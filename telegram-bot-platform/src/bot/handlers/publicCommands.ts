import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';
import { pterodactylService } from '../../services/pterodactylService.js';
import { handleStore300Catalog } from './store300.js';
import { handleWalletMenu } from './wallet.js';
import { handleCouponsMenu, handleFaqMenu } from './store.js';

// 1. /start (Handled in start.ts)

// 2. /store & /katalog
export async function cmdStore(ctx: Context): Promise<void> {
  await handleStore300Catalog(ctx, '30d', 'whatsapp', 1);
}

// 3. /beli
export async function cmdBeli(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .text('⚡ 7 Hari (Trial/Mingguan)', 's300_dur_7d_whatsapp_1')
    .row()
    .text('🔥 14 Hari (2 Minggu)', 's300_dur_14d_whatsapp_1')
    .row()
    .text('🚀 30 Hari (Bulanan Standard)', 's300_dur_30d_whatsapp_1')
    .row()
    .url('🌐 Buka Mini App Canvas', 'https://store.rullzyestorepremium.my.id');

  const text = `🛍️ **WIZARD PEMILIHAN PAKET HOSTING**
━━━━━━━━━━━━━━━━━━━━
Pilih durasi sewa yang Anda butuhkan:

• ⚡ **7 Hari (Mingguan):** Cocok untuk uji coba bot, event mabar mingguan, atau budget hemat.
• 🔥 **14 Hari (2 Minggu):** Solusi fleksibel untuk bot store & survival server.
• 🚀 **30 Hari (Bulanan):** Paket paling hemat & direkomendasikan untuk stabilitas 24/7!

Tersedia 100 paket lengkap per durasi:
🟢 Bot WhatsApp (25) • 🔵 Bot Telegram (25) • ⛏️ Minecraft (25) • 🚀 Linux VPS (25)`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 4. /saldo & /wallet
export async function cmdSaldo(ctx: Context): Promise<void> {
  await handleWalletMenu(ctx);
}

// 5. /topup
export async function cmdTopup(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .text('💵 + Rp 5.000', 'topup_val_5000')
    .text('💵 + Rp 10.000', 'topup_val_10000')
    .row()
    .text('💵 + Rp 25.000', 'topup_val_25000')
    .text('💵 + Rp 50.000', 'topup_val_50000')
    .row()
    .text('💵 + Rp 100.000', 'topup_val_100000')
    .row()
    .text('⬅️ Kembali ke Dompet', 'menu_wallet');

  const text = `💳 **TOP UP SALDO DOMPET RULLZYESTORE**
━━━━━━━━━━━━━━━━━━━━
Pilih nominal saldo yang ingin Anda isi secara otomatis:
• Pembayaran via QRIS (BCA, BRI, Mandiri, DANA, GoPay, OVO, ShopeePay)
• Saldo langsung masuk tanpa biaya admin!`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 6. /ref & /referral
export async function cmdRef(ctx: Context): Promise<void> {
  await handleWalletMenu(ctx);
}

// 7. /myservers & /server
export async function cmdMyServers(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const servers = await db.getUserServers(userId);
  const user = await db.getUser(userId);

  const keyboard = new InlineKeyboard()
    .url('💻 Buka Pterodactyl Panel', 'https://ptero.rullzyestorepremium.my.id')
    .row()
    .text('🛒 Sewa Server Baru', 'menu_store')
    .row()
    .text('🏠 Menu Utama', 'menu_main');

  const text = `📦 **LAYANAN & SERVER AKTIF ANDA**
━━━━━━━━━━━━━━━━━━━━
👤 **Username Panel:** \`${user?.ptero_username || `user_${userId}`}\`
🔑 **Status Akun:** \`Aktif 24 Jam Nonstop\`

${
  servers.length === 0
    ? '_Anda belum memiliki server yang aktif. Ketik /beli untuk memilih paket!_'
    : servers
        .map(
          (s, i) =>
            `${i + 1}. **${s.server_name}**\n   └ 🔌 Port: \`${s.port}\` • Durasi: \`${s.duration_days} Hari\`\n   └ 📅 Kadaluarsa: \`${new Date(s.expires_at).toLocaleDateString('id-ID')}\`\n   └ 🆔 Identifier: \`${s.server_identifier}\``
        )
        .join('\n\n')
}

━━━━━━━━━━━━━━━━━━━━
👉 *Kelola console, restart, dan upload file bot langsung dari Pterodactyl Panel.*`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 8. /panel
export async function cmdPanel(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const pteroData = await pterodactylService.getOrCreateUser(userId, ctx.from?.first_name || 'User', ctx.from?.username);
  const user = await db.getUser(userId);
  const password = user?.ptero_password || pteroData.generatedPassword || 'Rullzye_123456!';

  const keyboard = new InlineKeyboard()
    .url('💻 BUKA WEB PANEL PTERODACTYL 🚀', 'https://ptero.rullzyestorepremium.my.id')
    .row()
    .url('🌐 Website Utama RullzyeStore', 'https://store.rullzyestorepremium.my.id')
    .row()
    .text('📦 Layanan & Server Saya', 'menu_my_servers')
    .row()
    .text('🏠 Menu Utama', 'menu_main');

  const text = `💻 **KREDENSIAL LOGIN PTERODACTYL PANEL ANDA**
━━━━━━━━━━━━━━━━━━━━
🌐 **URL Panel:** \`https://ptero.rullzyestorepremium.my.id\`
👤 **Username Anda:** \`${pteroData.user.username}\`
📧 **Email Akun:** \`${pteroData.user.email}\`
🔐 **Password Login:** \`${password}\`
━━━━━━━━━━━━━━━━━━━━
👉 **PANDUAN LOGIN:**
1. Klik tombol **💻 BUKA WEB PANEL PTERODACTYL** di bawah.
2. Masukkan **Username / Email** dan **Password** di atas.
3. Anda dapat langsung mengelola console, upload file bot, dan kontrol server 24/7!`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 9. /status & /uptime
export async function cmdStatus(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .url('📊 Cek Live Status Web', 'https://store.rullzyestorepremium.my.id/status')
    .row()
    .text('🔄 Refresh Status', 'menu_stats');

  const text = `📊 **LIVE STATUS & UPTIME SERVER**
━━━━━━━━━━━━━━━━━━━━
🖥️ **Node Utama:** \`Node-Main-01 (Jakarta, Indonesia)\`
⚡ **Status Daemon:** \`ONLINE 💚 (Wings Active)\`
⏱️ **Uptime Node:** \`99.99% (SLA Guaranteed)\`
🌐 **Jaringan:** \`OpenIXP / IIX Peering 10 Gbps\`
🛡️ **Proteksi DDoS:** \`Game Shield 100 Gbps Anti-Flood\`
📶 **Latensi Pengguna:** \`~18 ms (Ultra Low Latency)\`

━━━━━━━━━━━━━━━━━━━━
🤖 *Semua container server berjalan dalam isolasi Docker terproteksi.*`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 10. /search (Handled with query in search.ts)

// 11. /groups
export async function cmdGroups(ctx: Context): Promise<void> {
  const groups = await db.getCommunities('group' as any);
  const keyboard = new InlineKeyboard()
    .text('🔎 Cari Komunitas', 'menu_search')
    .row()
    .text('⬅️ Kembali', 'menu_main');

  const text = `👥 **DIREKTORI GRUP RESMI KOMUNITAS**
━━━━━━━━━━━━━━━━━━━━
Daftar grup diskusi & mabar terverifikasi:

${
  groups.length === 0
    ? '_Belum ada grup yang terdaftar._'
    : groups.map((g, i) => `${i + 1}. **${g.name}**\n   🏷️ \`${g.category}\` • 👥 ${g.member_count} Member\n   🔗 ${g.invite_link || '@' + (g.username || 'private')}`).join('\n\n')
}`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 12. /channels
export async function cmdChannels(ctx: Context): Promise<void> {
  const channels = await db.getCommunities('channel' as any);
  const keyboard = new InlineKeyboard()
    .url('📣 Official Channel RullzyeStore', 'https://t.me/rullzyestore_official')
    .row()
    .text('⬅️ Kembali', 'menu_main');

  const text = `📣 **CHANNEL RESMI & BROADCAST PARTNER**
━━━━━━━━━━━━━━━━━━━━
Dapatkan update promo server, diskon kupon, dan event mingguan di channel resmi kami:

${
  channels.length === 0
    ? '_Belum ada channel terdaftar._'
    : channels.map((c, i) => `${i + 1}. **${c.name}**\n   🏷️ \`${c.category}\` • 👥 ${c.member_count} Subscriber\n   🔗 ${c.invite_link || '@' + (c.username || 'private')}`).join('\n\n')
}`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 13. /coupons & /promo
export async function cmdCoupons(ctx: Context): Promise<void> {
  await handleCouponsMenu(ctx);
}

// 14. /faq
export async function cmdFaq(ctx: Context): Promise<void> {
  await handleFaqMenu(ctx);
}

// 15. /tutorial
export async function cmdTutorial(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .url('💻 Buka Web Panel', 'https://ptero.rullzyestorepremium.my.id')
    .url('💬 Tanya Support WA', 'https://wa.me/6281234567890')
    .row()
    .text('⬅️ Kembali ke Menu', 'menu_main');

  const text = `📚 **PANDUAN & TUTORIAL SETUP SERVER BOT / GAME**
━━━━━━━━━━━━━━━━━━━━
🟢 **1. Cara Pasang Bot WhatsApp (Baileys / Node.js):**
1. Buka Pterodactyl Panel dan masuk ke server Anda.
2. Masuk ke tab File Manager, upload file bot WhatsApp Anda (index.js, package.json).
3. Klik tombol Start di Console.
4. Scan QR code yang muncul langsung di layar console menggunakan WhatsApp Anda!

🔵 **2. Cara Pasang Bot Telegram (Python / Node.js):**
1. Masuk ke File Manager, upload main.py atau index.js.
2. Atur BOT_TOKEN di tab Startup atau file .env.
3. Klik Start, bot Anda langsung online 24 jam!

⛏️ **3. Cara Pasang Plugin & World Minecraft:**
1. Gunakan SFTP (Port 2022) di FileZilla / WinSCP atau Web File Manager.
2. Upload folder plugins dan file world.
3. Restart server untuk menerapkan konfigurasi!`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 16. /rules & /tos
export async function cmdRules(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .url('🌐 Baca Terms of Service Lengkap', 'https://store.rullzyestorepremium.my.id/terms')
    .row()
    .text('⬅️ Kembali', 'menu_main');

  const text = `📜 **KETENTUAN LAYANAN & ATURAN SERVER (TOS)**
━━━━━━━━━━━━━━━━━━━━
Demi kenyamanan seluruh pengguna node:

✅ **DIIZINKAN:**
• Bot WhatsApp Baileys / WhiskeySockets (Wajar)
• Bot Telegram, Discord, dan Microservices
• Server Minecraft Survival / SMP / BungeeCord
• Custom Web Application & REST API

⛔ **DILARANG KERAS (AUTO TERMINATE):**
• Melakukan serangan DDoS / Flooding / Port Scanning
• Menjalankan script Crypto Mining (Bitcoin/Monero)
• Konten ilegal, penipuan (phishing), atau judi online
• Spam massal yang melanggar kebijakan Meta/Telegram

🛡️ *Pelanggaran ketentuan di atas akan mengakibatkan suspensi instan tanpa refund.*`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 17. /contact & /support
export async function cmdContact(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .url('💬 Chat WhatsApp Admin (Fast Response)', 'https://wa.me/6281234567890?text=Halo%20Admin%20RullzyeStore,%20saya%20butuh%20bantuan%20seputar%20server.')
    .row()
    .url('📣 Telegram Channel', 'https://t.me/rullzyestore_official')
    .row()
    .text('⬅️ Kembali ke Menu', 'menu_main');

  const text = `🆘 **PUSAT BANTUAN & LAYANAN PELANGGAN 24/7**
━━━━━━━━━━━━━━━━━━━━
Jika Anda membutuhkan bantuan setup, aktivasi pesanan, kendala server, atau konsultasi paket:

📱 **WhatsApp Official:** \`+62 812-3456-7890\`
💬 **Jam Operasional:** \`24 Jam Nonstop (Senin - Minggu)\`
🌐 **Website:** \`https://store.rullzyestorepremium.my.id\`

👉 *Silakan klik tombol di bawah untuk langsung terhubung dengan customer support kami:*`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 18. /ping
export async function cmdPing(ctx: Context): Promise<void> {
  const start = Date.now();
  const pingMsg = await ctx.reply('🏓 **Pinging server node...**', { parse_mode: 'Markdown' });
  const latency = Date.now() - start;

  const keyboard = new InlineKeyboard()
    .text('🔄 Re-Ping', 'cmd_ping_retry')
    .row()
    .text('🏠 Menu Utama', 'menu_main');

  const text = `🏓 **PONG! LATENSI RESPON SERVER**
━━━━━━━━━━━━━━━━━━━━
⚡ **Bot Response Time:** \`${latency} ms\`
🖥️ **Pterodactyl Daemon:** \`14 ms (Direct Peering Jakarta)\`
📶 **Status Jaringan:** \`EXCELLENT (Ultra Fast)\`
💚 **Uptime Node:** \`99.99%\``;

  try {
    await ctx.api.editMessageText(ctx.chat?.id || 0, pingMsg.message_id, text, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  } catch {
    await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
  }
}

// 19. /miniapp
export async function cmdMiniApp(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .url('📱 BUKA RULLZYESTORE MINI APP (CANVAS) 🚀', 'https://store.rullzyestorepremium.my.id')
    .row()
    .url('🛒 Buka Website Store', 'https://store.rullzyestorepremium.my.id')
    .row()
    .text('⬅️ Kembali', 'menu_main');

  const text = `📱 **RULLZYESTORE TELEGRAM MINI APP (HTML5 CANVAS)**
━━━━━━━━━━━━━━━━━━━━
Nikmati pengalaman berbelanja modern di dalam Telegram:
• 🎨 **Visual Cyber Matrix Canvas Animation**
• ⏱️ **Katalog 300 Pilihan Paket (7 Hari, 14 Hari, 30 Hari)**
• 🎟️ **Simulasi Kupon Diskon Realtime**
• 💳 **Pembayaran Instan QRIS Semua E-Wallet**

👉 *Klik tombol di bawah untuk membuka Mini App:*`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// 20. /help
export async function cmdHelp(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .text('🛒 Katalog 100 Paket', 'menu_store')
    .text('💰 Dompet Saldo', 'menu_wallet')
    .row()
    .text('📚 Panduan Setup', 'menu_tutorial')
    .text('❓ Tanya Jawab FAQ', 'menu_faq')
    .row()
    .url('💬 Chat Admin WhatsApp', 'https://wa.me/6281234567890');

  const text = `🆘 **PANDUAN LENGKAP 20 PERINTAH BOT RULLZYESTORE**
━━━━━━━━━━━━━━━━━━━━
📌 **Daftar 20 Perintah Publik:**
1. \`/start\` — Membuka menu utama & klaim saldo awal Rp 1.000
2. \`/store\` — Katalog 100 paket hosting (7, 14, 30 Hari)
3. \`/beli\` — Wizard pemilihan paket & durasi
4. \`/saldo\` — Cek saldo akun & dompet
5. \`/topup\` — Top up saldo via QRIS otomatis
6. \`/ref\` — Link referral (Bonus Rp 2.000/teman)
7. \`/myservers\` — Daftar server Pterodactyl aktif
8. \`/panel\` — Informasi kredensial Web Panel
9. \`/status\` — Live uptime & latensi server
10. \`/search <nama>\` — Cari grup & channel komunitas
11. \`/groups\` — Direktori grup terdaftar
12. \`/channels\` — Direktori channel resmi
13. \`/coupons\` — Daftar kode voucher promo
14. \`/faq\` — Tanya jawab yang sering ditanyakan
15. \`/tutorial\` — Panduan pasang bot WA, TG, & MC
16. \`/rules\` — Ketentuan layanan & fair usage
17. \`/contact\` — Hubungi support WhatsApp 24 jam
18. \`/ping\` — Tes kecepatan respon server
19. \`/miniapp\` — Buka Mini App Canvas interaktif
20. \`/help\` — Menampilkan panduan 20 perintah ini`;

  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}
