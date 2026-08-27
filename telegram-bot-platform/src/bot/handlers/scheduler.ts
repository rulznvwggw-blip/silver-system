import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';

export async function handleSchedulerPanel(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const isAdmin = await db.isAdmin(userId);

  if (!isAdmin) {
    await ctx.reply('⛔ Anda tidak memiliki izin untuk menggunakan fitur ini.');
    return;
  }

  const isEnabled = await db.getSetting('auto_broadcast_enabled', true);
  const interval = await db.getSetting('auto_broadcast_interval', 30);
  const tasks = await db.getScheduledTasks();
  const task = tasks[0];

  const keyboard = new InlineKeyboard()
    .text(isEnabled ? '⏸️ Pause Auto Broadcast' : '▶️ Resume Auto Broadcast', 'sched_toggle')
    .row()
    .text('⏱️ Ganti Interval (30 Mnt)', 'sched_interval_30')
    .text('⏱️ Ganti Interval (1 Jam)', 'sched_interval_60')
    .row()
    .text('🔄 Trigger AI Broadcast Sekarang', 'sched_trigger_now')
    .row()
    .text('👑 Kembali ke Admin', 'admin_main');

  const text = `📅 **AUTOMATED AI BROADCAST SCHEDULER**
━━━━━━━━━━━━━━━━━━━━
⚙️ **Status Scheduler:** **${isEnabled ? '🟢 RUNNING (AKTIF)' : '⏸️ PAUSED (JEDA)'}**
⏱️ **Interval Siklus:** \`Setiap ${interval} Menit\`
⏰ **Timezone:** \`Asia/Jakarta (WIB)\`
🕒 **Jadwal Eksekusi Berikutnya:** \`${task?.next_run_at ? new Date(task.next_run_at).toLocaleTimeString() : 'Dalam 15 menit'}\`

Flow Otomasi:
1. AI Generate Konten Segar (Bervariasi)
2. Filter Komunitas Aktif & Berizin
3. Masuk ke BullMQ Queue
4. Pengiriman Aman dengan Backoff Rate-Limit`;

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
