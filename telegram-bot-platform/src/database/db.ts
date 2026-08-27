import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { SUPER_ADMIN_ID, CommunityType, BroadcastStatus } from '../config/constants.js';
import { env } from '../config/env.js';
import { ALL_200_PRODUCTS } from '../data/products200.js';

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'bot_database.sqlite');
const sqlite = new Database(dbPath);

// Enable WAL Mode and Fast Foreign Keys
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('synchronous = NORMAL');

// 1. Initialize SaaS Platform Database Schema
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

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admins (
    telegram_id INTEGER PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'super_admin',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL DEFAULT '📦',
    is_active INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    ram_mb INTEGER NOT NULL,
    cpu_percent INTEGER NOT NULL,
    disk_gb INTEGER NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 30,
    duration_label TEXT NOT NULL DEFAULT '30 Hari',
    badge TEXT NOT NULL DEFAULT 'POPULER',
    description TEXT NOT NULL,
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_popular INTEGER NOT NULL DEFAULT 0,
    is_new INTEGER NOT NULL DEFAULT 0,
    is_premium INTEGER NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 999,
    is_active INTEGER NOT NULL DEFAULT 1,
    egg_id INTEGER NOT NULL DEFAULT 15,
    docker_image TEXT NOT NULL DEFAULT 'ghcr.io/pterodactyl/yolks:nodejs_20',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    UNIQUE(telegram_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS wishlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(telegram_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT NOT NULL UNIQUE,
    telegram_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'BALANCE',
    payment_status TEXT NOT NULL DEFAULT 'PAID',
    order_status TEXT NOT NULL DEFAULT 'COMPLETED',
    server_id INTEGER,
    notes TEXT,
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

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_code TEXT NOT NULL UNIQUE,
    telegram_id INTEGER NOT NULL,
    order_code TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PAID',
    payment_method TEXT NOT NULL DEFAULT 'QRIS',
    paid_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS coupons (
    code TEXT PRIMARY KEY,
    discount_percent INTEGER NOT NULL DEFAULT 0,
    discount_amount INTEGER NOT NULL DEFAULT 0,
    min_purchase INTEGER NOT NULL DEFAULT 0,
    max_uses INTEGER NOT NULL DEFAULT 100,
    current_uses INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    coupon_code TEXT NOT NULL,
    is_used INTEGER NOT NULL DEFAULT 0,
    used_at TEXT,
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

  CREATE TABLE IF NOT EXISTS saved_communities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    community_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(telegram_id, community_id)
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

  CREATE TABLE IF NOT EXISTS scheduled_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    task_type TEXT NOT NULL,
    interval_minutes INTEGER NOT NULL,
    is_enabled INTEGER NOT NULL DEFAULT 1,
    last_run_at TEXT,
    next_run_at TEXT
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_code TEXT NOT NULL UNIQUE,
    telegram_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'technical',
    priority TEXT NOT NULL DEFAULT 'MEDIUM',
    status TEXT NOT NULL DEFAULT 'OPEN',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ticket_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    sender_type TEXT NOT NULL DEFAULT 'user',
    sender_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS recently_viewed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    viewed_at TEXT NOT NULL,
    UNIQUE(telegram_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS user_preferences (
    telegram_id INTEGER PRIMARY KEY,
    language TEXT NOT NULL DEFAULT 'id',
    appearance TEXT NOT NULL DEFAULT 'cozy_dark',
    notifications_enabled INTEGER NOT NULL DEFAULT 1,
    timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS decorations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    community_id INTEGER NOT NULL,
    component_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned INTEGER NOT NULL DEFAULT 1,
    is_applied INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
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

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ai_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    feature_type TEXT NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS deposits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reff_id TEXT NOT NULL UNIQUE,
    pay_id TEXT,
    telegram_id INTEGER NOT NULL,
    product_id TEXT,
    amount_request INTEGER NOT NULL,
    amount_total INTEGER NOT NULL,
    fee INTEGER NOT NULL DEFAULT 0,
    method_code TEXT NOT NULL DEFAULT 'QRIS',
    status TEXT NOT NULL DEFAULT 'pending',
    qr_image TEXT,
    qr_string TEXT,
    pay_url TEXT,
    created_at TEXT NOT NULL,
    paid_at TEXT,
    expired_at TEXT
  );
`);

try {
  sqlite.exec('ALTER TABLE deposits ADD COLUMN product_id TEXT');
} catch {}

// 2. Initial Seeding of Admin, Categories, Products & Coupons
const adminCheck = sqlite.prepare('SELECT telegram_id FROM admins WHERE telegram_id = ?').get(SUPER_ADMIN_ID);
if (!adminCheck) {
  sqlite.prepare('INSERT INTO admins (telegram_id, role, created_at) VALUES (?, ?, ?)').run(
    SUPER_ADMIN_ID,
    'super_admin',
    new Date().toISOString()
  );
}

// Seed Categories
const insertCat = sqlite.prepare(`
  INSERT INTO categories (id, name, description, icon, is_active)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET name=excluded.name, description=excluded.description, icon=excluded.icon, is_active=1
`);
insertCat.run('whatsapp', 'Bot WhatsApp', 'Hosting Bot Baileys Node.js 20 & Multi-Session 24 Jam', '🟢', 1);
insertCat.run('telegram', 'Bot Telegram', 'Hosting Python 3.11 & Node.js Telegraf 24 Jam', '🔵', 1);
insertCat.run('minecraft', 'Minecraft Java', 'Paper & Purpur Server TPS 20.0 Anti-DDoS 100G', '⛏️', 1);
insertCat.run('application', 'App Cloud & API', 'Hosting Express.js, FastAPI, Flask & Custom Linux App', '🚀', 1);

// Seed / Sync All 200 Products
const insertProd = sqlite.prepare(`
  INSERT INTO products (id, category_id, name, price, ram_mb, cpu_percent, disk_gb, duration_days, duration_label, badge, description, is_featured, is_popular, is_new, is_premium, stock, is_active, egg_id, docker_image, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET 
    category_id=excluded.category_id,
    name=excluded.name,
    price=excluded.price,
    ram_mb=excluded.ram_mb,
    cpu_percent=excluded.cpu_percent,
    disk_gb=excluded.disk_gb,
    duration_days=excluded.duration_days,
    duration_label=excluded.duration_label,
    badge=excluded.badge,
    description=excluded.description,
    is_featured=excluded.is_featured,
    is_popular=excluded.is_popular,
    is_new=excluded.is_new,
    is_premium=excluded.is_premium,
    stock=excluded.stock,
    is_active=1,
    egg_id=excluded.egg_id,
    docker_image=excluded.docker_image
`);

const nowIso = new Date().toISOString();
for (const p of ALL_200_PRODUCTS) {
  insertProd.run(
    p.id,
    p.category_id,
    p.name,
    p.price,
    p.ram_mb,
    p.cpu_percent,
    p.disk_gb,
    p.duration_days,
    p.duration_label,
    p.badge,
    p.description,
    p.is_featured ? 1 : 0,
    p.is_popular ? 1 : 0,
    p.is_new ? 1 : 0,
    p.is_premium ? 1 : 0,
    p.stock,
    1,
    p.egg_id,
    p.docker_image,
    nowIso
  );
}

// Seed Initial Coupons
const coupCount = (sqlite.prepare('SELECT count(*) as count FROM coupons').get() as any).count;
if (coupCount === 0) {
  const insertCoup = sqlite.prepare('INSERT INTO coupons (code, discount_percent, discount_amount, min_purchase, max_uses, current_uses, is_active, description, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  insertCoup.run('WELCOME10', 10, 0, 0, 500, 12, 1, 'Diskon 10% Semua Paket Tanpa Min Belanja', '2027-12-31T23:59:59Z');
  insertCoup.run('DISKON20', 20, 0, 15000, 200, 4, 1, 'Diskon 20% Pembelian Min Rp 15.000', '2027-12-31T23:59:59Z');
  insertCoup.run('RULLZYESAAS', 30, 0, 20000, 100, 0, 1, 'Diskon Spesial 30% Promo Launching Platform', '2027-12-31T23:59:59Z');
}

// Seed Initial Communities
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

  insertComm.run(
    -1004300438986,
    'fufufafa dan RullzyeStore Cloud Hosting 🚀',
    CommunityType.GROUP,
    undefined,
    undefined,
    'Grup resmi diskusi server Pterodactyl, Bot WhatsApp, dan Bot Telegram.',
    'hosting',
    1,
    1,
    1,
    150,
    '1. No Spam\n2. No Scam / Judi Online\n3. Sopan dan saling menghargai',
    new Date().toISOString(),
    new Date().toISOString()
  );

  insertComm.run(
    -1004400415668,
    'Rullzyecloud CHANEL|Pteroductyl Panel',
    CommunityType.CHANNEL,
    'rullzyeclouds',
    'https://t.me/rullzyeclouds',
    'Official Channel Pterodactyl Panel, promo voucher server mingguan & tutorial.',
    'hosting',
    1,
    1,
    1,
    520,
    '',
    new Date().toISOString(),
    new Date().toISOString()
  );
}

// 3. Exported Models
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

export interface TransactionModel {
  id?: number;
  telegram_id: number;
  type: string;
  amount: number;
  description: string;
  created_at: Date;
}

export interface ProductModel {
  id: string;
  category_id: string;
  name: string;
  price: number;
  ram_mb: number;
  cpu_percent: number;
  disk_gb: number;
  duration_days: number;
  duration_label: string;
  badge: string;
  description: string;
  is_featured: boolean;
  is_popular: boolean;
  is_new: boolean;
  is_premium: boolean;
  stock: number;
  is_active: boolean;
  egg_id: number;
  docker_image: string;
  created_at: Date;
}

export interface OrderModel {
  id: number;
  order_code: string;
  telegram_id: number;
  product_id: string;
  product_name: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  server_id?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
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

export interface InvoiceModel {
  id: number;
  invoice_code: string;
  telegram_id: number;
  order_code: string;
  amount: number;
  status: string;
  payment_method: string;
  paid_at?: Date;
  created_at: Date;
}

export interface CouponModel {
  code: string;
  discount_percent: number;
  discount_amount: number;
  min_purchase: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  description?: string;
  expires_at: Date;
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

export interface TicketModel {
  id: number;
  ticket_code: string;
  telegram_id: number;
  subject: string;
  category: string;
  priority: string;
  status: 'OPEN' | 'PROCESSING' | 'WAITING' | 'RESOLVED' | 'CLOSED';
  created_at: Date;
  updated_at: Date;
}

export interface NotificationModel {
  id: number;
  telegram_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: Date;
}

export interface BroadcastModel {
  id: number;
  title?: string;
  type?: string;
  message_text?: string;
  content?: string;
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

export interface DepositModel {
  id?: number;
  reff_id: string;
  pay_id?: string;
  telegram_id: number;
  product_id?: string;
  amount_request: number;
  amount_total: number;
  fee: number;
  method_code: string;
  status: string;
  qr_image?: string;
  qr_string?: string;
  pay_url?: string;
  created_at: Date;
  paid_at?: Date;
  expired_at?: Date;
}

// 4. DB Controller & Methods
export const db = {
  // --- USERS & WALLET ---
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

    if (validRef) {
      sqlite.prepare('UPDATE users SET balance = balance + 2000, referral_count = referral_count + 1 WHERE telegram_id = ?').run(validRef);
      refBonusAwarded = true;
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
      type: 'topup_balance',
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
      type: 'deduct_balance',
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

  // --- PRODUCTS & CATEGORIES ---
  async getProducts(filter?: { category_id?: string; is_featured?: boolean; is_popular?: boolean; is_new?: boolean; is_premium?: boolean; search?: string }): Promise<ProductModel[]> {
    let sql = 'SELECT * FROM products WHERE is_active = 1';
    const params: any[] = [];

    if (filter?.category_id) {
      sql += ' AND category_id = ?';
      params.push(filter.category_id);
    }
    if (filter?.is_featured) {
      sql += ' AND is_featured = 1';
    }
    if (filter?.is_popular) {
      sql += ' AND is_popular = 1';
    }
    if (filter?.is_new) {
      sql += ' AND is_new = 1';
    }
    if (filter?.is_premium) {
      sql += ' AND is_premium = 1';
    }
    if (filter?.search) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)';
      const q = `%${filter.search.toLowerCase()}%`;
      params.push(q, q);
    }

    sql += ' ORDER BY price ASC';
    const rows = sqlite.prepare(sql).all(...params) as any[];
    return rows.map(r => ({
      id: r.id,
      category_id: r.category_id,
      name: r.name,
      price: r.price,
      ram_mb: r.ram_mb,
      cpu_percent: r.cpu_percent,
      disk_gb: r.disk_gb,
      duration_days: r.duration_days,
      duration_label: r.duration_label,
      badge: r.badge,
      description: r.description,
      is_featured: !!r.is_featured,
      is_popular: !!r.is_popular,
      is_new: !!r.is_new,
      is_premium: !!r.is_premium,
      stock: r.stock,
      is_active: !!r.is_active,
      egg_id: r.egg_id,
      docker_image: r.docker_image,
      created_at: new Date(r.created_at),
    }));
  },

  async getProductById(id: string): Promise<ProductModel | undefined> {
    const r = sqlite.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    if (!r) return undefined;
    return {
      id: r.id,
      category_id: r.category_id,
      name: r.name,
      price: r.price,
      ram_mb: r.ram_mb,
      cpu_percent: r.cpu_percent,
      disk_gb: r.disk_gb,
      duration_days: r.duration_days,
      duration_label: r.duration_label,
      badge: r.badge,
      description: r.description,
      is_featured: !!r.is_featured,
      is_popular: !!r.is_popular,
      is_new: !!r.is_new,
      is_premium: !!r.is_premium,
      stock: r.stock,
      is_active: !!r.is_active,
      egg_id: r.egg_id,
      docker_image: r.docker_image,
      created_at: new Date(r.created_at),
    };
  },

  async saveProduct(p: Omit<ProductModel, 'created_at'>): Promise<void> {
    const existing = await this.getProductById(p.id);
    const now = new Date().toISOString();
    if (existing) {
      sqlite.prepare(`
        UPDATE products SET category_id = ?, name = ?, price = ?, ram_mb = ?, cpu_percent = ?, disk_gb = ?, duration_days = ?, duration_label = ?, badge = ?, description = ?, is_featured = ?, is_popular = ?, is_new = ?, is_premium = ?, stock = ?, is_active = ?, egg_id = ?, docker_image = ?
        WHERE id = ?
      `).run(
        p.category_id, p.name, p.price, p.ram_mb, p.cpu_percent, p.disk_gb, p.duration_days, p.duration_label, p.badge, p.description, p.is_featured ? 1 : 0, p.is_popular ? 1 : 0, p.is_new ? 1 : 0, p.is_premium ? 1 : 0, p.stock, p.is_active ? 1 : 0, p.egg_id, p.docker_image, p.id
      );
    } else {
      sqlite.prepare(`
        INSERT INTO products (id, category_id, name, price, ram_mb, cpu_percent, disk_gb, duration_days, duration_label, badge, description, is_featured, is_popular, is_new, is_premium, stock, is_active, egg_id, docker_image, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        p.id, p.category_id, p.name, p.price, p.ram_mb, p.cpu_percent, p.disk_gb, p.duration_days, p.duration_label, p.badge, p.description, p.is_featured ? 1 : 0, p.is_popular ? 1 : 0, p.is_new ? 1 : 0, p.is_premium ? 1 : 0, p.stock, p.is_active ? 1 : 0, p.egg_id, p.docker_image, now
      );
    }
  },

  async deleteProduct(id: string): Promise<void> {
    sqlite.prepare('DELETE FROM products WHERE id = ?').run(id);
  },

  async getCategories() {
    return sqlite.prepare('SELECT * FROM categories WHERE is_active = 1').all() as any[];
  },

  // --- SHOPPING CART & WISHLIST ---
  async getCart(telegramId: number) {
    const rows = sqlite.prepare(`
      SELECT c.id as cart_id, c.quantity, p.* 
      FROM cart_items c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.telegram_id = ?
    `).all(telegramId) as any[];
    return rows;
  },

  async addToCart(telegramId: number, productId: string, quantity = 1) {
    sqlite.prepare(`
      INSERT INTO cart_items (telegram_id, product_id, quantity, created_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(telegram_id, product_id) DO UPDATE SET quantity = quantity + ?
    `).run(telegramId, productId, quantity, new Date().toISOString(), quantity);
  },

  async removeFromCart(telegramId: number, productId: string) {
    sqlite.prepare('DELETE FROM cart_items WHERE telegram_id = ? AND product_id = ?').run(telegramId, productId);
  },

  async clearCart(telegramId: number) {
    sqlite.prepare('DELETE FROM cart_items WHERE telegram_id = ?').run(telegramId);
  },

  async getWishlist(telegramId: number) {
    const rows = sqlite.prepare(`
      SELECT w.id as wishlist_id, p.* 
      FROM wishlist_items w 
      JOIN products p ON w.product_id = p.id 
      WHERE w.telegram_id = ?
    `).all(telegramId) as any[];
    return rows;
  },

  async toggleWishlist(telegramId: number, productId: string): Promise<boolean> {
    const existing = sqlite.prepare('SELECT id FROM wishlist_items WHERE telegram_id = ? AND product_id = ?').get(telegramId, productId);
    if (existing) {
      sqlite.prepare('DELETE FROM wishlist_items WHERE telegram_id = ? AND product_id = ?').run(telegramId, productId);
      return false;
    } else {
      sqlite.prepare('INSERT INTO wishlist_items (telegram_id, product_id, created_at) VALUES (?, ?, ?)').run(telegramId, productId, new Date().toISOString());
      return true;
    }
  },

  // --- RECENTLY VIEWED ---
  async recordRecentlyViewed(telegramId: number, productId: string) {
    sqlite.prepare(`
      INSERT INTO recently_viewed (telegram_id, product_id, viewed_at)
      VALUES (?, ?, ?)
      ON CONFLICT(telegram_id, product_id) DO UPDATE SET viewed_at = ?
    `).run(telegramId, productId, new Date().toISOString(), new Date().toISOString());
  },

  async getRecentlyViewed(telegramId: number, limit = 5) {
    return sqlite.prepare(`
      SELECT p.*, r.viewed_at 
      FROM recently_viewed r 
      JOIN products p ON r.product_id = p.id 
      WHERE r.telegram_id = ? 
      ORDER BY r.viewed_at DESC LIMIT ?
    `).all(telegramId, limit) as any[];
  },

  // --- ORDERS & INVOICES ---
  async createOrder(data: { telegram_id: number; product_id: string; product_name: string; total_amount: number; payment_method?: string; payment_status?: string; order_status?: string; server_id?: number; notes?: string }): Promise<OrderModel> {
    const orderCode = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(-3).toUpperCase()}`;
    const invoiceCode = `INV-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();

    const info = sqlite.prepare(`
      INSERT INTO orders (order_code, telegram_id, product_id, product_name, total_amount, payment_method, payment_status, order_status, server_id, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderCode, data.telegram_id, data.product_id, data.product_name, data.total_amount, data.payment_method || 'BALANCE', data.payment_status || 'PAID', data.order_status || 'COMPLETED', data.server_id || null, data.notes || null, now, now
    );

    // Create corresponding invoice
    sqlite.prepare(`
      INSERT INTO invoices (invoice_code, telegram_id, order_code, amount, status, payment_method, paid_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      invoiceCode, data.telegram_id, orderCode, data.total_amount, 'PAID', data.payment_method || 'BALANCE', now, now
    );

    return {
      id: Number(info.lastInsertRowid),
      order_code: orderCode,
      telegram_id: data.telegram_id,
      product_id: data.product_id,
      product_name: data.product_name,
      total_amount: data.total_amount,
      payment_method: data.payment_method || 'BALANCE',
      payment_status: data.payment_status || 'PAID',
      order_status: data.order_status || 'COMPLETED',
      server_id: data.server_id,
      notes: data.notes,
      created_at: new Date(now),
      updated_at: new Date(now),
    };
  },

  async getUserOrders(telegramId: number, status?: string): Promise<OrderModel[]> {
    let sql = 'SELECT * FROM orders WHERE telegram_id = ?';
    const params: any[] = [telegramId];
    if (status) {
      sql += ' AND order_status = ?';
      params.push(status);
    }
    sql += ' ORDER BY id DESC';
    const rows = sqlite.prepare(sql).all(...params) as any[];
    return rows.map(r => ({
      id: r.id,
      order_code: r.order_code,
      telegram_id: r.telegram_id,
      product_id: r.product_id,
      product_name: r.product_name,
      total_amount: r.total_amount,
      payment_method: r.payment_method,
      payment_status: r.payment_status,
      order_status: r.order_status,
      server_id: r.server_id,
      notes: r.notes,
      created_at: new Date(r.created_at),
      updated_at: new Date(r.updated_at),
    }));
  },

  async getAllOrders(status?: string): Promise<OrderModel[]> {
    let sql = 'SELECT * FROM orders';
    const params: any[] = [];
    if (status) {
      sql += ' WHERE order_status = ?';
      params.push(status);
    }
    sql += ' ORDER BY id DESC';
    const rows = sqlite.prepare(sql).all(...params) as any[];
    return rows.map(r => ({
      id: r.id,
      order_code: r.order_code,
      telegram_id: r.telegram_id,
      product_id: r.product_id,
      product_name: r.product_name,
      total_amount: r.total_amount,
      payment_method: r.payment_method,
      payment_status: r.payment_status,
      order_status: r.order_status,
      server_id: r.server_id,
      notes: r.notes,
      created_at: new Date(r.created_at),
      updated_at: new Date(r.updated_at),
    }));
  },

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    sqlite.prepare('UPDATE orders SET order_status = ?, updated_at = ? WHERE id = ?').run(status, new Date().toISOString(), orderId);
  },

  async getUserInvoices(telegramId: number): Promise<InvoiceModel[]> {
    const rows = sqlite.prepare('SELECT * FROM invoices WHERE telegram_id = ? ORDER BY id DESC').all(telegramId) as any[];
    return rows.map(r => ({
      id: r.id,
      invoice_code: r.invoice_code,
      telegram_id: r.telegram_id,
      order_code: r.order_code,
      amount: r.amount,
      status: r.status,
      payment_method: r.payment_method,
      paid_at: r.paid_at ? new Date(r.paid_at) : undefined,
      created_at: new Date(r.created_at),
    }));
  },

  // --- COUPONS ---
  async getCoupons(): Promise<CouponModel[]> {
    const rows = sqlite.prepare('SELECT * FROM coupons WHERE is_active = 1').all() as any[];
    return rows.map(r => ({
      code: r.code,
      discount_percent: r.discount_percent,
      discount_amount: r.discount_amount,
      min_purchase: r.min_purchase,
      max_uses: r.max_uses,
      current_uses: r.current_uses,
      is_active: !!r.is_active,
      description: r.description,
      expires_at: new Date(r.expires_at),
    }));
  },

  async getCoupon(code: string): Promise<CouponModel | undefined> {
    const r = sqlite.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(code.toUpperCase().trim()) as any;
    if (!r) return undefined;
    return {
      code: r.code,
      discount_percent: r.discount_percent,
      discount_amount: r.discount_amount,
      min_purchase: r.min_purchase,
      max_uses: r.max_uses,
      current_uses: r.current_uses,
      is_active: !!r.is_active,
      description: r.description,
      expires_at: new Date(r.expires_at),
    };
  },

  // --- TICKETS (SUPPORT) ---
  async createTicket(telegramId: number, subject: string, category = 'technical', priority = 'MEDIUM'): Promise<TicketModel> {
    const ticketCode = `TCK-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();
    const info = sqlite.prepare(`
      INSERT INTO tickets (ticket_code, telegram_id, subject, category, priority, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'OPEN', ?, ?)
    `).run(ticketCode, telegramId, subject, category, priority, now, now);

    return {
      id: Number(info.lastInsertRowid),
      ticket_code: ticketCode,
      telegram_id: telegramId,
      subject,
      category,
      priority,
      status: 'OPEN',
      created_at: new Date(now),
      updated_at: new Date(now),
    };
  },

  async getUserTickets(telegramId: number): Promise<TicketModel[]> {
    const rows = sqlite.prepare('SELECT * FROM tickets WHERE telegram_id = ? ORDER BY id DESC').all(telegramId) as any[];
    return rows.map(r => ({
      id: r.id,
      ticket_code: r.ticket_code,
      telegram_id: r.telegram_id,
      subject: r.subject,
      category: r.category,
      priority: r.priority,
      status: r.status,
      created_at: new Date(r.created_at),
      updated_at: new Date(r.updated_at),
    }));
  },

  async updateTicketStatus(ticketId: number, status: 'OPEN' | 'PROCESSING' | 'WAITING' | 'RESOLVED' | 'CLOSED'): Promise<void> {
    sqlite.prepare('UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?').run(status, new Date().toISOString(), ticketId);
  },

  // --- NOTIFICATIONS ---
  async createNotification(telegramId: number, title: string, message: string, type = 'info') {
    sqlite.prepare('INSERT INTO notifications (telegram_id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, 0, ?)').run(
      telegramId, title, message, type, new Date().toISOString()
    );
  },

  async getUserNotifications(telegramId: number): Promise<NotificationModel[]> {
    const rows = sqlite.prepare('SELECT * FROM notifications WHERE telegram_id = ? ORDER BY id DESC LIMIT 15').all(telegramId) as any[];
    return rows.map(r => ({
      id: r.id,
      telegram_id: r.telegram_id,
      title: r.title,
      message: r.message,
      type: r.type,
      is_read: !!r.is_read,
      created_at: new Date(r.created_at),
    }));
  },

  // --- PREFERENCES ---
  async getUserPreferences(telegramId: number) {
    let p = sqlite.prepare('SELECT * FROM user_preferences WHERE telegram_id = ?').get(telegramId) as any;
    if (!p) {
      sqlite.prepare('INSERT INTO user_preferences (telegram_id, language, appearance, notifications_enabled, timezone, updated_at) VALUES (?, ?, ?, ?, ?, ?)').run(
        telegramId, 'id', 'cozy_dark', 1, 'Asia/Jakarta', new Date().toISOString()
      );
      p = sqlite.prepare('SELECT * FROM user_preferences WHERE telegram_id = ?').get(telegramId);
    }
    return p;
  },

  async updateUserPreferences(telegramId: number, updates: Partial<{ language: string; appearance: string; notifications_enabled: boolean; timezone: string }>) {
    const current = await this.getUserPreferences(telegramId);
    sqlite.prepare(`
      UPDATE user_preferences SET language = ?, appearance = ?, notifications_enabled = ?, timezone = ?, updated_at = ?
      WHERE telegram_id = ?
    `).run(
      updates.language || current.language,
      updates.appearance || current.appearance,
      updates.notifications_enabled !== undefined ? (updates.notifications_enabled ? 1 : 0) : current.notifications_enabled,
      updates.timezone || current.timezone,
      new Date().toISOString(),
      telegramId
    );
  },

  // --- SERVER MANAGEMENT ---
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

  // --- COMMUNITIES ---
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
        data.name, data.type, data.username || null, data.invite_link || null, data.description || null, data.category, data.is_featured ? 1 : 0, data.is_active ? 1 : 0, data.broadcast_enabled ? 1 : 0, data.member_count, data.rules || null, now, data.telegram_id
      );
      return (await this.getCommunityByTelegramId(data.telegram_id))!;
    }

    const info = sqlite.prepare(`
      INSERT INTO communities (telegram_id, name, type, username, invite_link, description, category, is_featured, is_active, broadcast_enabled, member_count, rules, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.telegram_id, data.name, data.type, data.username || null, data.invite_link || null, data.description || null, data.category, data.is_featured ? 1 : 0, data.is_active ? 1 : 0, data.broadcast_enabled ? 1 : 0, data.member_count, data.rules || null, now, now
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

  // --- SAVED COMMUNITIES ---
  async toggleSavedCommunity(telegramId: number, communityId: number): Promise<boolean> {
    const existing = sqlite.prepare('SELECT id FROM saved_communities WHERE telegram_id = ? AND community_id = ?').get(telegramId, communityId);
    if (existing) {
      sqlite.prepare('DELETE FROM saved_communities WHERE telegram_id = ? AND community_id = ?').run(telegramId, communityId);
      return false;
    } else {
      sqlite.prepare('INSERT INTO saved_communities (telegram_id, community_id, created_at) VALUES (?, ?, ?)').run(telegramId, communityId, new Date().toISOString());
      return true;
    }
  },

  async getSavedCommunities(telegramId: number) {
    return sqlite.prepare(`
      SELECT c.* FROM saved_communities s
      JOIN communities c ON s.community_id = c.id
      WHERE s.telegram_id = ? AND c.is_active = 1
    `).all(telegramId) as any[];
  },

  // --- AI LOGS ---
  async logAiRequest(telegramId: number, featureType: string, prompt: string, response: string) {
    sqlite.prepare('INSERT INTO ai_requests (telegram_id, feature_type, prompt, response, created_at) VALUES (?, ?, ?, ?, ?)').run(
      telegramId, featureType, prompt, response, new Date().toISOString()
    );
  },

  // --- BROADCASTS & TASKS ---
  async createBroadcast(data: Omit<BroadcastModel, 'id' | 'created_at'>): Promise<BroadcastModel> {
    const now = new Date().toISOString();
    const messageText = data.message_text || data.content || '';
    const info = sqlite.prepare(`
      INSERT INTO broadcasts (message_text, target_type, category, status, total_targets, sent_count, failed_count, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      messageText, data.target_type || 'all_communities', data.category || null, data.status, data.total_targets || 0, data.sent_count || 0, data.failed_count || 0, data.created_by, now
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
      content: r.message_text,
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
      merged.sent_count || merged.success_count || 0,
      merged.failed_count || 0,
      merged.total_targets || 0,
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

  // --- MODERATION & LOGS ---
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

  // --- SETTINGS ---
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

  // --- FLOWIX DEPOSITS & PAYMENTS ---
  async createDepositRecord(data: Omit<DepositModel, 'id' | 'created_at'>): Promise<DepositModel> {
    const now = new Date().toISOString();
    const info = sqlite.prepare(`
      INSERT INTO deposits (reff_id, pay_id, telegram_id, product_id, amount_request, amount_total, fee, method_code, status, qr_image, qr_string, pay_url, created_at, paid_at, expired_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.reff_id,
      data.pay_id || null,
      data.telegram_id,
      data.product_id || null,
      data.amount_request,
      data.amount_total,
      data.fee || 0,
      data.method_code || 'QRIS',
      data.status || 'pending',
      data.qr_image || null,
      data.qr_string || null,
      data.pay_url || null,
      now,
      data.paid_at ? data.paid_at.toISOString() : null,
      data.expired_at ? data.expired_at.toISOString() : null
    );

    return {
      ...data,
      id: Number(info.lastInsertRowid),
      created_at: new Date(now),
    };
  },

  async getDepositByReffId(reffId: string): Promise<DepositModel | undefined> {
    const r = sqlite.prepare('SELECT * FROM deposits WHERE reff_id = ?').get(reffId) as any;
    if (!r) return undefined;
    return {
      id: r.id,
      reff_id: r.reff_id,
      pay_id: r.pay_id || undefined,
      telegram_id: r.telegram_id,
      product_id: r.product_id || undefined,
      amount_request: r.amount_request,
      amount_total: r.amount_total,
      fee: r.fee,
      method_code: r.method_code,
      status: r.status,
      qr_image: r.qr_image || undefined,
      qr_string: r.qr_string || undefined,
      pay_url: r.pay_url || undefined,
      created_at: new Date(r.created_at),
      paid_at: r.paid_at ? new Date(r.paid_at) : undefined,
      expired_at: r.expired_at ? new Date(r.expired_at) : undefined,
    };
  },

  async updateDepositStatus(reffId: string, status: string, paidAt?: Date): Promise<void> {
    if (paidAt) {
      sqlite.prepare('UPDATE deposits SET status = ?, paid_at = ? WHERE reff_id = ?').run(
        status,
        paidAt.toISOString(),
        reffId
      );
    } else {
      sqlite.prepare('UPDATE deposits SET status = ? WHERE reff_id = ?').run(status, reffId);
    }
  },

  async getUserDeposits(telegramId: number, limit = 10): Promise<DepositModel[]> {
    const rows = sqlite.prepare('SELECT * FROM deposits WHERE telegram_id = ? ORDER BY id DESC LIMIT ?').all(telegramId, limit) as any[];
    return rows.map(r => ({
      id: r.id,
      reff_id: r.reff_id,
      pay_id: r.pay_id || undefined,
      telegram_id: r.telegram_id,
      product_id: r.product_id || undefined,
      amount_request: r.amount_request,
      amount_total: r.amount_total,
      fee: r.fee,
      method_code: r.method_code,
      status: r.status,
      qr_image: r.qr_image || undefined,
      qr_string: r.qr_string || undefined,
      pay_url: r.pay_url || undefined,
      created_at: new Date(r.created_at),
      paid_at: r.paid_at ? new Date(r.paid_at) : undefined,
      expired_at: r.expired_at ? new Date(r.expired_at) : undefined,
    }));
  },

  async getAllDeposits(limit = 30): Promise<DepositModel[]> {
    const rows = sqlite.prepare('SELECT * FROM deposits ORDER BY id DESC LIMIT ?').all(limit) as any[];
    return rows.map(r => ({
      id: r.id,
      reff_id: r.reff_id,
      pay_id: r.pay_id || undefined,
      telegram_id: r.telegram_id,
      product_id: r.product_id || undefined,
      amount_request: r.amount_request,
      amount_total: r.amount_total,
      fee: r.fee,
      method_code: r.method_code,
      status: r.status,
      qr_image: r.qr_image || undefined,
      qr_string: r.qr_string || undefined,
      pay_url: r.pay_url || undefined,
      created_at: new Date(r.created_at),
      paid_at: r.paid_at ? new Date(r.paid_at) : undefined,
      expired_at: r.expired_at ? new Date(r.expired_at) : undefined,
    }));
  },

  // --- ADMIN SECURITY & AUDIT ---
  async isAdmin(telegramId: number): Promise<boolean> {
    if (telegramId === SUPER_ADMIN_ID || telegramId === env.adminId) return true;
    const row = sqlite.prepare('SELECT telegram_id FROM admins WHERE telegram_id = ?').get(telegramId);
    return !!row;
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

  // --- STATS OVERVIEW FOR ADMIN DASHBOARD ---
  async getPlatformStats() {
    const totalUsers = (sqlite.prepare("SELECT count(*) as c FROM users").get() as any).c;
    const totalServers = (sqlite.prepare("SELECT count(*) as c FROM user_servers WHERE status = 'active'").get() as any).c;
    const totalRevenue = (sqlite.prepare("SELECT COALESCE(sum(total_amount), 0) as s FROM orders WHERE payment_status = 'PAID'").get() as any).s;
    const totalOrders = (sqlite.prepare("SELECT count(*) as c FROM orders").get() as any).c;
    const totalCommunities = (sqlite.prepare("SELECT count(*) as c FROM communities WHERE is_active = 1").get() as any).c;
    const totalTickets = (sqlite.prepare("SELECT count(*) as c FROM tickets").get() as any).c;
    const openTickets = (sqlite.prepare("SELECT count(*) as c FROM tickets WHERE status = 'OPEN' OR status = 'PROCESSING'").get() as any).c;

    return {
      totalUsers,
      totalServers,
      totalRevenue,
      totalOrders,
      totalCommunities,
      totalTickets,
      openTickets,
    };
  },
};
