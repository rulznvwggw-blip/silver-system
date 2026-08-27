import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';
import { CommunityType } from '../../config/constants.js';

export async function handleSetupCommunityViaChatId(ctx: Context, targetIdStr: string, type: CommunityType): Promise<void> {
  const chatId = parseInt(targetIdStr.trim(), 10);
  if (isNaN(chatId)) {
    await ctx.reply('⚠️ Format Chat ID tidak valid. Contoh: `/setup_group -1001928374650`', { parse_mode: 'Markdown' });
    return;
  }

  try {
    // 1. Fetch chat info from Telegram
    const chat = await ctx.api.getChat(chatId);
    const chatTitle = (chat as any).title || (type === CommunityType.GROUP ? 'Group Komunitas' : 'Official Channel');
    const username = (chat as any).username;
    const inviteLink = (chat as any).invite_link;

    // 2. Save / Register to Database
    await db.saveCommunity({
      telegram_id: chatId,
      name: chatTitle,
      type,
      username,
      invite_link: inviteLink,
      category: 'community',
      is_featured: true,
      is_active: true,
      broadcast_enabled: true,
      member_count: 50,
    });

    // 3. Post Auto-Decoration into Group / Channel
    const storeKeyboard = new InlineKeyboard()
      .url('🛒 Sewa Server Bot & Game', 'https://rullzyestorepremium.my.id')
      .url('📱 Buka Mini App', 'https://rullzyestorepremium.my.id')
      .row()
      .url('💬 Chat Admin WhatsApp', 'https://wa.me/6281234567890');

    const decorationPost = `╔═════════════════════════════════╗
   🚀 **${chatTitle.toUpperCase()}**
╚═════════════════════════════════╝

🔥 **Selamat Datang di ${chatTitle}!**

📌 **ATURAN KOMUNITAS (RULES):**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Saling menghargai sesama anggota
2️⃣ Dilarang spam, flood, promosi ilegal, atau judi online
3️⃣ Dilarang melakukan penipuan (scam)
4️⃣ Gunakan bahasa yang sopan dan santun

⚡ **LAYANAN HOSTING RESMI KOMUNITAS:**
• 🟢 Hosting Bot WhatsApp (Baileys / Node.js) - Rp 15rb
• 🔵 Hosting Bot Telegram (Python / Node.js) - Rp 12rb
• ⛏️ Minecraft Java Server (Paper / Purpur) - Rp 35rb
• 🚀 Linux Container VPS 24 Jam Nonstop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Server ini dimonitor oleh RullzyeStore AI & Anti-Spam Guard*`;

    const sent = await ctx.api.sendMessage(chatId, decorationPost, {
      parse_mode: 'Markdown',
      reply_markup: storeKeyboard,
    });

    // Try pinning message
    try {
      await ctx.api.pinChatMessage(chatId, sent.message_id);
    } catch {}

    await ctx.reply(`✅ **BERHASIL MENGHIAS ${type.toUpperCase()}!**\n\nKomunitas: **${chatTitle}** (\`${chatId}\`)\nPostingan dekorasi dan aturan telah dikirim dan disematkan (pinned).`, {
      parse_mode: 'Markdown',
    });
  } catch (err: any) {
    await ctx.reply(`❌ **Gagal Mengakses Chat ID:** \`${chatId}\`\n\nPastikan bot **@cinerestbot** sudah dimasukkan ke dalam ${type} tersebut dan diangkat sebagai **Admin** dengan permission posting pesan.`);
  }
}
