export type DurationType = '7d' | '14d' | '30d';

export interface HostingPackage {
  id: string;
  category: 'whatsapp' | 'telegram' | 'minecraft';
  tier: number;
  name: string;
  duration: DurationType;
  durationLabel: string;
  durationDays: number;
  price: number; // in IDR (Indonesian market pricing)
  ramMb: number;
  cpuPercent: number;
  diskGb: number;
  eggId: number;
  nestId: number;
  dockerImage: string;
  description: string;
  badge: string;
}

const RAM_TIERS_25 = [
  256, 512, 768, 1024, 1536, 2048, 2560, 3072, 4096, 5120,
  6144, 7168, 8192, 10240, 12288, 14336, 16384, 18432, 20480, 22528,
  24576, 26624, 28672, 30720, 32768
];

const MC_RAM_TIERS_25 = [
  1024, 1536, 2048, 3072, 4096, 5120, 6144, 8192, 10240, 12288,
  14336, 16384, 18432, 20480, 24576, 28672, 32768, 36864, 40960, 45056,
  49152, 53248, 57344, 61440, 65536
];

export function generatePackagesForDuration(duration: DurationType): HostingPackage[] {
  const packages: HostingPackage[] = [];
  const durationLabel = duration === '7d' ? '7 Hari (1 Minggu)' : duration === '14d' ? '14 Hari (2 Minggu)' : '30 Hari (1 Bulan)';
  const durationDays = duration === '7d' ? 7 : duration === '14d' ? 14 : 30;
  const multiplier = duration === '7d' ? 0.35 : duration === '14d' ? 0.60 : 1.0;

  // 1. WhatsApp Bot Hosting (Tier 1 - 25)
  RAM_TIERS_25.forEach((ram, idx) => {
    const tier = idx + 1;
    const ramLabel = ram >= 1024 ? `${ram / 1024} GB` : `${ram} MB`;
    const baseMonthlyPrice = Math.max(2000, Math.round((ram / 1024) * 3500));
    const price = Math.max(1000, Math.round(baseMonthlyPrice * multiplier));
    const cpu = Math.min(400, Math.round(40 + (ram / 1024) * 20));
    const disk = Math.max(1, Math.round((ram / 1024) * 2.5));

    packages.push({
      id: `wa-${duration}-t${tier}`,
      category: 'whatsapp',
      tier,
      duration,
      durationLabel,
      durationDays,
      name: `WA Bot T${tier} (${ramLabel}) [${durationLabel}]`,
      price,
      ramMb: ram,
      cpuPercent: cpu,
      diskGb: disk,
      eggId: 15,
      nestId: 5,
      dockerImage: 'ghcr.io/pterodactyl/yolks:nodejs_20',
      description: `Optimasi Baileys / Node.js 20/22. RAM ${ramLabel}, CPU ${cpu}%, Disk ${disk}GB NVMe. Scan QR langsung di Web Console.`,
      badge: tier === 1 ? 'HEMAT' : tier === 4 ? 'POPULER' : tier === 8 ? 'PRO STORE' : `TIER ${tier}`,
    });
  });

  // 2. Telegram Bot Hosting (Tier 1 - 25)
  RAM_TIERS_25.forEach((ram, idx) => {
    const tier = idx + 1;
    const ramLabel = ram >= 1024 ? `${ram / 1024} GB` : `${ram} MB`;
    const baseMonthlyPrice = Math.max(2000, Math.round((ram / 1024) * 3000));
    const price = Math.max(1000, Math.round(baseMonthlyPrice * multiplier));
    const cpu = Math.min(400, Math.round(35 + (ram / 1024) * 20));
    const disk = Math.max(1, Math.round((ram / 1024) * 2.0));

    packages.push({
      id: `tg-${duration}-t${tier}`,
      category: 'telegram',
      tier,
      duration,
      durationLabel,
      durationDays,
      name: `TG Bot T${tier} (${ramLabel}) [${durationLabel}]`,
      price,
      ramMb: ram,
      cpuPercent: cpu,
      diskGb: disk,
      eggId: 16,
      nestId: 5,
      dockerImage: 'ghcr.io/pterodactyl/yolks:python_3.11',
      description: `Python 3.11 & Node.js Telegraf. RAM ${ramLabel}, CPU ${cpu}%, Disk ${disk}GB NVMe. Auto-restart saat crash.`,
      badge: tier === 1 ? 'STARTER' : tier === 4 ? 'FAVORIT' : `TIER ${tier}`,
    });
  });

  // 3. Minecraft Java Server (Tier 1 - 25)
  MC_RAM_TIERS_25.forEach((ram, idx) => {
    const tier = idx + 1;
    const ramLabel = `${ram / 1024} GB`;
    const baseMonthlyPrice = Math.max(5000, Math.round((ram / 1024) * 4500));
    const price = Math.max(2000, Math.round(baseMonthlyPrice * multiplier));
    const cpu = Math.min(600, Math.round(80 + (ram / 1024) * 20));
    const disk = Math.max(5, Math.round((ram / 1024) * 4));

    packages.push({
      id: `mc-${duration}-t${tier}`,
      category: 'minecraft',
      tier,
      duration,
      durationLabel,
      durationDays,
      name: `Minecraft Java T${tier} (${ramLabel}) [${durationLabel}]`,
      price,
      ramMb: ram,
      cpuPercent: cpu,
      diskGb: disk,
      eggId: 2,
      nestId: 1,
      dockerImage: 'ghcr.io/pterodactyl/yolks:java_21',
      description: `Paper & Purpur TPS 20.0 Stabil. RAM ${ramLabel}, CPU ${cpu}%, Disk ${disk}GB NVMe, Proteksi Anti-DDoS 100 Gbps.`,
      badge: tier === 1 ? 'MABAR SMP' : tier === 4 ? 'SURVIVAL PRO' : tier === 8 ? 'BUNGEE NETWORK' : `TIER ${tier}`,
    });
  });

  return packages;
}

// Packages for 7d, 14d, 30d (WhatsApp, Telegram, Minecraft)
export const PACKAGES_7D = generatePackagesForDuration('7d');
export const PACKAGES_14D = generatePackagesForDuration('14d');
export const PACKAGES_30D = generatePackagesForDuration('30d');
export type PackageDuration = '7d' | '14d' | '30d';

export const ALL_PACKAGES: HostingPackage[] = [
  ...PACKAGES_7D,
  ...PACKAGES_14D,
  ...PACKAGES_30D,
];

export const ALL_300_PACKAGES = ALL_PACKAGES;
