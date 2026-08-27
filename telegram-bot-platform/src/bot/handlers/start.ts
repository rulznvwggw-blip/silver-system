import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';
import { pterodactylService } from '../../services/pterodactylService.js';

export async function handleStart(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const name = ctx.from?.first_name || 'Pelanggan';
  const username = ctx.from?.username;

  // 1. Parse Referral from /start ref_123456
  let refId: number | undefined;
  const textMsg = ctx.message?.text || '';
  if (textMsg.startsWith('/start ref_')) {
    const match = textMsg.match(/\/start ref_(\d+)/);
    if (match) refId = parseInt(match[1], 10);
  }

  // 2. Register user & grant bonuses (Rp 1.000 initial bonus + Rp 2.000 referrer bonus)
  const regResult = await db.registerUser(userId, name, username, refId);
  const user = regResult.user;

  // 3. Auto-create Pterodactyl Account if not already created
  if (!user.ptero_user_id) {
    try {
      const pteroData = await pterodactylService.getOrCreateUser(userId, name, username);
      await db.savePteroCredentials(userId, pteroData.user.id, pteroData.user.username, pteroData.generatedPassword);
      user.ptero_user_id = pteroData.user.id;
      user.ptero_username = pteroData.user.username;
      user.ptero_password = pteroData.generatedPassword;
    } catch (e: any) {
      console.warn('[PTERO AUTO-REGISTER NOTICE]', e.message);
    }
  }

  // If new user received referral bonus notification
  if (regResult.isNew && regResult.refBonusAwarded && refId) {
    try {
      await ctx.api.sendMessage(
        refId,
        `🎉 **BONUS REFERRAL MASUK!**\n\nTeman Anda [${name}](tg://user?id=${userId}) baru saja bergabung via link Anda! Saldo **+Rp 2.000** telah ditambahkan ke dompet Anda!`,
        { parse_mode: 'Markdown' }
      );
    } catch {}
  }

  const isAdmin = await db.isAdmin(userId);
  const keyboard = new InlineKeyboard();

  if (isAdmin) {
    // ADMIN VIEW: Full Master Admin Hub + User Control
    keyboard
      .url('📱 BUKA RULLZYESTORE MINI APP (CANVAS) 🚀', 'https://store.rullzyestorepremium.my.id')
      .row()
      .text('👑 ADMIN CONTROL CENTER', 'admin_main')
      .text('👥 Full User Control', 'admin_users')
      .row()
      .text('🛒 Katalog 100 Paket (7, 14, 30 Hari)', 's300_dur_30d_whatsapp_1')
      .text('💰 Dompet Saldo & Ref', 'menu_wallet')
      .row()
      .text('📦 Layanan Saya', 'menu_my_servers')
      .text('📊 Live Server Stats', 'menu_stats')
      .row()
      .text('🤖 AI Broadcast Instant', 'admin_ai_broadcast')
      .text('📅 Scheduler 30-Menit', 'admin_scheduler')
      .row()
      .text('👥 Groups', 'menu_groups')
      .text('📣 Channels', 'menu_channels')
      .row()
      .text('🔎 Search Komunitas', 'menu_search')
      .text('🎨 Decoration', 'menu_decoration')
      .row()
      .url('🌐 Website Store', 'https://store.rullzyestorepremium.my.id')
      .url('💻 Pterodactyl Panel', 'https://ptero.rullzyestorepremium.my.id');

    const adminWelcomeText = `👑 **ADMINISTRATOR CONTROL CENTER [${name}]**
━━━━━━━━━━━━━━━━━━━━
🔑 **Status Akses:** \`Super Administrator (ID: ${userId})\`
💵 **Saldo Admin:** \`Rp ${user.balance.toLocaleString('id-ID')}\`
👥 **Total Referral:** \`${user.referral_count} Orang\`
⏰ **Timezone:** \`Asia/Jakarta (WIB)\`

Gunakan modul di bawah untuk mengontrol pengguna, saldo, broadcast AI, dan server Pterodactyl.`;

    if (ctx.callbackQuery) {
      try {
        await ctx.editMessageText(adminWelcomeText, { parse_mode: 'Markdown', reply_markup: keyboard });
        await ctx.answerCallbackQuery();
        return;
      } catch {}
    }
    await ctx.reply(adminWelcomeText, { parse_mode: 'Markdown', reply_markup: keyboard });
    return;
  }

  // REGULAR USER VIEW: Clean Hosting Store & Client Area (Zero Admin Leaks!)
  keyboard
    .url('📱 BUKA RULLZYESTORE MINI APP (CANVAS) 🚀', 'https://store.rullzyestorepremium.my.id')
    .row()
    .text('🛒 Beli Hosting (7, 14, 30 Hari)', 's300_dur_30d_whatsapp_1')
    .row()
    .text(`💰 Dompet Saldo (Rp ${user.balance.toLocaleString('id-ID')})`, 'menu_wallet')
    .text('📦 Layanan Saya', 'menu_my_servers')
    .row()
    .text('🎟️ Kode Voucher Promo', 'menu_coupons')
    .text('📊 Live Server Status (99.99%)', 'menu_stats')
    .row()
    .text('📚 Panduan Tutorial', 'menu_tutorial')
    .text('❓ Tanya Jawab FAQ', 'menu_faq')
    .row()
    .text('🔎 Cari Komunitas & Grup', 'menu_search')
    .url('💬 Chat Support WhatsApp', 'https://wa.me/6281234567890?text=Halo%20Admin%20RullzyeStore,%20saya%20ingin%20bertanya%20tentang%20sewa%20hosting.')
    .row()
    .url('🌐 Website Utama RullzyeStore', 'https://store.rullzyestorepremium.my.id');

  const userWelcomeText = `👋 **Halo, ${name}!**
Selamat datang di **RullzyeStore Cloud & Bot Hosting Indonesia** 🚀

🎁 **BONUS PENDAFTARAN ANDA:**
💵 **Saldo Awal:** \`Rp ${user.balance.toLocaleString('id-ID')}\` *(Bonus Pendaftaran Aktif!)*
👤 **Akun Panel Anda:** \`${user.ptero_username || `tg_${userId}`}\` *(Siap Pakai di Pterodactyl)*

⚡ **PILIHAN DURASI & 100 PAKET LENGKAP (HARGA INDONESIA):**
• ⚡ **7 Hari (Mingguan / Trial)** — Mulai Rp 1.000 / minggu
• 🔥 **14 Hari (2 Minggu)** — Mulai Rp 1.500 / 2 minggu
• 🚀 **30 Hari (Bulanan Standard)** — Mulai Rp 2.000 / bulan
• 🟢 **Bot WhatsApp** | 🔵 **Bot Telegram** | ⛏️ **Minecraft** | 🚀 **Linux VPS**

💎 **Keunggulan Layanan:**
✅ Otomatis Dibuat dalam 5-10 Detik Setelah Bayar (Bisa Pakai Saldo / QRIS)
✅ Scan QR Baileys Langsung di Web Console Browser
✅ Bonus Referral **Rp 2.000** Setiap Mengajak 1 Teman!

Silakan pilih menu atau buka **Mini App Canvas** di bawah ini:`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(userWelcomeText, { parse_mode: 'Markdown', reply_markup: keyboard });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }

  await ctx.reply(userWelcomeText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
}
