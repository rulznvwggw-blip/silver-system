import { Queue } from 'bullmq';
import { env } from '../config/env.js';

const connection = {
  host: 'localhost',
  port: 6379,
};

export const broadcastQueue = new Queue('broadcast_queue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

export const moderationQueue = new Queue('moderation_queue', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    removeOnComplete: 50,
  },
});
