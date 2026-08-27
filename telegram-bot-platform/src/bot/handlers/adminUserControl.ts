import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';
import { ALL_PACKAGES } from '../../data/packages300.js';
import { pterodactylService } from '../../services/pterodactylService.js';

export async function handleAdminUsersList(ctx: Context): Promise<void> {
  const users = await db.getAllUsers();

  const keyboard = new InlineKeyboard()
    .text('🔄 Refresh User List', 'admin_users')
    .row()
    .text('👑 Kembali ke Admin', 'admin_main');

  const text = `👥 **MANAJEMEN PENGGUNA (FULL USER CONTROL)**
━━━━━━━━━━━━━━━━━━━━
📊 **Total Terdaftar:** \`${users.length} Pengguna\`

${
  users.length === 0
    ? '_Belum ada pengguna terdaftar._'
    : users
        .slice(0, 10)
        .map(
          (u, i) =>
            `${i + 1}. **${u.first_name || 'User'}** (\`${u.telegram_id}\`)\n   💰 Saldo: \`Rp ${u.balance.toLocaleString('id-ID')}\` • Ref: \`${u.referral_count}\` • Panel: \`${u.ptero_username || 'None'}\``
        )
        .join('\n\n')
}

━━━━━━━━━━━━━━━━━━━━
⚙️ **Perintah Kontrol Pengguna:**
• \`/addsaldo <id> <nominal>\` - Tambah saldo user
• \`/minussaldo <id> <nominal>\` - Kurangi saldo user
• \`/userdetail <id>\` - Cek detail server & riwayat user
• \`/giveserver <id> <package_id>\` - Beri server gratis`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }
  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

export async function handleAdminAddSaldo(ctx: Context, matchStr: string): Promise<void> {
  const parts = matchStr.trim().split(/\s+/);
  if (parts.length < 2) {
    await ctx.reply('⚠️ Gunakan: `/addsaldo <telegram_id> <nominal>`\nContoh: `/addsaldo 7128038268 50000`', { parse_mode: 'Markdown' });
    return;
  }

  const targetId = parseInt(parts[0], 10);
  const amount = parseInt(parts[1], 10);

  if (isNaN(targetId) || isNaN(amount) || amount <= 0) {
    await ctx.reply('⚠️ Parameter ID atau nominal tidak valid.');
    return;
  }

  const user = await db.getUser(targetId);
  if (!user) {
    await ctx.reply(`❌ Pengguna dengan ID \`${targetId}\` tidak ditemukan di database.`);
    return;
  }

  const newBalance = await db.adjustBalanceAdmin(targetId, amount, 'Injeksi Saldo oleh Super Admin');

  // Notify target user
  try {
    await ctx.api.sendMessage(
      targetId,
      `🎁 **SALDO DITAMBAHKAN OLEH ADMIN!**\n\nNominal: **Rp ${amount.toLocaleString('id-ID')}**\nSaldo Sekarang: **Rp ${newBalance.toLocaleString('id-ID')}**\n\nTerima kasih telah menggunakan layanan RullzyeStore!`,
      { parse_mode: 'Markdown' }
    );
  } catch {}

  await ctx.reply(`✅ **BERHASIL MENAMBAHKAN SALDO!**\n\nPengguna: [${user.first_name || 'User'}](tg://user?id=${targetId}) (\`${targetId}\`)\nNominal: \`+Rp ${amount.toLocaleString('id-ID')}\`\nSaldo Baru: \`Rp ${newBalance.toLocaleString('id-ID')}\``, { parse_mode: 'Markdown' });
}

export async function handleAdminMinusSaldo(ctx: Context, matchStr: string): Promise<void> {
  const parts = matchStr.trim().split(/\s+/);
  if (parts.length < 2) {
    await ctx.reply('⚠️ Gunakan: `/minussaldo <telegram_id> <nominal>`\nContoh: `/minussaldo 7128038268 20000`', { parse_mode: 'Markdown' });
    return;
  }

  const targetId = parseInt(parts[0], 10);
  const amount = parseInt(parts[1], 10);

  if (isNaN(targetId) || isNaN(amount) || amount <= 0) {
    await ctx.reply('⚠️ Parameter ID atau nominal tidak valid.');
    return;
  }

  const user = await db.getUser(targetId);
  if (!user) {
    await ctx.reply(`❌ Pengguna dengan ID \`${targetId}\` tidak ditemukan di database.`);
    return;
  }

  const newBalance = await db.adjustBalanceAdmin(targetId, -amount, 'Pengurangan Saldo oleh Super Admin');

  await ctx.reply(`✅ **BERHASIL MENGURANGI SALDO!**\n\nPengguna: [${user.first_name || 'User'}](tg://user?id=${targetId}) (\`${targetId}\`)\nNominal: \`-Rp ${amount.toLocaleString('id-ID')}\`\nSaldo Baru: \`Rp ${newBalance.toLocaleString('id-ID')}\``, { parse_mode: 'Markdown' });
}

export async function handleAdminUserDetail(ctx: Context, matchStr: string): Promise<void> {
  const targetId = parseInt(matchStr.trim(), 10);
  if (isNaN(targetId)) {
    await ctx.reply('⚠️ Gunakan: `/userdetail <telegram_id>`', { parse_mode: 'Markdown' });
    return;
  }

  const user = await db.getUser(targetId);
  if (!user) {
    await ctx.reply(`❌ Pengguna dengan ID \`${targetId}\` tidak ditemukan.`);
    return;
  }

  const servers = await db.getUserServers(targetId);
  const txs = await db.getUserTransactions(targetId, 5);

  const text = `👤 **DETAIL PENGGUNA #${targetId}**
━━━━━━━━━━━━━━━━━━━━
• **Nama:** ${user.first_name || 'User'} (@${user.username || 'none'})
• **Saldo Dompet:** \`Rp ${user.balance.toLocaleString('id-ID')}\`
• **Total Referral:** \`${user.referral_count} Teman\`
• **Akun Pterodactyl:** \`${user.ptero_username || 'None'}\` (ID: \`${user.ptero_user_id || 'None'}\`)
• **Password Panel:** \`${user.ptero_password || 'Custom'}\`
• **Terdaftar Sejak:** \`${new Date(user.created_at).toLocaleString('id-ID')}\`

📦 **Server Aktif (${servers.length}):**
${
  servers.length === 0
    ? '_Tidak memiliki server aktif._'
    : servers.map(s => `• **${s.server_name}** (\`${s.server_identifier}\`) - Port: \`${s.port}\``).join('\n')
}

💸 **5 Transaksi Terakhir:**
${
  txs.length === 0
    ? '_Belum ada transaksi._'
    : txs.map(t => `• \`${t.created_at.toLocaleDateString()}\` [${t.type}]: Rp ${t.amount.toLocaleString('id-ID')} (${t.description})`).join('\n')
}`;

  await ctx.reply(text, { parse_mode: 'Markdown' });
}

export async function handleAdminGiveServer(ctx: Context, matchStr: string): Promise<void> {
  const parts = matchStr.trim().split(/\s+/);
  if (parts.length < 2) {
    await ctx.reply('⚠️ Gunakan: `/giveserver <telegram_id> <package_id>`\nContoh: `/giveserver 7128038268 wa-30d-t4`', { parse_mode: 'Markdown' });
    return;
  }

  const targetId = parseInt(parts[0], 10);
  const packageId = parts[1];

  const user = await db.getUser(targetId);
  if (!user) {
    await ctx.reply(`❌ Pengguna ID \`${targetId}\` tidak ditemukan.`);
    return;
  }

  const pkg = ALL_PACKAGES.find(p => p.id === packageId);
  if (!pkg) {
    await ctx.reply(`❌ Paket ID \`${packageId}\` tidak ditemukan di katalog.`);
    return;
  }

  const waitMsg = await ctx.reply(`⏳ **Sedang membuat server hadiah untuk user ${targetId}...**`, { parse_mode: 'Markdown' });

  try {
    const pteroData = await pterodactylService.getOrCreateUser(targetId, user.first_name || 'Customer', user.username);
    const pteroUser = pteroData.user;
    await db.savePteroCredentials(targetId, pteroUser.id, pteroUser.username, pteroData.generatedPassword);

    const srv = await pterodactylService.createServer(pteroUser.id, pkg, `[GIFT] ${pkg.name}`);
    const expiresAt = new Date(Date.now() + pkg.durationDays * 24 * 60 * 60 * 1000);

    await db.recordUserServer({
      telegram_id: targetId,
      server_id: srv.serverId,
      server_identifier: srv.serverIdentifier,
      server_name: srv.name,
      package_id: pkg.id,
      duration_days: pkg.durationDays,
      port: srv.port,
      status: 'active',
      expires_at: expiresAt,
    });

    // Notify user
    try {
      await ctx.api.sendMessage(
        targetId,
        `🎁 **SELAMAT! ANDA MENDAPATKAN SERVER GRATIS DARI ADMIN!**\n\n📦 **Paket:** \`${pkg.name}\`\n🔌 **Port:** \`${srv.port}\`\n🌐 **Panel:** \`${srv.panelUrl}\`\n👤 **Username:** \`${pteroUser.username}\`\n${pteroData.generatedPassword ? `🔑 **Password:** \`${pteroData.generatedPassword}\`\n` : ''}\nServer sudah aktif dan siap digunakan 24 jam!`,
        { parse_mode: 'Markdown' }
      );
    } catch {}

    await ctx.api.editMessageText(ctx.chat?.id || 0, waitMsg.message_id, `✅ **BERHASIL MEMBERIKAN SERVER HADIAH!**\n\nUser: \`${targetId}\`\nServer: \`${srv.name}\` (#${srv.serverId})\nPort: \`${srv.port}\``, { parse_mode: 'Markdown' });
  } catch (err: any) {
    await ctx.reply(`❌ **Gagal Memberikan Server:** ${err.message}`);
  }
}
