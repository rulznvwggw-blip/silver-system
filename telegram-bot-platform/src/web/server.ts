import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { db } from '../database/db.js';
import { aiProvider } from '../ai/provider.js';
import { broadcastQueue } from '../queue/queues.js';
import { pterodactylService } from '../services/pterodactylService.js';
import { SUPER_ADMIN_ID } from '../config/constants.js';

export function createWebServer(): express.Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Determine public directory path
  const distPublic = path.resolve(process.cwd(), 'dist/web/public');
  const srcPublic = path.resolve(process.cwd(), 'src/web/public');
  const publicDir = fs.existsSync(distPublic) ? distPublic : srcPublic;
  app.use(express.static(publicDir));

  // 1. Dashboard Overview Stats
  app.get('/api/stats', async (req, res) => {
    const communities = await db.getCommunities();
    const broadcasts = await db.getBroadcasts(50);
    const moderationLogs = await db.getModerationLogs(20);
    const auditLogs = await db.getAuditLogs(20);

    const groupsCount = communities.filter(c => c.type === 'group').length;
    const channelsCount = communities.filter(c => c.type === 'channel').length;
    const totalMembers = communities.reduce((acc, c) => acc + (c.member_count || 0), 0);

    const totalDelivered = broadcasts.reduce((acc, b) => acc + (b.success_count || 0), 0);
    const totalFailed = broadcasts.reduce((acc, b) => acc + (b.failed_count || 0), 0);
    const totalAttempts = totalDelivered + totalFailed;
    const successRate = totalAttempts > 0 ? Number(((totalDelivered / totalAttempts) * 100).toFixed(1)) : 100.0;

    const isAutoBroadcast = await db.getSetting('auto_broadcast_enabled', true);
    const isEmergencyStopped = await db.getSetting('emergency_stop_broadcast', false);

    res.json({
      success: true,
      stats: {
        groupsCount,
        channelsCount,
        totalCommunities: communities.length,
        totalMembers,
        totalBroadcasts: broadcasts.length,
        totalDelivered,
        totalFailed,
        successRate,
        isAutoBroadcast,
        isEmergencyStopped,
        primaryAdminId: SUPER_ADMIN_ID,
      },
      recentBroadcasts: broadcasts.slice(0, 5),
      recentModeration: moderationLogs.slice(0, 5),
      recentAudits: auditLogs.slice(0, 5),
    });
  });

  // 2. Communities List & Add
  app.get('/api/communities', async (req, res) => {
    const type = req.query.type as any;
    const list = await db.getCommunities(type);
    res.json({ success: true, data: list });
  });

  // 3. Broadcasts List & Trigger
  app.get('/api/broadcasts', async (req, res) => {
    const list = await db.getBroadcasts(50);
    res.json({ success: true, data: list });
  });

  app.post('/api/broadcasts/dispatch', async (req, res) => {
    const { title, content, targetType, category } = req.body;
    let communities = await db.getCommunities();

    if (targetType === 'groups') communities = communities.filter(c => c.type === 'group');
    if (targetType === 'channels') communities = communities.filter(c => c.type === 'channel');
    if (category) communities = communities.filter(c => c.category === category);

    const eligible = communities.filter(c => c.is_active && c.broadcast_enabled);

    const broadcast = await db.createBroadcast({
      created_by: SUPER_ADMIN_ID,
      title: title || 'Manual Web Broadcast',
      content,
      type: 'manual',
      target_filter: { targetType, category },
      total_targets: eligible.length,
      success_count: 0,
      failed_count: 0,
      skipped_count: 0,
      status: 'pending',
    });

    await broadcastQueue.add('broadcast.send', {
      broadcastId: broadcast.id,
      content,
      targets: eligible.map(c => ({ id: c.id, telegram_id: c.telegram_id, name: c.name })),
    });

    res.json({ success: true, data: broadcast });
  });

  // 4. Trigger AI Content
  app.post('/api/ai/generate', async (req, res) => {
    const { topic, tone, language } = req.body;
    const result = await aiProvider.generateBroadcast({ topic, tone, language });
    res.json({ success: true, data: result });
  });

  // 5. Toggle Settings
  app.post('/api/settings/toggle', async (req, res) => {
    const { key } = req.body;
    const current = await db.getSetting(key, false);
    const updated = !current;
    await db.setSetting(key, updated);
    res.json({ success: true, key, value: updated });
  });

  // 6. Flowix Webhook Callback Handler
  app.post('/api/webhook/flowix', async (req, res) => {
    try {
      const { event, data } = req.body || {};
      console.log(`[FLOWIX WEBHOOK] Received event: ${event}`, data);

      if (event === 'deposit.status' && data?.reff_id) {
        const deposit = await db.getDepositByReffId(data.reff_id);
        if (deposit) {
          if (data.status === 'success' && deposit.status !== 'success') {
            await db.updateDepositStatus(data.reff_id, 'success', new Date());

            if (deposit.product_id) {
              // Direct Product Purchase via QRIS
              const product = await db.getProductById(deposit.product_id);
              if (product) {
                try {
                  const user = await db.getUser(deposit.telegram_id);
                  const pteroData = await pterodactylService.getOrCreateUser(deposit.telegram_id, user?.first_name || 'Customer', user?.username);
                  const pteroUser = pteroData.user;
                  const password = pteroData.generatedPassword;

                  const mockPackage = {
                    id: product.id,
                    category: product.category_id as any,
                    tier: 1,
                    name: product.name,
                    duration: '30d' as any,
                    durationLabel: product.duration_label,
                    durationDays: product.duration_days,
                    price: product.price,
                    ramMb: product.ram_mb,
                    cpuPercent: product.cpu_percent,
                    diskGb: product.disk_gb,
                    eggId: product.egg_id,
                    nestId: product.category_id === 'minecraft' ? 1 : product.category_id === 'whatsapp' || product.category_id === 'telegram' ? 5 : 6,
                    dockerImage: product.docker_image,
                    description: product.description,
                    badge: product.badge,
                  };

                  const serverResult = await pterodactylService.createServer(pteroUser.id, mockPackage, `${product.name} - ${user?.first_name || 'User'}`);
                  const expiresAt = new Date(Date.now() + product.duration_days * 24 * 60 * 60 * 1000);

                  await db.recordUserServer({
                    telegram_id: deposit.telegram_id,
                    server_id: serverResult.serverId,
                    server_identifier: serverResult.serverIdentifier,
                    server_name: serverResult.name,
                    package_id: product.id,
                    duration_days: product.duration_days,
                    port: serverResult.port,
                    status: 'active',
                    expires_at: expiresAt,
                  });

                  await db.createOrder({
                    telegram_id: deposit.telegram_id,
                    product_id: product.id,
                    product_name: product.name,
                    total_amount: product.price,
                    payment_method: 'QRIS_FLOWIX',
                    payment_status: 'PAID',
                    order_status: 'COMPLETED',
                    server_id: serverResult.serverId,
                  });

                  await db.createNotification(
                    deposit.telegram_id,
                    '🎉 Server Berhasil Diaktifkan!',
                    `Server ${product.name} aktif! Login: Username '${pteroUser.username}' Password '${password}' di ${serverResult.panelUrl}`
                  );
                } catch (provErr) {
                  console.error('[WEBHOOK AUTO-PROVISION ERROR]', provErr);
                  await db.addBalance(deposit.telegram_id, product.price, `Kompensasi Saldo Server (${data.reff_id})`);
                }
              }
            } else {
              // Regular Top Up
              const creditedAmount = data.amount || deposit.amount_request;
              await db.addBalance(deposit.telegram_id, creditedAmount, `Top Up Flowix QRIS (${data.reff_id})`);
              await db.createNotification(
                deposit.telegram_id,
                '🎉 Top Up Saldo Berhasil!',
                `Pembayaran QRIS ${data.reff_id} sebesar Rp ${creditedAmount.toLocaleString('id-ID')} telah berhasil diverifikasi dan saldo telah ditambahkan.`
              );
              console.log(`[FLOWIX WEBHOOK] Credited Rp ${creditedAmount} to User ${deposit.telegram_id}`);
            }
          } else if (data.status === 'failed' || data.status === 'expired' || data.status === 'canceled') {
            await db.updateDepositStatus(data.reff_id, data.status);
          }
        }
      }

      res.status(200).json({ success: true, received: true });
    } catch (err: any) {
      console.error('[FLOWIX WEBHOOK ERROR]', err);
      res.status(200).json({ success: false, error: err.message });
    }
  });

  return app;
}
