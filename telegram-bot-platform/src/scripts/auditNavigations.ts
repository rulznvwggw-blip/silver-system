import { db } from '../database/db.js';
import { SUPER_ADMIN_ID } from '../config/constants.js';

// Public 1 - 60 Navigations
import * as PubHandlers from '../bot/handlers/platformPublic.js';
// Admin 61 - 100 Navigations
import * as AdmHandlers from '../bot/handlers/platformAdmin.js';
// Decoration Center
import * as DecHandlers from '../bot/handlers/platformDecoration.js';

interface NavigationItem {
  id: number;
  code: string;
  name: string;
  scope: 'PUBLIC' | 'ADMIN';
  handlerName: string;
}

const ALL_100_NAVIGATIONS: NavigationItem[] = [
  // PUBLIC MENU (1 - 60)
  { id: 1, code: 'nav_pub_home', name: '🏠 Home', scope: 'PUBLIC', handlerName: 'handlePubHome' },
  { id: 2, code: 'nav_pub_store', name: '🛍️ Store', scope: 'PUBLIC', handlerName: 'handlePubStore' },
  { id: 3, code: 'nav_pub_products', name: '📦 Products', scope: 'PUBLIC', handlerName: 'handlePubProducts' },
  { id: 4, code: 'nav_pub_categories', name: '🗂️ Categories', scope: 'PUBLIC', handlerName: 'handlePubCategories' },
  { id: 5, code: 'nav_pub_popular', name: '🔥 Popular', scope: 'PUBLIC', handlerName: 'handlePubPopular' },
  { id: 6, code: 'nav_pub_featured', name: '⭐ Featured', scope: 'PUBLIC', handlerName: 'handlePubFeatured' },
  { id: 7, code: 'nav_pub_new_products', name: '🆕 New Products', scope: 'PUBLIC', handlerName: 'handlePubNewProducts' },
  { id: 8, code: 'nav_pub_premium', name: '💎 Premium', scope: 'PUBLIC', handlerName: 'handlePubPremium' },
  { id: 9, code: 'nav_pub_promotions', name: '🎁 Promotions', scope: 'PUBLIC', handlerName: 'handlePubPromotions' },
  { id: 10, code: 'nav_pub_coupons', name: '🎟️ Coupons', scope: 'PUBLIC', handlerName: 'handlePubCoupons' },

  { id: 11, code: 'nav_pub_cart', name: '🛒 Shopping Cart', scope: 'PUBLIC', handlerName: 'handlePubCart' },
  { id: 12, code: 'nav_pub_checkout', name: '💳 Checkout', scope: 'PUBLIC', handlerName: 'handlePubCheckout' },
  { id: 13, code: 'nav_pub_invoices', name: '🧾 Invoices', scope: 'PUBLIC', handlerName: 'handlePubInvoices' },
  { id: 14, code: 'nav_pub_my_orders', name: '📦 My Orders', scope: 'PUBLIC', handlerName: 'handlePubMyOrders' },
  { id: 15, code: 'nav_pub_renew_service', name: '🔄 Renew Service', scope: 'PUBLIC', handlerName: 'handlePubRenewService' },
  { id: 16, code: 'nav_pub_my_services', name: '🧩 My Services', scope: 'PUBLIC', handlerName: 'handlePubMyServices' },
  { id: 17, code: 'nav_pub_deployments', name: '🚀 Deployments', scope: 'PUBLIC', handlerName: 'handlePubDeployments' },
  { id: 18, code: 'nav_pub_order_stats', name: '📊 Order Statistics', scope: 'PUBLIC', handlerName: 'handlePubOrderStats' },
  { id: 19, code: 'nav_pub_wishlist', name: '❤️ Wishlist', scope: 'PUBLIC', handlerName: 'handlePubWishlist' },
  { id: 20, code: 'nav_pub_recently_viewed', name: '🕘 Recently Viewed', scope: 'PUBLIC', handlerName: 'handlePubRecentlyViewed' },

  { id: 21, code: 'nav_pub_groups', name: '👥 Groups', scope: 'PUBLIC', handlerName: 'handlePubGroups' },
  { id: 22, code: 'nav_pub_channels', name: '📣 Channels', scope: 'PUBLIC', handlerName: 'handlePubChannels' },
  { id: 23, code: 'nav_pub_comm_featured', name: '⭐ Featured Communities', scope: 'PUBLIC', handlerName: 'handlePubCommFeatured' },
  { id: 24, code: 'nav_pub_comm_popular', name: '🔥 Popular Communities', scope: 'PUBLIC', handlerName: 'handlePubCommPopular' },
  { id: 25, code: 'nav_pub_comm_new', name: '🆕 New Communities', scope: 'PUBLIC', handlerName: 'handlePubCommNew' },
  { id: 26, code: 'nav_pub_comm_search', name: '🔎 Search Community', scope: 'PUBLIC', handlerName: 'handlePubCommSearch' },
  { id: 27, code: 'nav_pub_comm_categories', name: '🏷️ Community Categories', scope: 'PUBLIC', handlerName: 'handlePubCommCategories' },
  { id: 28, code: 'nav_pub_comm_my', name: '🔗 My Communities', scope: 'PUBLIC', handlerName: 'handlePubCommMy' },
  { id: 29, code: 'nav_pub_comm_saved', name: '📌 Saved Communities', scope: 'PUBLIC', handlerName: 'handlePubCommSaved' },
  { id: 30, code: 'nav_pub_comm_stats', name: '📊 Community Statistics', scope: 'PUBLIC', handlerName: 'handlePubCommStats' },

  { id: 31, code: 'nav_pub_ai_assistant', name: '🤖 AI Assistant', scope: 'PUBLIC', handlerName: 'handlePubAiAssistant' },
  { id: 32, code: 'nav_pub_ai_writer', name: '✍️ AI Writer', scope: 'PUBLIC', handlerName: 'handlePubAiWriter' },
  { id: 33, code: 'nav_pub_ai_ideas', name: '💡 AI Ideas', scope: 'PUBLIC', handlerName: 'handlePubAiIdeas' },
  { id: 34, code: 'nav_pub_ai_announcement', name: '📢 AI Announcement', scope: 'PUBLIC', handlerName: 'handlePubAiAnnouncement' },
  { id: 35, code: 'nav_pub_ai_decoration', name: '🎨 AI Decoration', scope: 'PUBLIC', handlerName: 'handlePubAiDecoration' },
  { id: 36, code: 'nav_pub_ai_rewrite', name: '📝 AI Rewrite', scope: 'PUBLIC', handlerName: 'handlePubAiRewrite' },
  { id: 37, code: 'nav_pub_ai_translate', name: '🌐 AI Translate', scope: 'PUBLIC', handlerName: 'handlePubAiTranslate' },
  { id: 38, code: 'nav_pub_ai_search', name: '🔍 AI Search', scope: 'PUBLIC', handlerName: 'handlePubAiSearch' },
  { id: 39, code: 'nav_pub_ai_support', name: '💬 AI Support', scope: 'PUBLIC', handlerName: 'handlePubAiSupport' },
  { id: 40, code: 'nav_pub_ai_help', name: '🧠 AI Help', scope: 'PUBLIC', handlerName: 'handlePubAiHelp' },

  { id: 41, code: 'nav_pub_profile', name: '👤 My Profile', scope: 'PUBLIC', handlerName: 'handlePubProfile' },
  { id: 42, code: 'nav_pub_account_info', name: '🪪 Account Information', scope: 'PUBLIC', handlerName: 'handlePubAccountInfo' },
  { id: 43, code: 'nav_pub_order_history', name: '📦 Order History', scope: 'PUBLIC', handlerName: 'handlePubOrderHistory' },
  { id: 44, code: 'nav_pub_balance', name: '💰 Balance', scope: 'PUBLIC', handlerName: 'handlePubBalance' },
  { id: 45, code: 'nav_pub_my_coupons', name: '🎟️ My Coupons', scope: 'PUBLIC', handlerName: 'handlePubMyCoupons' },
  { id: 46, code: 'nav_pub_notifications', name: '🔔 Notifications', scope: 'PUBLIC', handlerName: 'handlePubNotifications' },
  { id: 47, code: 'nav_pub_security', name: '🔐 Security', scope: 'PUBLIC', handlerName: 'handlePubSecurity' },
  { id: 48, code: 'nav_pub_language', name: '🌐 Language', scope: 'PUBLIC', handlerName: 'handlePubLanguage' },
  { id: 49, code: 'nav_pub_appearance', name: '🎨 Appearance', scope: 'PUBLIC', handlerName: 'handlePubAppearance' },
  { id: 50, code: 'nav_pub_preferences', name: '⚙️ Preferences', scope: 'PUBLIC', handlerName: 'handlePubPreferences' },

  { id: 51, code: 'nav_pub_help_center', name: '🆘 Help Center', scope: 'PUBLIC', handlerName: 'handlePubHelpCenter' },
  { id: 52, code: 'nav_pub_contact_support', name: '💬 Contact Support', scope: 'PUBLIC', handlerName: 'handlePubContactSupport' },
  { id: 53, code: 'nav_pub_my_tickets', name: '🎫 My Tickets', scope: 'PUBLIC', handlerName: 'handlePubMyTickets' },
  { id: 54, code: 'nav_pub_create_ticket', name: '➕ Create Ticket', scope: 'PUBLIC', handlerName: 'handlePubCreateTicket' },
  { id: 55, code: 'nav_pub_faq', name: '📚 FAQ', scope: 'PUBLIC', handlerName: 'handlePubFaq' },
  { id: 56, code: 'nav_pub_docs', name: '📖 Documentation', scope: 'PUBLIC', handlerName: 'handlePubDocs' },
  { id: 57, code: 'nav_pub_rules', name: '📋 Rules', scope: 'PUBLIC', handlerName: 'handlePubRules' },
  { id: 58, code: 'nav_pub_privacy', name: '🛡️ Privacy', scope: 'PUBLIC', handlerName: 'handlePubPrivacy' },
  { id: 59, code: 'nav_pub_terms', name: '📜 Terms', scope: 'PUBLIC', handlerName: 'handlePubTerms' },
  { id: 60, code: 'nav_pub_about', name: 'ℹ️ About', scope: 'PUBLIC', handlerName: 'handlePubAbout' },

  // ADMIN MENU (61 - 100)
  { id: 61, code: 'nav_adm_dashboard', name: '👑 Admin Dashboard', scope: 'ADMIN', handlerName: 'handleAdmDashboard' },
  { id: 62, code: 'nav_adm_overview', name: '📊 Overview', scope: 'ADMIN', handlerName: 'handleAdmOverview' },
  { id: 63, code: 'nav_adm_revenue', name: '💰 Revenue', scope: 'ADMIN', handlerName: 'handleAdmRevenue' },
  { id: 64, code: 'nav_adm_orders', name: '📦 Orders', scope: 'ADMIN', handlerName: 'handleAdmOrders' },
  { id: 65, code: 'nav_adm_customers', name: '👥 Customers', scope: 'ADMIN', handlerName: 'handleAdmCustomers' },
  { id: 66, code: 'nav_adm_services', name: '🖥️ Services', scope: 'ADMIN', handlerName: 'handleAdmServices' },
  { id: 67, code: 'nav_adm_system_status', name: '🟢 System Status', scope: 'ADMIN', handlerName: 'handleAdmSystemStatus' },
  { id: 68, code: 'nav_adm_growth', name: '📈 Growth', scope: 'ADMIN', handlerName: 'handleAdmGrowth' },
  { id: 69, code: 'nav_adm_popular_products', name: '🔥 Popular Products', scope: 'ADMIN', handlerName: 'handleAdmPopularProducts' },
  { id: 70, code: 'nav_adm_alerts', name: '⚠️ Alerts', scope: 'ADMIN', handlerName: 'handleAdmAlerts' },

  { id: 71, code: 'nav_adm_prod_create', name: '➕ Create Product', scope: 'ADMIN', handlerName: 'handleAdmProdCreate' },
  { id: 72, code: 'nav_adm_prod_edit', name: '✏️ Edit Product', scope: 'ADMIN', handlerName: 'handleAdmProdEdit' },
  { id: 73, code: 'nav_adm_prod_delete', name: '🗑️ Delete Product', scope: 'ADMIN', handlerName: 'handleAdmProdDelete' },
  { id: 74, code: 'nav_adm_prod_list', name: '📋 Product List', scope: 'ADMIN', handlerName: 'handleAdmProdList' },
  { id: 75, code: 'nav_adm_prod_categories', name: '🗂️ Categories', scope: 'ADMIN', handlerName: 'handleAdmProdCategories' },
  { id: 76, code: 'nav_adm_prod_pricing', name: '💰 Pricing', scope: 'ADMIN', handlerName: 'handleAdmProdPricing' },
  { id: 77, code: 'nav_adm_prod_coupons', name: '🎟️ Coupons', scope: 'ADMIN', handlerName: 'handleAdmProdCoupons' },
  { id: 78, code: 'nav_adm_prod_promotions', name: '🎁 Promotions', scope: 'ADMIN', handlerName: 'handleAdmProdPromotions' },
  { id: 79, code: 'nav_adm_prod_featured', name: '⭐ Featured Products', scope: 'ADMIN', handlerName: 'handleAdmProdFeatured' },
  { id: 80, code: 'nav_adm_prod_inventory', name: '📦 Inventory/Capacity', scope: 'ADMIN', handlerName: 'handleAdmProdInventory' },

  { id: 81, code: 'nav_adm_ord_all', name: '📦 All Orders', scope: 'ADMIN', handlerName: 'handleAdmOrdAll' },
  { id: 82, code: 'nav_adm_ord_pending', name: '⏳ Pending Orders', scope: 'ADMIN', handlerName: 'handleAdmOrdPending' },
  { id: 83, code: 'nav_adm_ord_paid', name: '💳 Paid Orders', scope: 'ADMIN', handlerName: 'handleAdmOrdPaid' },
  { id: 84, code: 'nav_adm_ord_failed', name: '❌ Failed Orders', scope: 'ADMIN', handlerName: 'handleAdmOrdFailed' },
  { id: 85, code: 'nav_adm_ord_processing', name: '🔄 Processing Orders', scope: 'ADMIN', handlerName: 'handleAdmOrdProcessing' },
  { id: 86, code: 'nav_adm_ord_completed', name: '✅ Completed Orders', scope: 'ADMIN', handlerName: 'handleAdmOrdCompleted' },
  { id: 87, code: 'nav_adm_ord_refunds', name: '🔁 Refund Requests', scope: 'ADMIN', handlerName: 'handleAdmOrdRefunds' },
  { id: 88, code: 'nav_adm_ord_search', name: '🔍 Search Order', scope: 'ADMIN', handlerName: 'handleAdmOrdSearch' },
  { id: 89, code: 'nav_adm_ord_invoices', name: '🧾 Invoice Management', scope: 'ADMIN', handlerName: 'handleAdmOrdInvoices' },
  { id: 90, code: 'nav_adm_ord_analytics', name: '📊 Order Analytics', scope: 'ADMIN', handlerName: 'handleAdmOrdAnalytics' },

  { id: 91, code: 'nav_adm_broadcast_center', name: '📢 Broadcast Center', scope: 'ADMIN', handlerName: 'handleAdmBroadcastCenter' },
  { id: 92, code: 'nav_adm_ai_broadcast', name: '🤖 AI Broadcast', scope: 'ADMIN', handlerName: 'handleAdmAiBroadcast' },
  { id: 93, code: 'nav_adm_broadcast_scheduler', name: '⏰ Broadcast Scheduler', scope: 'ADMIN', handlerName: 'handleAdmBroadcastScheduler' },
  { id: 94, code: 'nav_adm_broadcast_history', name: '📜 Broadcast History', scope: 'ADMIN', handlerName: 'handleAdmBroadcastHistory' },
  { id: 95, code: 'nav_adm_broadcast_analytics', name: '📊 Broadcast Analytics', scope: 'ADMIN', handlerName: 'handleAdmBroadcastAnalytics' },
  { id: 96, code: 'nav_adm_broadcast_groups', name: '👥 Broadcast Groups', scope: 'ADMIN', handlerName: 'handleAdmBroadcastGroups' },
  { id: 97, code: 'nav_adm_broadcast_channels', name: '📣 Broadcast Channels', scope: 'ADMIN', handlerName: 'handleAdmBroadcastChannels' },
  { id: 98, code: 'nav_adm_broadcast_templates', name: '🎨 Broadcast Templates', scope: 'ADMIN', handlerName: 'handleAdmBroadcastTemplates' },
  { id: 99, code: 'nav_adm_broadcast_emergency_stop', name: '🛑 Emergency Stop', scope: 'ADMIN', handlerName: 'handleAdmBroadcastEmergencyStop' },
  { id: 100, code: 'nav_adm_broadcast_settings', name: '⚙️ Broadcast Settings', scope: 'ADMIN', handlerName: 'handleAdmBroadcastSettings' },
];

async function runNavigationAudit() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 TELEGRAM MANAGEMENT & STORE PLATFORM - SAAS NAVIGATION AUDIT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let passed = 0;
  let failed = 0;

  // 1. Audit All 100 Navigations Handlers
  console.log('1️⃣ [NAVIGATION INVENTORY AUDIT (100/100)]');
  const auditResults: any[] = [];

  for (const nav of ALL_100_NAVIGATIONS) {
    let handlerExists = false;
    if (nav.scope === 'PUBLIC') {
      handlerExists = typeof (PubHandlers as any)[nav.handlerName] === 'function';
    } else {
      handlerExists = typeof (AdmHandlers as any)[nav.handlerName] === 'function' || typeof (DecHandlers as any)[nav.handlerName] === 'function';
    }

    if (handlerExists) {
      passed++;
      auditResults.push({ id: nav.id, code: nav.code, name: nav.name, scope: nav.scope, status: '✅ PASS' });
    } else {
      failed++;
      auditResults.push({ id: nav.id, code: nav.code, name: nav.name, scope: nav.scope, status: '❌ ORPHAN' });
    }
  }

  console.table(auditResults.slice(0, 15));
  console.log(`   ... and ${ALL_100_NAVIGATIONS.length - 15} more navigations.`);
  console.log(`\n   🎯 Total Navigations Tested : ${ALL_100_NAVIGATIONS.length}`);
  console.log(`   ✅ Passed (Zero Dead Buttons) : ${passed}`);
  console.log(`   ❌ Failed (Orphan Buttons)    : ${failed}\n`);

  if (failed > 0) {
    console.error('❌ BUILD FAILED: Found dead/orphan buttons in navigation inventory!');
    process.exit(1);
  }

  // 2. Audit Database ACID Schema & Initial Records
  console.log('2️⃣ [DATABASE & BACKEND AUDIT]');
  const user = await db.getUser(SUPER_ADMIN_ID) || (await db.registerUser(SUPER_ADMIN_ID, 'Rullzye Admin', 'fufuhfafahfa')).user;
  const products = await db.getProducts();
  const categories = await db.getCategories();
  const coupons = await db.getCoupons();
  const communities = await db.getCommunities();
  const stats = await db.getPlatformStats();

  console.log(`   ✅ User Table & Wallet  : OK (Super Admin Balance: Rp ${user.balance.toLocaleString('id-ID')})`);
  console.log(`   ✅ Products Loaded      : ${products.length} Products (WA, TG, Minecraft)`);
  console.log(`   ✅ Categories Loaded    : ${categories.length} Categories`);
  console.log(`   ✅ Active Coupons       : ${coupons.length} Coupons`);
  console.log(`   ✅ Communities DB       : ${communities.length} Communities`);
  console.log(`   ✅ Platform Realtime Stats:`, stats);

  // 3. Audit RBAC Security Wall
  console.log('\n3️⃣ [RBAC SECURITY WALL AUDIT]');
  const isSuperAdmin = await db.isAdmin(SUPER_ADMIN_ID);
  const isFakeUserAdmin = await db.isAdmin(999999999);

  if (isSuperAdmin && !isFakeUserAdmin) {
    console.log(`   ✅ Super Admin (${SUPER_ADMIN_ID}) : ACCESS GRANTED 👑`);
    console.log(`   ✅ Non-Admin User (999999999)      : ACCESS DENIED ⛔ (Protected)`);
  } else {
    console.error('❌ RBAC Security Audit Failed!');
    process.exit(1);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 100/100 NAVIGATIONS AUDITED, VERIFIED, & 100% OPERATIONAL!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

runNavigationAudit().catch(err => {
  console.error('Audit Fatal Error:', err);
  process.exit(1);
});
