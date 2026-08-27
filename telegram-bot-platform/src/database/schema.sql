-- Telegram Bot Management Platform Database Schema
-- Compatible with PostgreSQL 14+

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_banned BOOLEAN DEFAULT FALSE,
    warnings_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Administrators Table (RBAC)
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin', -- 'super_admin', 'admin', 'moderator'
    permissions JSONB DEFAULT '["all"]'::jsonb,
    added_by BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admins_telegram_id ON admins(telegram_id);

-- 3. Communities Table (Groups & Channels)
CREATE TABLE IF NOT EXISTS communities (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'group', 'channel'
    username VARCHAR(255),
    invite_link VARCHAR(512),
    description TEXT,
    category VARCHAR(100) DEFAULT 'community',
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    broadcast_enabled BOOLEAN DEFAULT TRUE,
    member_count INT DEFAULT 0,
    rules TEXT,
    welcome_msg TEXT,
    pinned_msg TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_communities_telegram_id ON communities(telegram_id);
CREATE INDEX IF NOT EXISTS idx_communities_type ON communities(type);
CREATE INDEX IF NOT EXISTS idx_communities_category ON communities(category);
CREATE INDEX IF NOT EXISTS idx_communities_status ON communities(is_active);

-- 4. Broadcasts Table
CREATE TABLE IF NOT EXISTS broadcasts (
    id SERIAL PRIMARY KEY,
    created_by BIGINT NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'manual', -- 'manual', 'ai'
    ai_model VARCHAR(100),
    target_filter JSONB DEFAULT '{"target": "all"}'::jsonb,
    total_targets INT DEFAULT 0,
    success_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    skipped_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_broadcasts_status ON broadcasts(status);
CREATE INDEX IF NOT EXISTS idx_broadcasts_created_at ON broadcasts(created_at);

-- 5. Broadcast Deliveries Table
CREATE TABLE IF NOT EXISTS broadcast_deliveries (
    id SERIAL PRIMARY KEY,
    broadcast_id INT REFERENCES broadcasts(id) ON DELETE CASCADE,
    community_id INT REFERENCES communities(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'sent', 'failed', 'rate_limited'
    error_message TEXT,
    delivered_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_broadcast_deliveries_b_id ON broadcast_deliveries(broadcast_id);

-- 6. Scheduled Tasks Table
CREATE TABLE IF NOT EXISTS scheduled_tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    task_type VARCHAR(100) NOT NULL, -- 'ai_broadcast_30m', 'cleanup', 'metrics'
    cron_expression VARCHAR(100) DEFAULT '*/30 * * * *',
    interval_minutes INT DEFAULT 30,
    is_enabled BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. AI Requests Table
CREATE TABLE IF NOT EXISTS ai_requests (
    id SERIAL PRIMARY KEY,
    prompt TEXT NOT NULL,
    category VARCHAR(100),
    tone VARCHAR(50),
    language VARCHAR(50),
    response_content TEXT,
    model VARCHAR(100),
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Moderation Logs Table
CREATE TABLE IF NOT EXISTS moderation_logs (
    id SERIAL PRIMARY KEY,
    community_id INT REFERENCES communities(id) ON DELETE CASCADE,
    telegram_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'warn', 'mute', 'ban', 'delete_msg'
    reason TEXT,
    message_snippet TEXT,
    ai_confidence NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_moderation_logs_community ON moderation_logs(community_id);

-- 9. Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL, -- 'welcome', 'rules', 'announcement', 'decoration'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(100),
    target_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- 11. System Settings Table
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
