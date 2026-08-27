import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';
import { aiProvider } from '../../ai/provider.js';
import { broadcastQueue } from '../../queue/queues.js';
import { runProgressAnimation, ANIMATION_PRESETS } from '../animations/progress.js';
import { BroadcastTargetType } from '../../config/constants.js';

// Temporary draft broadcast store in memory
const draftBroadcasts = new Map<number, { title: string; content: string; targetType: BroadcastTargetType; category?: string }>();

export async function handleAIBroadcastFlow(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const isAdmin = await db.isAdmin(userId);

  if (!isAdmin) {
    await ctx.reply('⛔ Anda tidak memiliki izin untuk menggunakan fitur ini.');
    return;
  }

  // 1. Send initial animation placeholder
  const waitMsg = await ctx.reply('⏳ **Menghubungi AI Provider...**', { parse_mode: 'Markdown' });

  // 2. Run progress animation
  await runProgressAnimation(ctx, waitMsg.message_id, ctx.chat?.id || 0, ANIMATION_PRESETS.aiBroadcastGeneration);

  // 3. Generate content with AI
  const aiResult = await aiProvider.generateBroadcast({
    topic: 'Optimasi Server & Tips Komunitas',
    tone: 'friendly',
    language: 'Indonesia',
  });

  // Save to draft
  draftBroadcasts.set(userId, {
    title: aiResult.title,
    content: aiResult.content,
    targetType: BroadcastTargetType.ALL_COMMUNITIES,
  });

  // 4. Target selection keyboard
  const keyboard = new InlineKeyboard()
    .text('🌐 Semua Komunitas (Grup + Channel)', 'b_target_all')
    .row()
    .text('👥 Semua Grup Saja', 'b_target_groups')
    .text('📣 Semua Channel Saja', 'b_target_channels')
    .row()
    .text('🎮 Kategori Gaming', 'b_cat_gaming')
    .text('🚀 Kategori Hosting', 'b_cat_hosting')
    .row()
    .text('❌ Batalkan', 'admin_main');

  const previewText = `🤖 **KONTEN AI BROADCAST BERHASIL DIBUAT**
━━━━━━━━━━━━━━━━━━━━
**Model:** \`${aiResult.model}\`
**Judul:** *${aiResult.title}*

📝 **Preview Konten:**
${aiResult.content}

━━━━━━━━━━━━━━━━━━━━
🎯 **Pilih Target Tujuan Broadcast:**`;

  try {
    await ctx.api.editMessageText(ctx.chat?.id || 0, waitMsg.message_id, previewText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  } catch {
    await ctx.reply(previewText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  }
}

export async function handleTargetSelected(ctx: Context, targetType: BroadcastTargetType, category?: string): Promise<void> {
  const userId = ctx.from?.id || 0;
  const draft = draftBroadcasts.get(userId);

  if (!draft) {
    await ctx.reply('⚠️ Sesi draft broadcast telah berakhir. Silakan ulangi perintah.');
    return;
  }

  draft.targetType = targetType;
  draft.category = category;

  // Calculate targets
  let communities = await db.getCommunities();
  if (targetType === BroadcastTargetType.ALL_GROUPS) {
    communities = communities.filter(c => c.type === 'group');
  } else if (targetType === BroadcastTargetType.ALL_CHANNELS) {
    communities = communities.filter(c => c.type === 'channel');
  }
  if (category) {
    communities = communities.filter(c => c.category === category);
  }

  const eligibleCount = communities.filter(c => c.is_active && c.broadcast_enabled).length;

  const confirmKeyboard = new InlineKeyboard()
    .text(`✅ Confirm Kirim (${eligibleCount} Tujuan)`, 'b_confirm_dispatch')
    .text('❌ Batalkan', 'admin_main');

  const confirmText = `⚠️ **KONFIRMASI PENGIRIMAN BROADCAST**
━━━━━━━━━━━━━━━━━━━━
🎯 **Target:** \`${targetType.toUpperCase()}${category ? ` (${category})` : ''}\`
📊 **Jumlah Tujuan:** \`${eligibleCount} Komunitas\`
🚀 **Status Queue:** \`Siap Dijadwalkan\`

Apakah Anda yakin ingin menyebarkan pesan ini ke seluruh tujuan?`;

  await ctx.editMessageText(confirmText, {
    parse_mode: 'Markdown',
    reply_markup: confirmKeyboard,
  });
}

export async function handleConfirmDispatch(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const draft = draftBroadcasts.get(userId);

  if (!draft) {
    await ctx.reply('⚠️ Draft tidak ditemukan.');
    return;
  }

  // Fetch targets
  let communities = await db.getCommunities();
  if (draft.targetType === BroadcastTargetType.ALL_GROUPS) {
    communities = communities.filter(c => c.type === 'group');
  } else if (draft.targetType === BroadcastTargetType.ALL_CHANNELS) {
    communities = communities.filter(c => c.type === 'channel');
  }
  if (draft.category) {
    communities = communities.filter(c => c.category === draft.category);
  }

  const eligibleTargets = communities.filter(c => c.is_active && c.broadcast_enabled);

  // 1. Create Broadcast in DB
  const broadcast = await db.createBroadcast({
    created_by: userId,
    title: draft.title,
    content: draft.content,
    type: 'ai',
    target_filter: { target: draft.targetType, category: draft.category },
    total_targets: eligibleTargets.length,
    success_count: 0,
    failed_count: 0,
    skipped_count: 0,
    status: 'pending',
  });

  // 2. Add to BullMQ Queue
  await broadcastQueue.add('broadcast.send', {
    broadcastId: broadcast.id,
    content: draft.content,
    targets: eligibleTargets.map(c => ({
      id: c.id,
      telegram_id: c.telegram_id,
      name: c.name,
    })),
  });

  // Log Audit
  await db.logAudit(userId, 'DISPATCH_BROADCAST', { broadcastId: broadcast.id, targets: eligibleTargets.length });

  // Clean draft
  draftBroadcasts.delete(userId);

  const doneKeyboard = new InlineKeyboard()
    .text('📊 Lihat Status Delivery', `b_report_${broadcast.id}`)
    .row()
    .text('👑 Kembali ke Admin Panel', 'admin_main');

  const reportText = `🚀 **BROADCAST BERHASIL DI-DISPATCH!**
━━━━━━━━━━━━━━━━━━━━
🆔 **Broadcast ID:** \`#${broadcast.id}\`
🎯 **Total Target:** \`${eligibleTargets.length} Komunitas\`
⚙️ **Queue Worker:** \`BullMQ Active (Background Processing)\`

Pesan sedang dikirim secara bertahap di background dengan perlindungan rate-limit Telegram.`;

  await ctx.editMessageText(reportText, {
    parse_mode: 'Markdown',
    reply_markup: doneKeyboard,
  });
}

export async function handleEmergencyStop(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const isAdmin = await db.isAdmin(userId);

  if (!isAdmin) return;

  const current = await db.getSetting('emergency_stop_broadcast', false);
  const updated = !current;
  await db.setSetting('emergency_stop_broadcast', updated);

  await db.logAudit(userId, updated ? 'EMERGENCY_STOP_ENABLED' : 'EMERGENCY_STOP_DISABLED');

  const keyboard = new InlineKeyboard()
    .text(updated ? '🟢 Nonaktifkan Emergency Stop' : '🛑 Aktifkan Emergency Stop', 'admin_emergency_stop')
    .row()
    .text('👑 Kembali ke Admin', 'admin_main');

  const statusText = `🛑 **GLOBAL EMERGENCY BROADCAST SWITCH**
━━━━━━━━━━━━━━━━━━━━
Status Saat Ini: **${updated ? '🔴 DIHENTIKAN TOTAL (EMERGENCY ACTIVE)' : '🟢 NORMAL (BROADCAST DIZINKAN)'}**

${
  updated
    ? '⚠️ Semua antrean pengiriman broadcast di BullMQ worker telah dihentikan secara paksa.'
    : '✅ Sistem broadcast berjalan normal.'
}`;

  await ctx.editMessageText(statusText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
}
