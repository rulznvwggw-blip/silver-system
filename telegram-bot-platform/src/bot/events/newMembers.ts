import { Context, InlineKeyboard } from 'grammy';

export async function handleNewChatMembers(ctx: Context): Promise<void> {
  const newMembers = ctx.message?.new_chat_members || [];
  const groupName = ctx.chat?.title || 'Komunitas';

  for (const member of newMembers) {
    if (member.is_bot) continue;

    const keyboard = new InlineKeyboard()
      .text('📜 Baca Rules Grup', 'view_rules')
      .url('📣 Official Channel', 'https://t.me/rullzyestore_official')
      .row()
      .url('🌐 Website Komunitas', 'https://store.rullzyestorepremium.my.id')
      .url('🆘 Bantuan Admin', 'https://t.me/rullzye');

    const greeting = `🎉 **Welcome!**

👋 **Selamat datang, [${member.first_name}](tg://user?id=${member.id})!**

Kamu sekarang berada di grup:
👉 **${groupName}**

📜 *Harap membaca rules grup kami agar suasana obrolan tetap aman dan nyaman.*`;

    try {
      await ctx.reply(greeting, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    } catch {
      // Non-blocking
    }
  }
}
