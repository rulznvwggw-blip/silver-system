export interface ProductItem {
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
}

interface TierDef {
  code: string;
  name: string;
  ramMb: number;
  cpuPercent: number;
  diskGb: number;
  basePrice30d: number;
  badge: string;
  desc: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
}

const DURATIONS = [
  { key: '7d', label: '7 Hari', days: 7, mult: 0.35, minPrice: 1000 },
  { key: '14d', label: '14 Hari', days: 14, mult: 0.60, minPrice: 1500 },
  { key: '30d', label: '30 Hari', days: 30, mult: 1.00, minPrice: 2000 },
  { key: '90d', label: '90 Hari', days: 90, mult: 2.70, minPrice: 5000 },
];

function generateCategoryProducts(
  categoryId: string,
  eggId: number,
  dockerImage: string,
  tiers: TierDef[]
): ProductItem[] {
  const items: ProductItem[] = [];

  for (const tier of tiers) {
    for (const dur of DURATIONS) {
      const calculatedPrice = Math.max(dur.minPrice, Math.round((tier.basePrice30d * dur.mult) / 500) * 500);
      const id = `${categoryId}-${tier.code}-${dur.key}`;
      const name = `${tier.name} (${dur.label})`;

      items.push({
        id,
        category_id: categoryId,
        name,
        price: calculatedPrice,
        ram_mb: tier.ramMb,
        cpu_percent: tier.cpuPercent,
        disk_gb: tier.diskGb,
        duration_days: dur.days,
        duration_label: dur.label,
        badge: tier.badge,
        description: `${tier.desc} Durasi ${dur.label}, alokasi RAM ${tier.ramMb}MB & Port Dedikasi.`,
        is_featured: !!tier.isFeatured && dur.key === '30d',
        is_popular: !!tier.isPopular && dur.key === '30d',
        is_new: !!tier.isNew && dur.key === '30d',
        is_premium: !!tier.isPremium || tier.ramMb >= 8192,
        stock: 999,
        is_active: true,
        egg_id: eggId,
        docker_image: dockerImage,
      });
    }
  }

  return items;
}

// 1. WhatsApp Bot Hosting (15 Tiers * 4 Durations = 60 Products)
const WA_TIERS: TierDef[] = [
  { code: 'nano', name: 'WA Nano 256MB', ramMb: 256, cpuPercent: 35, diskGb: 1, basePrice30d: 1500, badge: 'HEMAT', desc: 'Bot WhatsApp Single Session ringan 24 jam.' },
  { code: 'starter', name: 'WA Starter 512MB', ramMb: 512, cpuPercent: 50, diskGb: 2, basePrice30d: 2000, badge: 'STARTER', desc: 'Optimasi Baileys Node.js 20 auto-restart.', isPopular: true },
  { code: 'lite', name: 'WA Lite 768MB', ramMb: 768, cpuPercent: 75, diskGb: 3, basePrice30d: 3000, badge: 'LITE', desc: 'Bot WhatsApp group & anti-delete support.' },
  { code: 'basic', name: 'WA Basic 1GB', ramMb: 1024, cpuPercent: 100, diskGb: 5, basePrice30d: 4000, badge: 'POPULER', desc: 'Multi-device Baileys bot untuk komunitas.', isFeatured: true, isPopular: true },
  { code: 'standard', name: 'WA Standard 1.5GB', ramMb: 1536, cpuPercent: 125, diskGb: 8, basePrice30d: 5500, badge: 'STANDARD', desc: 'Support scraping web & downloader bot.' },
  { code: 'pro', name: 'WA Pro 2GB', ramMb: 2048, cpuPercent: 150, diskGb: 10, basePrice30d: 7000, badge: 'FAVORIT', desc: 'High traffic bot store & gateway pembayaran.', isFeatured: true },
  { code: 'plus', name: 'WA Plus 3GB', ramMb: 3072, cpuPercent: 200, diskGb: 15, basePrice30d: 10000, badge: 'PLUS', desc: 'Dedicated memory untuk bot broadcast puluhan grup.' },
  { code: 'turbo', name: 'WA Turbo 4GB', ramMb: 4096, cpuPercent: 250, diskGb: 20, basePrice30d: 13000, badge: 'TURBO', desc: 'Puppeteer & browser automation bot support.', isNew: true },
  { code: 'super', name: 'WA Super 6GB', ramMb: 6144, cpuPercent: 300, diskGb: 30, basePrice30d: 19000, badge: 'SUPER', desc: 'Multi-session bot WhatsApp hingga 20 nomor aktif.' },
  { code: 'enterprise', name: 'WA Enterprise 8GB', ramMb: 8192, cpuPercent: 400, diskGb: 40, basePrice30d: 25000, badge: 'ENTERPRISE', desc: 'Dedicated core NVMe untuk kebutuhan bot bisnis.', isPremium: true },
  { code: 'extreme', name: 'WA Extreme 12GB', ramMb: 12288, cpuPercent: 500, diskGb: 60, basePrice30d: 36000, badge: 'EXTREME', desc: 'Heavy broadcast & automated database sync.', isPremium: true },
  { code: 'ultimate', name: 'WA Ultimate 16GB', ramMb: 16384, cpuPercent: 600, diskGb: 80, basePrice30d: 48000, badge: 'ULTIMATE', desc: 'Maximum performance cloud container.', isPremium: true },
  { code: 'cluster', name: 'WA Cluster 24GB', ramMb: 24576, cpuPercent: 800, diskGb: 100, basePrice30d: 70000, badge: 'CLUSTER', desc: 'Enterprise SaaS WhatsApp Gateway multi-tenant.', isPremium: true },
  { code: 'dedicated', name: 'WA Dedicated 32GB', ramMb: 32768, cpuPercent: 1000, diskGb: 150, basePrice30d: 95000, badge: 'DEDICATED', desc: 'Private resources non-shared memory.', isPremium: true },
  { code: 'infinity', name: 'WA Infinity 64GB', ramMb: 65536, cpuPercent: 1600, diskGb: 250, basePrice30d: 180000, badge: 'INFINITY', desc: 'Ultimate scale container untuk jaringan bot raksasa.', isPremium: true },
];

// 2. Telegram Bot Hosting (15 Tiers * 4 Durations = 60 Products)
const TG_TIERS: TierDef[] = [
  { code: 'nano', name: 'TG Nano 256MB', ramMb: 256, cpuPercent: 35, diskGb: 1, basePrice30d: 1500, badge: 'HEMAT', desc: 'Bot Telegram Python/Node.js starter.' },
  { code: 'starter', name: 'TG Starter 512MB', ramMb: 512, cpuPercent: 45, diskGb: 2, basePrice30d: 2000, badge: 'STARTER', desc: 'Python 3.11 & Telegraf auto-restart 24 jam.', isPopular: true },
  { code: 'lite', name: 'TG Lite 768MB', ramMb: 768, cpuPercent: 65, diskGb: 3, basePrice30d: 3000, badge: 'LITE', desc: 'Aiogram & Pyrogram bot support.' },
  { code: 'basic', name: 'TG Basic 1GB', ramMb: 1024, cpuPercent: 90, diskGb: 5, basePrice30d: 3500, badge: 'POPULER', desc: 'Bot Toko Digital & QRIS payment automation.', isFeatured: true, isPopular: true },
  { code: 'standard', name: 'TG Standard 1.5GB', ramMb: 1536, cpuPercent: 110, diskGb: 8, basePrice30d: 5000, badge: 'STANDARD', desc: 'AI Copilot & SQLite storage ready.' },
  { code: 'pro', name: 'TG Pro 2GB', ramMb: 2048, cpuPercent: 140, diskGb: 10, basePrice30d: 6000, badge: 'FAVORIT', desc: 'High concurrency webhook SSL connection.', isFeatured: true },
  { code: 'plus', name: 'TG Plus 3GB', ramMb: 3072, cpuPercent: 180, diskGb: 15, basePrice30d: 8500, badge: 'PLUS', desc: 'Bot manajemen grup & auto-broadcast multi-channel.' },
  { code: 'turbo', name: 'TG Turbo 4GB', ramMb: 4096, cpuPercent: 220, diskGb: 20, basePrice30d: 11000, badge: 'TURBO', desc: 'Fast processing Pyrogram Userbot & Telethon.', isNew: true },
  { code: 'super', name: 'TG Super 6GB', ramMb: 6144, cpuPercent: 280, diskGb: 30, basePrice30d: 16000, badge: 'SUPER', desc: 'AI Image & Audio generator processing bot.' },
  { code: 'enterprise', name: 'TG Enterprise 8GB', ramMb: 8192, cpuPercent: 350, diskGb: 40, basePrice30d: 22000, badge: 'ENTERPRISE', desc: 'High scale bot dengan ribuan pengguna aktif harian.', isPremium: true },
  { code: 'extreme', name: 'TG Extreme 12GB', ramMb: 12288, cpuPercent: 450, diskGb: 60, basePrice30d: 32000, badge: 'EXTREME', desc: 'Heavy media converter & file streamer bot.', isPremium: true },
  { code: 'ultimate', name: 'TG Ultimate 16GB', ramMb: 16384, cpuPercent: 550, diskGb: 80, basePrice30d: 42000, badge: 'ULTIMATE', desc: 'Enterprise Grade Cloud instance.', isPremium: true },
  { code: 'cluster', name: 'TG Cluster 24GB', ramMb: 24576, cpuPercent: 750, diskGb: 100, basePrice30d: 62000, badge: 'CLUSTER', desc: 'Multi-bot management network instance.', isPremium: true },
  { code: 'dedicated', name: 'TG Dedicated 32GB', ramMb: 32768, cpuPercent: 900, diskGb: 150, basePrice30d: 85000, badge: 'DEDICATED', desc: 'Private core memory zero throttling.', isPremium: true },
  { code: 'infinity', name: 'TG Infinity 64GB', ramMb: 65536, cpuPercent: 1500, diskGb: 250, basePrice30d: 160000, badge: 'INFINITY', desc: 'Massive scale Telegram infrastructure.', isPremium: true },
];

// 3. Minecraft Java Hosting (15 Tiers * 4 Durations = 60 Products)
const MC_TIERS: TierDef[] = [
  { code: 'wood', name: 'Minecraft Wood 1GB', ramMb: 1024, cpuPercent: 100, diskGb: 5, basePrice30d: 5000, badge: 'STARTER', desc: 'Purpur/Paper 1.20.4 untuk 1-3 Player testing.' },
  { code: 'stone', name: 'Minecraft Stone 2GB', ramMb: 2048, cpuPercent: 150, diskGb: 10, basePrice30d: 9000, badge: 'MABAR SMP', desc: '5-10 Player Mabar Survival TPS 20.0 stabil.', isPopular: true },
  { code: 'iron', name: 'Minecraft Iron 3GB', ramMb: 3072, cpuPercent: 200, diskGb: 15, basePrice30d: 13500, badge: 'SMOOTH', desc: 'Support plugin Essentials, WorldEdit, AuthMe.' },
  { code: 'gold', name: 'Minecraft Gold 4GB', ramMb: 4096, cpuPercent: 250, diskGb: 20, basePrice30d: 18000, badge: 'POPULER', desc: '15-25 Player SMP dengan Anti-DDoS 100 Gbps.', isFeatured: true, isPopular: true },
  { code: 'lapis', name: 'Minecraft Lapis 5GB', ramMb: 5120, cpuPercent: 300, diskGb: 25, basePrice30d: 22500, badge: 'EXP', desc: 'Survival RPG dengan custom item & economy.' },
  { code: 'redstone', name: 'Minecraft Redstone 6GB', ramMb: 6144, cpuPercent: 350, diskGb: 30, basePrice30d: 27000, badge: 'REDSTONE', desc: 'Support farm redstone & mob spawner berat.' },
  { code: 'diamond', name: 'Minecraft Diamond 8GB', ramMb: 8192, cpuPercent: 400, diskGb: 40, basePrice30d: 35000, badge: 'NETWORK', desc: '30-50 Player Mabar, Bedrock Geyser crossplay.', isFeatured: true, isPremium: true },
  { code: 'emerald', name: 'Minecraft Emerald 10GB', ramMb: 10240, cpuPercent: 450, diskGb: 50, basePrice30d: 44000, badge: 'EMERALD', desc: 'High spec Survival SMP + custom world generator.', isPremium: true },
  { code: 'obsidian', name: 'Minecraft Obsidian 12GB', ramMb: 12288, cpuPercent: 500, diskGb: 60, basePrice30d: 52000, badge: 'OBSIDIAN', desc: 'Heavy Modpack Fabric / Forge 1.20 ready.', isPremium: true },
  { code: 'netherite', name: 'Minecraft Netherite 16GB', ramMb: 16384, cpuPercent: 600, diskGb: 80, basePrice30d: 68000, badge: 'NETHERITE', desc: '50-100 Player Network Hub / Minigames.', isPremium: true },
  { code: 'enderman', name: 'Minecraft Enderman 20GB', ramMb: 20480, cpuPercent: 700, diskGb: 100, basePrice30d: 85000, badge: 'ENDERMAN', desc: 'Multi-world server dengan BungeeCord proxy.', isPremium: true },
  { code: 'wither', name: 'Minecraft Wither 24GB', ramMb: 24576, cpuPercent: 800, diskGb: 120, basePrice30d: 100000, badge: 'WITHER', desc: 'High concurrent player minigames network.', isPremium: true },
  { code: 'dragon', name: 'Minecraft Dragon 32GB', ramMb: 32768, cpuPercent: 1000, diskGb: 160, basePrice30d: 135000, badge: 'DRAGON', desc: 'Large Public Minecraft Community Server.', isPremium: true },
  { code: 'titan', name: 'Minecraft Titan 48GB', ramMb: 49152, cpuPercent: 1200, diskGb: 200, basePrice30d: 195000, badge: 'TITAN', desc: 'Enterprise Minecraft Tournament Host.', isPremium: true },
  { code: 'dedicated', name: 'Minecraft Dedicated 64GB', ramMb: 65536, cpuPercent: 1600, diskGb: 300, basePrice30d: 260000, badge: 'DEDICATED', desc: 'Maximum performance private node instance.', isPremium: true },
];

// 4. Node.js & Python Application Hosting (5 Tiers * 4 Durations = 20 Products)
const APP_TIERS: TierDef[] = [
  { code: 'nano', name: 'App Cloud Nano 512MB', ramMb: 512, cpuPercent: 50, diskGb: 5, basePrice30d: 2500, badge: 'STARTER', desc: 'Web API Express.js & FastAPI backend cloud.' },
  { code: 'micro', name: 'App Cloud Micro 1GB', ramMb: 1024, cpuPercent: 100, diskGb: 10, basePrice30d: 4500, badge: 'POPULER', desc: 'Next.js, Django, Flask & NestJS ready.', isPopular: true },
  { code: 'small', name: 'App Cloud Small 2GB', ramMb: 2048, cpuPercent: 150, diskGb: 20, basePrice30d: 8000, badge: 'STANDARD', desc: 'Database SQLite/MariaDB & Cron job scheduler.' },
  { code: 'medium', name: 'App Cloud Medium 4GB', ramMb: 4096, cpuPercent: 200, diskGb: 40, basePrice30d: 15000, badge: 'PRO', desc: 'Multi-service microservices application.', isFeatured: true },
  { code: 'large', name: 'App Cloud Large 8GB', ramMb: 8192, cpuPercent: 300, diskGb: 60, basePrice30d: 28000, badge: 'ENTERPRISE', desc: 'High traffic production web application.', isPremium: true },
];

// Combine all 200 Products
export const ALL_200_PRODUCTS: ProductItem[] = [
  ...generateCategoryProducts('whatsapp', 15, 'ghcr.io/pterodactyl/yolks:nodejs_20', WA_TIERS),
  ...generateCategoryProducts('telegram', 16, 'ghcr.io/pterodactyl/yolks:python_3.11', TG_TIERS),
  ...generateCategoryProducts('minecraft', 2, 'ghcr.io/pterodactyl/yolks:java_21', MC_TIERS),
  ...generateCategoryProducts('application', 15, 'ghcr.io/pterodactyl/yolks:nodejs_20', APP_TIERS),
];
