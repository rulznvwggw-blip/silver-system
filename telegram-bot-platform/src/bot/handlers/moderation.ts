import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';

export async function handleModerationPanel(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const isAdmin = await db.isAdmin(userId);

  if (!isAdmin) {
    await ctx.reply('⛔ Anda tidak memiliki izin untuk menggunakan fitur ini.');
    return;
  }

  const logs = await db.getModerationLogs(5);

  const keyboard = new InlineKeyboard()
    .text('🛡️ Toggle Anti-Flood (5 msg/5s)', 'mod_toggle_flood')
    .row()
    .text('🔗 Toggle Anti-Link Massal', 'mod_toggle_link')
    .row()
    .text('🤖 Toggle AI Spam Classifier', 'mod_toggle_ai')
    .row()
    .text('📜 Lihat Seluruh Log Moderasi', 'mod_view_logs')
    .row()
    .text('👑 Kembali ke Admin', 'admin_main');

  const text = `🛡️ **SISTEM MODERASI & ANTI-SPAM AI**
━━━━━━━━━━━━━━━━━━━━
📊 **Status Pengaturan:**
• Anti-Flood Guard: \`AKTIF (5 pesan / 5 detik)\`
• Anti-Link Spam: \`AKTIF (Max 2 links)\`
• AI Scam Classifier: \`AKTIF (Confidence > 90% Auto-Delete)\`

📜 **5 Aktivitas Moderasi Terakhir:**
${
  logs.length === 0
    ? '_Belum ada tindakan pelanggaran yang tercatat._'
    : logs
        .map(
          l =>
            `• \`${l.created_at.toLocaleTimeString()}\` [${l.action.toUpperCase()}]: ${l.reason || 'Spam'} (ID: \`${l.telegram_id}\`)`
        )
        .join('\n')
}`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }

  await ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
}
