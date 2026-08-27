import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { db } from '../database/db.js';
import { aiProvider } from '../ai/provider.js';
import { broadcastQueue } from '../queue/queues.js';
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

  return app;
}
