import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';
import { CommunityType } from '../../config/constants.js';
import { aiProvider } from '../../ai/provider.js';
import { runProgressAnimation, ANIMATION_PRESETS } from '../animations/progress.js';

export async function handleListCommunities(ctx: Context, type?: CommunityType): Promise<void> {
  const communities = await db.getCommunities(type);

  const keyboard = new InlineKeyboard();

  communities.slice(0, 8).forEach(c => {
    keyboard.text(`${c.type === 'group' ? '👥' : '📣'} ${c.name}`, `comm_view_${c.id}`).row();
  });

  keyboard.text('🔎 Cari Komunitas', 'menu_search')
    .row()
    .text('⬅️ Kembali ke Menu', 'menu_main');

  const title = type === CommunityType.GROUP ? '👥 **DAFTAR GRUP TERDAFTAR**' : type === CommunityType.CHANNEL ? '📣 **DAFTAR CHANNEL RESMI**' : '🌐 **DIREKTORI KOMUNITAS**';

  const text = `${title}
━━━━━━━━━━━━━━━━━━━━
Daftar komunitas yang terdaftar dan terhubung ke platform kami:

${
  communities.length === 0
    ? '_Belum ada komunitas yang terdaftar._'
    : communities
        .slice(0, 8)
        .map((c, i) => `${i + 1}. **${c.name}**\n   └ 🏷️ \`${c.category}\` • 👥 ${c.member_count} Member\n   └ 🔗 ${c.invite_link || '@' + (c.username || 'private')}`)
        .join('\n\n')
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

export async function handleGenerateCommunity(ctx: Context, topic = 'Hosting & Cloud', category = 'hosting'): Promise<void> {
  const userId = ctx.from?.id || 0;
  const isAdmin = await db.isAdmin(userId);

  if (!isAdmin) {
    await ctx.reply('⛔ Anda tidak memiliki izin untuk menggunakan fitur ini.');
    return;
  }

  const waitMsg = await ctx.reply('⏳ **Menghubungi AI Community Architect...**', { parse_mode: 'Markdown' });

  // Progress animation
  await runProgressAnimation(ctx, waitMsg.message_id, ctx.chat?.id || 0, ANIMATION_PRESETS.communityGeneration);

  // Generate Plan
  const plan = await aiProvider.generateCommunityPlan(topic, category);

  const keyboard = new InlineKeyboard()
    .text('🎨 Salin Template Rules & Welcome', 'comm_copy_template')
    .row()
    .text('👑 Kembali ke Admin Panel', 'admin_main');

  const resultText = `✨ **BLUEPRINT KOMUNITAS BERHASIL DIBUAT (AI)**
━━━━━━━━━━━━━━━━━━━━
🏷️ **Kategori:** \`${category.toUpperCase()}\`
📌 **Nama Rekomendasi:**
**${plan.name}**

📝 **Deskripsi Komunitas:**
_${plan.description}_

📜 **Aturan Grup (Rules):**
${plan.rules}

👋 **Welcome Post:**
_${plan.welcomePost}_

🔖 **Tagar Branding:**
\`${plan.brandingTags.join(' ')}\`

━━━━━━━━━━━━━━━━━━━━
⚠️ **Catatan Resmi Telegram:**
_Telegram Bot API tidak mengizinkan bot membuat Grup/Channel baru secara langsung dari API tanpa akun pengguna. Silakan buat grup di aplikasi Telegram Anda, lalu masukkan bot ini sebagai **Admin** dengan permission posting pesan._`;

  try {
    await ctx.api.editMessageText(ctx.chat?.id || 0, waitMsg.message_id, resultText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  } catch {
    await ctx.reply(resultText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  }
}
