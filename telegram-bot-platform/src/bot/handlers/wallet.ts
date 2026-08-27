import { Context, InlineKeyboard } from 'grammy';
import { db } from '../../database/db.js';

export async function handleWalletMenu(ctx: Context): Promise<void> {
  const userId = ctx.from?.id || 0;
  let user = await db.getUser(userId);

  if (!user) {
    const reg = await db.registerUser(userId, ctx.from?.first_name, ctx.from?.username);
    user = reg.user;
  }

  const referralLink = `https://t.me/cinerestbot?start=ref_${userId}`;

  const keyboard = new InlineKeyboard()
    .text('💳 Top Up Saldo (QRIS Instan)', 'wallet_topup')
    .row()
    .text('👥 Bagikan Link Referral (Dapat Rp 2.000)', 'wallet_share_ref')
    .row()
    .text('🛒 Beli Server Pakai Saldo', 'menu_store')
    .row()
    .text('⬅️ Kembali ke Menu Utama', 'menu_main');

  const text = `💰 **DOMPET SALDO & REFERRAL ANDA**
━━━━━━━━━━━━━━━━━━━━
💵 **Saldo Aktif:** \`Rp ${user.balance.toLocaleString('id-ID')}\`
👥 **Teman Diundang:** \`${user.referral_count} Orang\`
🎁 **Total Bonus Referral:** \`Rp ${(user.referral_count * 2000).toLocaleString('id-ID')}\`

━━━━━━━━━━━━━━━━━━━━
🔗 **Link Referral Anda:**
\`${referralLink}\`

💡 **Program Bonus RullzyeStore:**
• Setiap teman yang mendaftar via link Anda, Anda mendapatkan **Rp 2.000 Saldo**.
• Teman Anda juga langsung mendapatkan saldo awal **Rp 1.000**.
• Saldo dapat digunakan untuk memotong harga atau sewa server gratis!`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
      await ctx.answerCallbackQuery();
      return;
    } catch {}
  }
  await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
}

export async function handleTopupOptions(ctx: Context): Promise<void> {
  const keyboard = new InlineKeyboard()
    .text('💵 + Rp 10.000', 'topup_val_10000')
    .text('💵 + Rp 25.000', 'topup_val_25000')
    .row()
    .text('💵 + Rp 50.000', 'topup_val_50000')
    .text('💵 + Rp 100.000', 'topup_val_100000')
    .row()
    .text('⬅️ Kembali ke Dompet', 'menu_wallet');

  const text = `💳 **TOP UP SALDO RULLZYESTORE**
━━━━━━━━━━━━━━━━━━━━
Pilih nominal saldo yang ingin Anda isi melalui QRIS (Semua E-Wallet / Mobile Banking):`;

  try {
    await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } catch {
    await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
  }
}

export async function handleTopupAction(ctx: Context, amount: number): Promise<void> {
  const userId = ctx.from?.id || 0;
  const newBalance = await db.addBalance(userId, amount);

  const keyboard = new InlineKeyboard()
    .text('🛒 Gunakan Saldo Sewa Server', 'menu_store')
    .row()
    .text('💰 Cek Saldo Sekarang', 'menu_wallet');

  const text = `✅ **TOP UP SALDO BERHASIL (SIMULASI QRIS)!**
━━━━━━━━━━━━━━━━━━━━
💵 **Nominal Top Up:** \`Rp ${amount.toLocaleString('id-ID')}\`
💳 **Metode:** \`QRIS Instant Settlement\`
💰 **Saldo Baru Anda:** \`Rp ${newBalance.toLocaleString('id-ID')}\`

Saldo Anda siap digunakan untuk membeli server bot WhatsApp, Telegram, atau Minecraft secara otomatis!`;

  try {
    await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } catch {
    await ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
  }
}
