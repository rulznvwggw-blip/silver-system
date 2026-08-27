import { Context } from 'grammy';
import { aiProvider } from '../../ai/provider.js';
import { db } from '../../database/db.js';

export async function handleGroupMessageGuard(ctx: Context): Promise<void> {
  const text = ctx.message?.text;
  const userId = ctx.from?.id;
  const chatId = ctx.chat?.id;

  if (!text || !userId || !chatId || ctx.chat?.type === 'private') return;

  // Ignore admin messages
  const isAdmin = await db.isAdmin(userId);
  if (isAdmin) return;

  // Run AI moderation
  const result = await aiProvider.moderateMessage(text);

  if (result.isSpam && result.confidence > 0.85) {
    try {
      if (ctx.message?.message_id) {
        await ctx.api.deleteMessage(chatId, ctx.message.message_id);
      }

      await ctx.reply(
        `🛡️ **AI MODERATION GUARD**\n\nPesan dari [${ctx.from?.first_name}](tg://user?id=${userId}) telah dihapus otomatis.\n\n⚠️ **Alasan:** \`${result.reason}\`\n🤖 **Confidence:** \`${(result.confidence * 100).toFixed(0)}%\``,
        { parse_mode: 'Markdown' }
      );

      await db.logModeration({
        community_id: chatId,
        telegram_id: userId,
        action: 'ai_delete_spam',
        reason: result.reason,
        message_snippet: text.substring(0, 100),
        ai_confidence: result.confidence,
      });
    } catch {
      // Ignore Telegram permission errors
    }
  }
}
