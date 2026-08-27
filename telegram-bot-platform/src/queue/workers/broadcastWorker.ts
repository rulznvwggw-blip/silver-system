import { Worker, Job } from 'bullmq';
import { db } from '../../database/db.js';
import { Bot } from 'grammy';
import { env } from '../../config/env.js';

export interface BroadcastJobData {
  broadcastId: number;
  content: string;
  targets: { id: number; telegram_id: number; name: string }[];
}

export function startBroadcastWorker(botInstance?: Bot) {
  const connection = { host: 'localhost', port: 6379 };

  const worker = new Worker(
    'broadcast_queue',
    async (job: Job<BroadcastJobData>) => {
      const { broadcastId, content, targets } = job.data;
      console.log(`[WORKER] Starting broadcast #${broadcastId} to ${targets.length} targets...`);

      await db.updateBroadcast(broadcastId, { status: 'processing' });

      let successCount = 0;
      let failedCount = 0;
      let skippedCount = 0;

      for (const target of targets) {
        // Global emergency switch check
        const isEmergencyStopped = await db.getSetting('emergency_stop_broadcast', false);
        if (isEmergencyStopped) {
          console.warn(`[WORKER] Emergency stop triggered! Cancelling broadcast #${broadcastId}`);
          await db.updateBroadcast(broadcastId, { status: 'cancelled' });
          return;
        }

        try {
          if (botInstance && !env.isMockMode) {
            await botInstance.api.sendMessage(target.telegram_id, content, {
              parse_mode: 'Markdown',
            });
          }
          successCount++;
          console.log(`[WORKER] Delivered to: ${target.name} (${target.telegram_id})`);

          // Rate-limit safety: 35ms sleep between messages
          await new Promise(r => setTimeout(r, 40));
        } catch (err: any) {
          if (err?.error_code === 429) {
            const retryAfter = err?.parameters?.retry_after || 5;
            console.warn(`[WORKER] Rate limited by Telegram. Backing off for ${retryAfter}s...`);
            await new Promise(r => setTimeout(r, retryAfter * 1000));
          }
          failedCount++;
          console.error(`[WORKER] Failed to deliver to ${target.telegram_id}:`, err?.message || err);
        }
      }

      await db.updateBroadcast(broadcastId, {
        status: 'completed',
        success_count: successCount,
        failed_count: failedCount,
        skipped_count: skippedCount,
        completed_at: new Date(),
      });

      console.log(`[WORKER] Broadcast #${broadcastId} completed. Success: ${successCount}, Failed: ${failedCount}`);
    },
    { connection, concurrency: 2 }
  );

  worker.on('failed', (job, err) => {
    console.error(`[WORKER] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
