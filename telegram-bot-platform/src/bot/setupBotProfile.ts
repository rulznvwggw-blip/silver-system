import { Bot } from 'grammy';

export async function setupBotProfile(bot: Bot<any>): Promise<void> {
  try {
    console.log('[BOT SETUP] Updating Telegram Bot Bio, Description, Commands, and Profile...');

    // 1. Set Bot Name (Max 64 chars)
    try {
      await bot.api.setMyName('RullzyeStore Cloud Hosting 🚀');
    } catch (e: any) {
      console.warn('[BOT SETUP] setMyName notice:', e.message);
    }

    // 2. Set Short Description (Bio header, max 120 chars)
    try {
      await bot.api.setMyShortDescription('Hosting Bot WhatsApp, Telegram & Minecraft 24 Jam Pterodactyl Indonesia. Beli & aktif instan via QRIS!');
    } catch (e: any) {
      console.warn('[BOT SETUP] setMyShortDescription notice:', e.message);
    }

    // 3. Set Description (Displayed in empty chat before user clicks /start, max 512 chars)
    try {
      await bot.api.setMyDescription(
`⚡ Pusat Sewa Cloud Hosting Server 24 Jam Otomatis Indonesia!

✨ PILIHAN DURASI & LAYANAN:
• ⚡ 7 Hari (Mingguan) | 🔥 14 Hari (2 Minggu) | 🚀 30 Hari (Bulanan)
• 🟢 Hosting Bot WhatsApp (Baileys / Node.js 20)
• 🔵 Hosting Bot Telegram (Python 3.11 / Node.js)
• ⛏️ Minecraft Java Server (Paper / Purpur TPS 20.0)
• 🚀 Linux VPS & Container Docker

💎 BONUS & KEUNGGULAN:
• 🎁 Saldo Awal Rp 1.000 + Bonus Referral Rp 2.000/Teman
• ⚡ Auto-Deploy dalam 5 Detik & Scan QR di Web Console
• 💳 Pembayaran Instan via QRIS (Semua E-Wallet)

👉 Ketik /start untuk membuka Mini App & katalog 100 paket!`
      );
    } catch (e: any) {
      console.warn('[BOT SETUP] setMyDescription notice:', e.message);
    }

    // 4. Set 20 Searchable Public Commands
    try {
      await bot.api.setMyCommands([
        { command: 'start', description: '🚀 Buka Menu Utama & Dapatkan Saldo Rp 1.000' },
        { command: 'store', description: '🛒 Katalog 100 Paket Hosting (7, 14, 30 Hari)' },
        { command: 'beli', description: '💳 Wizard Pemilihan & Pembelian Paket' },
        { command: 'saldo', description: '💰 Cek Saldo Dompet & Riwayat' },
        { command: 'topup', description: '💵 Top Up Saldo Instan via QRIS' },
        { command: 'ref', description: '👥 Link Referral (Bonus Rp 2.000/Teman)' },
        { command: 'myservers', description: '📦 Daftar Server Pterodactyl Aktif Anda' },
        { command: 'panel', description: '💻 Kredensial & URL Login Web Panel' },
        { command: 'status', description: '📊 Live Status Uptime Node Server (99.99%)' },
        { command: 'search', description: '🔎 Cari Grup & Channel Komunitas' },
        { command: 'groups', description: '👥 Direktori Grup Komunitas Terdaftar' },
        { command: 'channels', description: '📣 Direktori Channel Resmi' },
        { command: 'coupons', description: '🎟️ Daftar Kode Voucher Diskon Promo' },
        { command: 'faq', description: '❓ Tanya Jawab & Pertanyaan Umum' },
        { command: 'tutorial', description: '📚 Panduan Setup Bot WA, TG, & Minecraft' },
        { command: 'rules', description: '📜 Ketentuan Layanan & Aturan Node (TOS)' },
        { command: 'contact', description: '🆘 Hubungi Customer Support WhatsApp 24 Jam' },
        { command: 'ping', description: '🏓 Tes Latensi Respon Bot & Server' },
        { command: 'miniapp', description: '📱 Buka Telegram Mini App Canvas' },
        { command: 'help', description: '📋 Panduan Lengkap 20 Perintah Bot' },
      ]);
    } catch (e: any) {
      console.warn('[BOT SETUP] setMyCommands notice:', e.message);
    }

    console.log('[BOT SETUP] ✅ All 20 Public Commands, Profile, Bio & Descriptions successfully updated on Telegram!');
  } catch (err: any) {
    console.warn('[BOT SETUP] Profile setup error:', err.message);
  }
}
