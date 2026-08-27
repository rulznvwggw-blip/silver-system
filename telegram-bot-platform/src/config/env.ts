import dotenv from 'dotenv';
import { SUPER_ADMIN_ID, TIMEZONE } from './constants.js';

dotenv.config();

export interface AppConfig {
  botToken: string;
  databaseUrl: string;
  redisUrl: string;
  aiApiKey: string;
  aiProvider: 'gemini' | 'openai' | 'fallback';
  webhookUrl?: string;
  adminId: number;
  timezone: string;
  webPort: number;
  autoBroadcastMinutes: number;
  isMockMode: boolean;
}

export const env: AppConfig = {
  botToken: process.env.BOT_TOKEN || '',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/telegram_bot_db',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  aiApiKey: process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || '',
  aiProvider: (process.env.AI_PROVIDER as any) || 'gemini',
  webhookUrl: process.env.WEBHOOK_URL,
  adminId: parseInt(process.env.ADMIN_ID || String(SUPER_ADMIN_ID), 10) || SUPER_ADMIN_ID,
  timezone: process.env.TIMEZONE || TIMEZONE,
  webPort: parseInt(process.env.WEB_PORT || '3005', 10),
  autoBroadcastMinutes: parseInt(process.env.AUTO_BROADCAST_MINUTES || '30', 10),
  isMockMode: !process.env.BOT_TOKEN,
};
