import cron from 'node-cron';
import { db } from '../../database/db.js';
import { aiProvider } from '../../ai/provider.js';
import { broadcastQueue } from '../queues.js';

export function start30MinuteScheduler() {
  console.log('[SCHEDULER] Automated 30-Minute AI Broadcast Scheduler initialized (Asia/Jakarta)...');

  // Cron schedule for every 30 minutes
  const task = cron.schedule('*/30 * * * *', async () => {
    try {
      const isEnabled = await db.getSetting('auto_broadcast_enabled', true);
      if (!isEnabled) {
        console.log('[SCHEDULER] Auto broadcast is currently disabled in admin settings.');
        return;
      }

      console.log('[SCHEDULER] Running 30-Minute Automated AI Broadcast...');

      // 1. Fetch active targets
      const communities = await db.getCommunities();
      const eligibleTargets = communities.filter(c => c.is_active && c.broadcast_enabled);

      if (eligibleTargets.length === 0) {
        console.log('[SCHEDULER] No eligible communities registered for broadcast.');
        return;
      }

      // 2. Generate AI Content
      const aiContent = await aiProvider.generateBroadcast({
        topic: 'Tips & Update Komunitas',
        tone: 'friendly',
        language: 'Indonesia',
      });

      // 3. Create Broadcast Record in DB
      const broadcast = await db.createBroadcast({
        created_by: 0, // System Scheduler
        title: `[AUTO 30-MIN] ${aiContent.title}`,
        content: aiContent.content,
        type: 'ai',
        ai_model: aiContent.model,
        target_filter: { target: 'all_active' },
        total_targets: eligibleTargets.length,
        success_count: 0,
        failed_count: 0,
        skipped_count: 0,
        status: 'pending',
      });

      // 4. Dispatch Job to BullMQ Queue
      await broadcastQueue.add('broadcast.send', {
        broadcastId: broadcast.id,
        content: aiContent.content,
        targets: eligibleTargets.map(c => ({
          id: c.id,
          telegram_id: c.telegram_id,
          name: c.name,
        })),
      });

      // 5. Update Scheduled Task Metadata
      await db.updateScheduledTask(1, {
        last_run_at: new Date(),
        next_run_at: new Date(Date.now() + 1000 * 60 * 30),
      });

      console.log(`[SCHEDULER] Dispatched automated broadcast #${broadcast.id} to ${eligibleTargets.length} communities.`);
    } catch (err: any) {
      console.error('[SCHEDULER] Error in automated broadcast run:', err.message);
    }
  });

  return task;
}
