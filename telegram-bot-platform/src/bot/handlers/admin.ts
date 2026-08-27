import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';
import { SUPER_ADMIN_ID } from '../../config/constants.js';

export async function handleAdminPanel(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const isAdmin = await db.isAdmin(userId);

  if (!isAdmin) {
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({
        text: '⛔ Anda tidak memiliki izin untuk menggunakan fitur ini.',
        show_alert: true,
      });
      return;
    }
    await ctx.reply('⛔ Anda tidak memiliki izin untuk menggunakan fitur ini.');
    return;
  }

  const isSuper = userId === SUPER_ADMIN_ID;

  const keyboard = new InlineKeyboard()
    .text('📊 Dashboard Stats', 'admin_dashboard')
    .text('📢 Broadcast Massal', 'admin_broadcast_opt')
    .row()
    .text('🤖 AI Broadcast Instant', 'admin_ai_broadcast')
    .text('📅 Scheduler (30-Mnt)', 'admin_scheduler')
    .row()
    .text('👥 Manage Groups', 'admin_groups')
    .text('📣 Manage Channels', 'admin_channels')
    .row()
    .text('➕ Create Community', 'admin_create_comm')
    .text('🎨 Auto Decoration', 'admin_decoration')
    .row()
    .text('🛡️ Moderation & Anti-Spam', 'admin_moderation')
    .text('🔎 Search Index', 'admin_search_index')
    .row()
    .text('📈 Analytics Delivery', 'admin_analytics')
    .text('👤 RBAC User Admin', 'admin_users')
    .row()
    .text('⚙️ System Settings', 'admin_settings')
    .text('📜 Audit Logs', 'admin_logs')
    .row()
    .text('🛑 EMERGENCY STOP BROADCAST', 'admin_emergency_stop')
    .row()
    .text('⬅️ Kembali ke Main Menu', 'menu_main');

  const text = `👑 **ADMIN CONTROL CENTER**
━━━━━━━━━━━━━━━━━━━━
🔑 **Role:** \`${isSuper ? 'SUPER ADMIN (Root)' : 'Administrator'}\`
👤 **Admin ID:** \`${userId}\`
⏰ **Timezone:** \`Asia/Jakarta (UTC+7)\`

Pilih modul manajemen sistem di bawah ini:`;

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
