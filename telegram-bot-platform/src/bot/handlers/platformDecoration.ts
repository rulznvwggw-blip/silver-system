import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';
import { createCozyHeader } from '../../utils/ui.js';
import { sendOrEdit } from './platformPublic.js';
import { checkAdminGuard } from './platformAdmin.js';
import { CommunityType } from '../../config/constants.js';

export async function handleAdmDecorationCenter(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('🎨 DECORATION CENTER', 'Pusat Dekorasi & Format Komunitas');
  const body = `${header}\n\n` +
    `Percantik tampilan grup & channel Anda dengan layout rapi, welcome message otomatis, dan tombol interaktif:\n\n` +
    `Pilih komunitas yang ingin dihias:`;

  const comms = await db.getCommunities();
  const keyboard = new InlineKeyboard();

  comms.forEach(c => {
    keyboard.text(`🎨 Hias ${c.name.slice(0, 20)}...`, `dec_select_comm_${c.id}`).row();
  });

  keyboard
    .text('✨ AI Decoration Auto-Format', 'dec_ai_auto_format')
    .row()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmDecorationSelectComponent(ctx: Context, communityId: number): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const comms = await db.getCommunities();
  const community = comms.find(c => c.id === communityId);
  if (!community) {
    await ctx.reply('⚠️ Komunitas tidak ditemukan.');
    return;
  }

  const header = createCozyHeader(`🎨 DEKORASI: ${community.name.slice(0, 20)}`, 'Pilih Komponen Dekorasi');
  const body = `${header}\n\n` +
    `Pilih elemen dekorasi yang ingin Anda pasang di **${community.name}**:\n\n` +
    `1. 📌 **Pinned Banner:** Pesan tersemat berisi aturan & link store.\n` +
    `2. 👋 **Welcome Message:** Sambutan hangat untuk member baru.\n` +
    `3. 📋 **Rules & Regulations:** Tata tertib resmi komunitas.\n` +
    `4. 🛒 **Store Showcase:** Katalog hosting bot & game dengan inline button.`;

  const keyboard = new InlineKeyboard()
    .text('📌 Pasang Pinned Banner', `dec_apply_pinned_${community.id}`)
    .row()
    .text('👋 Atur Welcome Message', `dec_apply_welcome_${community.id}`)
    .row()
    .text('📋 Pasang Rules Komunitas', `dec_apply_rules_${community.id}`)
    .row()
    .text('🛒 Pasang Showcase Store', `dec_apply_store_${community.id}`)
    .row()
    .text('🔄 Reset ke Format Default', `dec_reset_${community.id}`)
    .row()
    .text('⬅️ Kembali ke Daftar Komunitas', 'nav_adm_decoration_center');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmDecorationApply(ctx: Context, communityId: number, component: string): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const comms = await db.getCommunities();
  const community = comms.find(c => c.id === communityId);
  if (!community) return;

  let text = '';
  const storeKeyboard = new InlineKeyboard()
    .url('🛒 Sewa Server Bot & Game', 'https://rullzyestorepremium.my.id')
    .url('📱 Buka Mini App', 'https://rullzyestorepremium.my.id')
    .row()
    .url('💬 Chat Admin WhatsApp', 'https://wa.me/6281234567890');

  if (component === 'pinned' || component === 'store') {
    text = `╔═════════════════════════════════╗\n` +
      `   🚀 **${community.name.toUpperCase()}**\n` +
      `╚═════════════════════════════════╝\n\n` +
      `🔥 **Selamat Datang di ${community.name}!**\n\n` +
      `📌 **LAYANAN RESMI HOSTING KOMUNITAS:**\n` +
      `• 🟢 Hosting Bot WhatsApp (Baileys / Node.js 20)\n` +
      `• 🔵 Hosting Bot Telegram (Python / Node.js)\n` +
      `• ⛏️ Minecraft Java & Bedrock (Paper 1.20.4 TPS 20.0)\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🤖 *Komunitas ini dimonitor oleh RullzyeStore AI & Anti-Spam Guard*`;
  } else if (component === 'rules') {
    text = `📋 **TATA TERTIB RESMI KOMUNITAS ${community.name.toUpperCase()}**\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `1️⃣ Saling menghargai sesama anggota.\n` +
      `2️⃣ Dilarang spam, flood, promosi ilegal, atau judi online.\n` +
      `3️⃣ Dilarang melakukan penipuan (scam).\n` +
      `4️⃣ Gunakan bahasa yang sopan dan santun.\n\n` +
      `Pelanggar akan di-warn atau di-kick otomatis oleh bot moderator.`;
  } else if (component === 'welcome') {
    text = `👋 **SELAMAT BERGABUNG DI ${community.name.toUpperCase()}!**\n\n` +
      `Silakan perkenalkan diri Anda dan baca pesan tersemat untuk panduan komunitas.`;
  }

  try {
    const sent = await ctx.api.sendMessage(community.telegram_id, text, {
      parse_mode: 'Markdown',
      reply_markup: storeKeyboard,
    });

    if (component === 'pinned') {
      try {
        await ctx.api.pinChatMessage(community.telegram_id, sent.message_id);
      } catch {}
    }

    await ctx.reply(`✅ **BERHASIL MENERAPKAN DEKORASI!**\n\nKomunitas: **${community.name}**\nKomponen: \`${component.toUpperCase()}\` telah dikirim dan disematkan.`);
  } catch (err: any) {
    await ctx.reply(`❌ **Gagal Menerapkan Dekorasi:** ${err.message}\n\nPastikan bot @cinerestbot sudah diangkat menjadi Admin di ${community.name}.`);
  }
}
