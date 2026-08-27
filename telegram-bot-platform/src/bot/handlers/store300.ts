import { Context, InlineKeyboard } from 'grammy';
import { ALL_300_PACKAGES, HostingPackage, PackageDuration } from '../../data/packages300.js';
import { db } from '../../database/db.js';
import { pterodactylService } from '../../services/pterodactylService.js';

export async function handleStore300Catalog(
  ctx: Context,
  duration: PackageDuration = '30d',
  category = 'whatsapp',
  page = 1
): Promise<void> {
  // Push toast notification on bottom
  if (ctx.callbackQuery) {
    try {
      const durName = duration === '7d' ? '7 Hari' : duration === '14d' ? '14 Hari' : '30 Hari';
      await ctx.answerCallbackQuery({
        text: `⚡ Memuat Katalog ${durName} (${category.toUpperCase()})...`,
        show_alert: false,
      });
    } catch {}
  }

  const filtered = ALL_300_PACKAGES.filter(p => p.duration === duration && p.category === category);
  const pageSize = 5;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));

  const startIdx = (safePage - 1) * pageSize;
  const currentPackages = filtered.slice(startIdx, startIdx + pageSize);

  const keyboard = new InlineKeyboard();

  // 1. Duration Tabs
  keyboard
    .text(duration === '7d' ? '• ⚡ 7 Hari •' : '⚡ 7 Hari', `s300_dur_7d_${category}_1`)
    .text(duration === '14d' ? '• 🔥 14 Hari •' : '🔥 14 Hari', `s300_dur_14d_${category}_1`)
    .text(duration === '30d' ? '• 🚀 30 Hari •' : '🚀 30 Hari', `s300_dur_30d_${category}_1`)
    .row();

  // 2. Category Tabs
  keyboard
    .text(category === 'whatsapp' ? '• 🟢 WA (25) •' : '🟢 WhatsApp', `s300_nav_${duration}_whatsapp_1`)
    .text(category === 'telegram' ? '• 🔵 TG (25) •' : '🔵 Telegram', `s300_nav_${duration}_telegram_1`)
    .row()
    .text(category === 'minecraft' ? '• ⛏️ Minecraft (25) •' : '⛏️ Minecraft', `s300_nav_${duration}_minecraft_1`)
    .text(category === 'vps' ? '• 🚀 Linux VPS (25) •' : '🚀 Linux VPS', `s300_nav_${duration}_vps_1`)
    .row();

  // 3. Product Plan Buttons
  currentPackages.forEach(p => {
    const ramLabel = p.ramMb >= 1024 ? `${p.ramMb / 1024} GB` : `${p.ramMb} MB`;
    keyboard
      .text(
        `📦 Tier ${p.tier} (${ramLabel}) — Rp ${p.price.toLocaleString('id-ID')} [${p.badge}]`,
        `s300_detail_${p.id}`
      )
      .row();
  });

  // 4. Pagination Controls
  if (safePage > 1) {
    keyboard.text('⬅️ Sebelumnya', `s300_nav_${duration}_${category}_${safePage - 1}`);
  }
  keyboard.text(`📄 ${safePage}/${totalPages}`, 'noop');
  if (safePage < totalPages) {
    keyboard.text('Selanjutnya ➡️', `s300_nav_${duration}_${category}_${safePage + 1}`);
  }

  // 5. Mini App & Main Menu
  keyboard
    .row()
    .url('🌐 Buka Mini App Canvas 🚀', 'https://rullzyestorepremium.my.id')
    .row()
    .text('🏠 Menu Utama', 'menu_main');

  const durLabel = duration === '7d' ? '⚡ 7 HARI (TRIAL / MINGGUAN)' : duration === '14d' ? '🔥 14 HARI (2 MINGGU)' : '🚀 30 HARI (BULANAN)';
  const catLabel = category === 'whatsapp' ? '🟢 BOT WHATSAPP (BAILEYS)' : category === 'telegram' ? '🔵 BOT TELEGRAM (PYTHON/NODE)' : category === 'minecraft' ? '⛏️ MINECRAFT JAVA EDITION' : '🚀 LINUX VPS CONTAINER';

  const text = `🛒 **KATALOG SERVER HOSTING RULLZYESTORE**
━━━━━━━━━━━━━━━━━━━━
⏱️ **Durasi Sewa:** **${durLabel}**
📂 **Kategori:** **${catLabel}**
📄 **Halaman:** \`${safePage} dari ${totalPages}\`

${currentPackages
  .map(
    p =>
      `• **${p.name}** [${p.badge}]\n  💰 \`Rp ${p.price.toLocaleString('id-ID')}/${p.durationLabel}\` | ⚙️ RAM: \`${p.ramMb >= 1024 ? `${p.ramMb / 1024}GB` : `${p.ramMb}MB`}\` • CPU: \`${p.cpuPercent}%\` • Disk: \`${p.diskGb}GB\`\n  _${p.description}_`
  )
  .join('\n\n')}

━━━━━━━━━━━━━━━━━━━━
💡 *Pilih salah satu tier paket di atas untuk melihat detail lengkap & sewa otomatis:*`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      return;
    } catch {}
  }
  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

export async function handlePackage300Detail(ctx: Context, packageId: string): Promise<void> {
  const pkg = ALL_300_PACKAGES.find(p => p.id === packageId);
  if (!pkg) {
    await ctx.reply('⚠️ Paket hosting tidak ditemukan.');
    return;
  }

  const userId = ctx.from?.id || 0;
  const user = await db.getUser(userId);
  const balance = user?.balance || 0;

  const checkoutUrl = `https://rullzyestorepremium.my.id/checkout?plan=${pkg.id}`;

  const keyboard = new InlineKeyboard()
    .text(`💰 Bayar Pakai Saldo (Saldo: Rp ${balance.toLocaleString('id-ID')})`, `s300_buysaldo_${pkg.id}`)
    .row()
    .url('💳 Bayar Instan via QRIS / VA Otomatis', checkoutUrl)
    .row()
    .text('⬅️ Kembali ke Daftar Paket', `s300_nav_${pkg.duration}_${pkg.category}_1`);

  const ramLabel = pkg.ramMb >= 1024 ? `${pkg.ramMb / 1024} GB (${pkg.ramMb} MB)` : `${pkg.ramMb} MB`;

  const text = `📦 **DETAIL PAKET HOSTING: ${pkg.name.toUpperCase()}**
━━━━━━━━━━━━━━━━━━━━
🏷️ **Kategori:** \`${pkg.category.toUpperCase()}\`
⏱️ **Durasi Sewa:** \`${pkg.durationLabel}\`
💰 **Biaya Sewa:** \`Rp ${pkg.price.toLocaleString('id-ID')}\`

⚙️ **Spesifikasi Lengkap:**
• **Alokasi RAM:** \`${ramLabel}\`
• **Limit CPU:** \`${pkg.cpuPercent}% vCPU Core\`
• **NVMe Storage:** \`${pkg.diskGb} GB High Speed\`
• **Port Publik:** \`Gratis 1 Port Alokasi Dedikasi\`
• **Docker Container:** \`${pkg.dockerImage}\`

🛡️ **Keunggulan Layanan:**
• ✅ Auto-Restart saat bot crash 24/7
• ✅ Web Console Pterodactyl & SFTP File Manager
• ✅ Proteksi Anti-DDoS 100 Gbps Datacenter Jakarta
• ✅ Deployment Instan Otomatis (0.15 Detik)

━━━━━━━━━━━━━━━━━━━━
💡 *Silakan pilih metode pembayaran di bawah untuk aktivasi instan:*`;

  try {
    await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } catch {
    await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
  }
}

export async function handleBuy300WithBalance(ctx: Context, packageId: string): Promise<void> {
  const pkg = ALL_300_PACKAGES.find(p => p.id === packageId);
  if (!pkg) return;

  const userId = ctx.from?.id || 0;
  const user = await db.getUser(userId);

  if (!user || user.balance < pkg.price) {
    const keyboard = new InlineKeyboard()
      .text('💳 Top Up Saldo Sekarang', 'wallet_topup')
      .row()
      .url('📲 Bayar via QRIS Langsung', `https://rullzyestorepremium.my.id/checkout?plan=${pkg.id}`)
      .row()
      .text('⬅️ Kembali', `s300_detail_${pkg.id}`);

    await ctx.reply(
      `⚠️ **Saldo Tidak Mencukupi!**\n\nHarga Paket: \`Rp ${pkg.price.toLocaleString('id-ID')}\`\nSaldo Anda: \`Rp ${(user?.balance || 0).toLocaleString('id-ID')}\`\n\nSilakan Top Up saldo Anda atau bayar langsung via QRIS.`,
      { parse_mode: 'Markdown', reply_markup: keyboard }
    );
    return;
  }

  // Deduct balance
  await db.deductBalance(userId, pkg.price, `Sewa Server ${pkg.name}`);

  // Send toast loading notification
  if (ctx.callbackQuery) {
    try {
      await ctx.answerCallbackQuery({
        text: '🚀 Menghubungkan ke Pterodactyl Node & Membuat Container...',
        show_alert: false,
      });
    } catch {}
  }

  const loading = await ctx.reply('⏳ **Sedang membuat server otomatis di Pterodactyl Panel... [🟩🟩🟩▫️▫️]**', { parse_mode: 'Markdown' });

  try {
    // 1. Get or Create User Account on Pterodactyl (Guarantees Known Password)
    const pteroUserData = await pterodactylService.getOrCreateUser(userId, ctx.from?.first_name || 'User', ctx.from?.username);
    const pteroUser = pteroUserData.user;
    const password = pteroUserData.generatedPassword;

    // 2. Provision Container Server on Node-Main-01
    const serverResult = await pterodactylService.createServer(pteroUser.id, pkg, `${pkg.name} - ${ctx.from?.first_name || 'Server'}`);

    // Calculate expiry date
    const expiresAt = new Date(Date.now() + pkg.durationDays * 24 * 60 * 60 * 1000);

    // 3. Record Server in DB
    await db.recordUserServer({
      telegram_id: userId,
      server_id: serverResult.serverId,
      server_identifier: serverResult.serverIdentifier,
      server_name: serverResult.name,
      package_id: pkg.id,
      duration_days: pkg.durationDays,
      port: serverResult.port,
      status: 'active',
      expires_at: expiresAt,
    });

    const successKeyboard = new InlineKeyboard()
      .url('💻 BUKA PTERODACTYL PANEL', serverResult.panelUrl)
      .row()
      .text('📦 Layanan & Server Saya', 'menu_my_servers')
      .row()
      .text('🏠 Menu Utama', 'menu_main');

    const credsText = `🎉 **SERVER ANDA BERHASIL DIAKTIFKAN OTOMATIS!**
━━━━━━━━━━━━━━━━━━━━
📦 **Paket:** \`${pkg.name}\`
⏱️ **Durasi Aktif:** \`${pkg.durationDays} Hari\` (Exp: \`${expiresAt.toLocaleDateString('id-ID')}\`)
🆔 **Server ID:** \`#${serverResult.serverId}\` (\`${serverResult.serverIdentifier}\`)
🔌 **Alokasi Port:** \`${serverResult.port}\`
🌐 **Node Host:** \`pteronode.rullzyestorepremium.my.id\`

🔑 **KREDENSIAL LOGIN PTERODACTYL PANEL:**
• 🌐 **URL Panel:** \`${serverResult.panelUrl}\`
• 👤 **Username:** \`${pteroUser.username}\`
• 📧 **Email Akun:** \`${pteroUser.email}\`
• 🔐 **Password Login:** \`${password}\`
━━━━━━━━━━━━━━━━━━━━
👉 **PANDUAN MASUK KE PANEL:**
1. Klik tombol **💻 BUKA PTERODACTYL PANEL** di bawah.
2. Masukkan **Username** (\`${pteroUser.username}\`) dan **Password** (\`${password}\`).
3. Anda langsung dapat mengelola console, upload file bot, dan start server 24/7!`;

    try {
      await ctx.api.editMessageText(ctx.chat?.id || 0, loading.message_id, credsText, {
        parse_mode: 'Markdown',
        reply_markup: successKeyboard,
      });
    } catch {
      await ctx.reply(credsText, { parse_mode: 'Markdown', reply_markup: successKeyboard });
    }
  } catch (err: any) {
    // Refund balance if error occurs
    await db.addBalance(userId, pkg.price, 'Refund Gagal Buat Server');
    console.error('[PROVISION ERROR]', err);
    await ctx.reply(`❌ **Gagal Membuat Server:** ${err.message}\n\nSaldo Anda telah dikembalikan secara utuh.`);
  }
}
