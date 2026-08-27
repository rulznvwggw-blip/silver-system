import { Context, InlineKeyboard } from 'grammy';

export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  ram: string;
  cpu: string;
  disk: string;
  features: string[];
}

export const STORE_PRODUCTS: Record<string, StoreProduct[]> = {
  whatsapp: [
    {
      id: 'wa-starter',
      name: 'WA Starter (512 MB)',
      category: 'Bot WhatsApp',
      price: 'Rp 15.000 / bln',
      ram: '512 MB',
      cpu: '50% vCPU',
      disk: '2 GB NVMe',
      features: ['Node.js 20/22', 'Baileys Ready', 'Scan QR di Console', 'Auto Restart'],
    },
    {
      id: 'wa-basic',
      name: 'WA Basic (1 GB)',
      category: 'Bot WhatsApp',
      price: 'Rp 25.000 / bln',
      ram: '1024 MB',
      cpu: '100% vCPU',
      disk: '5 GB NVMe',
      features: ['Multi-Device', 'Auto npm install', 'Web Console', 'Anti-Disconnect'],
    },
    {
      id: 'wa-pro',
      name: 'WA Pro Store (2 GB)',
      category: 'Bot WhatsApp',
      price: 'Rp 45.000 / bln',
      ram: '2048 MB',
      cpu: '150% vCPU',
      disk: '10 GB NVMe',
      features: ['High Traffic Store', 'Git Auto Pull', 'Full SFTP', 'Backup 24 Jam'],
    },
  ],
  telegram: [
    {
      id: 'tg-starter',
      name: 'TG Starter (512 MB)',
      category: 'Bot Telegram',
      price: 'Rp 12.000 / bln',
      ram: '512 MB',
      cpu: '50% vCPU',
      disk: '2 GB NVMe',
      features: ['Python 3.11 / Node.js', 'Aiogram & Telegraf', 'Auto pip install', 'Port Publik'],
    },
    {
      id: 'tg-pro',
      name: 'TG Pro Bot (1 GB)',
      category: 'Bot Telegram',
      price: 'Rp 25.000 / bln',
      ram: '1024 MB',
      cpu: '100% vCPU',
      disk: '5 GB NVMe',
      features: ['Webhook & Polling', 'Auto Restart Crash', 'Database SQLite/JSON', 'Uptime 99.99%'],
    },
  ],
  minecraft: [
    {
      id: 'mc-starter',
      name: 'MC Starter SMP (2 GB)',
      category: 'Minecraft Java',
      price: 'Rp 35.000 / bln',
      ram: '2048 MB',
      cpu: '150% CPU Clock',
      disk: '10 GB NVMe',
      features: ['Paper & Purpur', 'Java 8/17/21 Selector', '5-10 Player', 'Anti-DDoS 100 Gbps'],
    },
    {
      id: 'mc-smp',
      name: 'MC Survival Pro (4 GB)',
      category: 'Minecraft Java',
      price: 'Rp 65.000 / bln',
      ram: '4096 MB',
      cpu: '250% CPU Clock',
      disk: '20 GB NVMe',
      features: ['TPS 20.0 Stabil', 'Paper/Purpur/Spigot', '15-25 Player', 'Free Port Alokasi'],
    },
    {
      id: 'mc-network',
      name: 'MC Network (8 GB)',
      category: 'Minecraft Java',
      price: 'Rp 120.000 / bln',
      ram: '8192 MB',
      cpu: '400% CPU Clock',
      disk: '40 GB NVMe',
      features: ['Bungeecord / Velocity', '50+ Player Mabar', 'Full SFTP & JAR', 'Dedicated Core'],
    },
  ],
};

export async function handleStoreMenu(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .url('📱 Buka Mini App Interaktif 🚀', 'https://rullzyestorepremium.my.id')
    .row()
    .text('🟢 Bot WhatsApp (Baileys)', 'store_cat_whatsapp')
    .row()
    .text('🔵 Bot Telegram (Python/Node)', 'store_cat_telegram')
    .row()
    .text('⛏️ Minecraft Server (Java)', 'store_cat_minecraft')
    .row()
    .text('🎟️ Lihat Voucher Diskon', 'menu_coupons')
    .url('🌐 Buka Website Store', 'https://rullzyestorepremium.my.id/#pricing')
    .row()
    .text('⬅️ Kembali ke Menu Utama', 'menu_main');

  const text = `🛒 **KATALOG SEWA HOSTING RULLZYESTORE**
━━━━━━━━━━━━━━━━━━━━
Pilih kategori server yang ingin Anda sewa:

• 🟢 **Bot WhatsApp:** Optimal untuk Baileys / WhiskeySockets (Auto QR di Web Console).
• 🔵 **Bot Telegram:** Python 3.11 & Node.js 20 (Aiogram / Telegraf).
• ⛏️ **Minecraft Java:** Paper & Purpur TPS stabil 20.0 dengan Java Selector.

⚡ *Semua server otomatis dibuat & aktif dalam 5-10 detik setelah pembayaran QRIS/VA!*`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }
  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

export async function handleStoreCategory(ctx: Context, categoryKey: string): Promise<void> {
  const products = STORE_PRODUCTS[categoryKey] || [];
  const keyboard = new InlineKeyboard();

  products.forEach(p => {
    keyboard.text(`📦 ${p.name} - ${p.price}`, `store_plan_${p.id}`).row();
  });

  keyboard.text('⬅️ Kembali ke Katalog', 'menu_store').row().text('🏠 Menu Utama', 'menu_main');

  const catTitle = categoryKey === 'whatsapp' ? '🟢 HOSTING BOT WHATSAPP' : categoryKey === 'telegram' ? '🔵 HOSTING BOT TELEGRAM' : '⛏️ HOSTING MINECRAFT SERVER';

  const text = `${catTitle}
━━━━━━━━━━━━━━━━━━━━
Pilih paket spesifikasi yang sesuai dengan kebutuhan Anda:

${products
  .map(
    (p, i) =>
      `${i + 1}. **${p.name}**\n   💰 Harga: \`${p.price}\`\n   ⚙️ RAM: \`${p.ram}\` • CPU: \`${p.cpu}\` • Disk: \`${p.disk}\`\n   ✨ ${p.features.join(', ')}`
  )
  .join('\n\n')}`;

  try {
    await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } catch {
    await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
  }
}

export async function handleStoreProductDetail(ctx: Context, planId: string): Promise<void> {
  let product: StoreProduct | undefined;
  for (const cat of Object.values(STORE_PRODUCTS)) {
    const found = cat.find(p => p.id === planId);
    if (found) {
      product = found;
      break;
    }
  }

  if (!product) {
    await ctx.reply('⚠️ Paket tidak ditemukan.');
    return;
  }

  const checkoutUrl = `https://rullzyestorepremium.my.id/checkout?plan=${product.id}`;

  const keyboard = new InlineKeyboard()
    .url('💳 Pesan & Bayar Instan (QRIS / VA)', checkoutUrl)
    .row()
    .url('💬 Tanya Admin WhatsApp', 'https://wa.me/6281234567890?text=Halo%20Admin%20RullzyeStore,%20saya%20tertarik%20dengan%20paket%20' + encodeURIComponent(product.name))
    .row()
    .text('⬅️ Pilih Paket Lain', 'menu_store');

  const text = `📦 **DETAIL PAKET: ${product.name.toUpperCase()}**
━━━━━━━━━━━━━━━━━━━━
🏷️ **Kategori:** \`${product.category}\`
💰 **Biaya Sewa:** \`${product.price}\`

⚙️ **Spesifikasi Teknis:**
• **RAM Memory:** \`${product.ram}\`
• **Processor Limit:** \`${product.cpu}\`
• **Storage Disk:** \`${product.disk}\`
• **Port Publik:** \`Gratis 1 Port Alokasi\`
• **Panel Kontrol:** \`Pterodactyl Web Panel\`

✨ **Keunggulan Layanan:**
${product.features.map(f => `• ${f}`).join('\n')}
• Proteksi Auto-Restart saat crash
• Akses Web Console & File Manager SFTP

━━━━━━━━━━━━━━━━━━━━
👉 *Klik tombol di bawah untuk langsung menuju halaman pembayaran QRIS & aktivasi otomatis 24 jam:*`;

  try {
    await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } catch {
    await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
  }
}

export async function handleCouponsMenu(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .text('🛒 Pilih Paket & Gunakan Kupon', 'menu_store')
    .row()
    .text('⬅️ Kembali ke Menu', 'menu_main');

  const text = `🎟️ **KODE VOUCHER & PROMO RULLZYESTORE**
━━━━━━━━━━━━━━━━━━━━
Gunakan kode kupon di bawah ini saat checkout di website untuk mendapatkan potongan harga langsung:

1️⃣ **\`WELCOME10\`**
   • Diskon: **10% OFF**
   • Berlaku untuk: Semua Paket Hosting
   • Tanpa minimum belanja!

2️⃣ **\`DISKON20\`**
   • Diskon: **20% OFF**
   • Berlaku untuk: Pembelian paket apa saja dengan total min. Rp 30.000.

3️⃣ **\`MC50\`**
   • Diskon: **25% OFF**
   • Khusus untuk: Semua Paket Minecraft Server (Starter, SMP, Pro Network).

━━━━━━━━━━━━━━━━━━━━
💡 *Masukkan kode kupon di kolom "Punya Kode Voucher?" pada saat checkout.*`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }
  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

export async function handleFaqMenu(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .text('🛒 Beli Hosting Sekarang', 'menu_store')
    .row()
    .url('💬 Chat Admin WhatsApp', 'https://wa.me/6281234567890')
    .row()
    .text('⬅️ Kembali ke Menu', 'menu_main');

  const text = `❓ **TANYA JAWAB (FREQUENTLY ASKED QUESTIONS)**
━━━━━━━━━━━━━━━━━━━━
📌 **1. Bagaimana cara server saya aktif?**
_Setelah Anda melakukan pembayaran via QRIS / VA di website, sistem auto-provisioning akan langsung membuat akun dan mendeploy container server Anda dalam 5-10 detik._

📌 **2. Apakah bot WhatsApp mendukung Baileys?**
_Sangat mendukung! Egg Node.js kami sudah dioptimasi untuk Baileys, auto-install npm dependencies, dan QR code login bisa langsung di-scan di Web Console browser._

📌 **3. Bisakah upload plugin / custom JAR Minecraft?**
_Bisa! Anda mendapatkan akses penuh File Manager berbasis web dan SFTP (Port 2022) untuk upload file jar kustom, plugin, dan world map._

📌 **4. Bagaimana jika server saya mengalami kendala?**
_Tim support kami siap membantu 24/7 melalui Live Chat WhatsApp dan sistem tiket di Client Area._`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }
  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}
