import { env } from './config/env.js';
import { createBot } from './bot/bot.js';
import { createWebServer } from './web/server.js';
import { startBroadcastWorker } from './queue/workers/broadcastWorker.js';
import { start30MinuteScheduler } from './queue/workers/schedulerWorker.js';
import { setupBotProfile } from './bot/setupBotProfile.js';
import { SUPER_ADMIN_ID } from './config/constants.js';

async function bootstrap() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🤖 RULLZYE AI TELEGRAM BOT & STORE PLATFORM');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`👑 Primary Super Admin ID : ${SUPER_ADMIN_ID}`);
  console.log(`⏰ Timezone               : ${env.timezone}`);
  console.log(`⏱️ Auto-Broadcast         : Every ${env.autoBroadcastMinutes} Minutes`);
  console.log(`🌐 Web Dashboard Port     : http://localhost:${env.webPort}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 1. Start Web Dashboard & REST API
  const app = createWebServer();
  app.listen(env.webPort, () => {
    console.log(`[WEB] Admin Web Dashboard active on http://localhost:${env.webPort}`);
  });

  // 2. Initialize Telegram Bot
  const bot = createBot();

  // 3. Start BullMQ Queue Worker
  startBroadcastWorker(bot);
  console.log('[QUEUE] BullMQ Broadcast Queue Worker active.');

  // 4. Start 30-Minute Scheduler
  start30MinuteScheduler();
  console.log('[SCHEDULER] 30-Minute Automated Broadcast Scheduler active.');

  // 5. Start Bot Polling Runner (with clean webhook purge and profile setup)
  if (env.botToken && env.botToken !== 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
    try {
      console.log('[BOT] Cleaning any pending webhook updates...');
      await bot.api.deleteWebhook({ drop_pending_updates: true });

      // Automatically setup Bio, Descriptions, Commands
      await setupBotProfile(bot);

      console.log('[BOT] Connecting to Telegram Bot API with Long Polling...');
      bot.start({
        onStart: (botInfo) => {
          console.log(`[BOT] ✅ Connected and Polling as @${botInfo.username} (ID: ${botInfo.id})`);
        },
      });
    } catch (err: any) {
      console.error('[BOT] Failed to connect to Telegram:', err.message);
    }
  } else {
    console.log('[BOT] ℹ️ BOT_TOKEN belum diisi di .env. Bot berjalan dalam mode Web & Queue Ready.');
  }
}

bootstrap().catch((err) => {
  console.error('[FATAL] Unhandled bootstrap error:', err);
  process.exit(1);
});
