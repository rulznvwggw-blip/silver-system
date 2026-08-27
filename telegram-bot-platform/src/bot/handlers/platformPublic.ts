import { Context, InlineKeyboard } from 'grammy';
import { db, ProductModel } from '../../database/db.js';
import { getDynamicGreeting, createCozyHeader, formatRupiah } from '../../utils/ui.js';
import { AnimationManager } from '../animations/animationManager.js';
import { pterodactylService } from '../../services/pterodactylService.js';
import { flowixService } from '../../services/flowixService.js';
import { CommunityType } from '../../config/constants.js';

export async function sendOrEdit(ctx: Context, text: string, keyboard: InlineKeyboard): Promise<void> {
  if (ctx.callbackQuery?.message) {
    try {
      await ctx.api.editMessageText(
        ctx.chat!.id,
        ctx.callbackQuery.message.message_id,
        text,
        { parse_mode: 'Markdown', reply_markup: keyboard, link_preview_options: { is_disabled: true } }
      );
      return;
    } catch {}
  }
  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard, link_preview_options: { is_disabled: true } });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. HOME & HIGHLIGHTS (Nav 1 - 10)
// ═══════════════════════════════════════════════════════════════════════════════

export async function handlePubHome(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const name = ctx.from?.first_name || 'Customer';
  const { greeting, icon, timeLabel } = getDynamicGreeting();
  const user = await db.getUser(userId) || (await db.registerUser(userId, name, ctx.from?.username)).user;

  const header = `╭──────────────────────────────────╮\n│  ${icon} ${greeting.toUpperCase()}\n│  👋 Halo, ${name}!\n╰──────────────────────────────────╯`;

  const body = `✨ **Selamat datang di RULLZYE STORE CLOUD**\n_Platform Manajemen Server Bot & Game Hosting Terdepan_\n\n` +
    `👤 **Status Akun:** \`Terverifikasi (Member)\`\n` +
    `💰 **Saldo Dompet:** \`${formatRupiah(user.balance)}\`\n` +
    `🌟 **Waktu Server:** \`${timeLabel} (Asia/Jakarta)\`\n\n` +
    `🔥 **Promo Hari Ini:** Diskon 10% kode voucher \`WELCOME10\`!\n\n` +
    `Silakan pilih layanan utama yang ingin Anda akses:`;

  const keyboard = new InlineKeyboard()
    .text('🛍️ Buka Store', 'nav_pub_store')
    .text('🧩 Layanan Saya', 'nav_pub_my_services')
    .row()
    .text('🛒 Keranjang', 'nav_pub_cart')
    .text('👥 Komunitas', 'nav_pub_groups')
    .row()
    .text('🤖 AI Assistant', 'nav_pub_ai_assistant')
    .text('👤 Akun Saya', 'nav_pub_profile')
    .row()
    .text('🆘 Bantuan & Support', 'nav_pub_help_center')
    .url('🌐 Web Store', 'https://store.rullzyestorepremium.my.id');

  await sendOrEdit(ctx, `${header}\n\n${body}`, keyboard);
}

export async function handlePubStore(ctx: Context): Promise<void> {
  const header = createCozyHeader('🛍️ RULLZYE STORE CATALOG', 'Pusat Hosting Bot & Server Game');
  const text = `${header}\n\n` +
    `Pilih kategori produk atau filter katalog unggulan di bawah ini:\n\n` +
    `• 🟢 **Bot WhatsApp:** Baileys / Node.js 20 Multi-Device (Auto QR).\n` +
    `• 🔵 **Bot Telegram:** Python 3.11 & Node.js Telegraf 24 Jam.\n` +
    `• ⛏️ **Minecraft Java:** Paper & Purpur 1.20.4 TPS 20.0.\n\n` +
    `⚡ _Semua server langsung aktif dalam 5 detik setelah pembayaran!_`;

  const keyboard = new InlineKeyboard()
    .text('📦 Semua Produk', 'nav_pub_products')
    .text('🗂️ Kategori', 'nav_pub_categories')
    .row()
    .text('🔥 Terpopuler', 'nav_pub_popular')
    .text('⭐ Produk Unggulan', 'nav_pub_featured')
    .row()
    .text('🆕 Produk Baru', 'nav_pub_new_products')
    .text('💎 Paket Premium', 'nav_pub_premium')
    .row()
    .text('🎁 Promo Aktif', 'nav_pub_promotions')
    .text('🎟️ Kode Kupon', 'nav_pub_coupons')
    .row()
    .text('🛒 Lihat Keranjang', 'nav_pub_cart')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, text, keyboard);
}

export async function handlePubProducts(ctx: Context, page = 1): Promise<void> {
  const products = await db.getProducts();
  const pageSize = 4;
  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));
  const current = products.slice((safePage - 1) * pageSize, safePage * pageSize);

  const header = createCozyHeader('📦 SEMUA PRODUK HOSTING', `Halaman ${safePage} dari ${totalPages}`);
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();

  if (current.length === 0) {
    body += `_Belum ada produk yang tersedia saat ini._\n\n`;
  } else {
    current.forEach(p => {
      body += `• **${p.name}** [${p.badge}]\n  💰 \`${formatRupiah(p.price)}/${p.duration_label}\` | RAM: \`${p.ram_mb}MB\` • Disk: \`${p.disk_gb}GB\`\n  _${p.description}_\n\n`;
      keyboard.text(`👉 Detail ${p.name.slice(0, 18)}...`, `prod_view_${p.id}`).row();
    });
  }

  // Pagination
  const navRow = [];
  if (safePage > 1) navRow.push(InlineKeyboard.text('⬅️ Sebelumnya', `nav_pub_products_p_${safePage - 1}`));
  navRow.push(InlineKeyboard.text(`📄 ${safePage}/${totalPages}`, 'noop'));
  if (safePage < totalPages) navRow.push(InlineKeyboard.text('Selanjutnya ➡️', `nav_pub_products_p_${safePage + 1}`));
  keyboard.row(...navRow);

  keyboard.row().text('⬅️ Kembali ke Store', 'nav_pub_store').text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCategories(ctx: Context): Promise<void> {
  const categories = await db.getCategories();
  const header = createCozyHeader('🗂️ KATEGORI PRODUK (200 PILIHAN)', 'Pilih kategori server yang Anda butuhkan');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  categories.forEach(c => {
    body += `${c.icon} **${c.name}**\n_${c.description}_\n\n`;
    keyboard.text(`${c.icon} ${c.name}`, `cat_filter_${c.id}`).row();
  });

  keyboard.text('⬅️ Kembali', 'nav_pub_store').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCategoryProducts(ctx: Context, categoryId: string, page = 1): Promise<void> {
  const products = await db.getProducts({ category_id: categoryId });
  const pageSize = 5;
  const totalPages = Math.ceil(products.length / pageSize) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));
  const current = products.slice((safePage - 1) * pageSize, safePage * pageSize);

  const catNames: Record<string, string> = {
    whatsapp: '🟢 BOT WHATSAPP (60 PAKET)',
    telegram: '🔵 BOT TELEGRAM (60 PAKET)',
    minecraft: '⛏️ MINECRAFT JAVA & BEDROCK (60 PAKET)',
    application: '🚀 APP CLOUD & API (20 PAKET)',
  };

  const title = catNames[categoryId] || `🗂️ KATEGORI ${categoryId.toUpperCase()}`;
  const header = createCozyHeader(title, `Halaman ${safePage} dari ${totalPages} (Total ${products.length} Pilihan)`);
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();

  if (current.length === 0) {
    body += `_Belum ada paket produk di kategori ini._\n\n`;
  } else {
    current.forEach(p => {
      body += `• **${p.name}** [${p.badge}]\n  💰 \`${formatRupiah(p.price)}/${p.duration_label}\` | RAM: \`${p.ram_mb}MB\` • Disk: \`${p.disk_gb}GB\`\n  _${p.description}_\n\n`;
      keyboard.text(`👉 Pilih ${p.name.slice(0, 18)}...`, `prod_view_${p.id}`).row();
    });
  }

  // Pagination for category
  const navRow = [];
  if (safePage > 1) navRow.push(InlineKeyboard.text('⬅️ Prev', `cat_page_${categoryId}_${safePage - 1}`));
  navRow.push(InlineKeyboard.text(`📄 ${safePage}/${totalPages}`, 'noop'));
  if (safePage < totalPages) navRow.push(InlineKeyboard.text('Next ➡️', `cat_page_${categoryId}_${safePage + 1}`));
  keyboard.row(...navRow);

  keyboard.row().text('🗂️ Semua Kategori', 'nav_pub_categories').text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubPopular(ctx: Context): Promise<void> {
  const popular = await db.getProducts({ is_popular: true });
  const header = createCozyHeader('🔥 PRODUK TERPOPULER', 'Paling Banyak Disewa Pelanggan');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  popular.forEach(p => {
    body += `• 🔥 **${p.name}**\n  💰 \`${formatRupiah(p.price)}/${p.duration_label}\`\n  _${p.description}_\n\n`;
    keyboard.text(`📦 Beli ${p.name.slice(0, 18)}...`, `prod_view_${p.id}`).row();
  });

  keyboard.text('⬅️ Kembali', 'nav_pub_store').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubFeatured(ctx: Context): Promise<void> {
  const featured = await db.getProducts({ is_featured: true });
  const header = createCozyHeader('⭐ PRODUK UNGGULAN (FEATURED)', 'Direkomendasikan oleh Admin & Komunitas');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  featured.forEach(p => {
    body += `• ⭐ **${p.name}** [${p.badge}]\n  💰 \`${formatRupiah(p.price)}/${p.duration_label}\`\n  _${p.description}_\n\n`;
    keyboard.text(`📦 Pilih ${p.name.slice(0, 18)}...`, `prod_view_${p.id}`).row();
  });

  keyboard.text('⬅️ Kembali', 'nav_pub_store').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubNewProducts(ctx: Context): Promise<void> {
  const newProds = await db.getProducts({ is_new: true });
  const header = createCozyHeader('🆕 PRODUK TERBARU', 'Paket & Spesifikasi Anyar');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  if (newProds.length === 0) {
    body += `_Semua produk kami sudah diperbarui ke versi stabil terbaru._\n\n`;
  } else {
    newProds.forEach(p => {
      body += `• 🆕 **${p.name}**\n  💰 \`${formatRupiah(p.price)}\`\n  _${p.description}_\n\n`;
      keyboard.text(`📦 Lihat ${p.name.slice(0, 18)}...`, `prod_view_${p.id}`).row();
    });
  }

  keyboard.text('⬅️ Kembali', 'nav_pub_store').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubPremium(ctx: Context): Promise<void> {
  const premium = await db.getProducts({ is_premium: true });
  const header = createCozyHeader('💎 PAKET ENTERPRISE & PREMIUM', 'Dedicated Core & High RAM Memory');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  premium.forEach(p => {
    body += `• 💎 **${p.name}**\n  💰 \`${formatRupiah(p.price)}/${p.duration_label}\` | RAM: \`${p.ram_mb}MB\`\n  _${p.description}_\n\n`;
    keyboard.text(`👑 Detail ${p.name.slice(0, 18)}...`, `prod_view_${p.id}`).row();
  });

  keyboard.text('⬅️ Kembali', 'nav_pub_store').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubPromotions(ctx: Context): Promise<void> {
  const header = createCozyHeader('🎁 PROMO & DISKON SPESIAL', 'Penawaran Terbatas Bulan Ini');
  const body = `${header}\n\n` +
    `🎉 **PROMO AKTIF SAAT INI:**\n\n` +
    `1️⃣ **LAUNCHING SPECIAL 30% OFF**\n` +
    `   • Gunakan kode: \`RULLZYESAAS\`\n` +
    `   • Min. Belanja: \`Rp 20.000\`\n\n` +
    `2️⃣ **DISKON MEMBER BARU 10%**\n` +
    `   • Gunakan kode: \`WELCOME10\`\n` +
    `   • Tanpa minimum belanja!\n\n` +
    `3️⃣ **GRATIS 1 PORT DEDIKASI**\n` +
    `   • Semua pembelian server Minecraft & Bot otomatis mendapatkan 1 port publik gratis.\n\n` +
    `💡 _Klaim kupon pada saat proses checkout pesanan._`;

  const keyboard = new InlineKeyboard()
    .text('🎟️ Lihat Semua Kupon', 'nav_pub_coupons')
    .text('🛍️ Belanja Sekarang', 'nav_pub_products')
    .row()
    .text('⬅️ Kembali', 'nav_pub_store')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCoupons(ctx: Context): Promise<void> {
  const coupons = await db.getCoupons();
  const header = createCozyHeader('🎟️ DAFTAR KODE KUPON VOUCHER', 'Kupon Potongan Harga Siap Pakai');
  let body = `${header}\n\n`;

  coupons.forEach((c, idx) => {
    body += `${idx + 1}. 🎟️ **\`${c.code}\`**\n` +
      `   • Potongan: **${c.discount_percent}%**\n` +
      `   • Min Belanja: \`${formatRupiah(c.min_purchase)}\`\n` +
      `   • Info: _${c.description}_\n\n`;
  });

  body += `💡 _Salin salah satu kode di atas dan masukkan saat checkout._`;

  const keyboard = new InlineKeyboard()
    .text('🛍️ Gunakan Kupon di Store', 'nav_pub_products')
    .row()
    .text('⬅️ Kembali', 'nav_pub_store')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. STORE, CART, CHECKOUT & ORDERS (Nav 11 - 20)
// ═══════════════════════════════════════════════════════════════════════════════

export async function handlePubCart(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const items = await db.getCart(userId);
  const header = createCozyHeader('🛒 KERANJANG BELANJA ANDA', 'Shopping Cart');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();

  if (items.length === 0) {
    body += `_Belum ada produk di keranjang belanja Anda._\n\nSilakan jelajahi katalog kami dan tambahkan paket server yang Anda inginkan!`;
    keyboard.text('🛍️ Jelajahi Produk Store', 'nav_pub_products').row();
  } else {
    let total = 0;
    items.forEach((item, idx) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      body += `${idx + 1}. **${item.name}**\n   └ Qty: \`${item.quantity}\`x | Subtotal: \`${formatRupiah(subtotal)}\`\n\n`;
      keyboard.text(`❌ Hapus ${item.name.slice(0, 12)}`, `cart_remove_${item.id}`).row();
    });

    body += `━━━━━━━━━━━━━━━━━━━━\n💰 **Total Belanja:** \`${formatRupiah(total)}\``;

    keyboard
      .text('💳 Lanjutkan ke Checkout', 'nav_pub_checkout')
      .row()
      .text('🗑️ Kosongkan Keranjang', 'cart_clear')
      .text('➕ Tambah Produk', 'nav_pub_products')
      .row();
  }

  keyboard.text('⬅️ Kembali ke Store', 'nav_pub_store').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCheckout(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const items = await db.getCart(userId);
  const user = await db.getUser(userId);
  const balance = user?.balance || 0;

  if (items.length === 0) {
    await handlePubCart(ctx);
    return;
  }

  let total = 0;
  items.forEach(i => (total += i.price * i.quantity));

  const header = createCozyHeader('💳 CHECKOUT & PEMBAYARAN', 'Konfirmasi Pesanan');
  const body = `${header}\n\n` +
    `📦 **Ringkasan Pesanan:**\n` +
    items.map(i => `• ${i.name} (x${i.quantity}) — \`${formatRupiah(i.price * i.quantity)}\``).join('\n') +
    `\n\n━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 **Total Tagihan:** \`${formatRupiah(total)}\`\n` +
    `💳 **Saldo Anda Saat Ini:** \`${formatRupiah(balance)}\`\n\n` +
    (balance >= total
      ? `✅ _Saldo Anda mencukupi untuk pembayaran instan._`
      : `⚠️ _Saldo tidak mencukupi. Silakan top up saldo atau gunakan QRIS instan._`);

  const keyboard = new InlineKeyboard();

  if (balance >= total) {
    keyboard.text('💰 Bayar Sekarang Pakai Saldo', 'checkout_confirm_balance').row();
  } else {
    keyboard.text('💳 Top Up Saldo Akun', 'nav_pub_balance').row();
  }

  keyboard
    .url('📲 Bayar via QRIS Otomatis', 'https://store.rullzyestorepremium.my.id')
    .row()
    .text('🛒 Kembali ke Keranjang', 'nav_pub_cart')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubInvoices(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const invoices = await db.getUserInvoices(userId);
  const header = createCozyHeader('🧾 INVOICE & BUKTI PEMBAYARAN', 'Riwayat Faktur Transaksi');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();

  if (invoices.length === 0) {
    body += `_Belum ada riwayat faktur/invoice pada akun Anda._\n\nInvoice akan otomatis terbit setiap Anda melakukan transaksi.`;
  } else {
    invoices.slice(0, 5).forEach((inv, idx) => {
      body += `${idx + 1}. 🧾 **Invoice: \`${inv.invoice_code}\`**\n` +
        `   └ Order: \`${inv.order_code}\` | Jumlah: \`${formatRupiah(inv.amount)}\`\n` +
        `   └ Status: \`LUNAS (${inv.status})\` • Tgl: \`${inv.created_at.toLocaleDateString('id-ID')}\`\n\n`;
    });
  }

  keyboard.text('⬅️ Layanan Saya', 'nav_pub_my_services').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubMyOrders(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const orders = await db.getUserOrders(userId);
  const header = createCozyHeader('📦 PESANAN SAYA (MY ORDERS)', 'Daftar Semua Pesanan Anda');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();

  if (orders.length === 0) {
    body += `_Belum ada riwayat pesanan server di akun Anda._\n\nPesan server pertama Anda dan nikmati hosting instan 24 jam!`;
    keyboard.text('🛍️ Buka Katalog Store', 'nav_pub_products').row();
  } else {
    orders.slice(0, 6).forEach((ord, idx) => {
      body += `${idx + 1}. **${ord.product_name}**\n` +
        `   └ No. Order: \`${ord.order_code}\`\n` +
        `   └ Status: \`${ord.order_status}\` | Biaya: \`${formatRupiah(ord.total_amount)}\`\n` +
        `   └ Tanggal: \`${ord.created_at.toLocaleDateString('id-ID')}\`\n\n`;
    });
  }

  keyboard.text('🧾 Lihat Invoice', 'nav_pub_invoices').row().text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubRenewService(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const servers = await db.getUserServers(userId);
  const header = createCozyHeader('🔄 PERPANJANG LAYANAN (RENEW)', 'Perpanjang Masa Aktif Server');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();

  if (servers.length === 0) {
    body += `_Anda belum memiliki server aktif yang perlu diperpanjang._`;
    keyboard.text('🛍️ Sewa Server Baru', 'nav_pub_products').row();
  } else {
    body += `Pilih server di bawah ini untuk memperpanjang durasi masa aktif:\n\n`;
    servers.forEach(s => {
      body += `• **${s.server_name}** (Port: \`${s.port}\`)\n  └ Expired: \`${s.expires_at.toLocaleDateString('id-ID')}\`\n\n`;
      keyboard.text(`🔄 Perpanjang ${s.server_name.slice(0, 16)}`, `renew_server_${s.id}`).row();
    });
  }

  keyboard.text('⬅️ Layanan Saya', 'nav_pub_my_services').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubMyServices(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const servers = await db.getUserServers(userId);
  const user = await db.getUser(userId);

  const header = createCozyHeader('🧩 LAYANAN & SERVER SAYA', 'Active Services & Containers');
  let body = `${header}\n\n` +
    `👤 **Akun Panel:** \`${user?.ptero_username || `user_${userId}`}\`\n` +
    `🌐 **Panel Host:** \`ptero.rullzyestorepremium.my.id\`\n\n`;

  const keyboard = new InlineKeyboard();

  if (servers.length === 0) {
    body += `_Anda belum memiliki server yang aktif saat ini._\n\nBeli paket server untuk mulai membuat bot atau server game Anda!`;
    keyboard.text('🛍️ Sewa Server Pertama', 'nav_pub_products').row();
  } else {
    servers.forEach((s, idx) => {
      body += `${idx + 1}. **${s.server_name}**\n` +
        `   └ 🔌 Port: \`${s.port}\` | Status: \`ONLINE 💚\`\n` +
        `   └ ⏱️ Masa Aktif: \`${s.duration_days} Hari\` (s.d. \`${s.expires_at.toLocaleDateString('id-ID')}\`)\n` +
        `   └ 🆔 Identifier: \`${s.server_identifier}\`\n\n`;
    });

    keyboard
      .url('💻 Buka Pterodactyl Panel', 'https://ptero.rullzyestorepremium.my.id')
      .row()
      .text('🔄 Perpanjang Server', 'nav_pub_renew_service')
      .text('🚀 Deployments', 'nav_pub_deployments')
      .row();
  }

  keyboard.text('🧾 Invoices', 'nav_pub_invoices').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubDeployments(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const servers = await db.getUserServers(userId);
  const header = createCozyHeader('🚀 STATUS DEPLOYMENT CONTAINER', 'Realtime Node & Runtime Status');
  let body = `${header}\n\n` +
    `🟢 **Node Status:** \`ONLINE (Node-Main-01 Jakarta)\`\n` +
    `⚡ **Network Latency:** \`1ms - 5ms\`\n` +
    `🛡️ **Anti-DDoS Shield:** \`100 Gbps Active\`\n\n` +
    `📊 **Container Aktif Anda:** \`${servers.length} Container\`\n\n`;

  if (servers.length > 0) {
    servers.forEach((s, i) => {
      body += `${i + 1}. **${s.server_name}**\n   └ Host: \`pteronode.rullzyestorepremium.my.id:${s.port}\`\n   └ Container ID: \`${s.server_identifier}\`\n\n`;
    });
  }

  const keyboard = new InlineKeyboard()
    .url('💻 Buka Web Console', 'https://ptero.rullzyestorepremium.my.id')
    .row()
    .text('⬅️ Kembali', 'nav_pub_my_services')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubOrderStats(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const orders = await db.getUserOrders(userId);
  const totalSpent = orders.reduce((sum, o) => sum + o.total_amount, 0);

  const header = createCozyHeader('📊 STATISTIK PESANAN AKUN', 'Laporan Belanja Anda');
  const body = `${header}\n\n` +
    `📦 **Total Pesanan:** \`${orders.length} Transaksi\`\n` +
    `💰 **Total Belanja:** \`${formatRupiah(totalSpent)}\`\n` +
    `✅ **Tingkat Keberhasilan:** \`100% (Instant Automated)\`\n\n` +
    `Terima kasih telah mempercayakan kebutuhan hosting Anda kepada RullzyeStore!`;

  const keyboard = new InlineKeyboard()
    .text('📦 Riwayat Pesanan', 'nav_pub_my_orders')
    .text('🧾 Invoices', 'nav_pub_invoices')
    .row()
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubWishlist(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const wishlist = await db.getWishlist(userId);
  const header = createCozyHeader('❤️ WISHLIST & PRODUK TERSIMPAN', 'Daftar Keinginan Anda');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();

  if (wishlist.length === 0) {
    body += `_Wishlist Anda masih kosong._\n\nKlik tombol ❤️ pada detail produk untuk menyimpannya di sini.`;
    keyboard.text('🛍️ Cari Produk Favorit', 'nav_pub_products').row();
  } else {
    wishlist.forEach(p => {
      body += `• **${p.name}**\n  💰 \`${formatRupiah(p.price)}\`\n  _${p.description}_\n\n`;
      keyboard.text(`🛒 Beli ${p.name.slice(0, 16)}`, `prod_view_${p.id}`).row();
    });
  }

  keyboard.text('⬅️ Kembali ke Store', 'nav_pub_store').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubRecentlyViewed(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const recent = await db.getRecentlyViewed(userId);
  const header = createCozyHeader('🕘 TERAKHIR DILIHAT (RECENTLY VIEWED)', 'Produk yang baru Anda lihat');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();

  if (recent.length === 0) {
    body += `_Belum ada produk yang baru saja Anda lihat._`;
    keyboard.text('🛍️ Jelajahi Store', 'nav_pub_products').row();
  } else {
    recent.forEach(p => {
      body += `• **${p.name}** — \`${formatRupiah(p.price)}\`\n`;
      keyboard.text(`👉 Lihat ${p.name.slice(0, 18)}`, `prod_view_${p.id}`).row();
    });
  }

  keyboard.text('⬅️ Kembali ke Store', 'nav_pub_store').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. COMMUNITY DIRECTORY (Nav 21 - 30)
// ═══════════════════════════════════════════════════════════════════════════════

export async function handlePubGroups(ctx: Context): Promise<void> {
  const groups = await db.getCommunities(CommunityType.GROUP);
  const header = createCozyHeader('👥 DIREKTORI GRUP RESMI', 'Komunitas Diskusi & Mabar');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  groups.forEach(g => {
    body += `• 👥 **${g.name}**\n  └ Kategori: \`${g.category}\` • Anggota: \`${g.member_count}+\`\n  _${g.description || 'Grup resmi komunitas'}\_\n\n`;
    if (g.username) {
      keyboard.url(`🔗 Gabung @${g.username}`, `https://t.me/${g.username}`).row();
    } else if (g.invite_link) {
      keyboard.url(`🔗 Gabung ${g.name.slice(0, 16)}`, g.invite_link).row();
    }
  });

  keyboard
    .text('📣 Lihat Channels', 'nav_pub_channels')
    .text('🔎 Cari Komunitas', 'nav_pub_comm_search')
    .row()
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubChannels(ctx: Context): Promise<void> {
  const channels = await db.getCommunities(CommunityType.CHANNEL);
  const header = createCozyHeader('📣 OFFICIAL CHANNELS', 'Saluran Pengumuman & Update Promo');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  channels.forEach(c => {
    body += `• 📣 **${c.name}**\n  └ Kategori: \`${c.category}\` • Pelanggan: \`${c.member_count}+\`\n  _${c.description || 'Channel informasi resmi'}\_\n\n`;
    if (c.username) {
      keyboard.url(`📢 Buka @${c.username}`, `https://t.me/${c.username}`).row();
    } else if (c.invite_link) {
      keyboard.url(`📢 Buka ${c.name.slice(0, 16)}`, c.invite_link).row();
    }
  });

  keyboard
    .text('👥 Lihat Groups', 'nav_pub_groups')
    .text('⭐ Komunitas Unggulan', 'nav_pub_comm_featured')
    .row()
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCommFeatured(ctx: Context): Promise<void> {
  const comms = (await db.getCommunities()).filter(c => c.is_featured);
  const header = createCozyHeader('⭐ KOMUNITAS UNGGULAN (FEATURED)', 'Grup & Saluran Terverifikasi');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  comms.forEach(c => {
    body += `• ⭐ **${c.name}** [${c.type.toUpperCase()}]\n  _${c.description || 'Official community'}\_\n\n`;
    if (c.username) keyboard.url(`🔗 Gabung @${c.username}`, `https://t.me/${c.username}`).row();
  });

  keyboard.text('👥 Semua Grup', 'nav_pub_groups').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCommPopular(ctx: Context): Promise<void> {
  const comms = (await db.getCommunities()).sort((a, b) => b.member_count - a.member_count);
  const header = createCozyHeader('🔥 KOMUNITAS TERPOPULER', 'Paling Banyak Member');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  comms.forEach(c => {
    body += `• 🔥 **${c.name}** (\`${c.member_count.toLocaleString('id-ID')} Anggota\`)\n\n`;
    if (c.username) keyboard.url(`🔗 Gabung @${c.username}`, `https://t.me/${c.username}`).row();
  });

  keyboard.text('👥 Semua Komunitas', 'nav_pub_groups').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCommNew(ctx: Context): Promise<void> {
  const comms = (await db.getCommunities()).slice(-3);
  const header = createCozyHeader('🆕 KOMUNITAS BARU DITAMBAHKAN', 'Fresh Official Communities');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  comms.forEach(c => {
    body += `• 🆕 **${c.name}** [${c.type.toUpperCase()}]\n  _${c.description || 'Komunitas baru'}\_\n\n`;
    if (c.username) keyboard.url(`🔗 Buka ${c.name.slice(0, 16)}`, `https://t.me/${c.username}`).row();
  });

  keyboard.text('⬅️ Kembali', 'nav_pub_groups').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCommSearch(ctx: Context): Promise<void> {
  const header = createCozyHeader('🔎 PENCARIAN KOMUNITAS', 'Cari Grup / Channel Berdasarkan Topik');
  const body = `${header}\n\n` +
    `Ketik command di chat untuk mencari komunitas:\n` +
    `👉 \`/cari hosting\`\n` +
    `👉 \`/cari minecraft\`\n` +
    `👉 \`/cari bot\`\n\n` +
    `Atau klik salah satu kategori cepat di bawah:`;

  const keyboard = new InlineKeyboard()
    .text('🚀 Komunitas Hosting', 'comm_search_hosting')
    .text('⛏️ Komunitas Minecraft', 'comm_search_minecraft')
    .row()
    .text('👥 Semua Grup', 'nav_pub_groups')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCommCategories(ctx: Context): Promise<void> {
  const header = createCozyHeader('🏷️ KATEGORI KOMUNITAS', 'Eksplorasi berdasarkan Minat');
  const body = `${header}\n\n` +
    `• 🚀 **Hosting & Cloud:** Diskusi Pterodactyl, VPS, Node.js, Python.\n` +
    `• ⛏️ **Minecraft Gaming:** Survival SMP, Mabar, Plugin & Maps.\n` +
    `• 📢 **Update & Technology:** Info teknologi server dan promo diskon.`;

  const keyboard = new InlineKeyboard()
    .text('🚀 Hosting', 'comm_search_hosting')
    .text('⛏️ Gaming', 'comm_search_minecraft')
    .row()
    .text('👥 Kembali ke Direktori', 'nav_pub_groups')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCommMy(ctx: Context): Promise<void> {
  const header = createCozyHeader('🔗 KOMUNITAS SAYA', 'Grup & Channel Tempat Anda Terdaftar');
  const body = `${header}\n\n` +
    `Anda saat ini terhubung dengan jaringan komunitas resmi RullzyeStore Cloud.\n\n` +
    `Semua anggota komunitas resmi berhak atas promo voucher mingguan & konsultasi bot 24 jam!`;

  const keyboard = new InlineKeyboard()
    .text('📌 Komunitas Tersimpan', 'nav_pub_comm_saved')
    .text('👥 Jelajahi Grup', 'nav_pub_groups')
    .row()
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCommSaved(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const saved = await db.getSavedCommunities(userId);
  const header = createCozyHeader('📌 KOMUNITAS TERSIMPAN', 'Bookmark Favorit Anda');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  if (saved.length === 0) {
    body += `_Belum ada komunitas yang Anda simpan/bookmark._`;
    keyboard.text('👥 Jelajahi Grup', 'nav_pub_groups').row();
  } else {
    saved.forEach(s => {
      body += `• **${s.name}**\n`;
      if (s.username) keyboard.url(`🔗 Buka @${s.username}`, `https://t.me/${s.username}`).row();
    });
  }

  keyboard.text('⬅️ Kembali', 'nav_pub_groups').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCommStats(ctx: Context): Promise<void> {
  const comms = await db.getCommunities();
  const totalMembers = comms.reduce((sum, c) => sum + c.member_count, 0);

  const header = createCozyHeader('📊 STATISTIK KOMUNITAS', 'Pertumbuhan Ekosistem');
  const body = `${header}\n\n` +
    `👥 **Total Komunitas Terverifikasi:** \`${comms.length} Grup/Channel\`\n` +
    `🌐 **Total Jangkauan Member:** \`${totalMembers.toLocaleString('id-ID')}+ Pengguna\`\n` +
    `🤖 **AI Moderator & Spam Guard:** \`Aktif 24/7\``;

  const keyboard = new InlineKeyboard()
    .text('👥 Lihat Semua Komunitas', 'nav_pub_groups')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. AI PUBLIC SUITE (Nav 31 - 40)
// ═══════════════════════════════════════════════════════════════════════════════

export async function handlePubAiAssistant(ctx: Context): Promise<void> {
  const header = createCozyHeader('🤖 RULLZYE AI ASSISTANT SUITE', 'Asisten Cerdas Serba Bisa');
  const body = `${header}\n\n` +
    `Pilih fitur AI cerdas yang ingin Anda gunakan:\n\n` +
    `• ✍️ **AI Writer:** Membuat artikel, deskripsi produk, atau script bot.\n` +
    `• 💡 **AI Ideas:** Brainstorming ide bot & server game.\n` +
    `• 📢 **AI Announcement:** Membuat teks promosi & pengumuman.\n` +
    `• 🎨 **AI Decoration:** Generator pesan sambutan & format rapi.\n` +
    `• 📝 **AI Rewrite:** Merapikan & memoles tulisan Anda.\n` +
    `• 🌐 **AI Translate:** Menerjemahkan bahasa secara akurat.\n` +
    `• 🔍 **AI Search:** Menjawab pertanyaan seputar hosting & coding.\n` +
    `• 💬 **AI Support:** Bantuan otomatis kendala teknis.`;

  const keyboard = new InlineKeyboard()
    .text('✍️ AI Writer', 'nav_pub_ai_writer')
    .text('💡 AI Ideas', 'nav_pub_ai_ideas')
    .row()
    .text('📢 AI Announcement', 'nav_pub_ai_announcement')
    .text('🎨 AI Decoration', 'nav_pub_ai_decoration')
    .row()
    .text('📝 AI Rewrite', 'nav_pub_ai_rewrite')
    .text('🌐 AI Translate', 'nav_pub_ai_translate')
    .row()
    .text('🔍 AI Search', 'nav_pub_ai_search')
    .text('💬 AI Support', 'nav_pub_ai_support')
    .row()
    .text('🧠 AI Help', 'nav_pub_ai_help')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAiWriter(ctx: Context): Promise<void> {
  await AnimationManager.aiThinking(ctx);
  const header = createCozyHeader('✍️ AI WRITER & COPYWRITER', 'Generator Konten Profesional');
  const body = `${header}\n\n` +
    `Contoh hasil tulisan AI untuk Bot Store:\n\n` +
    `_"🚀 Dapatkan Server Bot WhatsApp & Minecraft Terbaik dengan Uptime 99.99%! Deploy instan 5 detik, fitur auto-restart saat crash, dan proteksi anti-DDoS datacenter Jakarta. Hubungi kami sekarang!"_\n\n` +
    `💡 _Ketik \`/ai_tulis [topik]\` untuk membuat teks kustom Anda sendiri._`;

  const keyboard = new InlineKeyboard()
    .text('🔄 Coba AI Lainnya', 'nav_pub_ai_assistant')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAiIdeas(ctx: Context): Promise<void> {
  await AnimationManager.aiThinking(ctx);
  const header = createCozyHeader('💡 AI IDEAS & BRAINSTORMING', 'Inspirasi Proyek & Bisnis');
  const body = `${header}\n\n` +
    `🎯 **Top 3 Ide Bot Paling Menguntungkan:**\n\n` +
    `1️⃣ **Bot Store Otomatis (QRIS Auto-Confirm):** Jual diamond game, voucher, dan akun digital 24 jam.\n` +
    `2️⃣ **Bot AI Customer Service:** Balas chat customer WhatsApp otomatis dengan integrasi AI.\n` +
    `3️⃣ **Minecraft SMP Roleplay Server:** Server survival dengan ekonomi custom, quest, dan dungeon.\n\n` +
    `💡 _Sewa server hostingnya di RullzyeStore mulai Rp 2.000 saja!_`;

  const keyboard = new InlineKeyboard()
    .text('🛍️ Sewa Server', 'nav_pub_products')
    .text('🤖 Menu AI', 'nav_pub_ai_assistant')
    .row()
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAiAnnouncement(ctx: Context): Promise<void> {
  await AnimationManager.aiThinking(ctx);
  const header = createCozyHeader('📢 AI ANNOUNCEMENT GENERATOR', 'Template Pengumuman Komunitas');
  const body = `${header}\n\n` +
    `📢 **PENGUMUMAN RESMI KOMUNITAS:**\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🔥 Selamat datang kepada seluruh member baru! Jangan lupa membaca aturan grup di pesan tersemat dan hubungi admin jika butuh bantuan hosting.\n\n` +
    `💡 _Gunakan template di atas untuk siaran grup Anda._`;

  const keyboard = new InlineKeyboard()
    .text('🎨 AI Decoration', 'nav_pub_ai_decoration')
    .text('🤖 Menu AI', 'nav_pub_ai_assistant')
    .row()
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAiDecoration(ctx: Context): Promise<void> {
  await AnimationManager.aiThinking(ctx);
  const header = createCozyHeader('🎨 AI DECORATION DESIGNER', 'Penyusun Format & Layout Cozy');
  const body = `${header}\n\n` +
    `╔════════════════════════════════╗\n` +
    `   🚀 **RULLZYE CLOUD COMMUNITY**\n` +
    `╚════════════════════════════════╝\n\n` +
    `✨ Server Uptime: \`99.99%\` • Proteksi: \`Anti-DDoS 100G\`\n` +
    `🛒 Layanan: Bot WhatsApp, Telegram & Minecraft\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💡 _Format dekorasi di atas siap disalin ke grup Anda._`;

  const keyboard = new InlineKeyboard()
    .text('🤖 Menu AI', 'nav_pub_ai_assistant')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAiRewrite(ctx: Context): Promise<void> {
  await AnimationManager.aiThinking(ctx);
  const header = createCozyHeader('📝 AI REWRITE & POLISHER', 'Perapih Tata Bahasa');
  const body = `${header}\n\n` +
    `Ketik command di chat:\n` +
    `👉 \`/ai_rapihkan [teks Anda]\`\n\n` +
    `AI akan memformat ulang tulisan Anda agar lebih profesional, menarik, dan mudah dipahami!`;

  const keyboard = new InlineKeyboard()
    .text('🤖 Menu AI', 'nav_pub_ai_assistant')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAiTranslate(ctx: Context): Promise<void> {
  await AnimationManager.aiThinking(ctx);
  const header = createCozyHeader('🌐 AI TRANSLATE', 'Penerjemah Multi-Bahasa');
  const body = `${header}\n\n` +
    `Mendukung terjemahan akurat Bahasa Indonesia ⇄ English ⇄ Japanese ⇄ Arabic.\n\n` +
    `Gunakan format:\n` +
    `👉 \`/translate [en/id] [teks]\``;

  const keyboard = new InlineKeyboard()
    .text('🤖 Menu AI', 'nav_pub_ai_assistant')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAiSearch(ctx: Context): Promise<void> {
  await AnimationManager.aiThinking(ctx);
  const header = createCozyHeader('🔍 AI KNOWLEDGE SEARCH', 'Pencarian Jawaban Teknis');
  const body = `${header}\n\n` +
    `Tanyakan apa saja seputar konfigurasi Pterodactyl, Baileys WhatsApp, Python Telegram, dan Java Minecraft.\n\n` +
    `Gunakan format:\n` +
    `👉 \`/tanya [pertanyaan Anda]\``;

  const keyboard = new InlineKeyboard()
    .text('🤖 Menu AI', 'nav_pub_ai_assistant')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAiSupport(ctx: Context): Promise<void> {
  await AnimationManager.aiThinking(ctx);
  const header = createCozyHeader('💬 AI SUPPORT COPILOT', 'Bantuan Teknis Otomatis');
  const body = `${header}\n\n` +
    `AI Support siap menjawab pertanyaan teknis Anda seputar:\n` +
    `• Cara scan QR WhatsApp di Web Console\n` +
    `• Cara pasang Bot Token Telegram\n` +
    `• Cara upload plugin / world map Minecraft\n\n` +
    `Jika masalah berlanjut, Anda dapat membuat tiket dukungan bantuan!`;

  const keyboard = new InlineKeyboard()
    .text('🎫 Buat Tiket Support', 'nav_pub_create_ticket')
    .text('🤖 Menu AI', 'nav_pub_ai_assistant')
    .row()
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAiHelp(ctx: Context): Promise<void> {
  const header = createCozyHeader('🧠 PANDUAN PENGGUNAAN AI', 'Cara Memaksimalkan AI Suite');
  const body = `${header}\n\n` +
    `1️⃣ Berikan prompt yang jelas dan spesifik.\n` +
    `2️⃣ Gunakan tombol AI di menu untuk tugas umum.\n` +
    `3️⃣ Semua respons AI gratis untuk seluruh pengguna aktif RullzyeStore!`;

  const keyboard = new InlineKeyboard()
    .text('🤖 Menu AI', 'nav_pub_ai_assistant')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. ACCOUNT & SETTINGS (Nav 41 - 50)
// ═══════════════════════════════════════════════════════════════════════════════

export async function handlePubProfile(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const user = await db.getUser(userId);
  const servers = await db.getUserServers(userId);
  const orders = await db.getUserOrders(userId);

  const header = createCozyHeader('👤 PROFIL PENGGUNA (MY PROFILE)', 'Detail Akun Member');
  const body = `${header}\n\n` +
    `🆔 **Telegram ID:** \`${userId}\`\n` +
    `👤 **Nama:** \`${user?.first_name || 'Customer'}\`\n` +
    `🌐 **Username:** \`${user?.username ? `@${user.username}` : '-'}\`\n` +
    `💰 **Saldo Dompet:** \`${formatRupiah(user?.balance || 0)}\`\n` +
    `🎁 **Total Referral:** \`${user?.referral_count || 0} Pengguna\`\n` +
    `🖥️ **Server Aktif:** \`${servers.length} Unit\`\n` +
    `📦 **Total Pesanan:** \`${orders.length} Transaksi\`\n` +
    `📅 **Bergabung Sejak:** \`${user?.created_at.toLocaleDateString('id-ID') || '-'}\``;

  const keyboard = new InlineKeyboard()
    .text('💰 Isi Saldo (Top Up)', 'nav_pub_balance')
    .text('🪪 Info Akun Panel', 'nav_pub_account_info')
    .row()
    .text('📦 Riwayat Order', 'nav_pub_order_history')
    .text('🎟️ Kupon Saya', 'nav_pub_my_coupons')
    .row()
    .text('🔔 Notifikasi', 'nav_pub_notifications')
    .text('⚙️ Pengaturan', 'nav_pub_preferences')
    .row()
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAccountInfo(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const user = await db.getUser(userId);

  const header = createCozyHeader('🪪 INFORMASI AKUN PTERODACTYL', 'Kredensial Login Panel');
  const body = `${header}\n\n` +
    `🌐 **URL Panel:** \`https://ptero.rullzyestorepremium.my.id\`\n` +
    `👤 **Username:** \`${user?.ptero_username || `user_${userId}`}\`\n` +
    `📧 **Email:** \`user_${userId}@rullzyestore.my.id\`\n` +
    `🔐 **Password:** \`${user?.ptero_password || 'Tersinkronisasi 24/7'}\`\n\n` +
    `👉 _Gunakan username dan password di atas untuk login ke Web Panel Pterodactyl._`;

  const keyboard = new InlineKeyboard()
    .url('💻 Buka Web Panel', 'https://ptero.rullzyestorepremium.my.id')
    .row()
    .text('⬅️ Kembali ke Profil', 'nav_pub_profile')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubOrderHistory(ctx: Context): Promise<void> {
  await handlePubMyOrders(ctx);
}

export async function handlePubBalance(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const user = await db.getUser(userId);
  const balance = user?.balance || 0;
  const recentDeps = await db.getUserDeposits(userId, 3);

  const header = createCozyHeader('💰 DOMPET SALDO AKUN', 'Saldo & Top Up Otomatis via Flowix');
  let body = `${header}\n\n` +
    `💵 **Saldo Anda Saat Ini:** \`${formatRupiah(balance)}\`\n\n` +
    `⚡ **Metode Top Up:** \`QRIS Otomatis Realtime (Flowix Gateway)\`\n` +
    `💳 **Dukungan:** Seluruh Bank (BCA, BRI, BNI, Mandiri) & E-Wallet (Dana, GoPay, OVO, ShopeePay)\n\n` +
    `Pilih nominal Top Up instan di bawah ini:`;

  if (recentDeps.length > 0) {
    body += `\n\n━━━━━━━━━━━━━━━━━━━━\n🕒 **Riwayat Top Up Terakhir:**\n`;
    recentDeps.forEach(d => {
      const icon = d.status === 'success' ? '✅' : d.status === 'pending' ? '⏳' : '❌';
      body += `${icon} \`${d.reff_id}\` — \`${formatRupiah(d.amount_request)}\` (${d.status.toUpperCase()})\n`;
    });
  }

  const keyboard = new InlineKeyboard()
    .text('➕ Rp 2.000', 'topup_nominal_2000')
    .text('➕ Rp 5.000', 'topup_nominal_5000')
    .text('➕ Rp 10.000', 'topup_nominal_10000')
    .row()
    .text('➕ Rp 25.000', 'topup_nominal_25000')
    .text('➕ Rp 50.000', 'topup_nominal_50000')
    .text('➕ Rp 100.000', 'topup_nominal_100000')
    .row()
    .url('🌐 Top Up di Website', 'https://store.rullzyestorepremium.my.id')
    .row()
    .text('⬅️ Profil', 'nav_pub_profile')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCreateFlowixDeposit(ctx: Context, amount: number, methodCode = 'QRIS'): Promise<void> {
  const userId = ctx.from?.id || 0;
  await AnimationManager.processing(ctx, `Membuat tagihan QRIS ${formatRupiah(amount)}`);

  try {
    const deposit = await flowixService.createDeposit({
      amount,
      method_code: methodCode,
      fee_by_customer: true,
    });

    const expiredAt = deposit.expired_at ? new Date(deposit.expired_at) : new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Save record to DB
    await db.createDepositRecord({
      reff_id: deposit.reff_id,
      pay_id: deposit.pay_id,
      telegram_id: userId,
      amount_request: deposit.amount_request,
      amount_total: deposit.amount_total,
      fee: deposit.fee || 0,
      method_code: deposit.method_code,
      status: deposit.status || 'pending',
      qr_image: deposit.qr_image,
      qr_string: deposit.qr_string,
      pay_url: deposit.pay_url,
      expired_at: expiredAt,
    });

    const header = createCozyHeader('🧾 TAGIHAN TOP UP QRIS (FLOWIX)', 'Scan QRIS untuk Menyelesaikan Pembayaran');
    const body = `${header}\n\n` +
      `🆔 **Reff ID:** \`${deposit.reff_id}\`\n` +
      `💰 **Nominal Saldo:** \`${formatRupiah(deposit.amount_request)}\`\n` +
      `🏷️ **Biaya Admin:** \`${formatRupiah(deposit.fee || 0)}\`\n` +
      `💵 **Total Tagihan:** \`${formatRupiah(deposit.amount_total)}\`\n` +
      `💳 **Metode:** \`${deposit.method_name || deposit.method_code}\`\n` +
      `⏳ **Status:** \`PENDING (Menunggu Pembayaran)\`\n` +
      `⏱️ **Batas Waktu:** \`${expiredAt.toLocaleString('id-ID')}\`\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👉 **PANDUAN PEMBAYARAN:**\n` +
      `1. Scan QRIS di atas ATAU klik tombol **🌐 Buka Halaman Bayar** di bawah.\n` +
      `2. Buka BCA, BRI, BNI, Mandiri, Dana, GoPay, OVO, ShopeePay, atau m-Banking.\n` +
      `3. Masukkan nominal tagihan tepat \`${formatRupiah(deposit.amount_total)}\`.\n` +
      `4. Setelah berhasil membayar, klik tombol **🔄 Cek Status Pembayaran** di bawah!`;

    const keyboard = new InlineKeyboard();
    if (deposit.pay_url) {
      keyboard.url('🌐 Buka Halaman Bayar Flowix', deposit.pay_url).row();
    }
    keyboard
      .text('🔄 Cek Status Pembayaran', `check_deposit_${deposit.reff_id}`)
      .row()
      .text('❌ Batalkan Tagihan', `cancel_deposit_${deposit.reff_id}`)
      .text('💰 Dompet Saldo', 'nav_pub_balance');

    if (deposit.qr_image) {
      try {
        await ctx.replyWithPhoto(deposit.qr_image, {
          caption: body,
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        });
        return;
      } catch (err) {
        console.warn('Fallback to sendOrEdit for QR image:', err);
      }
    }

    await sendOrEdit(ctx, body, keyboard);
  } catch (err: any) {
    await ctx.reply(`❌ **Gagal Membuat Deposit Flowix:** ${err.message}\n\nSilakan coba beberapa saat lagi.`);
    await handlePubBalance(ctx);
  }
}

export async function handleBuyProductWithQris(ctx: Context, productId: string): Promise<void> {
  const product = await db.getProductById(productId);
  if (!product) {
    await ctx.reply('⚠️ Produk tidak ditemukan.');
    return;
  }

  const userId = ctx.from?.id || 0;
  await AnimationManager.processing(ctx, `Membuat tagihan QRIS untuk ${product.name}`);

  try {
    const deposit = await flowixService.createDeposit({
      amount: product.price,
      method_code: 'QRIS',
      fee_by_customer: true,
    });

    const expiredAt = deposit.expired_at ? new Date(deposit.expired_at) : new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Save record to DB with product_id
    await db.createDepositRecord({
      reff_id: deposit.reff_id,
      pay_id: deposit.pay_id,
      telegram_id: userId,
      product_id: product.id,
      amount_request: deposit.amount_request,
      amount_total: deposit.amount_total,
      fee: deposit.fee || 0,
      method_code: deposit.method_code,
      status: deposit.status || 'pending',
      qr_image: deposit.qr_image,
      qr_string: deposit.qr_string,
      pay_url: deposit.pay_url,
      expired_at: expiredAt,
    });

    const header = createCozyHeader(`💳 BELI LANGSUNG VIA QRIS: ${product.name.toUpperCase()}`, 'Scan QRIS untuk Otomatis Mengaktifkan Server');
    const body = `${header}\n\n` +
      `📦 **Paket:** \`${product.name}\`\n` +
      `⏱️ **Masa Aktif:** \`${product.duration_label}\` (${product.duration_days} Hari)\n` +
      `🆔 **Reff ID:** \`${deposit.reff_id}\`\n` +
      `💰 **Harga Paket:** \`${formatRupiah(deposit.amount_request)}\`\n` +
      `🏷️ **Biaya Admin Gateway:** \`${formatRupiah(deposit.fee || 0)}\`\n` +
      `💵 **Total Tagihan QRIS:** \`${formatRupiah(deposit.amount_total)}\`\n` +
      `⏳ **Status:** \`PENDING (Menunggu Pembayaran)\`\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⚡ **PANDUAN AKTIVASI INSTAN:**\n` +
      `1. Scan gambar QRIS di atas dengan aplikasi BCA / BRI / Mandiri / Dana / GoPay / OVO / ShopeePay.\n` +
      `2. Bayar tepat sejumlah \`${formatRupiah(deposit.amount_total)}\`.\n` +
      `3. Setelah berhasil transfer, klik tombol **🔄 Cek Status & Aktifkan Server** di bawah!\n` +
      `4. Server Pterodactyl dan password akun akan langsung terbit 100% otomatis.`;

    const keyboard = new InlineKeyboard();
    if (deposit.pay_url) {
      keyboard.url('🌐 Buka Halaman Bayar Flowix', deposit.pay_url).row();
    }
    keyboard
      .text('🔄 Cek Status & Aktifkan Server', `check_prod_qris_${deposit.reff_id}_${product.id}`)
      .row()
      .text('❌ Batalkan Transaksi', `cancel_deposit_${deposit.reff_id}`)
      .text('⬅️ Detail Produk', `prod_view_${product.id}`);

    if (deposit.qr_image) {
      try {
        await ctx.replyWithPhoto(deposit.qr_image, {
          caption: body,
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        });
        return;
      } catch (err) {
        console.warn('Fallback to sendOrEdit for product QR image:', err);
      }
    }

    await sendOrEdit(ctx, body, keyboard);
  } catch (err: any) {
    await ctx.reply(`❌ **Gagal Membuat Tagihan QRIS:** ${err.message}\n\nSilakan coba beberapa saat lagi.`);
    await handleProductDetailView(ctx, productId);
  }
}

export async function handleCheckProductQrisDeposit(ctx: Context, reffId: string, productId: string): Promise<void> {
  const userId = ctx.from?.id || 0;
  const product = await db.getProductById(productId);
  if (!product) {
    await ctx.reply('⚠️ Produk tidak ditemukan.');
    return;
  }

  try {
    const statusData = await flowixService.checkDeposit(reffId);
    const existing = await db.getDepositByReffId(reffId);

    if (statusData.status === 'success') {
      if (existing && existing.status !== 'success') {
        const paidAt = statusData.paid_at ? new Date(statusData.paid_at) : new Date();
        await db.updateDepositStatus(reffId, 'success', paidAt);

        await ctx.answerCallbackQuery({ text: '🎉 Pembayaran Diterima! Server sedang dibuat...', show_alert: true });
        await AnimationManager.deploying(ctx, product.name);
        const loading = await ctx.reply('⏳ **Sedang mendeploy server otomatis di Pterodactyl Panel...**', { parse_mode: 'Markdown' });

        try {
          const pteroData = await pterodactylService.getOrCreateUser(userId, ctx.from?.first_name || 'Customer', ctx.from?.username);
          const pteroUser = pteroData.user;
          const password = pteroData.generatedPassword;

          const mockPackage = {
            id: product.id,
            category: product.category_id as any,
            tier: 1,
            name: product.name,
            duration: '30d' as any,
            durationLabel: product.duration_label,
            durationDays: product.duration_days,
            price: product.price,
            ramMb: product.ram_mb,
            cpuPercent: product.cpu_percent,
            diskGb: product.disk_gb,
            eggId: product.egg_id,
            nestId: product.category_id === 'minecraft' ? 1 : product.category_id === 'whatsapp' || product.category_id === 'telegram' ? 5 : 6,
            dockerImage: product.docker_image,
            description: product.description,
            badge: product.badge,
          };

          const serverResult = await pterodactylService.createServer(pteroUser.id, mockPackage, `${product.name} - ${ctx.from?.first_name || 'User'}`);
          const expiresAt = new Date(Date.now() + product.duration_days * 24 * 60 * 60 * 1000);

          await db.recordUserServer({
            telegram_id: userId,
            server_id: serverResult.serverId,
            server_identifier: serverResult.serverIdentifier,
            server_name: serverResult.name,
            package_id: product.id,
            duration_days: product.duration_days,
            port: serverResult.port,
            status: 'active',
            expires_at: expiresAt,
          });

          await db.createOrder({
            telegram_id: userId,
            product_id: product.id,
            product_name: product.name,
            total_amount: product.price,
            payment_method: 'QRIS_FLOWIX',
            payment_status: 'PAID',
            order_status: 'COMPLETED',
            server_id: serverResult.serverId,
          });

          const successKeyboard = new InlineKeyboard()
            .url('💻 BUKA PTERODACTYL PANEL', serverResult.panelUrl)
            .row()
            .text('🧩 Layanan Saya', 'nav_pub_my_services')
            .text('🏠 Home', 'nav_pub_home');

          const credsText = `🎉 **PEMBAYARAN QRIS SUKSES & SERVER BERHASIL AKTIF!**\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📦 **Paket:** \`${product.name}\`\n` +
            `⏱️ **Masa Aktif:** \`${product.duration_days} Hari\` (Exp: \`${expiresAt.toLocaleDateString('id-ID')}\`)\n` +
            `🆔 **Server ID:** \`#${serverResult.serverId}\` (\`${serverResult.serverIdentifier}\`)\n` +
            `🔌 **Alokasi Port:** \`${serverResult.port}\`\n` +
            `🌐 **Node Host:** \`pteronode.rullzyestorepremium.my.id\`\n\n` +
            `🔑 **KREDENSIAL LOGIN PTERODACTYL PANEL:**\n` +
            `• 🌐 **URL Panel:** \`${serverResult.panelUrl}\`\n` +
            `• 👤 **Username:** \`${pteroUser.username}\`\n` +
            `• 📧 **Email:** \`${pteroUser.email}\`\n` +
            `• 🔐 **Password:** \`${password}\`\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `👉 **PANDUAN LOGIN:**\n` +
            `1. Klik tombol **💻 BUKA PTERODACTYL PANEL** di bawah.\n` +
            `2. Masukkan **Username** dan **Password** di atas.\n` +
            `3. Server sudah siap 24 jam! Klik tombol **START** di tab Console untuk menjalankan bot/game.`;

          try {
            await ctx.api.editMessageText(ctx.chat!.id, loading.message_id, credsText, {
              parse_mode: 'Markdown',
              reply_markup: successKeyboard,
            });
          } catch {
            await ctx.reply(credsText, { parse_mode: 'Markdown', reply_markup: successKeyboard });
          }
          return;
        } catch (provErr: any) {
          await db.addBalance(userId, product.price, `Kompensasi Saldo Server Error (${reffId})`);
          await ctx.reply(`⚠️ Pembayaran QRIS berhasil, namun terjadi kendala saat auto-deploy: ${provErr.message}.\n\nSaldo senilai ${formatRupiah(product.price)} telah dimasukkan ke dompet akun Anda.`);
          return;
        }
      } else {
        await ctx.answerCallbackQuery({ text: '✅ Pesanan ini sudah berhasil diproses dan server telah aktif.', show_alert: true });
        await handlePubMyServices(ctx);
        return;
      }
    } else if (statusData.status === 'pending') {
      await ctx.answerCallbackQuery({
        text: '⏳ Pembayaran belum terdeteksi di Flowix. Silakan selesaikan scan QRIS di atas lalu klik cek status lagi.',
        show_alert: true,
      });
    } else {
      await db.updateDepositStatus(reffId, statusData.status);
      await ctx.answerCallbackQuery({
        text: `⚠️ Status transaksi: ${statusData.status.toUpperCase()}`,
        show_alert: true,
      });
    }
  } catch (err: any) {
    await ctx.answerCallbackQuery({ text: `⚠️ Error cek status: ${err.message}`, show_alert: true });
  }
}

export async function handleCheckFlowixDeposit(ctx: Context, reffId: string): Promise<void> {
  const userId = ctx.from?.id || 0;

  try {
    const statusData = await flowixService.checkDeposit(reffId);
    const existing = await db.getDepositByReffId(reffId);

    if (statusData.status === 'success') {
      if (existing && existing.status !== 'success') {
        const paidAt = statusData.paid_at ? new Date(statusData.paid_at) : new Date();
        await db.updateDepositStatus(reffId, 'success', paidAt);
        const newBalance = await db.addBalance(userId, statusData.amount_request, `Top Up Flowix QRIS (${reffId})`);

        await ctx.answerCallbackQuery({ text: `🎉 Pembayaran Diterima! Saldo Anda sekarang ${formatRupiah(newBalance)}`, show_alert: true });

        const header = createCozyHeader('🎉 TOP UP SALDO BERHASIL!', 'Pembayaran Telah Diverifikasi');
        const body = `${header}\n\n` +
          `✅ **Status Transaksi:** \`LUNAS / SUKSES 💚\`\n` +
          `🆔 **Reff ID:** \`${reffId}\`\n` +
          `💰 **Nominal Saldo Masuk:** \`${formatRupiah(statusData.amount_request)}\`\n` +
          `💳 **Saldo Anda Sekarang:** \`${formatRupiah(newBalance)}\`\n\n` +
          `Terima kasih! Saldo Anda sudah siap digunakan untuk sewa server dan bot instan.`;

        const keyboard = new InlineKeyboard()
          .text('🛍️ Belanja di Store', 'nav_pub_products')
          .text('💰 Cek Saldo', 'nav_pub_balance')
          .row()
          .text('🏠 Home', 'nav_pub_home');

        await sendOrEdit(ctx, body, keyboard);
        return;
      } else {
        await ctx.answerCallbackQuery({ text: '✅ Saldo dari tagihan ini sudah masuk ke dompet Anda.', show_alert: true });
        await handlePubBalance(ctx);
        return;
      }
    } else if (statusData.status === 'pending') {
      await ctx.answerCallbackQuery({
        text: '⏳ Pembayaran belum terdeteksi. Silakan selesaikan scan QRIS dan klik cek lagi setelah transfer.',
        show_alert: true,
      });
    } else {
      await db.updateDepositStatus(reffId, statusData.status);
      await ctx.answerCallbackQuery({
        text: `⚠️ Status transaksi: ${statusData.status.toUpperCase()}`,
        show_alert: true,
      });
      await handlePubBalance(ctx);
    }
  } catch (err: any) {
    await ctx.answerCallbackQuery({ text: `⚠️ Error cek status: ${err.message}`, show_alert: true });
  }
}

export async function handleCancelFlowixDeposit(ctx: Context, reffId: string): Promise<void> {
  try {
    await flowixService.cancelDeposit(reffId);
    await db.updateDepositStatus(reffId, 'canceled');
    await ctx.answerCallbackQuery({ text: '❌ Tagihan deposit berhasil dibatalkan.', show_alert: true });
    await handlePubBalance(ctx);
  } catch (err: any) {
    await ctx.answerCallbackQuery({ text: `⚠️ Gagal membatalkan: ${err.message}`, show_alert: true });
  }
}

export async function handlePubMyCoupons(ctx: Context): Promise<void> {
  await handlePubCoupons(ctx);
}

export async function handlePubNotifications(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const notifs = await db.getUserNotifications(userId);
  const header = createCozyHeader('🔔 PUSAT NOTIFIKASI AKUN', 'Pemberitahuan & Update');
  let body = `${header}\n\n`;

  if (notifs.length === 0) {
    body += `_Belum ada notifikasi baru untuk akun Anda._\n\nNotifikasi perpanjangan server dan promo akan muncul di sini.`;
  } else {
    notifs.forEach((n, idx) => {
      body += `${idx + 1}. 🔔 **${n.title}**\n   _${n.message}_\n   Tgl: \`${n.created_at.toLocaleDateString('id-ID')}\`\n\n`;
    });
  }

  const keyboard = new InlineKeyboard()
    .text('⬅️ Kembali', 'nav_pub_profile')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubSecurity(ctx: Context): Promise<void> {
  const header = createCozyHeader('🔐 KEAMANAN & PRIVASI AKUN', 'Security Center');
  const body = `${header}\n\n` +
    `🛡️ **Status Keamanan:** \`Sangat Aman (Protected)\`\n` +
    `• Enkripsi Data: \`AES-256 GCM\`\n` +
    `• Pterodactyl Authentication: \`Bcrypt Hash\`\n` +
    `• Anti-Spam & Rate Limit: \`Aktif\`\n\n` +
    `Jangan pernah membagikan password login panel Anda kepada siapapun!`;

  const keyboard = new InlineKeyboard()
    .text('⬅️ Kembali', 'nav_pub_profile')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubLanguage(ctx: Context): Promise<void> {
  const header = createCozyHeader('🌐 PENGATURAN BAHASA', 'Language Settings');
  const body = `${header}\n\n` +
    `Pilih bahasa tampilan bot:\n\n` +
    `• 🇮🇩 **Bahasa Indonesia (Default)**\n` +
    `• 🇬🇧 **English (US)**`;

  const keyboard = new InlineKeyboard()
    .text('• 🇮🇩 Bahasa Indonesia •', 'set_lang_id')
    .text('🇬🇧 English', 'set_lang_en')
    .row()
    .text('⬅️ Pengaturan', 'nav_pub_preferences')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAppearance(ctx: Context): Promise<void> {
  const header = createCozyHeader('🎨 TEMA & TAMPILAN', 'Appearance Customizer');
  const body = `${header}\n\n` +
    `Pilih gaya tema visual navigasi bot:\n\n` +
    `• 🌙 **Cozy Dark SaaS (Default)**\n` +
    `• ☀️ **Modern Minimalist**\n` +
    `• 💎 **Cyberpunk Neon**`;

  const keyboard = new InlineKeyboard()
    .text('• 🌙 Cozy Dark •', 'set_theme_dark')
    .text('☀️ Minimalist', 'set_theme_light')
    .row()
    .text('⬅️ Pengaturan', 'nav_pub_preferences')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubPreferences(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const pref = await db.getUserPreferences(userId);

  const header = createCozyHeader('⚙️ PENGATURAN PENGGUNA', 'User Preferences');
  const body = `${header}\n\n` +
    `🌐 **Bahasa:** \`${pref.language.toUpperCase()}\`\n` +
    `🎨 **Tema:** \`${pref.appearance}\`\n` +
    `🔔 **Notifikasi Push:** \`${pref.notifications_enabled ? 'Aktif' : 'Nonaktif'}\`\n` +
    `🕒 **Zona Waktu:** \`${pref.timezone}\``;

  const keyboard = new InlineKeyboard()
    .text('🌐 Ubah Bahasa', 'nav_pub_language')
    .text('🎨 Ubah Tema', 'nav_pub_appearance')
    .row()
    .text('🔔 Toggle Notifikasi', 'pref_toggle_notifs')
    .row()
    .text('⬅️ Profil', 'nav_pub_profile')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. SUPPORT & HELP (Nav 51 - 60)
// ═══════════════════════════════════════════════════════════════════════════════

export async function handlePubHelpCenter(ctx: Context): Promise<void> {
  const header = createCozyHeader('🆘 PUSAT BANTUAN (HELP CENTER)', 'Customer Service 24/7');
  const body = `${header}\n\n` +
    `Pilih layanan bantuan yang Anda butuhkan:\n\n` +
    `• 💬 **Contact Support:** Hubungi CS WhatsApp resmi.\n` +
    `• 🎫 **Tiket Bantuan:** Buat tiket kendala teknis.\n` +
    `• 📚 **FAQ:** Jawaban pertanyaan yang sering diajukan.\n` +
    `• 📖 **Dokumentasi:** Panduan lengkap setting server & bot.`;

  const keyboard = new InlineKeyboard()
    .text('💬 Chat Support CS', 'nav_pub_contact_support')
    .text('🎫 Tiket Saya', 'nav_pub_my_tickets')
    .row()
    .text('➕ Buat Tiket Baru', 'nav_pub_create_ticket')
    .text('📚 Tanya Jawab (FAQ)', 'nav_pub_faq')
    .row()
    .text('📖 Dokumentasi', 'nav_pub_docs')
    .text('📋 Aturan Layanan', 'nav_pub_rules')
    .row()
    .text('ℹ️ Tentang Kami', 'nav_pub_about')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubContactSupport(ctx: Context): Promise<void> {
  const header = createCozyHeader('💬 HUBUNGI CUSTOMER SUPPORT', 'Live Support WhatsApp & Telegram');
  const body = `${header}\n\n` +
    `Tim Customer Support kami siap membantu Anda 24 Jam Nonstop:\n\n` +
    `• 🟢 **WhatsApp CS:** \`+62 812-3456-7890\`\n` +
    `• 🔵 **Telegram Support:** \`@rullzye_support\`\n` +
    `• ⏱️ **Respon Rata-rata:** \`< 3 Menit\`\n\n` +
    `Klik tombol di bawah untuk langsung membuka chat bantuan:`;

  const keyboard = new InlineKeyboard()
    .url('💬 Buka Chat WhatsApp CS', 'https://wa.me/6281234567890')
    .row()
    .text('🎫 Atau Buat Tiket Bantuan', 'nav_pub_create_ticket')
    .row()
    .text('⬅️ Kembali', 'nav_pub_help_center')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubMyTickets(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  const tickets = await db.getUserTickets(userId);
  const header = createCozyHeader('🎫 TIKET BANTUAN SAYA', 'Support Ticket Lifecycle');
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();

  if (tickets.length === 0) {
    body += `_Anda belum memiliki tiket bantuan aktif._\n\nJika mengalami kendala, buat tiket baru untuk ditangani tim teknis.`;
    keyboard.text('➕ Buat Tiket Bantuan Baru', 'nav_pub_create_ticket').row();
  } else {
    tickets.forEach((t, idx) => {
      const statusIcon = t.status === 'OPEN' ? '🟡' : t.status === 'PROCESSING' ? '🔵' : t.status === 'RESOLVED' ? '🟢' : '⚪';
      body += `${idx + 1}. ${statusIcon} **Tiket: \`${t.ticket_code}\`**\n` +
        `   └ Topik: **${t.subject}**\n` +
        `   └ Status: \`${t.status}\` | Prioritas: \`${t.priority}\`\n` +
        `   └ Dibuat: \`${t.created_at.toLocaleDateString('id-ID')}\`\n\n`;
    });
    keyboard.text('➕ Buat Tiket Baru', 'nav_pub_create_ticket').row();
  }

  keyboard.text('⬅️ Pusat Bantuan', 'nav_pub_help_center').text('🏠 Home', 'nav_pub_home');
  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubCreateTicket(ctx: Context): Promise<void> {
  const header = createCozyHeader('➕ BUAT TIKET BANTUAN BARU', 'Bantuan Teknis & Billing');
  const body = `${header}\n\n` +
    `Pilih kategori masalah yang Anda alami:\n\n` +
    `1️⃣ **Teknis Server / Pterodactyl:** Server tidak mau start, error node, dsb.\n` +
    `2️⃣ **Billing & Pembayaran:** Konfirmasi saldo, pembayaran QRIS, faktur.\n` +
    `3️⃣ **Bot WhatsApp & Telegram:** Kendala scan QR, token bot, coding.\n` +
    `4️⃣ **Minecraft Server:** Plugin error, port query, ganti versi JAR.`;

  const keyboard = new InlineKeyboard()
    .text('🖥️ Kendala Teknis Server', 'ticket_cat_technical')
    .row()
    .text('💳 Kendala Pembayaran / Saldo', 'ticket_cat_billing')
    .row()
    .text('🤖 Kendala Bot WhatsApp / TG', 'ticket_cat_bot')
    .row()
    .text('⛏️ Kendala Server Minecraft', 'ticket_cat_minecraft')
    .row()
    .text('⬅️ Batal', 'nav_pub_help_center');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubFaq(ctx: Context): Promise<void> {
  const header = createCozyHeader('📚 TANYA JAWAB (FAQ)', 'Pertanyaan Umum');
  const body = `${header}\n\n` +
    `📌 **Q: Berapa lama server saya aktif?**\n` +
    `_A: Server langsung aktif dalam 5-10 detik secara otomatis setelah pembayaran._\n\n` +
    `📌 **Q: Bagaimana cara scan QR WhatsApp?**\n` +
    `_A: Buka tab "Console" di Pterodactyl Panel, klik "START", lalu scan QR yang muncul._\n\n` +
    `📌 **Q: Apakah server online 24 jam nonstop?**\n` +
    `_A: Ya! Semua server berjalan 24/7 di datacenter dengan auto-restart saat crash._\n\n` +
    `📌 **Q: Apakah bisa perpanjang server?**\n` +
    `_A: Sangat bisa, buka menu "Perpanjang Layanan" sebelum masa aktif berakhir._`;

  const keyboard = new InlineKeyboard()
    .text('🛍️ Beli Server', 'nav_pub_products')
    .text('💬 Tanya CS', 'nav_pub_contact_support')
    .row()
    .text('⬅️ Pusat Bantuan', 'nav_pub_help_center')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubDocs(ctx: Context): Promise<void> {
  const header = createCozyHeader('📖 DOKUMENTASI & TUTORIAL', 'Panduan Lengkap');
  const body = `${header}\n\n` +
    `📚 **PANDUAN TERSEDIA:**\n\n` +
    `1. 🟢 **Tutorial Bot WhatsApp:** Cara pasang Baileys, multi-session, dan pairing code.\n` +
    `2. 🔵 **Tutorial Bot Telegram:** Cara buat bot di @BotFather dan setting webhook.\n` +
    `3. ⛏️ **Tutorial Minecraft:** Cara pasang plugin Paper, konfigurasi port, dan invite teman.\n` +
    `4. 📁 **SFTP & File Manager:** Cara upload file zip dan backup data.`;

  const keyboard = new InlineKeyboard()
    .url('🌐 Buka Dokumentasi Web', 'https://store.rullzyestorepremium.my.id')
    .row()
    .text('⬅️ Pusat Bantuan', 'nav_pub_help_center')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubRules(ctx: Context): Promise<void> {
  const header = createCozyHeader('📋 ATURAN PENGGUNAAN LAYANAN', 'Terms of Use');
  const body = `${header}\n\n` +
    `1️⃣ Dilarang menggunakan server untuk aktivitas ilegal, DDoS, carding, atau judi online.\n` +
    `2️⃣ Dilarang melakukan brute force atau eksploitasi celah keamanan node.\n` +
    `3️⃣ Server yang terbukti melanggar akan disuspend otomatis tanpa pengembalian dana.\n` +
    `4️⃣ Gunakan bot secara bijak sesuai limit resource RAM & CPU paket Anda.`;

  const keyboard = new InlineKeyboard()
    .text('🛡️ Kebijakan Privasi', 'nav_pub_privacy')
    .text('📜 Syarat & Ketentuan', 'nav_pub_terms')
    .row()
    .text('⬅️ Pusat Bantuan', 'nav_pub_help_center')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubPrivacy(ctx: Context): Promise<void> {
  const header = createCozyHeader('🛡️ KEBIJAKAN PRIVASI (PRIVACY POLICY)', 'Perlindungan Data');
  const body = `${header}\n\n` +
    `Privasi Anda adalah prioritas kami:\n\n` +
    `• Kami tidak pernah membagikan data akun atau kredensial Anda ke pihak ketiga.\n` +
    `• Password dienkripsi dengan standar industri Bcrypt hash.\n` +
    `• File bot dan database server Anda tersimpan di volume terisolasi 100%.`;

  const keyboard = new InlineKeyboard()
    .text('📋 Aturan Layanan', 'nav_pub_rules')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubTerms(ctx: Context): Promise<void> {
  const header = createCozyHeader('📜 SYARAT & KETENTUAN (TERMS)', 'Perjanjian Layanan');
  const body = `${header}\n\n` +
    `Dengan menggunakan bot dan layanan RullzyeStore Cloud, Anda menyetujui seluruh ketentuan operasional, uptime guarantee 99.99%, dan kebijakan garansi saldo kami.`;

  const keyboard = new InlineKeyboard()
    .text('📋 Aturan Layanan', 'nav_pub_rules')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handlePubAbout(ctx: Context): Promise<void> {
  const header = createCozyHeader('ℹ️ TENTANG RULLZYE STORE CLOUD', 'Tentang Perusahaan');
  const body = `${header}\n\n` +
    `🚀 **RULLZYE STORE CLOUD PLATFORM**\n` +
    `_Penyedia Layanan Cloud Hosting, Bot WhatsApp, Telegram & Game Server Terpercaya di Indonesia._\n\n` +
    `• **Versi Platform:** \`v2.5.0 SaaS Edition\`\n` +
    `• **Datacenter:** \`Cyber Building Jakarta (Tier-3)\`\n` +
    `• **Status Node:** \`100% Online 💚\`\n` +
    `• **Dikelola oleh:** \`Rullzye Cloud Team\``;

  const keyboard = new InlineKeyboard()
    .url('🌐 Kunjungi Website Resmi', 'https://store.rullzyestorepremium.my.id')
    .row()
    .text('⬅️ Pusat Bantuan', 'nav_pub_help_center')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. PRODUCT DETAIL & BUY ACTION HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function handleProductDetailView(ctx: Context, productId: string): Promise<void> {
  const product = await db.getProductById(productId);
  if (!product) {
    await ctx.reply('⚠️ Produk tidak ditemukan.');
    return;
  }

  const userId = ctx.from?.id || 0;
  await db.recordRecentlyViewed(userId, productId);
  const user = await db.getUser(userId);
  const balance = user?.balance || 0;

  const header = createCozyHeader(`📦 ${product.name.toUpperCase()}`, `Spesifikasi & Detail Paket`);
  const body = `${header}\n\n` +
    `🏷️ **Kategori:** \`${product.category_id.toUpperCase()}\`\n` +
    `⏱️ **Durasi Sewa:** \`${product.duration_label}\`\n` +
    `💰 **Harga Sewa:** \`${formatRupiah(product.price)}\`\n\n` +
    `⚙️ **Spesifikasi Server:**\n` +
    `• RAM Memory: \`${product.ram_mb >= 1024 ? `${product.ram_mb / 1024} GB` : `${product.ram_mb} MB`}\`\n` +
    `• Limit CPU: \`${product.cpu_percent}% vCPU Core\`\n` +
    `• Storage: \`${product.disk_gb} GB NVMe SSD\`\n` +
    `• Alokasi Port: \`Gratis 1 Port Dedikasi\`\n\n` +
    `✨ **Keunggulan:**\n` +
    `_${product.description}_\n` +
    `• Auto-restart saat bot crash 24 jam\n` +
    `• Akses Web Console Pterodactyl & SFTP File Manager\n` +
    `• Siap pakai langsung tanpa instalasi manual\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💳 **Saldo Anda:** \`${formatRupiah(balance)}\``;

  const keyboard = new InlineKeyboard()
    .text(`💳 Beli Langsung via QRIS (${formatRupiah(product.price)})`, `buy_instant_qris_${product.id}`)
    .row()
    .text(`💰 Beli Pakai Saldo Dompet`, `buy_instant_balance_${product.id}`)
    .row()
    .text('🛒 Masukkan ke Keranjang', `add_cart_${product.id}`)
    .text('❤️ Wishlist', `toggle_wish_${product.id}`)
    .row()
    .url('🌐 Order via Website Store', `https://store.rullzyestorepremium.my.id/checkout?plan=${product.id}`)
    .row()
    .text('⬅️ Semua Produk', 'nav_pub_products')
    .text('🏠 Home', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleBuyProductWithBalance(ctx: Context, productId: string): Promise<void> {
  const product = await db.getProductById(productId);
  if (!product) return;

  const userId = ctx.from?.id || 0;
  const user = await db.getUser(userId);

  if (!user || user.balance < product.price) {
    const keyboard = new InlineKeyboard()
      .text('💳 Top Up Saldo Bot', 'nav_pub_balance')
      .text('💳 Beli via QRIS Instan', `buy_instant_qris_${product.id}`)
      .row()
      .url('🌐 Beli di Website Store', `https://store.rullzyestorepremium.my.id/checkout?plan=${product.id}`)
      .row()
      .text('⬅️ Kembali ke Produk', `prod_view_${product.id}`);

    await ctx.reply(
      `⚠️ **Saldo Tidak Mencukupi!**\n\nHarga Produk: \`${formatRupiah(product.price)}\`\nSaldo Anda: \`${formatRupiah(user?.balance || 0)}\`\n\nAnda dapat membeli langsung menggunakan QRIS Instan atau mengisi saldo dompet Anda terlebih dahulu.`,
      { parse_mode: 'Markdown', reply_markup: keyboard }
    );
    return;
  }

  // Deduct Balance
  await db.deductBalance(userId, product.price, `Sewa Server ${product.name}`);

  await AnimationManager.deploying(ctx, product.name);
  const loading = await ctx.reply('⏳ **Sedang mendeploy server otomatis di Pterodactyl Panel...**', { parse_mode: 'Markdown' });

  try {
    const pteroData = await pterodactylService.getOrCreateUser(userId, ctx.from?.first_name || 'Customer', ctx.from?.username);
    const pteroUser = pteroData.user;
    const password = pteroData.generatedPassword;

    const mockPackage = {
      id: product.id,
      category: product.category_id as any,
      tier: 1,
      name: product.name,
      duration: '30d' as any,
      durationLabel: product.duration_label,
      durationDays: product.duration_days,
      price: product.price,
      ramMb: product.ram_mb,
      cpuPercent: product.cpu_percent,
      diskGb: product.disk_gb,
      eggId: product.egg_id,
      nestId: product.category_id === 'minecraft' ? 1 : product.category_id === 'whatsapp' || product.category_id === 'telegram' ? 5 : 6,
      dockerImage: product.docker_image,
      description: product.description,
      badge: product.badge,
    };

    const serverResult = await pterodactylService.createServer(pteroUser.id, mockPackage, `${product.name} - ${ctx.from?.first_name || 'User'}`);
    const expiresAt = new Date(Date.now() + product.duration_days * 24 * 60 * 60 * 1000);

    const recorded = await db.recordUserServer({
      telegram_id: userId,
      server_id: serverResult.serverId,
      server_identifier: serverResult.serverIdentifier,
      server_name: serverResult.name,
      package_id: product.id,
      duration_days: product.duration_days,
      port: serverResult.port,
      status: 'active',
      expires_at: expiresAt,
    });

    // Create Order Record
    await db.createOrder({
      telegram_id: userId,
      product_id: product.id,
      product_name: product.name,
      total_amount: product.price,
      payment_method: 'BALANCE',
      payment_status: 'PAID',
      order_status: 'COMPLETED',
      server_id: serverResult.serverId,
    });

    const successKeyboard = new InlineKeyboard()
      .url('💻 BUKA PTERODACTYL PANEL', serverResult.panelUrl)
      .row()
      .text('🧩 Layanan Saya', 'nav_pub_my_services')
      .text('🏠 Home', 'nav_pub_home');

    const credsText = `🎉 **SERVER ANDA BERHASIL DIAKTIFKAN OTOMATIS!**\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 **Paket:** \`${product.name}\`\n` +
      `⏱️ **Masa Aktif:** \`${product.duration_days} Hari\` (Exp: \`${expiresAt.toLocaleDateString('id-ID')}\`)\n` +
      `🆔 **Server ID:** \`#${serverResult.serverId}\` (\`${serverResult.serverIdentifier}\`)\n` +
      `🔌 **Alokasi Port:** \`${serverResult.port}\`\n` +
      `🌐 **Node Host:** \`pteronode.rullzyestorepremium.my.id\`\n\n` +
      `🔑 **KREDENSIAL LOGIN PTERODACTYL PANEL:**\n` +
      `• 🌐 **URL Panel:** \`${serverResult.panelUrl}\`\n` +
      `• 👤 **Username:** \`${pteroUser.username}\`\n` +
      `• 📧 **Email:** \`${pteroUser.email}\`\n` +
      `• 🔐 **Password:** \`${password}\`\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👉 **PANDUAN MASUK:**\n` +
      `1. Klik tombol **💻 BUKA PTERODACTYL PANEL** di bawah.\n` +
      `2. Masukkan **Username** dan **Password**.\n` +
      `3. Server sudah siap 24 jam! Klik tombol **START** di tab Console untuk menjalankan.`;

    try {
      await ctx.api.editMessageText(ctx.chat!.id, loading.message_id, credsText, {
        parse_mode: 'Markdown',
        reply_markup: successKeyboard,
      });
    } catch {
      await ctx.reply(credsText, { parse_mode: 'Markdown', reply_markup: successKeyboard });
    }
  } catch (err: any) {
    await db.addBalance(userId, product.price, 'Refund Gagal Buat Server');
    await ctx.reply(`❌ **Gagal Membuat Server:** ${err.message}\n\nSaldo Anda telah dikembalikan secara utuh.`);
  }
}
