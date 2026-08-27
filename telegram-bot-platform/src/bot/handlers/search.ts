import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';
import { COMMUNITY_CATEGORIES } from '../../config/constants.js';

export async function handleSearch(ctx: Context, query = '', category?: string): Promise<void> {
  const results = await db.searchCommunities(query, category);

  const keyboard = new InlineKeyboard();

  // Category quick filter row
  COMMUNITY_CATEGORIES.slice(0, 4).forEach((cat, idx) => {
    keyboard.text(`${cat.icon} ${cat.name.split(' ')[0]}`, `search_cat_${cat.slug}`);
    if (idx === 1) keyboard.row();
  });

  keyboard.row().text('⬅️ Kembali ke Menu', 'menu_main');

  let resultList = '';
  if (results.length === 0) {
    resultList = '_Tidak ditemukan komunitas yang sesuai dengan kata kunci pencarian._';
  } else {
    resultList = results
      .slice(0, 5)
      .map((c, i) => {
        const typeIcon = c.type === 'group' ? '👥' : '📣';
        return `${i + 1}. **${c.name}**\n   ${typeIcon} \`${c.type.toUpperCase()}\` • 🏷️ \`${c.category}\` • 👥 ${c.member_count} Member\n   🔗 ${c.invite_link || '@' + (c.username || 'private')}`;
      })
      .join('\n\n');
  }

  const text = `🔎 **PENCARIAN KOMUNITAS & DIREKTORI**
━━━━━━━━━━━━━━━━━━━━
${query ? `🔍 Kata Kunci: \`${query}\`\n` : ''}${category ? `🏷️ Filter Kategori: \`${category}\`\n` : ''}
${resultList}

━━━━━━━━━━━━━━━━━━━━
💡 *Ketik \`/search <nama/topik>\` untuk mencari grup atau channel spesifik.*`;

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
