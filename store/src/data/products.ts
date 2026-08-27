import { ProductPlan, ProductCategory } from '@/types';

export const CATEGORIES: { id: ProductCategory; name: string; icon: string; shortDesc: string; popular?: boolean }[] = [
  {
    id: 'whatsapp',
    name: 'Bot WhatsApp',
    icon: 'MessageSquare',
    shortDesc: 'Node.js 20 & Baileys Ready dengan Auto Restart & Web Console 24/7',
    popular: true,
  },
  {
    id: 'telegram',
    name: 'Bot Telegram',
    icon: 'Send',
    shortDesc: 'Python 3.11 & Node.js Ready dengan Webhook Support & Auto Restart',
    popular: true,
  },
  {
    id: 'minecraft',
    name: 'Minecraft Java & Bedrock',
    icon: 'Gamepad2',
    shortDesc: 'Purpur / Paper 1.20.4 TPS 20.0 dengan Proteksi Anti-DDoS 100 Gbps',
    popular: true,
  },
  {
    id: 'application',
    name: 'App Cloud & API',
    icon: 'Layers',
    shortDesc: 'Express.js, FastAPI, Flask, Django & Custom Linux App',
  },
  {
    id: 'generic',
    name: 'Generic Linux App',
    icon: 'Server',
    shortDesc: 'Custom Docker Image, Full Resource Limit & Terminal Console',
  },
];

interface TierConfig {
  code: string;
  name: string;
  ramMb: number;
  cpuPercent: number;
  diskGb: number;
  basePrice30d: number;
  badge?: string;
  popular?: boolean;
  features: string[];
}

const DURATIONS = [
  { key: '7d', label: '7 Hari', mult: 0.35, minPrice: 1000 },
  { key: '14d', label: '14 Hari', mult: 0.60, minPrice: 1500 },
  { key: '30d', label: '30 Hari', mult: 1.00, minPrice: 2000 },
  { key: '90d', label: '90 Hari', mult: 2.70, minPrice: 5000 },
];

function generateWebProducts(
  category: ProductCategory,
  nestId: number,
  eggId: number,
  dockerImage: string,
  startup: string,
  envVars: Record<string, string>,
  tiers: TierConfig[]
): ProductPlan[] {
  const plans: ProductPlan[] = [];

  for (const tier of tiers) {
    for (const dur of DURATIONS) {
      const calculatedPrice = Math.max(dur.minPrice, Math.round((tier.basePrice30d * dur.mult) / 500) * 500);
      const id = `${category}-${tier.code}-${dur.key}`;
      const name = `${tier.name} (${dur.label})`;

      plans.push({
        id,
        name,
        badge: tier.badge,
        popular: tier.popular && dur.key === '30d',
        category,
        priceMonthly: calculatedPrice,
        specs: {
          ram: tier.ramMb >= 1024 ? `${tier.ramMb / 1024} GB` : `${tier.ramMb} MB`,
          ramMb: tier.ramMb,
          cpu: `${tier.cpuPercent}% vCPU`,
          cpuPercentage: tier.cpuPercent,
          disk: `${tier.diskGb} GB NVMe`,
          diskMb: tier.diskGb * 1024,
          ports: 1,
          backups: tier.ramMb >= 4096 ? 3 : 1,
          databases: tier.ramMb >= 2048 ? 2 : 1,
        },
        features: [
          ...tier.features,
          `Durasi Aktif: ${dur.label}`,
          'Uptime SLA 99.99% Datacenter Jakarta',
          'Siap Pakai Tanpa Install (Auto Provisioning)',
        ],
        nestId,
        eggId,
        dockerImage,
        startup,
        envVariables: envVars,
      });
    }
  }

  return plans;
}

// 1. WhatsApp Tiers (15 Tiers * 4 Durations = 60 Plans)
const WA_TIERS: TierConfig[] = [
  { code: 'nano', name: 'WA Nano 256MB', ramMb: 256, cpuPercent: 35, diskGb: 1, basePrice30d: 1500, badge: 'HEMAT', features: ['Node.js 20 Baileys', 'Auto Restart 24/7', 'Web Console QR'] },
  { code: 'starter', name: 'WA Starter 512MB', ramMb: 512, cpuPercent: 50, diskGb: 2, basePrice30d: 2000, badge: 'STARTER', popular: true, features: ['Node.js 20 Baileys', 'Anti Crash System', 'SFTP File Manager'] },
  { code: 'lite', name: 'WA Lite 768MB', ramMb: 768, cpuPercent: 75, diskGb: 3, basePrice30d: 3000, badge: 'LITE', features: ['Group Bot Support', 'Anti-Delete Feature', 'Web Console'] },
  { code: 'basic', name: 'WA Basic 1GB', ramMb: 1024, cpuPercent: 100, diskGb: 5, basePrice30d: 4000, badge: 'POPULER', popular: true, features: ['Multi-Device Baileys', 'Komunitas & Group Bot', 'Web Panel Pterodactyl'] },
  { code: 'standard', name: 'WA Standard 1.5GB', ramMb: 1536, cpuPercent: 125, diskGb: 8, basePrice30d: 5500, badge: 'STANDARD', features: ['Web Scraping & Downloader', 'Fast NVMe I/O', 'Port Dedikasi'] },
  { code: 'pro', name: 'WA Pro 2GB', ramMb: 2048, cpuPercent: 150, diskGb: 10, basePrice30d: 7000, badge: 'FAVORIT', popular: true, features: ['Bot Store & Payment Gateway', 'Multi-Session Ready', 'Auto Backup'] },
  { code: 'plus', name: 'WA Plus 3GB', ramMb: 3072, cpuPercent: 200, diskGb: 15, basePrice30d: 10000, badge: 'PLUS', features: ['Broadcast Puluhan Grup', 'High Memory Buffer', 'Priority Support'] },
  { code: 'turbo', name: 'WA Turbo 4GB', ramMb: 4096, cpuPercent: 250, diskGb: 20, basePrice30d: 13000, badge: 'TURBO', features: ['Puppeteer Browser Ready', 'Heavy Media Processing', 'Anti-DDoS Shield'] },
  { code: 'super', name: 'WA Super 6GB', ramMb: 6144, cpuPercent: 300, diskGb: 30, basePrice30d: 19000, badge: 'SUPER', features: ['Multi-Session hingga 20 Nomor', 'Enterprise Grade', 'Dedicated RAM'] },
  { code: 'enterprise', name: 'WA Enterprise 8GB', ramMb: 8192, cpuPercent: 400, diskGb: 40, basePrice30d: 25000, badge: 'ENTERPRISE', features: ['Dedicated CPU Clock', 'Full Cloud Isolation', '24/7 SLA 99.99%'] },
  { code: 'extreme', name: 'WA Extreme 12GB', ramMb: 12288, cpuPercent: 500, diskGb: 60, basePrice30d: 36000, badge: 'EXTREME', features: ['Large Broadcast Infrastructure', 'Zero Lag Gateway', 'Unlimited Requests'] },
  { code: 'ultimate', name: 'WA Ultimate 16GB', ramMb: 16384, cpuPercent: 600, diskGb: 80, basePrice30d: 48000, badge: 'ULTIMATE', features: ['High Scale Bot Container', 'Direct NVMe Bus', 'Snapshot Backup'] },
  { code: 'cluster', name: 'WA Cluster 24GB', ramMb: 24576, cpuPercent: 800, diskGb: 100, basePrice30d: 70000, badge: 'CLUSTER', features: ['Multi-Tenant SaaS Bot', 'Private Cloud Alloc', 'Zero Throttling'] },
  { code: 'dedicated', name: 'WA Dedicated 32GB', ramMb: 32768, cpuPercent: 1000, diskGb: 150, basePrice30d: 95000, badge: 'DEDICATED', features: ['Private Resource Guaranteed', 'High Bandwidth', 'Dedicated Firewall'] },
  { code: 'infinity', name: 'WA Infinity 64GB', ramMb: 65536, cpuPercent: 1600, diskGb: 250, basePrice30d: 180000, badge: 'INFINITY', features: ['Ultimate Mass Cloud Scale', 'Custom Hostname', 'VIP Dedicated CS'] },
];

// 2. Telegram Tiers (15 Tiers * 4 Durations = 60 Plans)
const TG_TIERS: TierConfig[] = [
  { code: 'nano', name: 'TG Nano 256MB', ramMb: 256, cpuPercent: 35, diskGb: 1, basePrice30d: 1500, badge: 'HEMAT', features: ['Python 3.11 & Node.js 20', 'Auto Restart', 'Polling Mode'] },
  { code: 'starter', name: 'TG Starter 512MB', ramMb: 512, cpuPercent: 45, diskGb: 2, basePrice30d: 2000, badge: 'STARTER', popular: true, features: ['Aiogram & Telegraf', '24/7 Always On', 'SFTP File Manager'] },
  { code: 'lite', name: 'TG Lite 768MB', ramMb: 768, cpuPercent: 65, diskGb: 3, basePrice30d: 3000, badge: 'LITE', features: ['Pyrogram & Telethon', 'Database SQLite Ready', 'Web Console'] },
  { code: 'basic', name: 'TG Basic 1GB', ramMb: 1024, cpuPercent: 90, diskGb: 5, basePrice30d: 3500, badge: 'POPULER', popular: true, features: ['Bot Toko Digital & QRIS', 'Webhook SSL Fast Response', 'Anti-DDoS'] },
  { code: 'standard', name: 'TG Standard 1.5GB', ramMb: 1536, cpuPercent: 110, diskGb: 8, basePrice30d: 5000, badge: 'STANDARD', features: ['AI Copilot Integration', 'Multi-thread Handler', 'Port Dedikasi'] },
  { code: 'pro', name: 'TG Pro 2GB', ramMb: 2048, cpuPercent: 140, diskGb: 10, basePrice30d: 6000, badge: 'FAVORIT', popular: true, features: ['High Concurrency Webhook', 'MariaDB & Redis Ready', 'Auto Backup'] },
  { code: 'plus', name: 'TG Plus 3GB', ramMb: 3072, cpuPercent: 180, diskGb: 15, basePrice30d: 8500, badge: 'PLUS', features: ['Bot Manajemen Grup Besar', 'Auto Broadcast Channels', 'Priority CPU'] },
  { code: 'turbo', name: 'TG Turbo 4GB', ramMb: 4096, cpuPercent: 220, diskGb: 20, basePrice30d: 11000, badge: 'TURBO', features: ['Heavy Pyrogram Userbot', 'Fast Media Processing', 'Anti-Crash Guard'] },
  { code: 'super', name: 'TG Super 6GB', ramMb: 6144, cpuPercent: 280, diskGb: 30, basePrice30d: 16000, badge: 'SUPER', features: ['AI Image & Audio Generation', 'Enterprise Instance', 'High IOPS'] },
  { code: 'enterprise', name: 'TG Enterprise 8GB', ramMb: 8192, cpuPercent: 350, diskGb: 40, basePrice30d: 22000, badge: 'ENTERPRISE', features: ['Ribuan User Aktif Serentak', 'Dedicated Core', 'SLA 99.99%'] },
  { code: 'extreme', name: 'TG Extreme 12GB', ramMb: 12288, cpuPercent: 450, diskGb: 60, basePrice30d: 32000, badge: 'EXTREME', features: ['Heavy Media Streaming Bot', 'Direct High Memory', 'Snapshot Backup'] },
  { code: 'ultimate', name: 'TG Ultimate 16GB', ramMb: 16384, cpuPercent: 550, diskGb: 80, basePrice30d: 42000, badge: 'ULTIMATE', features: ['Enterprise Bot Network', 'Dedicated Bandwidth', 'Full Isolation'] },
  { code: 'cluster', name: 'TG Cluster 24GB', ramMb: 24576, cpuPercent: 750, diskGb: 100, basePrice30d: 62000, badge: 'CLUSTER', features: ['Multi-Bot Management Node', 'Zero Throttling', 'Private Resource'] },
  { code: 'dedicated', name: 'TG Dedicated 32GB', ramMb: 32768, cpuPercent: 900, diskGb: 150, basePrice30d: 85000, badge: 'DEDICATED', features: ['Private Hardware Allocation', 'Custom Ports', 'Dedicated CS'] },
  { code: 'infinity', name: 'TG Infinity 64GB', ramMb: 65536, cpuPercent: 1500, diskGb: 250, basePrice30d: 160000, badge: 'INFINITY', features: ['Massive Scale Infrastructure', 'Full Control Panel', 'VIP Support'] },
];

// 3. Minecraft Tiers (15 Tiers * 4 Durations = 60 Plans)
const MC_TIERS: TierConfig[] = [
  { code: 'wood', name: 'Minecraft Wood 1GB', ramMb: 1024, cpuPercent: 100, diskGb: 5, basePrice30d: 5000, badge: 'STARTER', features: ['Purpur 1.20.4 Siap Pakai', '1-3 Player Testing', 'Java 21 Ready'] },
  { code: 'stone', name: 'Minecraft Stone 2GB', ramMb: 2048, cpuPercent: 150, diskGb: 10, basePrice30d: 9000, badge: 'MABAR SMP', popular: true, features: ['5-10 Player Mabar TPS 20.0', 'Paper/Purpur Plugin Support', 'Anti-DDoS 100G'] },
  { code: 'iron', name: 'Minecraft Iron 3GB', ramMb: 3072, cpuPercent: 200, diskGb: 15, basePrice30d: 13500, badge: 'SMOOTH', features: ['Support Essentials & AuthMe', 'Geyser Bedrock Crossplay', 'Fast NVMe SSD'] },
  { code: 'gold', name: 'Minecraft Gold 4GB', ramMb: 4096, cpuPercent: 250, diskGb: 20, basePrice30d: 18000, badge: 'POPULER', popular: true, features: ['15-25 Player Survival SMP', 'Aikar JVM Optimization', 'Subdomain Gratis'] },
  { code: 'lapis', name: 'Minecraft Lapis 5GB', ramMb: 5120, cpuPercent: 300, diskGb: 25, basePrice30d: 22500, badge: 'EXP', features: ['Custom Economy & Quest', 'WorldEdit & CoreProtect', 'Port Dedikasi'] },
  { code: 'redstone', name: 'Minecraft Redstone 6GB', ramMb: 6144, cpuPercent: 350, diskGb: 30, basePrice30d: 27000, badge: 'REDSTONE', features: ['Farm Mob & Redstone Stabil', 'Anti-Lag Engine', 'Automated Backup'] },
  { code: 'diamond', name: 'Minecraft Diamond 8GB', ramMb: 8192, cpuPercent: 400, diskGb: 40, basePrice30d: 35000, badge: 'NETWORK', popular: true, features: ['30-50 Player Network Hub', 'Heavy Modpack Ready', 'Priority CPU'] },
  { code: 'emerald', name: 'Minecraft Emerald 10GB', ramMb: 10240, cpuPercent: 450, diskGb: 50, basePrice30d: 44000, badge: 'EMERALD', features: ['Custom Terrain Generator', 'Voice Chat Simple Plugin', 'Dedicated RAM'] },
  { code: 'obsidian', name: 'Minecraft Obsidian 12GB', ramMb: 12288, cpuPercent: 500, diskGb: 60, basePrice30d: 52000, badge: 'OBSIDIAN', features: ['Heavy Fabric / Forge 1.20', 'High Player Capacity', 'Zero TPS Drop'] },
  { code: 'netherite', name: 'Minecraft Netherite 16GB', ramMb: 16384, cpuPercent: 600, diskGb: 80, basePrice30d: 68000, badge: 'NETHERITE', features: ['50-100 Player Minigames', 'BungeeCord & Velocity Hub', 'Snapshot Backup'] },
  { code: 'enderman', name: 'Minecraft Enderman 20GB', ramMb: 20480, cpuPercent: 700, diskGb: 100, basePrice30d: 85000, badge: 'ENDERMAN', features: ['Large Multi-World Network', 'Direct High-Speed NVMe', 'Full Root Control'] },
  { code: 'wither', name: 'Minecraft Wither 24GB', ramMb: 24576, cpuPercent: 800, diskGb: 120, basePrice30d: 100000, badge: 'WITHER', features: ['High Concurrent Player Arena', 'Custom Port Allocation', 'Anti-Crash Shield'] },
  { code: 'dragon', name: 'Minecraft Dragon 32GB', ramMb: 32768, cpuPercent: 1000, diskGb: 160, basePrice30d: 135000, badge: 'DRAGON', features: ['Large Public Server Host', 'Private CPU Allocation', '24/7 SLA 99.99%'] },
  { code: 'titan', name: 'Minecraft Titan 48GB', ramMb: 49152, cpuPercent: 1200, diskGb: 200, basePrice30d: 195000, badge: 'TITAN', features: ['Minecraft Tournament Host', 'High Bandwidth Network', 'Dedicated Support'] },
  { code: 'dedicated', name: 'Minecraft Dedicated 64GB', ramMb: 65536, cpuPercent: 1600, diskGb: 300, basePrice30d: 260000, badge: 'DEDICATED', features: ['Maximum Private Host Node', 'Custom Java Startup Flags', 'VIP Server Manager'] },
];

// 4. Application Tiers (5 Tiers * 4 Durations = 20 Plans)
const APP_TIERS: TierConfig[] = [
  { code: 'nano', name: 'App Cloud Nano 512MB', ramMb: 512, cpuPercent: 50, diskGb: 5, basePrice30d: 2500, badge: 'STARTER', features: ['Node.js & Python API', 'Express & FastAPI Ready', 'Auto Restart'] },
  { code: 'micro', name: 'App Cloud Micro 1GB', ramMb: 1024, cpuPercent: 100, diskGb: 10, basePrice30d: 4500, badge: 'POPULER', popular: true, features: ['Next.js, Flask, Django Ready', 'Database SQLite Included', 'Port Dedikasi'] },
  { code: 'small', name: 'App Cloud Small 2GB', ramMb: 2048, cpuPercent: 150, diskGb: 20, basePrice30d: 8000, badge: 'STANDARD', features: ['MariaDB & Redis Backend', 'Cron Job Scheduler', 'Fast NVMe I/O'] },
  { code: 'medium', name: 'App Cloud Medium 4GB', ramMb: 4096, cpuPercent: 200, diskGb: 40, basePrice30d: 15000, badge: 'PRO', popular: true, features: ['Microservices Application', 'Docker Environment', 'Anti-DDoS Protection'] },
  { code: 'large', name: 'App Cloud Large 8GB', ramMb: 8192, cpuPercent: 300, diskGb: 60, basePrice30d: 28000, badge: 'ENTERPRISE', features: ['High Traffic Production App', 'Dedicated Core Memory', 'SLA 99.99%'] },
];

// Combine all 200 Product Plans (60 + 60 + 60 + 20 = 200)
export const PRODUCT_PLANS: ProductPlan[] = [
  ...generateWebProducts('whatsapp', 1, 15, 'ghcr.io/pterodactyl/yolks:nodejs_20', 'node index.js', { MAIN_FILE: 'index.js' }, WA_TIERS),
  ...generateWebProducts('telegram', 1, 16, 'ghcr.io/pterodactyl/yolks:python_3.11', 'python3 main.py', { BOT_START_FILE: 'main.py' }, TG_TIERS),
  ...generateWebProducts('minecraft', 1, 2, 'ghcr.io/pterodactyl/yolks:java_21', 'java -Xms128M -XX:MaxRAMPercentage=95.0 -jar server.jar nogui', { SERVER_JARFILE: 'server.jar' }, MC_TIERS),
  ...generateWebProducts('application', 1, 15, 'ghcr.io/pterodactyl/yolks:nodejs_20', 'node index.js', { MAIN_FILE: 'index.js' }, APP_TIERS),
];
