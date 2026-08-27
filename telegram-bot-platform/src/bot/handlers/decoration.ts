import { Context, InlineKeyboard } from 'grammy';
import { aiProvider } from '../../ai/provider.js';
import { runProgressAnimation, ANIMATION_PRESETS } from '../animations/progress.js';

export async function handleDecoration(ctx: Context, groupName = 'Komunitas'): Promise<void> {
  const waitMsg = await ctx.reply('⏳ **Menyiapkan dekorasi komunitas...**', { parse_mode: 'Markdown' });

  await runProgressAnimation(ctx, waitMsg.message_id, ctx.chat?.id || 0, ANIMATION_PRESETS.decorating);

  const decorationText = await aiProvider.generateDecoration(groupName);

  const keyboard = new InlineKeyboard()
    .text('🔄 Generate Varian Lain', 'menu_decoration')
    .row()
    .text('⬅️ Kembali ke Menu', 'menu_main');

  try {
    await ctx.api.editMessageText(ctx.chat?.id || 0, waitMsg.message_id, decorationText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  } catch {
    await ctx.reply(decorationText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  }
}
