import { Redis } from 'ioredis';
import { env } from '../config/env.js';

let redisInstance: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis(env.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
    });

    redisInstance.on('error', (err) => {
      // Non-blocking log
    });
  }
  return redisInstance;
}
