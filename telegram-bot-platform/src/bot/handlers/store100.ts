import { Context, InlineKeyboard } from 'grammy';
import { ALL_100_PACKAGES } from '../../data/packages100.js';
import { db } from '../../database/db.js';
import { pterodactylService } from '../../services/pterodactylService.js';
import { HostingPackage } from '../../data/packages300.js';

export async function handleStore100Catalog(ctx: Context, category = 'whatsapp', page = 1): Promise<void> {
  const categoryPackages = ALL_100_PACKAGES.filter(p => p.category === category);
  const pageSize = 5;
  const totalPages = Math.ceil(categoryPackages.length / pageSize);
  const safePage = Math.max(1, Math.min(page, totalPages));

  const startIdx = (safePage - 1) * pageSize;
  const currentPackages = categoryPackages.slice(startIdx, startIdx + pageSize);

  const keyboard = new InlineKeyboard();

  // Category Selector Tabs
  keyboard
    .text(category === 'whatsapp' ? '• 🟢 WhatsApp (25) •' : '🟢 WhatsApp', 'p100_cat_whatsapp_1')
    .text(category === 'telegram' ? '• 🔵 Telegram (25) •' : '🔵 Telegram', 'p100_cat_telegram_1')
    .row()
    .text(category === 'minecraft' ? '• ⛏️ Minecraft (25) •' : '⛏️ Minecraft', 'p100_cat_minecraft_1')
    .text(category === 'vps' ? '• 🚀 Linux VPS (25) •' : '🚀 Linux VPS', 'p100_cat_vps_1')
    .row();

  // Product Plan Buttons
  currentPackages.forEach(p => {
    keyboard.text(`📦 Plan ${p.tier} (${p.ramMb >= 1024 ? `${p.ramMb / 1024}GB` : `${p.ramMb}MB`}) - Rp ${p.price.toLocaleString('id-ID')}`, `p100_detail_${p.id}`).row();
  });

  // Pagination Controls
  if (safePage > 1) {
    keyboard.text('⬅️ Prev', `p100_cat_${category}_${safePage - 1}`);
  }
  keyboard.text(`📄 Hal ${safePage}/${totalPages}`, 'noop');
  if (safePage < totalPages) {
    keyboard.text('Next ➡️', `p100_cat_${category}_${safePage + 1}`);
  }

  keyboard.row().text('🏠 Menu Utama', 'menu_main');

  const catName = category === 'whatsapp' ? '🟢 BOT WHATSAPP (BAILEYS)' : category === 'telegram' ? '🔵 BOT TELEGRAM (PYTHON/NODE)' : category === 'minecraft' ? '⛏️ MINECRAFT JAVA EDITION' : '🚀 LINUX VPS & CONTAINER';

  const text = `🛒 **KATALOG 100 PAKET HOSTING RULLZYESTORE**
━━━━━━━━━━━━━━━━━━━━
📂 **Kategori:** **${catName}**
📄 **Halaman:** \`${safePage} dari ${totalPages}\`

${currentPackages
  .map(
    p =>
      `• **${p.name}**\n  💰 \`Rp ${p.price.toLocaleString('id-ID')}/bln\` | ⚙️ RAM: \`${p.ramMb}MB\` • CPU: \`${p.cpuPercent}%\` • Disk: \`${p.diskGb}GB\`\n  _${p.description}_`
  )
  .join('\n\n')}

━━━━━━━━━━━━━━━━━━━━
👉 *Klik salah satu paket di atas untuk melihat detail & langsung sewa otomatis:*`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }
  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

export async function handlePackageDetail(ctx: Context, packageId: string): Promise<void> {
  const pkg = ALL_100_PACKAGES.find(p => p.id === packageId);
  if (!pkg) {
    await ctx.reply('⚠️ Paket hosting tidak ditemukan.');
    return;
  }

  const userId = ctx.from?.id || 0;
  const user = await db.getUser(userId);
  const balance = user?.balance || 0;

  const checkoutUrl = `https://rullzyestorepremium.my.id/checkout?plan=${pkg.id}`;

  const keyboard = new InlineKeyboard()
    .text(`💰 Bayar Pakai Saldo (Saldo: Rp ${balance.toLocaleString('id-ID')})`, `p100_buysaldo_${pkg.id}`)
    .row()
    .url('💳 Bayar Instan via QRIS / VA', checkoutUrl)
    .row()
    .text('⬅️ Kembali ke Daftar Paket', `p100_cat_${pkg.category}_1`);

  const text = `📦 **DETAIL PAKET HOSTING: ${pkg.name.toUpperCase()}**
━━━━━━━━━━━━━━━━━━━━
🏷️ **Kategori:** \`${pkg.category.toUpperCase()}\`
💰 **Biaya Sewa:** \`Rp ${pkg.price.toLocaleString('id-ID')} / bulan\`

⚙️ **Spesifikasi Server:**
• **RAM Alokasi:** \`${pkg.ramMb >= 1024 ? `${pkg.ramMb / 1024} GB (${pkg.ramMb} MB)` : `${pkg.ramMb} MB`}\`
• **CPU Limit:** \`${pkg.cpuPercent}% vCPU Core\`
• **Storage:** \`${pkg.diskGb} GB NVMe Ultra Fast\`
• **Port Publik:** \`Gratis 1 Port Alokasi\`
• **Docker Image:** \`${pkg.dockerImage}\`

✨ **Fitur & Jaminan:**
• Auto-restart saat bot/server crash
• Web Console Pterodactyl 24/7 & SFTP File Manager
• Proteksi Anti-DDoS 100 Gbps Datacenter Jakarta
• Aktivasi Otomatis Instan (5-10 Detik)

━━━━━━━━━━━━━━━━━━━━
💡 *Pilih metode pembayaran di bawah untuk aktivasi instan:*`;

  try {
    await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } catch {
    await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
  }
}

export async function handleBuyWithBalance(ctx: Context, packageId: string): Promise<void> {
  const pkg = ALL_100_PACKAGES.find(p => p.id === packageId);
  if (!pkg) return;

  const userId = ctx.from?.id || 0;
  const user = await db.getUser(userId);

  if (!user || user.balance < pkg.price) {
    const keyboard = new InlineKeyboard()
      .text('💳 Top Up Saldo Sekarang', 'wallet_topup')
      .row()
      .url('📲 Bayar via QRIS Langsung', `https://rullzyestorepremium.my.id/checkout?plan=${pkg.id}`)
      .row()
      .text('⬅️ Kembali', `p100_detail_${pkg.id}`);

    await ctx.reply(
      `⚠️ **Saldo Tidak Mencukupi!**\n\nHarga Paket: \`Rp ${pkg.price.toLocaleString('id-ID')}\`\nSaldo Anda: \`Rp ${(user?.balance || 0).toLocaleString('id-ID')}\`\n\nSilakan Top Up saldo Anda atau gunakan pembayaran langsung via QRIS.`,
      { parse_mode: 'Markdown', reply_markup: keyboard }
    );
    return;
  }

  // Deduct balance
  await db.deductBalance(userId, pkg.price, `Sewa Server ${pkg.name}`);

  // Send provisioning progress
  const loading = await ctx.reply('⏳ **Sedang membuat server otomatis di Pterodactyl Panel...**', { parse_mode: 'Markdown' });

  try {
    // 1. Get or Create User Account on Pterodactyl
    const pteroUserData = await pterodactylService.getOrCreateUser(userId, ctx.from?.first_name || 'User', ctx.from?.username);
    const pteroUser = pteroUserData.user;

    // Save Pterodactyl credentials in DB
    await db.savePteroCredentials(userId, pteroUser.id, pteroUser.username, pteroUserData.generatedPassword);

    const fullPkg: HostingPackage = {
      ...pkg,
      duration: '30d',
      durationLabel: '30 Hari',
      durationDays: 30,
      badge: 'PRO',
    };

    // 2. Provision Container Server on Node-Main-01
    const serverResult = await pterodactylService.createServer(pteroUser.id, fullPkg, `${pkg.name} - ${ctx.from?.first_name || 'Server'}`);

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // 3. Record Server in User Server DB
    await db.recordUserServer({
      telegram_id: userId,
      server_id: serverResult.serverId,
      server_identifier: serverResult.serverIdentifier,
      server_name: serverResult.name,
      package_id: pkg.id,
      duration_days: 30,
      port: serverResult.port,
      status: 'active',
      expires_at: expiresAt,
    });

    const successKeyboard = new InlineKeyboard()
      .url('💻 BUKA PTERODACTYL PANEL', serverResult.panelUrl)
      .row()
      .text('📦 Layanan Saya', 'menu_my_servers')
      .row()
      .text('🏠 Menu Utama', 'menu_main');

    const credsText = `🎉 **SERVER ANDA BERHASIL DIAKTIFKAN OTOMATIS!**
━━━━━━━━━━━━━━━━━━━━
📦 **Paket:** \`${pkg.name}\`
🆔 **Server ID:** \`#${serverResult.serverId}\` (\`${serverResult.serverIdentifier}\`)
🔌 **Alokasi Port:** \`${serverResult.port}\`
🌐 **Node Host:** \`pteronode.rullzyestorepremium.my.id\`

🔑 **KREDENSIAL PTERODACTYL PANEL:**
• **URL Panel:** \`${serverResult.panelUrl}\`
• **Username:** \`${pteroUser.username}\`
• **Email Akun:** \`${pteroUser.email}\`
${pteroUserData.generatedPassword ? `• **Password Login:** \`${pteroUserData.generatedPassword}\`\n` : ''}
━━━━━━━━━━━━━━━━━━━━
⚡ *Server sudah siap digunakan 24 jam nonstop! Klik tombol di bawah untuk membuka console:*`;

    try {
      await ctx.api.editMessageText(ctx.chat?.id || 0, loading.message_id, credsText, {
        parse_mode: 'Markdown',
        reply_markup: successKeyboard,
      });
    } catch {
      await ctx.reply(credsText, { parse_mode: 'Markdown', reply_markup: successKeyboard });
    }
  } catch (err: any) {
    // Refund balance if provisioning fails
    await db.addBalance(userId, pkg.price, 'Refund Gagal Buat Server');
    console.error('[PROVISION ERROR]', err);
    await ctx.reply(`❌ **Gagal Membuat Server:** ${err.message}\n\nSaldo Anda telah dikembalikan secara utuh. Silakan hubungi admin.`);
  }
}

export async function handleMyServers(ctx: Context): Promise<void> {
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
🔑 **Status Akun:** \`Terverifikasi 24/7\`

${
  servers.length === 0
    ? '_Anda belum memiliki server yang aktif. Beli paket server untuk memulai!_'
    : servers
        .map(
          (s, i) =>
            `${i + 1}. **${s.server_name}**\n   └ 🔌 Port: \`${s.port}\` • Durasi: \`${s.duration_days} Hari\` • Exp: \`${new Date(s.expires_at).toLocaleDateString('id-ID')}\`\n   └ 🆔 Identifier: \`${s.server_identifier}\``
        )
        .join('\n\n')
}

━━━━━━━━━━━━━━━━━━━━
👉 *Kelola file, console, dan start/restart server langsung dari Pterodactyl Panel.*`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }
  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}
