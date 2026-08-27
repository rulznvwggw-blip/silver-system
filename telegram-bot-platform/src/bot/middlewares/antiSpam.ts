import { Context, NextFunction } from 'grammy';
import { db } from '../../database/db.js';

// In-memory flood tracking map: userId -> timestamps[]
const userMessageTimestamps = new Map<number, number[]>();

export async function antiSpamMiddleware(ctx: Context, next: NextFunction): Promise<void> {
  const userId = ctx.from?.id;
  const chatId = ctx.chat?.id;

  // Only apply anti-spam in groups / supergroups
  if (!userId || !chatId || ctx.chat?.type === 'private') {
    return next();
  }

  // Admin bypass
  const isAdmin = await db.isAdmin(userId);
  if (isAdmin) return next();

  const now = Date.now();
  const windowMs = 5000; // 5 seconds
  const threshold = 5; // 5 messages in 5 seconds

  const timestamps = userMessageTimestamps.get(userId) || [];
  const recent = timestamps.filter(t => now - t < windowMs);
  recent.push(now);
  userMessageTimestamps.set(userId, recent);

  if (recent.length > threshold) {
    // Flood detected
    try {
      if (ctx.message?.message_id) {
        await ctx.api.deleteMessage(chatId, ctx.message.message_id);
      }
      await ctx.reply(
        `⚠️ **Peringatan Anti-Spam**\n\nPengguna [${ctx.from?.first_name}](tg://user?id=${userId}) terdeteksi mengirim pesan terlalu cepat (Flood). Mohon tenang.`,
        { parse_mode: 'Markdown' }
      );
      await db.logModeration({
        community_id: chatId,
        telegram_id: userId,
        action: 'delete_flood',
        reason: 'Flood detection (5 messages in 5s)',
      });
    } catch {
      // Ignore permission error
    }
    return;
  }

  return next();
}
