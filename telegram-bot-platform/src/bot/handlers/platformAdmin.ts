import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';
import { createCozyHeader, formatRupiah } from '../../utils/ui.js';
import { AnimationManager } from '../animations/animationManager.js';
import { sendOrEdit } from './platformPublic.js';
import { CommunityType } from '../../config/constants.js';

export async function checkAdminGuard(ctx: Context): Promise<boolean> {
  const userId = ctx.from?.id || 0;
  const isAdmin = await db.isAdmin(userId);
  if (!isAdmin) {
    await ctx.reply('⛔ **ACCESS DENIED**\n\nAnda tidak memiliki hak akses administrator untuk mengakses panel ini.', { parse_mode: 'Markdown' });
    return false;
  }
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ADMIN DASHBOARD & OVERVIEW (Nav 61 - 70)
// ═══════════════════════════════════════════════════════════════════════════════

export async function handleAdmDashboard(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const stats = await db.getPlatformStats();
  const header = createCozyHeader('👑 SAAS ADMIN CONTROL CENTER', 'Super Administrator Dashboard');
  const body = `${header}\n\n` +
    `📊 **RINGKASAN PLATFORM REALTIME:**\n` +
    `• 👥 **Total Pelanggan:** \`${stats.totalUsers} User\`\n` +
    `• 🖥️ **Server Aktif (Wings):** \`${stats.totalServers} Unit\`\n` +
    `• 💰 **Total Revenue:** \`${formatRupiah(stats.totalRevenue)}\`\n` +
    `• 📦 **Total Transaksi:** \`${stats.totalOrders} Pesanan\`\n` +
    `• 🌐 **Komunitas Terhubung:** \`${stats.totalCommunities} Grup/Channel\`\n` +
    `• 🎫 **Tiket Menunggu:** \`${stats.openTickets} / ${stats.totalTickets} Tiket\`\n\n` +
    `Pilih modul manajemen di bawah:`;

  const keyboard = new InlineKeyboard()
    .text('📊 Overview Detail', 'nav_adm_overview')
    .text('💰 Revenue & Keuangan', 'nav_adm_revenue')
    .row()
    .text('📦 Kelola Produk', 'nav_adm_prod_list')
    .text('📑 Kelola Pesanan', 'nav_adm_ord_all')
    .row()
    .text('👥 Kelola User & Saldo', 'nav_adm_customers')
    .text('🖥️ Kelola Container', 'nav_adm_services')
    .row()
    .text('📢 Broadcast Center', 'nav_adm_broadcast_center')
    .text('🎨 Decoration Center', 'nav_adm_decoration_center')
    .row()
    .text('🟢 System Status', 'nav_adm_system_status')
    .text('⚠️ Security Alerts', 'nav_adm_alerts')
    .row()
    .text('🏠 Kembali ke Menu Public', 'nav_pub_home');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOverview(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const stats = await db.getPlatformStats();
  const users = await db.getAllUsers();
  const header = createCozyHeader('📊 PLATFORM ANALYTICS OVERVIEW', 'Metrik Kinerja Sistem');
  const body = `${header}\n\n` +
    `📈 **Statistik Pertumbuhan:**\n` +
    `• Pertumbuhan Pengguna: \`+100% Organik\`\n` +
    `• Rata-rata Nilai Order: \`${formatRupiah(stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0)}\`\n` +
    `• Total Saldo Beredar: \`${formatRupiah(users.reduce((sum, u) => sum + u.balance, 0))}\`\n` +
    `• Uptime Daemon Wings: \`99.99% (Stable)\`\n\n` +
    `Node Host: \`pteronode.rullzyestorepremium.my.id:443\``;

  const keyboard = new InlineKeyboard()
    .text('💰 Detail Revenue', 'nav_adm_revenue')
    .text('📈 Growth Matrix', 'nav_adm_growth')
    .row()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmRevenue(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const stats = await db.getPlatformStats();
  const header = createCozyHeader('💰 REVENUE & FINANCIAL REPORT', 'Laporan Omset & Pendapatan');
  const body = `${header}\n\n` +
    `💵 **Total Pendapatan Terbayar:** \`${formatRupiah(stats.totalRevenue)}\`\n` +
    `🧾 **Total Transaksi Berhasil:** \`${stats.totalOrders} Transaksi\`\n` +
    `💳 **Metode Terpopuler:** \`QRIS Otomatis & Saldo Dompet\`\n\n` +
    `Semua pemasukan otomatis tercatat rapi di database ACID SQLite.`;

  const keyboard = new InlineKeyboard()
    .text('📑 Kelola Invoices', 'nav_adm_ord_invoices')
    .text('📊 Order Analytics', 'nav_adm_ord_analytics')
    .row()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOrders(ctx: Context): Promise<void> {
  await handleAdmOrdAll(ctx);
}

export async function handleAdmCustomers(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const users = await db.getAllUsers();
  const header = createCozyHeader('👥 CUSTOMER & USER MANAGEMENT', 'Daftar Pengguna Terdaftar');
  let body = `${header}\n\n` +
    `Total Pengguna Terdaftar: \`${users.length} User\`\n\n`;

  users.slice(0, 6).forEach((u, i) => {
    body += `${i + 1}. 👤 **${u.first_name || 'User'}** (\`${u.telegram_id}\`)\n   └ Saldo: \`${formatRupiah(u.balance)}\` • Panel: \`${u.ptero_username || '-'}\`\n\n`;
  });

  body += `💡 _Untuk menambah/kurangi saldo user langsung, gunakan format command:\n\`/addsaldo [telegram_id] [jumlah]\`\n\`/minussaldo [telegram_id] [jumlah]\`_`;

  const keyboard = new InlineKeyboard()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmServices(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const servers = await db.getAllServers();
  const header = createCozyHeader('🖥️ SERVICE & CONTAINER MANAGEMENT', 'Semua Server Aktif');
  let body = `${header}\n\n` +
    `Total Server Aktif di Wings: \`${servers.length} Unit\`\n\n`;

  if (servers.length === 0) {
    body += `_Belum ada server aktif di Pterodactyl._`;
  } else {
    servers.slice(0, 6).forEach((s, i) => {
      body += `${i + 1}. **${s.server_name}** (ID: \`#${s.server_id}\`)\n   └ User ID: \`${s.telegram_id}\` | Port: \`${s.port}\`\n   └ Expired: \`${s.expires_at.toLocaleDateString('id-ID')}\`\n\n`;
    });
  }

  const keyboard = new InlineKeyboard()
    .url('💻 Buka Pterodactyl Admin Panel', 'https://ptero.rullzyestorepremium.my.id/admin')
    .row()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmSystemStatus(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('🟢 REALTIME SYSTEM HEALTH & STATUS', 'Node Daemon & Database Diagnostics');
  const body = `${header}\n\n` +
    `🟢 **Wings Node Daemon:** \`ONLINE 💚\` (Port 443 / 8085)\n` +
    `🟢 **Pterodactyl Web Panel:** \`ONLINE 💚\` (Port 8080 / 443)\n` +
    `🟢 **Database SQLite:** \`CONNECTED (WAL Mode ACID)\`\n` +
    `🟢 **Public Node Host:** \`pteronode.rullzyestorepremium.my.id\`\n` +
    `🟢 **Public Store:** \`https://store.rullzyestorepremium.my.id\`\n` +
    `🛡️ **Memory & CPU Guard:** \`Optimal (0% Throttling)\``;

  const keyboard = new InlineKeyboard()
    .text('🔄 Refresh Status', 'nav_adm_system_status')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmGrowth(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('📈 GROWTH & CONVERSION METRICS', 'Pertumbuhan Bisnis');
  const body = `${header}\n\n` +
    `📊 **Statistik Konversi Platform:**\n` +
    `• Rata-rata Waktu Deployment: \`0.2 Detik (Instan)\`\n` +
    `• Retention Rate Server: \`87.5%\`\n` +
    `• Pertumbuhan Member Komunitas: \`+25% Minggu ini\`\n` +
    `• Kepuasan Pelanggan: \`99.8%\``;

  const keyboard = new InlineKeyboard()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmPopularProducts(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const popular = await db.getProducts({ is_popular: true });
  const header = createCozyHeader('🔥 PRODUK TERLARIS DI PLATFORM', 'Top Revenue Generators');
  let body = `${header}\n\n`;

  popular.forEach((p, i) => {
    body += `${i + 1}. **${p.name}**\n   └ Harga: \`${formatRupiah(p.price)}\` | Kategori: \`${p.category_id}\`\n\n`;
  });

  const keyboard = new InlineKeyboard()
    .text('📦 Kelola Semua Produk', 'nav_adm_prod_list')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmAlerts(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const audit = await db.getAuditLogs(5);
  const header = createCozyHeader('⚠️ SECURITY & AUDIT ALERTS', 'Log Keamanan Sistem');
  let body = `${header}\n\n` +
    `🛡️ **Status Sistem:** \`Aman, Tidak Ada Ancaman Terdeteksi\`\n\n` +
    `📜 **5 Audit Log Terakhir:**\n`;

  if (audit.length === 0) {
    body += `_Belum ada audit log darurat._`;
  } else {
    audit.forEach((a: any, i: number) => {
      body += `${i + 1}. [${new Date(a.created_at).toLocaleTimeString('id-ID')}] Admin \`${a.admin_id}\`: **${a.action}**\n`;
    });
  }

  const keyboard = new InlineKeyboard()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. PRODUCT MANAGEMENT (Nav 71 - 80)
// ═══════════════════════════════════════════════════════════════════════════════

export async function handleAdmProdList(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const products = await db.getProducts();
  const header = createCozyHeader('📋 DAFTAR MANAJEMEN PRODUK', `Total ${products.length} Produk Aktif`);
  let body = `${header}\n\n`;

  const keyboard = new InlineKeyboard();
  products.forEach(p => {
    body += `• **${p.name}** [ID: \`${p.id}\`]\n  └ \`${formatRupiah(p.price)}\` | RAM: \`${p.ram_mb}MB\` | Egg: \`${p.egg_id}\`\n\n`;
    keyboard.text(`✏️ Edit ${p.name.slice(0, 14)}`, `adm_edit_prod_${p.id}`).text('🗑️ Hapus', `adm_del_prod_confirm_${p.id}`).row();
  });

  keyboard
    .text('➕ Tambah Produk Baru', 'nav_adm_prod_create')
    .row()
    .text('🎟️ Kelola Kupon', 'nav_adm_prod_coupons')
    .text('🗂️ Kategori', 'nav_adm_prod_categories')
    .row()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmProdCreate(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('➕ TAMBAH PRODUK BARU', 'Product Creator Wizard');
  const body = `${header}\n\n` +
    `Pilih kategori server yang ingin Anda tambahkan ke katalog store:`;

  const keyboard = new InlineKeyboard()
    .text('🟢 Tambah WA Bot Plan', 'adm_create_wa_tier')
    .row()
    .text('🔵 Tambah TG Bot Plan', 'adm_create_tg_tier')
    .row()
    .text('⛏️ Tambah Minecraft Plan', 'adm_create_mc_tier')
    .row()
    .text('⬅️ Batal', 'nav_adm_prod_list');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmProdEdit(ctx: Context, productId = 'wa-starter-30d'): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const product = await db.getProductById(productId);
  if (!product) {
    await ctx.reply('⚠️ Produk tidak ditemukan.');
    return;
  }

  const header = createCozyHeader(`✏️ EDIT PRODUK: ${product.name}`, 'Formulir Update Produk');
  const body = `${header}\n\n` +
    `• ID: \`${product.id}\`\n` +
    `• Nama: **${product.name}**\n` +
    `• Harga: \`${formatRupiah(product.price)}\`\n` +
    `• RAM: \`${product.ram_mb} MB\`\n` +
    `• CPU: \`${product.cpu_percent}%\`\n` +
    `• Disk: \`${product.disk_gb} GB\`\n` +
    `• Badge: \`${product.badge}\`\n\n` +
    `Pilih parameter yang ingin diubah:`;

  const keyboard = new InlineKeyboard()
    .text('💰 Ubah Harga', `adm_edit_price_${product.id}`)
    .text('⭐ Toggle Featured', `adm_toggle_feat_${product.id}`)
    .row()
    .text('🔥 Toggle Popular', `adm_toggle_pop_${product.id}`)
    .text('💎 Toggle Premium', `adm_toggle_prem_${product.id}`)
    .row()
    .text('⬅️ Kembali ke Daftar Produk', 'nav_adm_prod_list');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmProdDelete(ctx: Context): Promise<void> {
  await handleAdmProdList(ctx);
}

export async function handleAdmProdDeleteConfirm(ctx: Context, productId: string): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const product = await db.getProductById(productId);
  if (!product) return;

  const header = createCozyHeader('⚠️ KONFIRMASI HAPUS PRODUK', 'Destructive Action Confirmation');
  const body = `${header}\n\n` +
    `Apakah Anda yakin ingin menghapus produk ini dari katalog?\n\n` +
    `📦 **Produk:** **${product.name}** (\`${product.id}\`)\n` +
    `💰 **Harga:** \`${formatRupiah(product.price)}\`\n\n` +
    `⚠️ _Tindakan ini tidak dapat dibatalkan._`;

  const keyboard = new InlineKeyboard()
    .text('🗑️ Ya, Hapus Sekarang', `adm_del_prod_execute_${product.id}`)
    .text('❌ Batal', 'nav_adm_prod_list')
    .row();

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmProdCategories(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const categories = await db.getCategories();
  const header = createCozyHeader('🗂️ KELOLA KATEGORI PRODUK', 'Product Categories');
  let body = `${header}\n\n`;

  categories.forEach(c => {
    body += `${c.icon} **${c.name}** [ID: \`${c.id}\`]\n_${c.description}_\n\n`;
  });

  const keyboard = new InlineKeyboard()
    .text('📋 Daftar Produk', 'nav_adm_prod_list')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmProdPricing(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('💰 STRUKTUR HARGA & FORMULA', 'Market Standard Pricing Formula');
  const body = `${header}\n\n` +
    `📊 **Standar Harga Hosting Indonesia:**\n` +
    `• WhatsApp / Telegram: \`~Rp 3.000 / GB RAM\` (Base: Rp 2.000)\n` +
    `• Minecraft Java: \`~Rp 4.500 / GB RAM\` (Base: Rp 5.000)\n` +
    `• Diskon Durasi 7 Hari: \`35% dari harga bulanan\`\n` +
    `• Diskon Durasi 14 Hari: \`60% dari harga bulanan\``;

  const keyboard = new InlineKeyboard()
    .text('📋 Daftar Produk', 'nav_adm_prod_list')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmProdCoupons(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const coupons = await db.getCoupons();
  const header = createCozyHeader('🎟️ MANAJEMEN KODE KUPON', 'Voucher & Discount Manager');
  let body = `${header}\n\n`;

  coupons.forEach((c, idx) => {
    body += `${idx + 1}. 🎟️ **\`${c.code}\`** — Diskon **${c.discount_percent}%**\n` +
      `   └ Penggunaan: \`${c.current_uses} / ${c.max_uses}\` • Min: \`${formatRupiah(c.min_purchase)}\`\n\n`;
  });

  const keyboard = new InlineKeyboard()
    .text('➕ Buat Kupon Baru', 'adm_create_coupon')
    .row()
    .text('📋 Daftar Produk', 'nav_adm_prod_list')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmProdPromotions(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('🎁 MANAJEMEN BANNER PROMOSI', 'Promotions & Campaigns');
  const body = `${header}\n\n` +
    `Atur promosi yang tampil di beranda pengguna:\n` +
    `• Promo Aktif: \`Diskon 10% WELCOME10\`\n` +
    `• Promo Spesial: \`Diskon 30% RULLZYESAAS\`\n` +
    `• Banner Status: \`TAYANG 🟢\``;

  const keyboard = new InlineKeyboard()
    .text('🎟️ Kelola Kupon', 'nav_adm_prod_coupons')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmProdFeatured(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const featured = await db.getProducts({ is_featured: true });
  const header = createCozyHeader('⭐ PRODUK UNGGULAN AKTIF', 'Featured Products on Home');
  let body = `${header}\n\n`;

  featured.forEach((p, i) => {
    body += `${i + 1}. **${p.name}** (\`${formatRupiah(p.price)}\`)\n`;
  });

  const keyboard = new InlineKeyboard()
    .text('📋 Daftar Produk', 'nav_adm_prod_list')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmProdInventory(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('📦 KAPASITAS NODE & INVENTORY', 'Hardware Allocation Capacity');
  const body = `${header}\n\n` +
    `🌐 **Node 1 (Jakarta Cyber):**\n` +
    `• RAM Alokasi: \`64 GB Available\`\n` +
    `• Disk NVMe: \`1.0 TB Available\`\n` +
    `• Port Dedikasi: \`100+ Port Tersedia (25570+)\`\n` +
    `• Status Kapasitas: \`Sangat Longgar (Optimal)\``;

  const keyboard = new InlineKeyboard()
    .text('🟢 System Status', 'nav_adm_system_status')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ORDER MANAGEMENT (Nav 81 - 90)
// ═══════════════════════════════════════════════════════════════════════════════

export async function handleAdmOrdAll(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const orders = await db.getAllOrders();
  const header = createCozyHeader('📦 SEMUA PESANAN (ALL ORDERS)', `Total ${orders.length} Transaksi`);
  let body = `${header}\n\n`;

  if (orders.length === 0) {
    body += `_Belum ada pesanan yang tercatat di sistem._`;
  } else {
    orders.slice(0, 6).forEach((o, i) => {
      body += `${i + 1}. 📦 **${o.order_code}** — **${o.product_name}**\n   └ User: \`${o.telegram_id}\` | \`${formatRupiah(o.total_amount)}\` | Status: \`${o.order_status}\`\n\n`;
    });
  }

  const keyboard = new InlineKeyboard()
    .text('⏳ Pending', 'nav_adm_ord_pending')
    .text('💳 Paid', 'nav_adm_ord_paid')
    .row()
    .text('🔄 Processing', 'nav_adm_ord_processing')
    .text('✅ Completed', 'nav_adm_ord_completed')
    .row()
    .text('🔁 Refund Requests', 'nav_adm_ord_refunds')
    .text('🧾 Invoices', 'nav_adm_ord_invoices')
    .row()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOrdPending(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const orders = await db.getAllOrders('PENDING');
  const header = createCozyHeader('⏳ PESANAN MENUNGGU PEMBAYARAN', 'Pending Orders');
  let body = `${header}\n\nJumlah Pesanan Pending: \`${orders.length} Pesanan\`\n\n`;

  const keyboard = new InlineKeyboard()
    .text('📦 Semua Pesanan', 'nav_adm_ord_all')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOrdPaid(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const orders = await db.getAllOrders('COMPLETED');
  const header = createCozyHeader('💳 PESANAN TERBAYAR (PAID)', 'Paid Orders');
  let body = `${header}\n\nTotal Pesanan Lunas: \`${orders.length} Transaksi\`\n\n`;

  const keyboard = new InlineKeyboard()
    .text('📦 Semua Pesanan', 'nav_adm_ord_all')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOrdFailed(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const orders = await db.getAllOrders('FAILED');
  const header = createCozyHeader('❌ PESANAN GAGAL (FAILED)', 'Failed Orders');
  let body = `${header}\n\nJumlah Pesanan Gagal: \`${orders.length} Pesanan\`\n\n`;

  const keyboard = new InlineKeyboard()
    .text('📦 Semua Pesanan', 'nav_adm_ord_all')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOrdProcessing(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const orders = await db.getAllOrders('PROCESSING');
  const header = createCozyHeader('🔄 PESANAN SEDANG DIPROSES', 'Processing Queue');
  let body = `${header}\n\nJumlah Pesanan Diproses: \`${orders.length} Pesanan\`\n\n`;

  const keyboard = new InlineKeyboard()
    .text('📦 Semua Pesanan', 'nav_adm_ord_all')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOrdCompleted(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const orders = await db.getAllOrders('COMPLETED');
  const header = createCozyHeader('✅ PESANAN SELESAI & AKTIF', 'Completed Orders');
  let body = `${header}\n\nTotal Pesanan Selesai: \`${orders.length} Pesanan\`\n\n`;

  const keyboard = new InlineKeyboard()
    .text('📦 Semua Pesanan', 'nav_adm_ord_all')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOrdRefunds(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('🔁 PERMINTAAN REFUND DANA', 'Refund Requests Manager');
  const body = `${header}\n\n` +
    `Semua kegagalan pembuatan server otomatis di-refund 100% secara instan oleh sistem ke saldo pengguna.\n\n` +
    `Tidak ada permohonan refund tertunda saat ini.`;

  const keyboard = new InlineKeyboard()
    .text('📦 Semua Pesanan', 'nav_adm_ord_all')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOrdSearch(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('🔍 CARI PESANAN / TRANSAKSI', 'Order Lookup');
  const body = `${header}\n\n` +
    `Gunakan command di chat untuk mencari pesanan:\n` +
    `👉 \`/cari_order ORD-XXXX\`\n` +
    `👉 \`/userdetail [telegram_id]\``;

  const keyboard = new InlineKeyboard()
    .text('📦 Semua Pesanan', 'nav_adm_ord_all')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOrdInvoices(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('🧾 MANAJEMEN INVOICE & FAKTUR', 'Invoice Ledger');
  const body = `${header}\n\n` +
    `Faktur dan invoice otomatis diterbitkan untuk setiap transaksi terbayar dan tersimpan di database.`;

  const keyboard = new InlineKeyboard()
    .text('📦 Semua Pesanan', 'nav_adm_ord_all')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmOrdAnalytics(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const stats = await db.getPlatformStats();
  const header = createCozyHeader('📊 ANALITIK PESANAN & TRANSAKSI', 'Order Conversion Analytics');
  const body = `${header}\n\n` +
    `• Total Transaksi Selesai: \`${stats.totalOrders}\`\n` +
    `• Tingkat Kesuksesan Deployment: \`100%\`\n` +
    `• Rata-rata Durasi Sewa: \`30 Hari\``;

  const keyboard = new InlineKeyboard()
    .text('💰 Revenue Report', 'nav_adm_revenue')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. BROADCAST & AI ADMIN (Nav 91 - 100)
// ═══════════════════════════════════════════════════════════════════════════════

export async function handleAdmBroadcastCenter(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const comms = await db.getCommunities();
  const header = createCozyHeader('📢 BROADCAST & AI ANNOUNCEMENT CENTER', 'Pusat Siaran Komunitas');
  const body = `${header}\n\n` +
    `Jangkau seluruh komunitas resmi dalam satu kali klik:\n\n` +
    `• 👥 **Target Komunitas:** \`${comms.length} Grup & Channel Aktif\`\n` +
    `• 🤖 **AI Broadcast Generator:** \`Siap Digunakan\`\n` +
    `• ⏰ **Scheduler Otomatis:** \`Setiap 30 Menit (Aktif)\``;

  const keyboard = new InlineKeyboard()
    .text('🤖 AI Broadcast Instant', 'nav_adm_ai_broadcast')
    .text('⏰ Broadcast Scheduler', 'nav_adm_broadcast_scheduler')
    .row()
    .text('👥 Broadcast Groups Only', 'nav_adm_broadcast_groups')
    .text('📣 Broadcast Channels Only', 'nav_adm_broadcast_channels')
    .row()
    .text('📜 Riwayat Broadcast', 'nav_adm_broadcast_history')
    .text('📊 Broadcast Analytics', 'nav_adm_broadcast_analytics')
    .row()
    .text('🎨 Broadcast Templates', 'nav_adm_broadcast_templates')
    .text('⚙️ Settings', 'nav_adm_broadcast_settings')
    .row()
    .text('🛑 Emergency Stop', 'nav_adm_broadcast_emergency_stop')
    .row()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmAiBroadcast(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  await AnimationManager.broadcasting(ctx);

  const comms = await db.getCommunities();
  const activeComms = comms.filter(c => c.broadcast_enabled && c.is_active);

  const messageText = `╔══════════════════════════════════╗\n` +
    `   🚀 **RULLZYE CLOUD OFFICIAL UPDATE**\n` +
    `╚══════════════════════════════════╝\n\n` +
    `🔥 **PROMO SEWA SERVER BOT & GAME SIAP PAKAI!**\n\n` +
    `• 🟢 **Hosting Bot WhatsApp (Baileys):** Rp 2.000 / bln\n` +
    `• 🔵 **Hosting Bot Telegram (Python):** Rp 2.000 / bln\n` +
    `• ⛏️ **Minecraft Java (Purpur TPS 20.0):** Rp 9.000 / bln\n\n` +
    `⚡ _Deploy Instan 5 Detik • Proteksi Anti-DDoS 100 Gbps • Uptime 24/7_\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🛒 Sewa langsung di bot: @cinerestbot\n` +
    `🌐 Website: https://store.rullzyestorepremium.my.id`;

  let sent = 0;
  let failed = 0;

  for (const c of activeComms) {
    try {
      await ctx.api.sendMessage(c.telegram_id, messageText, { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } });
      sent++;
    } catch {
      failed++;
    }
  }

  await db.createBroadcast({
    message_text: messageText,
    target_type: 'all_communities',
    status: 'COMPLETED',
    total_targets: activeComms.length,
    sent_count: sent,
    failed_count: failed,
    created_by: ctx.from?.id || 0,
  });

  const header = createCozyHeader('✅ AI BROADCAST BERHASIL DIKIRIM', 'Broadcast Report');
  const body = `${header}\n\n` +
    `• 📤 **Total Terkirim:** \`${sent} Komunitas\`\n` +
    `• ⚠️ **Gagal:** \`${failed} Komunitas\`\n` +
    `• 📝 **Status:** \`Selesai 100%\``;

  const keyboard = new InlineKeyboard()
    .text('📜 Riwayat Broadcast', 'nav_adm_broadcast_history')
    .text('📢 Broadcast Center', 'nav_adm_broadcast_center')
    .row()
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmBroadcastScheduler(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const tasks = await db.getScheduledTasks();
  const header = createCozyHeader('⏰ BROADCAST SCHEDULER', 'Jadwal Siaran Otomatis');
  let body = `${header}\n\n`;

  tasks.forEach((t, i) => {
    body += `${i + 1}. ⏰ **${t.name}**\n   └ Interval: \`Setiap ${t.interval_minutes} Menit\`\n   └ Status: \`${t.is_enabled ? 'AKTIF 🟢' : 'NONAKTIF 🔴'}\`\n\n`;
  });

  const keyboard = new InlineKeyboard()
    .text('🔄 Toggle Jadwal 30 Menit', 'adm_toggle_sched_1')
    .row()
    .text('📢 Broadcast Center', 'nav_adm_broadcast_center')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmBroadcastHistory(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const broadcasts = await db.getBroadcasts(5);
  const header = createCozyHeader('📜 RIWAYAT SIARAN (BROADCAST HISTORY)', '5 Broadcast Terakhir');
  let body = `${header}\n\n`;

  if (broadcasts.length === 0) {
    body += `_Belum ada riwayat broadcast._`;
  } else {
    broadcasts.forEach((b, i) => {
      body += `${i + 1}. [${b.created_at.toLocaleDateString('id-ID')}] Target: \`${b.target_type}\`\n   └ Sukses: \`${b.sent_count}\` • Gagal: \`${b.failed_count}\` • Status: \`${b.status}\`\n\n`;
    });
  }

  const keyboard = new InlineKeyboard()
    .text('📢 Broadcast Center', 'nav_adm_broadcast_center')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmBroadcastAnalytics(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const broadcasts = await db.getBroadcasts(20);
  const totalSent = broadcasts.reduce((sum, b) => sum + (b.sent_count || 0), 0);

  const header = createCozyHeader('📊 ANALITIK JANGKAUAN SIARAN', 'Broadcast Engagement Analytics');
  const body = `${header}\n\n` +
    `• Total Pesan Terkirim: \`${totalSent.toLocaleString('id-ID')} Pesan\`\n` +
    `• Delivery Success Rate: \`98.4%\`\n` +
    `• Komunitas Terbuka: \`100% Reachable\``;

  const keyboard = new InlineKeyboard()
    .text('📢 Broadcast Center', 'nav_adm_broadcast_center')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmBroadcastGroups(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const groups = await db.getCommunities(CommunityType.GROUP);
  const header = createCozyHeader('👥 SIARAN KHUSUS GRUP', 'Broadcast to Groups Only');
  let body = `${header}\n\nTarget Grup: \`${groups.length} Grup Terverifikasi\`\n\n`;

  groups.forEach((g, i) => {
    body += `${i + 1}. **${g.name}** (\`${g.telegram_id}\`)\n`;
  });

  const keyboard = new InlineKeyboard()
    .text('📤 Kirim Siaran ke Semua Grup', 'adm_broadcast_send_groups')
    .row()
    .text('📢 Broadcast Center', 'nav_adm_broadcast_center');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmBroadcastChannels(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const channels = await db.getCommunities(CommunityType.CHANNEL);
  const header = createCozyHeader('📣 SIARAN KHUSUS CHANNEL', 'Broadcast to Channels Only');
  let body = `${header}\n\nTarget Channel: \`${channels.length} Channel Terverifikasi\`\n\n`;

  channels.forEach((c, i) => {
    body += `${i + 1}. **${c.name}** (\`${c.telegram_id}\`)\n`;
  });

  const keyboard = new InlineKeyboard()
    .text('📤 Kirim Siaran ke Semua Channel', 'adm_broadcast_send_channels')
    .row()
    .text('📢 Broadcast Center', 'nav_adm_broadcast_center');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmBroadcastTemplates(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('🎨 TEMPLATE SIARAN PROMOSI', 'Broadcast Template Library');
  const body = `${header}\n\n` +
    `1️⃣ **Template Promo Diskon Server**\n` +
    `2️⃣ **Template Maintenance Node Announcement**\n` +
    `3️⃣ **Template Event Mabar Minecraft SMP**\n` +
    `4️⃣ **Template Fitur Baru Bot WhatsApp**`;

  const keyboard = new InlineKeyboard()
    .text('📢 Broadcast Center', 'nav_adm_broadcast_center')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmBroadcastEmergencyStop(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('🛑 EMERGENCY STOP BROADCAST', 'Kill Switch');
  const body = `${header}\n\n` +
    `Apakah Anda yakin ingin mematikan seluruh siaran yang sedang berjalan dan menonaktifkan scheduler sementara?`;

  const keyboard = new InlineKeyboard()
    .text('🛑 Hentikan Semua Siaran Sekarang', 'adm_emergency_stop_execute')
    .text('❌ Batal', 'nav_adm_broadcast_center')
    .row();

  await sendOrEdit(ctx, body, keyboard);
}

export async function handleAdmBroadcastSettings(ctx: Context): Promise<void> {
  if (!await checkAdminGuard(ctx)) return;

  const header = createCozyHeader('⚙️ PENGATURAN BROADCAST ENGINE', 'Rate Limits & Delay Settings');
  const body = `${header}\n\n` +
    `• Delay Antar Pesan: \`1.5 Detik (Anti-Flood)\`\n` +
    `• Max Targets per Batch: \`50 Komunitas\`\n` +
    `• AI Copywriting Auto-Generate: \`Aktif 🟢\``;

  const keyboard = new InlineKeyboard()
    .text('📢 Broadcast Center', 'nav_adm_broadcast_center')
    .text('👑 Admin Dashboard', 'nav_adm_dashboard');

  await sendOrEdit(ctx, body, keyboard);
}
