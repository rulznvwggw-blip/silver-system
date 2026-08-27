import { Bot, Context } from 'grammy';
import { env } from '../config/env.js';
import { adminGuard } from './middlewares/auth.js';
import { antiSpamMiddleware } from './middlewares/antiSpam.js';

// Handlers
import { handleStart } from './handlers/start.js';
import { handleAdminPanel } from './handlers/admin.js';
import {
  handleStore300Catalog,
  handlePackage300Detail,
  handleBuy300WithBalance,
} from './handlers/store300.js';
import {
  handleWalletMenu,
  handleTopupOptions,
  handleTopupAction,
} from './handlers/wallet.js';
import { handleSetupCommunityViaChatId } from './handlers/groupChannelJoin.js';
import { handleCouponsMenu, handleFaqMenu } from './handlers/store.js';
import {
  handleAdminUsersList,
  handleAdminAddSaldo,
  handleAdminMinusSaldo,
  handleAdminUserDetail,
  handleAdminGiveServer,
} from './handlers/adminUserControl.js';
import {
  cmdStore,
  cmdBeli,
  cmdSaldo,
  cmdTopup,
  cmdRef,
  cmdMyServers,
  cmdPanel,
  cmdStatus,
  cmdGroups,
  cmdChannels,
  cmdCoupons,
  cmdFaq,
  cmdTutorial,
  cmdRules,
  cmdContact,
  cmdPing,
  cmdMiniApp,
  cmdHelp,
} from './handlers/publicCommands.js';
import {
  handleAIBroadcastFlow,
  handleTargetSelected,
  handleConfirmDispatch,
  handleEmergencyStop,
} from './handlers/broadcast.js';
import { handleListCommunities, handleGenerateCommunity } from './handlers/community.js';
import { handleSearch } from './handlers/search.js';
import { handleDecoration } from './handlers/decoration.js';
import { handleModerationPanel } from './handlers/moderation.js';
import { handleSchedulerPanel } from './handlers/scheduler.js';
import { handleStats } from './handlers/stats.js';

// Events
import { handleNewChatMembers } from './events/newMembers.js';
import { handleGroupMessageGuard } from './events/messageGuard.js';
import { BroadcastTargetType, CommunityType } from '../config/constants.js';

export function createBot(): Bot<Context> {
  const token = env.botToken || '1234567890:MOCK_TOKEN_FOR_INITIALIZATION_SAFE';
  const bot = new Bot<Context>(token);

  // 1. Middlewares
  bot.use(antiSpamMiddleware);

  // 2. 20 Public User Commands
  bot.command('start', handleStart);
  bot.command('store', cmdStore);
  bot.command('katalog', cmdStore);
  bot.command('beli', cmdBeli);
  bot.command('saldo', cmdSaldo);
  bot.command('wallet', cmdSaldo);
  bot.command('topup', cmdTopup);
  bot.command('ref', cmdRef);
  bot.command('referral', cmdRef);
  bot.command('myservers', cmdMyServers);
  bot.command('server', cmdMyServers);
  bot.command('panel', cmdPanel);
  bot.command('status', cmdStatus);
  bot.command('uptime', cmdStatus);
  bot.command('search', async (ctx) => {
    const query = ctx.match || '';
    await handleSearch(ctx, query);
  });
  bot.command('groups', cmdGroups);
  bot.command('channels', cmdChannels);
  bot.command('coupons', cmdCoupons);
  bot.command('promo', cmdCoupons);
  bot.command('faq', cmdFaq);
  bot.command('tutorial', cmdTutorial);
  bot.command('rules', cmdRules);
  bot.command('tos', cmdRules);
  bot.command('contact', cmdContact);
  bot.command('support', cmdContact);
  bot.command('ping', cmdPing);
  bot.command('miniapp', cmdMiniApp);
  bot.command('help', cmdHelp);

  // Group & Channel Auto-Decoration Commands via Chat ID
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
      await ctx.reply('ℹ️ Gunakan: `/setup_channel <chat_id_atau_username>`\nContoh: `/setup_channel -1001928374652`', { parse_mode: 'Markdown' });
      return;
    }
    await handleSetupCommunityViaChatId(ctx, targetId, CommunityType.CHANNEL);
  });

  // 3. Admin Protected Commands (Strict Guard: Non-Admin will get Access Denied)
  bot.command('admin', adminGuard, handleAdminPanel);
  bot.command('users', adminGuard, handleAdminUsersList);
  bot.command('addsaldo', adminGuard, (ctx) => handleAdminAddSaldo(ctx, ctx.match || ''));
  bot.command('minussaldo', adminGuard, (ctx) => handleAdminMinusSaldo(ctx, ctx.match || ''));
  bot.command('userdetail', adminGuard, (ctx) => handleAdminUserDetail(ctx, ctx.match || ''));
  bot.command('giveserver', adminGuard, (ctx) => handleAdminGiveServer(ctx, ctx.match || ''));
  bot.command('broadcast', adminGuard, handleAIBroadcastFlow);
  bot.command('aibroadcast', adminGuard, handleAIBroadcastFlow);
  bot.command('scheduler', adminGuard, handleSchedulerPanel);
  bot.command('create', adminGuard, (ctx) => handleGenerateCommunity(ctx));
  bot.command('settings', adminGuard, handleAdminPanel);
  bot.command('logs', adminGuard, handleModerationPanel);
  bot.command('stopbroadcast', adminGuard, handleEmergencyStop);

  // 4. Interactive Callbacks

  // Main navigation
  bot.callbackQuery('menu_main', handleStart);
  bot.callbackQuery('menu_store', (ctx) => handleStore300Catalog(ctx, '30d', 'whatsapp', 1));
  bot.callbackQuery('menu_my_servers', cmdMyServers);
  bot.callbackQuery('menu_wallet', handleWalletMenu);
  bot.callbackQuery('wallet_topup', handleTopupOptions);
  bot.callbackQuery('wallet_share_ref', handleWalletMenu);
  bot.callbackQuery('menu_tutorial', cmdTutorial);
  bot.callbackQuery('cmd_ping_retry', cmdPing);

  // Topup amounts
  bot.callbackQuery(/^topup_val_(\d+)$/, async (ctx) => {
    const amount = parseInt(ctx.match[1], 10);
    await handleTopupAction(ctx, amount);
  });

  // Store 300 Duration Tab Callbacks: s300_dur_<dur>_<cat>_<page>
  bot.callbackQuery(/^s300_dur_([a-z0-9]+)_([a-z]+)_(\d+)$/, async (ctx) => {
    const duration = ctx.match[1] as any;
    const category = ctx.match[2];
    const page = parseInt(ctx.match[3], 10);
    await handleStore300Catalog(ctx, duration, category, page);
  });

  // Store 300 Category & Page Navigation: s300_nav_<dur>_<cat>_<page>
  bot.callbackQuery(/^s300_nav_([a-z0-9]+)_([a-z]+)_(\d+)$/, async (ctx) => {
    const duration = ctx.match[1] as any;
    const category = ctx.match[2];
    const page = parseInt(ctx.match[3], 10);
    await handleStore300Catalog(ctx, duration, category, page);
  });

  // Store 300 Detail
  bot.callbackQuery(/^s300_detail_(.+)$/, async (ctx) => {
    const planId = ctx.match[1];
    await handlePackage300Detail(ctx, planId);
  });

  // Store 300 Buy with Balance
  bot.callbackQuery(/^s300_buysaldo_(.+)$/, async (ctx) => {
    const planId = ctx.match[1];
    await handleBuy300WithBalance(ctx, planId);
  });

  bot.callbackQuery('menu_coupons', handleCouponsMenu);
  bot.callbackQuery('menu_faq', handleFaqMenu);

  // Admin Specific Callbacks
  bot.callbackQuery('admin_main', adminGuard, handleAdminPanel);
  bot.callbackQuery('admin_users', adminGuard, handleAdminUsersList);
  bot.callbackQuery('admin_dashboard', adminGuard, handleStats);
  bot.callbackQuery('admin_ai_broadcast', adminGuard, handleAIBroadcastFlow);
  bot.callbackQuery('admin_broadcast_opt', adminGuard, handleAIBroadcastFlow);
  bot.callbackQuery('admin_scheduler', adminGuard, handleSchedulerPanel);
  bot.callbackQuery('admin_groups', adminGuard, (ctx) => handleListCommunities(ctx, CommunityType.GROUP));
  bot.callbackQuery('admin_channels', adminGuard, (ctx) => handleListCommunities(ctx, CommunityType.CHANNEL));
  bot.callbackQuery('admin_create_comm', adminGuard, (ctx) => handleGenerateCommunity(ctx));
  bot.callbackQuery('admin_decoration', adminGuard, (ctx) => handleDecoration(ctx));
  bot.callbackQuery('admin_moderation', adminGuard, handleModerationPanel);
  bot.callbackQuery('admin_emergency_stop', adminGuard, handleEmergencyStop);

  // Broadcast Target Pickers
  bot.callbackQuery('b_target_all', (ctx) => handleTargetSelected(ctx, BroadcastTargetType.ALL_COMMUNITIES));
  bot.callbackQuery('b_target_groups', (ctx) => handleTargetSelected(ctx, BroadcastTargetType.ALL_GROUPS));
  bot.callbackQuery('b_target_channels', (ctx) => handleTargetSelected(ctx, BroadcastTargetType.ALL_CHANNELS));
  bot.callbackQuery('b_cat_gaming', (ctx) => handleTargetSelected(ctx, BroadcastTargetType.CUSTOM_TARGETS, 'gaming'));
  bot.callbackQuery('b_cat_hosting', (ctx) => handleTargetSelected(ctx, BroadcastTargetType.CUSTOM_TARGETS, 'hosting'));
  bot.callbackQuery('b_confirm_dispatch', handleConfirmDispatch);

  // Search & Community Callbacks
  bot.callbackQuery('menu_groups', (ctx) => handleListCommunities(ctx, CommunityType.GROUP));
  bot.callbackQuery('menu_channels', (ctx) => handleListCommunities(ctx, CommunityType.CHANNEL));
  bot.callbackQuery('menu_search', (ctx) => handleSearch(ctx));
  bot.callbackQuery('menu_stats', handleStats);
  bot.callbackQuery('menu_decoration', (ctx) => handleDecoration(ctx));
  bot.callbackQuery('menu_help', (ctx) => cmdHelp(ctx));
  bot.callbackQuery('noop', async (ctx) => ctx.answerCallbackQuery());

  bot.callbackQuery(/^search_cat_(.+)$/, async (ctx) => {
    const cat = ctx.match[1];
    await handleSearch(ctx, '', cat);
  });

  // 5. Group Events (New Members & Message Guard)
  bot.on('message:new_chat_members', handleNewChatMembers);
  bot.on('message:text', handleGroupMessageGuard);

  // Error Catching
  bot.catch((err) => {
    console.error(`[BOT ERROR] Error in update ${err.ctx.update.update_id}:`, err.error);
  });

  return bot;
}
