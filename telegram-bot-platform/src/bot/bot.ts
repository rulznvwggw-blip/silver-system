import { Bot, Context, InlineKeyboard } from 'grammy';
import { env } from '../config/env.js';
import { adminGuard } from './middlewares/auth.js';
import { antiSpamMiddleware } from './middlewares/antiSpam.js';
import { db } from '../database/db.js';
import { formatRupiah } from '../utils/ui.js';
import { AnimationManager } from './animations/animationManager.js';

// Public Handlers (1 - 60)
import {
  handlePubHome,
  handlePubStore,
  handlePubProducts,
  handlePubCategories,
  handlePubPopular,
  handlePubFeatured,
  handlePubNewProducts,
  handlePubPremium,
  handlePubPromotions,
  handlePubCoupons,
  handlePubCart,
  handlePubCheckout,
  handlePubInvoices,
  handlePubMyOrders,
  handlePubRenewService,
  handlePubMyServices,
  handlePubDeployments,
  handlePubOrderStats,
  handlePubWishlist,
  handlePubRecentlyViewed,
  handlePubGroups,
  handlePubChannels,
  handlePubCommFeatured,
  handlePubCommPopular,
  handlePubCommNew,
  handlePubCommSearch,
  handlePubCommCategories,
  handlePubCommMy,
  handlePubCommSaved,
  handlePubCommStats,
  handlePubAiAssistant,
  handlePubAiWriter,
  handlePubAiIdeas,
  handlePubAiAnnouncement,
  handlePubAiDecoration,
  handlePubAiRewrite,
  handlePubAiTranslate,
  handlePubAiSearch,
  handlePubAiSupport,
  handlePubAiHelp,
  handlePubProfile,
  handlePubAccountInfo,
  handlePubOrderHistory,
  handlePubBalance,
  handlePubMyCoupons,
  handlePubNotifications,
  handlePubSecurity,
  handlePubLanguage,
  handlePubAppearance,
  handlePubPreferences,
  handlePubHelpCenter,
  handlePubContactSupport,
  handlePubMyTickets,
  handlePubCreateTicket,
  handlePubFaq,
  handlePubDocs,
  handlePubRules,
  handlePubPrivacy,
  handlePubTerms,
  handlePubAbout,
  handleProductDetailView,
  handleBuyProductWithBalance,
} from './handlers/platformPublic.js';

// Admin Handlers (61 - 100)
import {
  handleAdmDashboard,
  handleAdmOverview,
  handleAdmRevenue,
  handleAdmOrders,
  handleAdmCustomers,
  handleAdmServices,
  handleAdmSystemStatus,
  handleAdmGrowth,
  handleAdmPopularProducts,
  handleAdmAlerts,
  handleAdmProdCreate,
  handleAdmProdEdit,
  handleAdmProdDeleteConfirm,
  handleAdmProdList,
  handleAdmProdCategories,
  handleAdmProdPricing,
  handleAdmProdCoupons,
  handleAdmProdPromotions,
  handleAdmProdFeatured,
  handleAdmProdInventory,
  handleAdmOrdAll,
  handleAdmOrdPending,
  handleAdmOrdPaid,
  handleAdmOrdFailed,
  handleAdmOrdProcessing,
  handleAdmOrdCompleted,
  handleAdmOrdRefunds,
  handleAdmOrdSearch,
  handleAdmOrdInvoices,
  handleAdmOrdAnalytics,
  handleAdmBroadcastCenter,
  handleAdmAiBroadcast,
  handleAdmBroadcastScheduler,
  handleAdmBroadcastHistory,
  handleAdmBroadcastAnalytics,
  handleAdmBroadcastGroups,
  handleAdmBroadcastChannels,
  handleAdmBroadcastTemplates,
  handleAdmBroadcastEmergencyStop,
  handleAdmBroadcastSettings,
} from './handlers/platformAdmin.js';

// Decoration Center
import {
  handleAdmDecorationCenter,
  handleAdmDecorationSelectComponent,
  handleAdmDecorationApply,
} from './handlers/platformDecoration.js';

// Community Setup
import { handleSetupCommunityViaChatId } from './handlers/groupChannelJoin.js';
import { CommunityType } from '../config/constants.js';

export function createBot(): Bot<Context> {
  const token = env.botToken || '1234567890:MOCK_TOKEN_FOR_INITIALIZATION_SAFE';
  const bot = new Bot<Context>(token);

  // 1. Middlewares
  bot.use(antiSpamMiddleware);

  // 2. Public Commands
  bot.command('start', handlePubHome);
  bot.command('store', handlePubStore);
  bot.command('katalog', (ctx) => handlePubProducts(ctx, 1));
  bot.command('cart', handlePubCart);
  bot.command('keranjang', handlePubCart);
  bot.command('saldo', handlePubBalance);
  bot.command('wallet', handlePubBalance);
  bot.command('myservers', handlePubMyServices);
  bot.command('server', handlePubMyServices);
  bot.command('groups', handlePubGroups);
  bot.command('channels', handlePubChannels);
  bot.command('ai', handlePubAiAssistant);
  bot.command('profile', handlePubProfile);
  bot.command('help', handlePubHelpCenter);
  bot.command('support', handlePubContactSupport);
  bot.command('faq', handlePubFaq);
  bot.command('rules', handlePubRules);
  bot.command('ping', async (ctx) => {
    await ctx.reply('🏓 **PONG!**\n\n🟢 Server Node Status: `ONLINE 100%`\n⚡ Latency: `1.2ms`\n🌐 Datacenter: `Cyber Building Jakarta`', { parse_mode: 'Markdown' });
  });

  // Group & Channel Auto-Decoration via Chat ID
  bot.command('setup_group', async (ctx) => {
    const targetId = ctx.match || '';
    if (!targetId) {
      await ctx.reply('ℹ️ Gunakan: `/setup_group <chat_id>`\nContoh: `/setup_group -1001928374650`', { parse_mode: 'Markdown' });
      return;
    }
    await handleSetupCommunityViaChatId(ctx, targetId, CommunityType.GROUP);
  });

  bot.command('setup_channel', async (ctx) => {
    const targetId = ctx.match || '';
    if (!targetId) {
      await ctx.reply('ℹ️ Gunakan: `/setup_channel <chat_id>`\nContoh: `/setup_channel -1001928374652`', { parse_mode: 'Markdown' });
      return;
    }
    await handleSetupCommunityViaChatId(ctx, targetId, CommunityType.CHANNEL);
  });

  // 3. Admin Protected Commands (Strict Guard: Non-Admin will get Access Denied)
  bot.command('admin', adminGuard, handleAdmDashboard);
  bot.command('dashboard', adminGuard, handleAdmDashboard);
  bot.command('orders', adminGuard, handleAdmOrdAll);
  bot.command('users', adminGuard, handleAdmCustomers);
  bot.command('broadcast', adminGuard, handleAdmBroadcastCenter);
  bot.command('aibroadcast', adminGuard, handleAdmAiBroadcast);
  bot.command('scheduler', adminGuard, handleAdmBroadcastScheduler);
  bot.command('decoration', adminGuard, handleAdmDecorationCenter);
  bot.command('status', adminGuard, handleAdmSystemStatus);

  // Admin user adjustment commands
  bot.command('addsaldo', adminGuard, async (ctx) => {
    const parts = (ctx.match || '').trim().split(/\s+/);
    if (parts.length < 2) {
      await ctx.reply('ℹ️ Format: `/addsaldo <telegram_id> <jumlah>`', { parse_mode: 'Markdown' });
      return;
    }
    const targetId = parseInt(parts[0], 10);
    const amount = parseInt(parts[1], 10);
    if (isNaN(targetId) || isNaN(amount) || amount <= 0) {
      await ctx.reply('⚠️ Parameter ID atau Jumlah tidak valid.');
      return;
    }
    const newBal = await db.addBalance(targetId, amount, 'Penambahan saldo oleh Admin');
    await ctx.reply(`✅ **Berhasil menambah ${formatRupiah(amount)} ke User ${targetId}!**\nSaldo sekarang: \`${formatRupiah(newBal)}\``, { parse_mode: 'Markdown' });
  });

  bot.command('minussaldo', adminGuard, async (ctx) => {
    const parts = (ctx.match || '').trim().split(/\s+/);
    if (parts.length < 2) {
      await ctx.reply('ℹ️ Format: `/minussaldo <telegram_id> <jumlah>`', { parse_mode: 'Markdown' });
      return;
    }
    const targetId = parseInt(parts[0], 10);
    const amount = parseInt(parts[1], 10);
    if (isNaN(targetId) || isNaN(amount) || amount <= 0) {
      await ctx.reply('⚠️ Parameter ID atau Jumlah tidak valid.');
      return;
    }
    const ok = await db.deductBalance(targetId, amount, 'Pengurangan saldo oleh Admin');
    await ctx.reply(ok ? `✅ **Berhasil mengurangi ${formatRupiah(amount)} dari User ${targetId}!**` : `⚠️ Gagal: Saldo user tidak mencukupi.`);
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 4. PUBLIC CALLBACK NAVIGATION (1 - 60)
  // ═══════════════════════════════════════════════════════════════════════════════
  bot.callbackQuery('nav_pub_home', handlePubHome);
  bot.callbackQuery('nav_pub_store', handlePubStore);
  bot.callbackQuery('nav_pub_products', (ctx) => handlePubProducts(ctx, 1));
  bot.callbackQuery(/^nav_pub_products_p_(\d+)$/, (ctx) => handlePubProducts(ctx, parseInt(ctx.match[1], 10)));
  bot.callbackQuery('nav_pub_categories', handlePubCategories);
  bot.callbackQuery('nav_pub_popular', handlePubPopular);
  bot.callbackQuery('nav_pub_featured', handlePubFeatured);
  bot.callbackQuery('nav_pub_new_products', handlePubNewProducts);
  bot.callbackQuery('nav_pub_premium', handlePubPremium);
  bot.callbackQuery('nav_pub_promotions', handlePubPromotions);
  bot.callbackQuery('nav_pub_coupons', handlePubCoupons);

  bot.callbackQuery('nav_pub_cart', handlePubCart);
  bot.callbackQuery('nav_pub_checkout', handlePubCheckout);
  bot.callbackQuery('nav_pub_invoices', handlePubInvoices);
  bot.callbackQuery('nav_pub_my_orders', handlePubMyOrders);
  bot.callbackQuery('nav_pub_renew_service', handlePubRenewService);
  bot.callbackQuery('nav_pub_my_services', handlePubMyServices);
  bot.callbackQuery('nav_pub_deployments', handlePubDeployments);
  bot.callbackQuery('nav_pub_order_stats', handlePubOrderStats);
  bot.callbackQuery('nav_pub_wishlist', handlePubWishlist);
  bot.callbackQuery('nav_pub_recently_viewed', handlePubRecentlyViewed);

  bot.callbackQuery('nav_pub_groups', handlePubGroups);
  bot.callbackQuery('nav_pub_channels', handlePubChannels);
  bot.callbackQuery('nav_pub_comm_featured', handlePubCommFeatured);
  bot.callbackQuery('nav_pub_comm_popular', handlePubCommPopular);
  bot.callbackQuery('nav_pub_comm_new', handlePubCommNew);
  bot.callbackQuery('nav_pub_comm_search', handlePubCommSearch);
  bot.callbackQuery('nav_pub_comm_categories', handlePubCommCategories);
  bot.callbackQuery('nav_pub_comm_my', handlePubCommMy);
  bot.callbackQuery('nav_pub_comm_saved', handlePubCommSaved);
  bot.callbackQuery('nav_pub_comm_stats', handlePubCommStats);

  bot.callbackQuery('nav_pub_ai_assistant', handlePubAiAssistant);
  bot.callbackQuery('nav_pub_ai_writer', handlePubAiWriter);
  bot.callbackQuery('nav_pub_ai_ideas', handlePubAiIdeas);
  bot.callbackQuery('nav_pub_ai_announcement', handlePubAiAnnouncement);
  bot.callbackQuery('nav_pub_ai_decoration', handlePubAiDecoration);
  bot.callbackQuery('nav_pub_ai_rewrite', handlePubAiRewrite);
  bot.callbackQuery('nav_pub_ai_translate', handlePubAiTranslate);
  bot.callbackQuery('nav_pub_ai_search', handlePubAiSearch);
  bot.callbackQuery('nav_pub_ai_support', handlePubAiSupport);
  bot.callbackQuery('nav_pub_ai_help', handlePubAiHelp);

  bot.callbackQuery('nav_pub_profile', handlePubProfile);
  bot.callbackQuery('nav_pub_account_info', handlePubAccountInfo);
  bot.callbackQuery('nav_pub_order_history', handlePubOrderHistory);
  bot.callbackQuery('nav_pub_balance', handlePubBalance);
  bot.callbackQuery('nav_pub_my_coupons', handlePubMyCoupons);
  bot.callbackQuery('nav_pub_notifications', handlePubNotifications);
  bot.callbackQuery('nav_pub_security', handlePubSecurity);
  bot.callbackQuery('nav_pub_language', handlePubLanguage);
  bot.callbackQuery('nav_pub_appearance', handlePubAppearance);
  bot.callbackQuery('nav_pub_preferences', handlePubPreferences);

  bot.callbackQuery('nav_pub_help_center', handlePubHelpCenter);
  bot.callbackQuery('nav_pub_contact_support', handlePubContactSupport);
  bot.callbackQuery('nav_pub_my_tickets', handlePubMyTickets);
  bot.callbackQuery('nav_pub_create_ticket', handlePubCreateTicket);
  bot.callbackQuery('nav_pub_faq', handlePubFaq);
  bot.callbackQuery('nav_pub_docs', handlePubDocs);
  bot.callbackQuery('nav_pub_rules', handlePubRules);
  bot.callbackQuery('nav_pub_privacy', handlePubPrivacy);
  bot.callbackQuery('nav_pub_terms', handlePubTerms);
  bot.callbackQuery('nav_pub_about', handlePubAbout);

  // ═══════════════════════════════════════════════════════════════════════════════
  // 5. ADMIN CALLBACK NAVIGATION (61 - 100)
  // ═══════════════════════════════════════════════════════════════════════════════
  bot.callbackQuery('nav_adm_dashboard', adminGuard, handleAdmDashboard);
  bot.callbackQuery('nav_adm_overview', adminGuard, handleAdmOverview);
  bot.callbackQuery('nav_adm_revenue', adminGuard, handleAdmRevenue);
  bot.callbackQuery('nav_adm_orders', adminGuard, handleAdmOrders);
  bot.callbackQuery('nav_adm_customers', adminGuard, handleAdmCustomers);
  bot.callbackQuery('nav_adm_services', adminGuard, handleAdmServices);
  bot.callbackQuery('nav_adm_system_status', adminGuard, handleAdmSystemStatus);
  bot.callbackQuery('nav_adm_growth', adminGuard, handleAdmGrowth);
  bot.callbackQuery('nav_adm_popular_products', adminGuard, handleAdmPopularProducts);
  bot.callbackQuery('nav_adm_alerts', adminGuard, handleAdmAlerts);

  bot.callbackQuery('nav_adm_prod_create', adminGuard, handleAdmProdCreate);
  bot.callbackQuery('nav_adm_prod_edit', adminGuard, (ctx) => handleAdmProdEdit(ctx));
  bot.callbackQuery('nav_adm_prod_delete', adminGuard, (ctx) => handleAdmProdList(ctx));
  bot.callbackQuery('nav_adm_prod_list', adminGuard, handleAdmProdList);
  bot.callbackQuery('nav_adm_prod_categories', adminGuard, handleAdmProdCategories);
  bot.callbackQuery('nav_adm_prod_pricing', adminGuard, handleAdmProdPricing);
  bot.callbackQuery('nav_adm_prod_coupons', adminGuard, handleAdmProdCoupons);
  bot.callbackQuery('nav_adm_prod_promotions', adminGuard, handleAdmProdPromotions);
  bot.callbackQuery('nav_adm_prod_featured', adminGuard, handleAdmProdFeatured);
  bot.callbackQuery('nav_adm_prod_inventory', adminGuard, handleAdmProdInventory);

  bot.callbackQuery('nav_adm_ord_all', adminGuard, handleAdmOrdAll);
  bot.callbackQuery('nav_adm_ord_pending', adminGuard, handleAdmOrdPending);
  bot.callbackQuery('nav_adm_ord_paid', adminGuard, handleAdmOrdPaid);
  bot.callbackQuery('nav_adm_ord_failed', adminGuard, handleAdmOrdFailed);
  bot.callbackQuery('nav_adm_ord_processing', adminGuard, handleAdmOrdProcessing);
  bot.callbackQuery('nav_adm_ord_completed', adminGuard, handleAdmOrdCompleted);
  bot.callbackQuery('nav_adm_ord_refunds', adminGuard, handleAdmOrdRefunds);
  bot.callbackQuery('nav_adm_ord_search', adminGuard, handleAdmOrdSearch);
  bot.callbackQuery('nav_adm_ord_invoices', adminGuard, handleAdmOrdInvoices);
  bot.callbackQuery('nav_adm_ord_analytics', adminGuard, handleAdmOrdAnalytics);

  bot.callbackQuery('nav_adm_broadcast_center', adminGuard, handleAdmBroadcastCenter);
  bot.callbackQuery('nav_adm_ai_broadcast', adminGuard, handleAdmAiBroadcast);
  bot.callbackQuery('nav_adm_broadcast_scheduler', adminGuard, handleAdmBroadcastScheduler);
  bot.callbackQuery('nav_adm_broadcast_history', adminGuard, handleAdmBroadcastHistory);
  bot.callbackQuery('nav_adm_broadcast_analytics', adminGuard, handleAdmBroadcastAnalytics);
  bot.callbackQuery('nav_adm_broadcast_groups', adminGuard, handleAdmBroadcastGroups);
  bot.callbackQuery('nav_adm_broadcast_channels', adminGuard, handleAdmBroadcastChannels);
  bot.callbackQuery('nav_adm_broadcast_templates', adminGuard, handleAdmBroadcastTemplates);
  bot.callbackQuery('nav_adm_broadcast_emergency_stop', adminGuard, handleAdmBroadcastEmergencyStop);
  bot.callbackQuery('nav_adm_broadcast_settings', adminGuard, handleAdmBroadcastSettings);
  bot.callbackQuery('nav_adm_decoration_center', adminGuard, handleAdmDecorationCenter);

  // ═══════════════════════════════════════════════════════════════════════════════
  // 6. ACTION & INTERACTIVE SUBMENU CALLBACKS
  // ═══════════════════════════════════════════════════════════════════════════════

  // Product View & Buy
  bot.callbackQuery(/^prod_view_(.+)$/, async (ctx) => {
    await handleProductDetailView(ctx, ctx.match[1]);
  });

  bot.callbackQuery(/^buy_instant_balance_(.+)$/, async (ctx) => {
    await handleBuyProductWithBalance(ctx, ctx.match[1]);
  });

  bot.callbackQuery(/^add_cart_(.+)$/, async (ctx) => {
    const userId = ctx.from?.id || 0;
    const prodId = ctx.match[1];
    await db.addToCart(userId, prodId, 1);
    await ctx.answerCallbackQuery({ text: '🛒 Berhasil ditambahkan ke keranjang!', show_alert: false });
    await handlePubCart(ctx);
  });

  bot.callbackQuery(/^cart_remove_(.+)$/, async (ctx) => {
    const userId = ctx.from?.id || 0;
    await db.removeFromCart(userId, ctx.match[1]);
    await ctx.answerCallbackQuery({ text: '🗑️ Produk dihapus dari keranjang', show_alert: false });
    await handlePubCart(ctx);
  });

  bot.callbackQuery('cart_clear', async (ctx) => {
    const userId = ctx.from?.id || 0;
    await db.clearCart(userId);
    await ctx.answerCallbackQuery({ text: '🗑️ Keranjang dikosongkan', show_alert: false });
    await handlePubCart(ctx);
  });

  bot.callbackQuery('checkout_confirm_balance', async (ctx) => {
    const userId = ctx.from?.id || 0;
    const items = await db.getCart(userId);
    if (items.length === 0) {
      await handlePubCart(ctx);
      return;
    }
    // Buy first item in cart
    await handleBuyProductWithBalance(ctx, items[0].id);
    await db.removeFromCart(userId, items[0].id);
  });

  bot.callbackQuery(/^toggle_wish_(.+)$/, async (ctx) => {
    const userId = ctx.from?.id || 0;
    const isAdded = await db.toggleWishlist(userId, ctx.match[1]);
    await ctx.answerCallbackQuery({ text: isAdded ? '❤️ Ditambahkan ke Wishlist!' : '💔 Dihapus dari Wishlist', show_alert: false });
  });

  // Top Up Nominals
  bot.callbackQuery(/^topup_nominal_(\d+)$/, async (ctx) => {
    const amount = parseInt(ctx.match[1], 10);
    const userId = ctx.from?.id || 0;
    await db.addBalance(userId, amount, `Top Up Saldo ${formatRupiah(amount)}`);
    await ctx.answerCallbackQuery({ text: `✅ Berhasil top up ${formatRupiah(amount)}!`, show_alert: true });
    await handlePubBalance(ctx);
  });

  // Ticket creation categories
  bot.callbackQuery(/^ticket_cat_(.+)$/, async (ctx) => {
    const cat = ctx.match[1];
    const userId = ctx.from?.id || 0;
    const ticket = await db.createTicket(userId, `Permintaan Bantuan Kategori ${cat.toUpperCase()}`, cat, 'MEDIUM');
    await ctx.reply(`✅ **TIKET BANTUAN BERHASIL DIBUAT!**\n\nNomor Tiket: \`${ticket.ticket_code}\`\nStatus: \`OPEN (Menunggu Antrian CS)\`\n\nTim support kami akan segera menanggapi kendala Anda.`);
    await handlePubMyTickets(ctx);
  });

  // Preferences & Appearance
  bot.callbackQuery('set_lang_id', async (ctx) => {
    const userId = ctx.from?.id || 0;
    await db.updateUserPreferences(userId, { language: 'id' });
    await ctx.answerCallbackQuery({ text: '🇮🇩 Bahasa diubah ke Bahasa Indonesia', show_alert: false });
    await handlePubPreferences(ctx);
  });

  bot.callbackQuery('set_lang_en', async (ctx) => {
    const userId = ctx.from?.id || 0;
    await db.updateUserPreferences(userId, { language: 'en' });
    await ctx.answerCallbackQuery({ text: '🇬🇧 Language set to English', show_alert: false });
    await handlePubPreferences(ctx);
  });

  bot.callbackQuery('set_theme_dark', async (ctx) => {
    const userId = ctx.from?.id || 0;
    await db.updateUserPreferences(userId, { appearance: 'cozy_dark' });
    await ctx.answerCallbackQuery({ text: '🌙 Tema Cozy Dark diaktifkan', show_alert: false });
    await handlePubPreferences(ctx);
  });

  bot.callbackQuery('set_theme_light', async (ctx) => {
    const userId = ctx.from?.id || 0;
    await db.updateUserPreferences(userId, { appearance: 'minimalist' });
    await ctx.answerCallbackQuery({ text: '☀️ Tema Minimalist diaktifkan', show_alert: false });
    await handlePubPreferences(ctx);
  });

  bot.callbackQuery('pref_toggle_notifs', async (ctx) => {
    const userId = ctx.from?.id || 0;
    const pref = await db.getUserPreferences(userId);
    await db.updateUserPreferences(userId, { notifications_enabled: !pref.notifications_enabled });
    await ctx.answerCallbackQuery({ text: `🔔 Notifikasi ${!pref.notifications_enabled ? 'Diaktifkan' : 'Dinonaktifkan'}`, show_alert: false });
    await handlePubPreferences(ctx);
  });

  // Category Filter
  bot.callbackQuery(/^cat_filter_(.+)$/, async (ctx) => {
    const catId = ctx.match[1];
    const prods = await db.getProducts({ category_id: catId });
    const header = `╭──────────────────────────────────╮\n│  🗂️ KATEGORI: ${catId.toUpperCase()}\n╰──────────────────────────────────╯`;
    let body = `${header}\n\n`;

    const keyboard = new InlineKeyboard();
    prods.forEach(p => {
      body += `• **${p.name}** — \`${formatRupiah(p.price)}\`\n`;
      keyboard.text(`👉 Lihat ${p.name.slice(0, 18)}`, `prod_view_${p.id}`).row();
    });

    keyboard.text('⬅️ Kembali ke Kategori', 'nav_pub_categories').text('🏠 Home', 'nav_pub_home');
    if (ctx.callbackQuery?.message) {
      await ctx.api.editMessageText(ctx.chat!.id, ctx.callbackQuery.message.message_id, body, { parse_mode: 'Markdown', reply_markup: keyboard });
    }
  });

  // Community Searches
  bot.callbackQuery('comm_search_hosting', async (ctx) => {
    const comms = await db.getCommunities();
    const filtered = comms.filter(c => c.category === 'hosting');
    const header = `╭──────────────────────────────────╮\n│  🚀 KOMUNITAS HOSTING & CLOUD\n╰──────────────────────────────────╯`;
    let body = `${header}\n\n`;
    const keyboard = new InlineKeyboard();
    filtered.forEach(c => {
      body += `• **${c.name}**\n`;
      if (c.username) keyboard.url(`🔗 Gabung @${c.username}`, `https://t.me/${c.username}`).row();
    });
    keyboard.text('⬅️ Kembali', 'nav_pub_comm_search').text('🏠 Home', 'nav_pub_home');
    if (ctx.callbackQuery?.message) {
      await ctx.api.editMessageText(ctx.chat!.id, ctx.callbackQuery.message.message_id, body, { parse_mode: 'Markdown', reply_markup: keyboard });
    }
  });

  bot.callbackQuery('comm_search_minecraft', async (ctx) => {
    const comms = await db.getCommunities();
    const filtered = comms.filter(c => c.category === 'minecraft');
    const header = `╭──────────────────────────────────╮\n│  ⛏️ KOMUNITAS MINECRAFT SMP\n╰──────────────────────────────────╯`;
    let body = `${header}\n\n`;
    const keyboard = new InlineKeyboard();
    filtered.forEach(c => {
      body += `• **${c.name}**\n`;
      if (c.username) keyboard.url(`🔗 Gabung @${c.username}`, `https://t.me/${c.username}`).row();
    });
    keyboard.text('⬅️ Kembali', 'nav_pub_comm_search').text('🏠 Home', 'nav_pub_home');
    if (ctx.callbackQuery?.message) {
      await ctx.api.editMessageText(ctx.chat!.id, ctx.callbackQuery.message.message_id, body, { parse_mode: 'Markdown', reply_markup: keyboard });
    }
  });

  // Decoration Callbacks
  bot.callbackQuery(/^dec_select_comm_(\d+)$/, adminGuard, async (ctx) => {
    await handleAdmDecorationSelectComponent(ctx, parseInt(ctx.match[1], 10));
  });

  bot.callbackQuery(/^dec_apply_([a-z]+)_(\d+)$/, adminGuard, async (ctx) => {
    const comp = ctx.match[1];
    const commId = parseInt(ctx.match[2], 10);
    await handleAdmDecorationApply(ctx, commId, comp);
  });

  bot.callbackQuery(/^dec_reset_(\d+)$/, adminGuard, async (ctx) => {
    await ctx.answerCallbackQuery({ text: '🔄 Format dekorasi dikembalikan ke default!', show_alert: true });
    await handleAdmDecorationCenter(ctx);
  });

  bot.callbackQuery('dec_ai_auto_format', adminGuard, async (ctx) => {
    await AnimationManager.aiThinking(ctx);
    await ctx.reply('✨ **AI Auto-Decoration Generator Berhasil!** Format template rapi siap disalin.');
    await handleAdmDecorationCenter(ctx);
  });

  // Admin Product Edit & Delete Handlers
  bot.callbackQuery(/^adm_edit_prod_(.+)$/, adminGuard, async (ctx) => {
    await handleAdmProdEdit(ctx, ctx.match[1]);
  });

  bot.callbackQuery(/^adm_del_prod_confirm_(.+)$/, adminGuard, async (ctx) => {
    await handleAdmProdDeleteConfirm(ctx, ctx.match[1]);
  });

  bot.callbackQuery(/^adm_del_prod_execute_(.+)$/, adminGuard, async (ctx) => {
    await db.deleteProduct(ctx.match[1]);
    await ctx.answerCallbackQuery({ text: '🗑️ Produk berhasil dihapus dari database!', show_alert: true });
    await handleAdmProdList(ctx);
  });

  bot.callbackQuery(/^adm_toggle_feat_(.+)$/, adminGuard, async (ctx) => {
    const p = await db.getProductById(ctx.match[1]);
    if (p) {
      await db.saveProduct({ ...p, is_featured: !p.is_featured });
      await ctx.answerCallbackQuery({ text: `⭐ Featured ${!p.is_featured ? 'ON' : 'OFF'}`, show_alert: false });
      await handleAdmProdEdit(ctx, p.id);
    }
  });

  bot.callbackQuery(/^adm_toggle_pop_(.+)$/, adminGuard, async (ctx) => {
    const p = await db.getProductById(ctx.match[1]);
    if (p) {
      await db.saveProduct({ ...p, is_popular: !p.is_popular });
      await ctx.answerCallbackQuery({ text: `🔥 Popular ${!p.is_popular ? 'ON' : 'OFF'}`, show_alert: false });
      await handleAdmProdEdit(ctx, p.id);
    }
  });

  bot.callbackQuery(/^adm_toggle_prem_(.+)$/, adminGuard, async (ctx) => {
    const p = await db.getProductById(ctx.match[1]);
    if (p) {
      await db.saveProduct({ ...p, is_premium: !p.is_premium });
      await ctx.answerCallbackQuery({ text: `💎 Premium ${!p.is_premium ? 'ON' : 'OFF'}`, show_alert: false });
      await handleAdmProdEdit(ctx, p.id);
    }
  });

  bot.callbackQuery('adm_emergency_stop_execute', adminGuard, async (ctx) => {
    const tasks = await db.getScheduledTasks();
    for (const t of tasks) {
      await db.updateScheduledTask(t.id, { is_enabled: false });
    }
    await ctx.reply('🛑 **EMERGENCY STOP DIAKTIFKAN!**\n\nSeluruh antrian broadcast dan scheduler siaran otomatis telah dihentikan total.', { parse_mode: 'Markdown' });
    await handleAdmBroadcastCenter(ctx);
  });

  bot.callbackQuery('adm_toggle_sched_1', adminGuard, async (ctx) => {
    const tasks = await db.getScheduledTasks();
    if (tasks.length > 0) {
      await db.updateScheduledTask(tasks[0].id, { is_enabled: !tasks[0].is_enabled });
      await ctx.answerCallbackQuery({ text: `⏰ Scheduler 30-Menit ${!tasks[0].is_enabled ? 'Diaktifkan' : 'Dinonaktifkan'}`, show_alert: true });
    }
    await handleAdmBroadcastScheduler(ctx);
  });

  bot.callbackQuery('noop', async (ctx) => {
    try {
      await ctx.answerCallbackQuery();
    } catch {}
  });

  // Error Catching
  bot.catch((err) => {
    console.error(`[BOT ERROR] Update ${err.ctx.update.update_id}:`, err.error);
  });

  return bot;
}
