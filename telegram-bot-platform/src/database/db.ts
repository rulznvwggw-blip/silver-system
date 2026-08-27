import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { SUPER_ADMIN_ID, CommunityType, BroadcastStatus } from '../config/constants.js';
import { env } from '../config/env.js';

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'bot_database.sqlite');
const sqlite = new Database(dbPath);

// Enable WAL Mode and Fast Foreign Keys for High Concurrency & Zero Data Loss
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('synchronous = NORMAL');

// 1. Initialize Tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    telegram_id INTEGER PRIMARY KEY,
    first_name TEXT,
    username TEXT,
    balance INTEGER NOT NULL DEFAULT 1000,
    ptero_user_id INTEGER,
    ptero_username TEXT,
    ptero_password TEXT,
    referral_count INTEGER NOT NULL DEFAULT 0,
    referred_by INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    server_id INTEGER NOT NULL,
    server_identifier TEXT NOT NULL,
    server_name TEXT NOT NULL,
    package_id TEXT NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 30,
    port INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS communities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    username TEXT,
    invite_link TEXT,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    broadcast_enabled INTEGER NOT NULL DEFAULT 1,
    member_count INTEGER NOT NULL DEFAULT 0,
    rules TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS broadcasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_text TEXT NOT NULL,
    target_type TEXT NOT NULL,
    category TEXT,
    status TEXT NOT NULL,
    total_targets INTEGER NOT NULL DEFAULT 0,
    sent_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admins (
    telegram_id INTEGER PRIMARY KEY,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS moderation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    reason TEXT NOT NULL,
    detected_content TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS scheduled_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    task_type TEXT NOT NULL,
    interval_minutes INTEGER NOT NULL,
    is_enabled INTEGER NOT NULL DEFAULT 1,
    last_run_at TEXT,
    next_run_at TEXT
  );
`);

// 2. Initial Seeding if empty
const adminCheck = sqlite.prepare('SELECT telegram_id FROM admins WHERE telegram_id = ?').get(SUPER_ADMIN_ID);
if (!adminCheck) {
  sqlite.prepare('INSERT INTO admins (telegram_id, role, created_at) VALUES (?, ?, ?)').run(
    SUPER_ADMIN_ID,
    'super_admin',
    new Date().toISOString()
  );
}

const commCount = (sqlite.prepare('SELECT count(*) as count FROM communities').get() as any).count;
if (commCount === 0) {
  const insertComm = sqlite.prepare(`
    INSERT INTO communities (telegram_id, name, type, username, invite_link, description, category, is_featured, is_active, broadcast_enabled, member_count, rules, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertComm.run(
    -1001928374650,
    '🚀 Hosting & Cloud Indonesia Hub',
    CommunityType.GROUP,
    'hosting_id_community',
    'https://t.me/hosting_id_community',
    'Komunitas diskusi Pterodactyl hosting, VPS, Node.js, dan Bot Indonesia.',
    'hosting',
    1,
    1,
    1,
    1420,
    '1. No Spam\n2. No Toxic\n3. Respect admin & members',
    new Date().toISOString(),
    new Date().toISOString()
  );

  insertComm.run(
    -1001928374651,
    '⛏️ Minecraft SMP Community Indonesia',
    CommunityType.GROUP,
    'minecraft_smp_id',
    'https://t.me/minecraft_smp_id',
    'Mabar Minecraft Java/Bedrock Server, sharing plugin, dan build showcase.',
    'minecraft',
    1,
    1,
    1,
    3850,
    '1. No Cheat / X-Ray\n2. Dilarang griefing\n3. Jual beli via admin pulber',
    new Date().toISOString(),
    new Date().toISOString()
  );

  insertComm.run(
    -1001928374652,
    '📣 RullzyeStore Official Channel',
    CommunityType.CHANNEL,
    'rullzyestore_official',
    'https://t.me/rullzyestore_official',
    'Official channel update server promo, tips bot WhatsApp & Telegram.',
    'technology',
    1,
    1,
    1,
    5200,
    '',
    new Date().toISOString(),
    new Date().toISOString()
  );
}

export interface UserModel {
  telegram_id: number;
  first_name?: string;
  username?: string;
  balance: number;
  ptero_user_id?: number;
  ptero_username?: string;
  ptero_password?: string;
  referral_count: number;
  referred_by?: number;
  created_at: Date;
  updated_at?: Date;
}

export interface UserServerModel {
  id?: number;
  telegram_id: number;
  server_id: number;
  server_identifier: string;
  server_name: string;
  package_id: string;
  duration_days: number;
  port: number;
  status: string;
  expires_at: Date;
  created_at?: Date;
}

export interface TransactionModel {
  id?: number;
  telegram_id: number;
  type: string;
  amount: number;
  description: string;
  created_at: Date;
}

export interface CommunityModel {
  id?: number;
  telegram_id: number;
  name: string;
  type: CommunityType;
  username?: string;
  invite_link?: string;
  description?: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  broadcast_enabled: boolean;
  member_count: number;
  rules?: string;
  created_at: Date;
  updated_at: Date;
}

export interface BroadcastModel {
  id: number;
  title?: string;
  type?: string;
  content?: string;
  message_text?: string;
  target_type?: string;
  target_filter?: any;
  ai_model?: string;
  category?: string;
  status: BroadcastStatus | string;
  total_targets: number;
  sent_count?: number;
  success_count?: number;
  skipped_count?: number;
  failed_count: number;
  created_by: number;
  created_at: Date;
  completed_at?: Date;
}

export interface ScheduledTaskModel {
  id: number;
  name: string;
  task_type: string;
  interval_minutes: number;
  is_enabled: boolean;
  last_run_at?: Date;
  next_run_at?: Date;
}

export interface ModerationLogModel {
  id?: number;
  chat_id?: number;
  community_id?: number;
  user_id?: number;
  telegram_id?: number;
  message_snippet?: string;
  ai_confidence?: number;
  action: string;
  reason: string;
  detected_content?: string;
  created_at: Date;
}

export const db = {
  // 1. User & Wallet Management (100% Persistent SQLite)
  async getUser(telegramId: number): Promise<UserModel | undefined> {
    const row = sqlite.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId) as any;
    if (!row) return undefined;
    return {
      telegram_id: row.telegram_id,
      first_name: row.first_name || undefined,
      username: row.username || undefined,
      balance: row.balance,
      ptero_user_id: row.ptero_user_id || undefined,
      ptero_username: row.ptero_username || undefined,
      ptero_password: row.ptero_password || undefined,
      referral_count: row.referral_count || 0,
      referred_by: row.referred_by || undefined,
      created_at: new Date(row.created_at),
      updated_at: row.updated_at ? new Date(row.updated_at) : undefined,
    };
  },

  async getAllUsers(): Promise<UserModel[]> {
    const rows = sqlite.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as any[];
    return rows.map(row => ({
      telegram_id: row.telegram_id,
      first_name: row.first_name || undefined,
      username: row.username || undefined,
      balance: row.balance,
      ptero_user_id: row.ptero_user_id || undefined,
      ptero_username: row.ptero_username || undefined,
      ptero_password: row.ptero_password || undefined,
      referral_count: row.referral_count || 0,
      referred_by: row.referred_by || undefined,
      created_at: new Date(row.created_at),
      updated_at: row.updated_at ? new Date(row.updated_at) : undefined,
    }));
  },

  async registerUser(telegramId: number, firstName?: string, username?: string, refBy?: number): Promise<{ user: UserModel; isNew: boolean; refBonusAwarded: boolean }> {
    const existing = await this.getUser(telegramId);
    if (existing) {
      sqlite.prepare('UPDATE users SET first_name = ?, username = ?, updated_at = ? WHERE telegram_id = ?').run(
        firstName || existing.first_name || null,
        username || existing.username || null,
        new Date().toISOString(),
        telegramId
      );
      return { user: { ...existing, first_name: firstName || existing.first_name, username: username || existing.username }, isNew: false, refBonusAwarded: false };
    }

    let refBonusAwarded = false;
    let validRef = refBy && refBy !== telegramId && (await this.getUser(refBy)) ? refBy : undefined;

    const now = new Date().toISOString();
    sqlite.prepare(`
      INSERT INTO users (telegram_id, first_name, username, balance, referral_count, referred_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      telegramId,
      firstName || null,
      username || null,
      1000,
      0,
      validRef || null,
      now,
      now
    );

    // Record register bonus transaction
    await this.addTransactionRecord({
      telegram_id: telegramId,
      type: 'bonus_register',
      amount: 1000,
      description: 'Bonus Saldo Awal Pendaftaran Bot',
      created_at: new Date(),
    });

    if (validRef) {
      sqlite.prepare('UPDATE users SET balance = balance + 2000, referral_count = referral_count + 1 WHERE telegram_id = ?').run(validRef);
      refBonusAwarded = true;
      await this.addTransactionRecord({
        telegram_id: validRef,
        type: 'bonus_referral',
        amount: 2000,
        description: `Bonus Referral Mengundang User @${username || telegramId}`,
        created_at: new Date(),
      });
      console.log(`[REFERRAL] Awarded Rp 2.000 persistent bonus to Referrer ID ${validRef} for inviting ${telegramId}!`);
    }

    const newUser = (await this.getUser(telegramId))!;
    return { user: newUser, isNew: true, refBonusAwarded };
  },

  async addBalance(telegramId: number, amount: number, description = 'Top Up Saldo'): Promise<number> {
    sqlite.prepare('UPDATE users SET balance = balance + ?, updated_at = ? WHERE telegram_id = ?').run(
      amount,
      new Date().toISOString(),
      telegramId
    );

    await this.addTransactionRecord({
      telegram_id: telegramId,
      type: 'topup_qris',
      amount,
      description,
      created_at: new Date(),
    });

    const user = await this.getUser(telegramId);
    return user?.balance || 0;
  },

  async deductBalance(telegramId: number, amount: number, description = 'Pembelian Server'): Promise<boolean> {
    const user = await this.getUser(telegramId);
    if (!user || user.balance < amount) return false;

    sqlite.prepare('UPDATE users SET balance = balance - ?, updated_at = ? WHERE telegram_id = ?').run(
      amount,
      new Date().toISOString(),
      telegramId
    );

    await this.addTransactionRecord({
      telegram_id: telegramId,
      type: 'buy_server',
      amount: -amount,
      description,
      created_at: new Date(),
    });

    return true;
  },

  async adjustBalanceAdmin(telegramId: number, amount: number, reason = 'Penyesuaian oleh Admin'): Promise<number> {
    sqlite.prepare('UPDATE users SET balance = MAX(0, balance + ?), updated_at = ? WHERE telegram_id = ?').run(
      amount,
      new Date().toISOString(),
      telegramId
    );

    await this.addTransactionRecord({
      telegram_id: telegramId,
      type: 'admin_adjust',
      amount,
      description: reason,
      created_at: new Date(),
    });

    const user = await this.getUser(telegramId);
    return user?.balance || 0;
  },

  async savePteroCredentials(telegramId: number, pteroUserId: number, pteroUsername: string, pteroPassword?: string): Promise<void> {
    if (pteroPassword) {
      sqlite.prepare('UPDATE users SET ptero_user_id = ?, ptero_username = ?, ptero_password = ?, updated_at = ? WHERE telegram_id = ?').run(
        pteroUserId,
        pteroUsername,
        pteroPassword,
        new Date().toISOString(),
        telegramId
      );
    } else {
      sqlite.prepare('UPDATE users SET ptero_user_id = ?, ptero_username = ?, updated_at = ? WHERE telegram_id = ?').run(
        pteroUserId,
        pteroUsername,
        new Date().toISOString(),
        telegramId
      );
    }
  },

  // 2. Server Management (100% Persistent)
  async recordUserServer(server: Omit<UserServerModel, 'id' | 'created_at'>): Promise<UserServerModel> {
    const now = new Date().toISOString();
    const info = sqlite.prepare(`
      INSERT INTO user_servers (telegram_id, server_id, server_identifier, server_name, package_id, duration_days, port, status, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      server.telegram_id,
      server.server_id,
      server.server_identifier,
      server.server_name,
      server.package_id,
      server.duration_days,
      server.port,
      server.status,
      server.expires_at.toISOString(),
      now
    );

    return {
      ...server,
      id: Number(info.lastInsertRowid),
      created_at: new Date(now),
    };
  },

  async getUserServers(telegramId: number): Promise<UserServerModel[]> {
    const rows = sqlite.prepare('SELECT * FROM user_servers WHERE telegram_id = ? ORDER BY id DESC').all(telegramId) as any[];
    return rows.map(r => ({
      id: r.id,
      telegram_id: r.telegram_id,
      server_id: r.server_id,
      server_identifier: r.server_identifier,
      server_name: r.server_name,
      package_id: r.package_id,
      duration_days: r.duration_days,
      port: r.port,
      status: r.status,
      expires_at: new Date(r.expires_at),
      created_at: new Date(r.created_at),
    }));
  },

  async getAllServers(): Promise<UserServerModel[]> {
    const rows = sqlite.prepare('SELECT * FROM user_servers ORDER BY id DESC').all() as any[];
    return rows.map(r => ({
      id: r.id,
      telegram_id: r.telegram_id,
      server_id: r.server_id,
      server_identifier: r.server_identifier,
      server_name: r.server_name,
      package_id: r.package_id,
      duration_days: r.duration_days,
      port: r.port,
      status: r.status,
      expires_at: new Date(r.expires_at),
      created_at: new Date(r.created_at),
    }));
  },

  // 3. Transactions
  async addTransactionRecord(tx: Omit<TransactionModel, 'id'>): Promise<TransactionModel> {
    const now = (tx.created_at || new Date()).toISOString();
    const info = sqlite.prepare(`
      INSERT INTO transactions (telegram_id, type, amount, description, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      tx.telegram_id,
      tx.type,
      tx.amount,
      tx.description,
      now
    );

    return {
      ...tx,
      id: Number(info.lastInsertRowid),
      created_at: new Date(now),
    };
  },

  async getUserTransactions(telegramId: number, limit = 10): Promise<TransactionModel[]> {
    const rows = sqlite.prepare('SELECT * FROM transactions WHERE telegram_id = ? ORDER BY id DESC LIMIT ?').all(telegramId, limit) as any[];
    return rows.map(r => ({
      id: r.id,
      telegram_id: r.telegram_id,
      type: r.type,
      amount: r.amount,
      description: r.description,
      created_at: new Date(r.created_at),
    }));
  },

  // 4. Admin & Communities
  async getAdmins(): Promise<{ telegram_id: number; role: string }[]> {
    const rows = sqlite.prepare('SELECT * FROM admins').all() as any[];
    return rows.map(r => ({ telegram_id: r.telegram_id, role: r.role }));
  },

  async isAdmin(telegramId: number): Promise<boolean> {
    if (telegramId === SUPER_ADMIN_ID || telegramId === env.adminId) return true;
    const row = sqlite.prepare('SELECT telegram_id FROM admins WHERE telegram_id = ?').get(telegramId);
    return !!row;
  },

  async getCommunities(type?: CommunityType): Promise<CommunityModel[]> {
    let rows: any[];
    if (type) {
      rows = sqlite.prepare('SELECT * FROM communities WHERE type = ? AND is_active = 1').all(type);
    } else {
      rows = sqlite.prepare('SELECT * FROM communities WHERE is_active = 1').all();
    }
    return rows.map(r => ({
      id: r.id,
      telegram_id: r.telegram_id,
      name: r.name,
      type: r.type as CommunityType,
      username: r.username || undefined,
      invite_link: r.invite_link || undefined,
      description: r.description || undefined,
      category: r.category,
      is_featured: !!r.is_featured,
      is_active: !!r.is_active,
      broadcast_enabled: !!r.broadcast_enabled,
      member_count: r.member_count,
      rules: r.rules || undefined,
      created_at: new Date(r.created_at),
      updated_at: new Date(r.updated_at),
    }));
  },

  async getCommunityByTelegramId(telegramId: number): Promise<CommunityModel | undefined> {
    const r = sqlite.prepare('SELECT * FROM communities WHERE telegram_id = ?').get(telegramId) as any;
    if (!r) return undefined;
    return {
      id: r.id,
      telegram_id: r.telegram_id,
      name: r.name,
      type: r.type as CommunityType,
      username: r.username || undefined,
      invite_link: r.invite_link || undefined,
      description: r.description || undefined,
      category: r.category,
      is_featured: !!r.is_featured,
      is_active: !!r.is_active,
      broadcast_enabled: !!r.broadcast_enabled,
      member_count: r.member_count,
      rules: r.rules || undefined,
      created_at: new Date(r.created_at),
      updated_at: new Date(r.updated_at),
    };
  },

  async saveCommunity(data: Omit<CommunityModel, 'id' | 'created_at' | 'updated_at'>): Promise<CommunityModel> {
    const existing = await this.getCommunityByTelegramId(data.telegram_id);
    const now = new Date().toISOString();
    if (existing) {
      sqlite.prepare(`
        UPDATE communities SET name = ?, type = ?, username = ?, invite_link = ?, description = ?, category = ?, is_featured = ?, is_active = ?, broadcast_enabled = ?, member_count = ?, rules = ?, updated_at = ?
        WHERE telegram_id = ?
      `).run(
        data.name,
        data.type,
        data.username || null,
        data.invite_link || null,
        data.description || null,
        data.category,
        data.is_featured ? 1 : 0,
        data.is_active ? 1 : 0,
        data.broadcast_enabled ? 1 : 0,
        data.member_count,
        data.rules || null,
        now,
        data.telegram_id
      );
      return (await this.getCommunityByTelegramId(data.telegram_id))!;
    }

    const info = sqlite.prepare(`
      INSERT INTO communities (telegram_id, name, type, username, invite_link, description, category, is_featured, is_active, broadcast_enabled, member_count, rules, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.telegram_id,
      data.name,
      data.type,
      data.username || null,
      data.invite_link || null,
      data.description || null,
      data.category,
      data.is_featured ? 1 : 0,
      data.is_active ? 1 : 0,
      data.broadcast_enabled ? 1 : 0,
      data.member_count,
      data.rules || null,
      now,
      now
    );

    return {
      ...data,
      id: Number(info.lastInsertRowid),
      created_at: new Date(now),
      updated_at: new Date(now),
    };
  },

  async searchCommunities(query: string, category?: string): Promise<CommunityModel[]> {
    const q = `%${query.toLowerCase().trim()}%`;
    let rows: any[];
    if (category) {
      rows = sqlite.prepare(`
        SELECT * FROM communities 
        WHERE is_active = 1 AND category = ? AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(username) LIKE ?)
      `).all(category, q, q, q);
    } else {
      rows = sqlite.prepare(`
        SELECT * FROM communities 
        WHERE is_active = 1 AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(username) LIKE ? OR LOWER(category) LIKE ?)
      `).all(q, q, q, q);
    }

    return rows.map(r => ({
      id: r.id,
      telegram_id: r.telegram_id,
      name: r.name,
      type: r.type as CommunityType,
      username: r.username || undefined,
      invite_link: r.invite_link || undefined,
      description: r.description || undefined,
      category: r.category,
      is_featured: !!r.is_featured,
      is_active: !!r.is_active,
      broadcast_enabled: !!r.broadcast_enabled,
      member_count: r.member_count,
      rules: r.rules || undefined,
      created_at: new Date(r.created_at),
      updated_at: new Date(r.updated_at),
    }));
  },

  async createBroadcast(data: Omit<BroadcastModel, 'id' | 'created_at'>): Promise<BroadcastModel> {
    const now = new Date().toISOString();
    const messageText = data.message_text || data.content || '';
    const info = sqlite.prepare(`
      INSERT INTO broadcasts (message_text, target_type, category, status, total_targets, sent_count, failed_count, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      messageText,
      data.target_type,
      data.category || null,
      data.status,
      data.total_targets || 0,
      data.sent_count || 0,
      data.failed_count || 0,
      data.created_by,
      now
    );

    return {
      ...data,
      message_text: messageText,
      id: Number(info.lastInsertRowid),
      created_at: new Date(now),
    };
  },

  async getBroadcasts(limit = 10): Promise<BroadcastModel[]> {
    const rows = sqlite.prepare('SELECT * FROM broadcasts ORDER BY id DESC LIMIT ?').all(limit) as any[];
    return rows.map(r => ({
      id: r.id,
      message_text: r.message_text,
      target_type: r.target_type,
      category: r.category || undefined,
      status: r.status as BroadcastStatus,
      total_targets: r.total_targets,
      sent_count: r.sent_count,
      success_count: r.sent_count,
      failed_count: r.failed_count,
      created_by: r.created_by,
      created_at: new Date(r.created_at),
    }));
  },

  async updateBroadcast(id: number, updates: Partial<BroadcastModel>): Promise<BroadcastModel | undefined> {
    const existing = sqlite.prepare('SELECT * FROM broadcasts WHERE id = ?').get(id) as any;
    if (!existing) return undefined;

    const merged = { ...existing, ...updates };
    sqlite.prepare(`
      UPDATE broadcasts SET status = ?, sent_count = ?, failed_count = ?, total_targets = ? WHERE id = ?
    `).run(
      merged.status,
      merged.sent_count,
      merged.failed_count,
      merged.total_targets,
      id
    );

    return {
      ...merged,
      created_at: new Date(existing.created_at),
    };
  },

  async getScheduledTasks(): Promise<ScheduledTaskModel[]> {
    const rows = sqlite.prepare('SELECT * FROM scheduled_tasks').all() as any[];
    if (rows.length === 0) {
      sqlite.prepare(`
        INSERT INTO scheduled_tasks (name, task_type, interval_minutes, is_enabled, last_run_at, next_run_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('AI Broadcast 30-Menit', 'ai_broadcast_30m', 30, 1, new Date().toISOString(), new Date(Date.now() + 30 * 60000).toISOString());
      return this.getScheduledTasks();
    }
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      task_type: r.task_type,
      interval_minutes: r.interval_minutes,
      is_enabled: !!r.is_enabled,
      last_run_at: r.last_run_at ? new Date(r.last_run_at) : undefined,
      next_run_at: r.next_run_at ? new Date(r.next_run_at) : undefined,
    }));
  },

  async updateScheduledTask(id: number, updates: Partial<ScheduledTaskModel>): Promise<void> {
    if (updates.is_enabled !== undefined) {
      sqlite.prepare('UPDATE scheduled_tasks SET is_enabled = ? WHERE id = ?').run(updates.is_enabled ? 1 : 0, id);
    }
    if (updates.last_run_at) {
      sqlite.prepare('UPDATE scheduled_tasks SET last_run_at = ? WHERE id = ?').run(updates.last_run_at.toISOString(), id);
    }
    if (updates.next_run_at) {
      sqlite.prepare('UPDATE scheduled_tasks SET next_run_at = ? WHERE id = ?').run(updates.next_run_at.toISOString(), id);
    }
  },

  async logAudit(adminId: number, action: string, details?: any): Promise<void> {
    sqlite.prepare('INSERT INTO audit_logs (admin_id, action, details, created_at) VALUES (?, ?, ?, ?)').run(
      adminId,
      action,
      details ? JSON.stringify(details) : null,
      new Date().toISOString()
    );
    console.log(`[AUDIT LOG] [${new Date().toISOString()}] Admin ${adminId} -> ${action}`);
  },

  async getAuditLogs(limit = 15) {
    return sqlite.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?').all(limit);
  },

  async logModeration(entry: Omit<ModerationLogModel, 'id' | 'created_at'>): Promise<void> {
    const chatId = entry.chat_id || entry.community_id || 0;
    const userId = entry.user_id || entry.telegram_id || 0;
    sqlite.prepare('INSERT INTO moderation_logs (chat_id, user_id, action, reason, detected_content, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
      chatId,
      userId,
      entry.action,
      entry.reason,
      entry.detected_content || null,
      new Date().toISOString()
    );
  },

  async getModerationLogs(limit = 15): Promise<ModerationLogModel[]> {
    const rows = sqlite.prepare('SELECT * FROM moderation_logs ORDER BY id DESC LIMIT ?').all(limit) as any[];
    return rows.map(r => ({
      id: r.id,
      chat_id: r.chat_id,
      community_id: r.chat_id,
      user_id: r.user_id,
      telegram_id: r.user_id,
      action: r.action,
      reason: r.reason,
      detected_content: r.detected_content || undefined,
      created_at: new Date(r.created_at),
    }));
  },

  async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const row = sqlite.prepare('SELECT value FROM settings WHERE key = ?').get(key) as any;
    if (row) {
      try {
        return JSON.parse(row.value);
      } catch {
        return row.value as any;
      }
    }
    return defaultValue;
  },

  async setSetting(key: string, value: any): Promise<void> {
    const val = typeof value === 'string' ? value : JSON.stringify(value);
    sqlite.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?').run(key, val, val);
  },
};
