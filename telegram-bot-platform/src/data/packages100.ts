export interface HostingPackage {
  id: string;
  category: 'whatsapp' | 'telegram' | 'minecraft';
  tier: number;
  name: string;
  price: number; // in IDR
  ramMb: number;
  cpuPercent: number;
  diskGb: number;
  eggId: number;
  nestId: number;
  dockerImage: string;
  description: string;
}

export function generate100Packages(): HostingPackage[] {
  const packages: HostingPackage[] = [];

  // 1. WhatsApp Bot Hosting (Tier 1 - 25): 256MB to 32GB
  const waRamTiers = [
    256, 512, 768, 1024, 1536, 2048, 2560, 3072, 4096, 5120,
    6144, 7168, 8192, 10240, 12288, 14336, 16384, 18432, 20480, 22528,
    24576, 26624, 28672, 30720, 32768
  ];

  waRamTiers.forEach((ram, idx) => {
    const tier = idx + 1;
    const price = Math.round((ram / 1024) * 20000) > 8000 ? Math.round((ram / 1024) * 20000) : 8000;
    const cpu = Math.min(400, Math.round(50 + (ram / 1024) * 25));
    const disk = Math.max(1, Math.round((ram / 1024) * 3));

    packages.push({
      id: `wa-tier-${tier}`,
      category: 'whatsapp',
      tier,
      name: `WhatsApp Bot Plan ${tier} (${ram >= 1024 ? `${ram / 1024}GB` : `${ram}MB`})`,
      price,
      ramMb: ram,
      cpuPercent: cpu,
      diskGb: disk,
      eggId: 15,
      nestId: 5,
      dockerImage: 'ghcr.io/pterodactyl/yolks:nodejs_20',
      description: `Optimasi Baileys / Node.js 20/22. RAM ${ram >= 1024 ? `${ram / 1024}GB` : `${ram}MB`}, CPU ${cpu}%, Disk ${disk}GB NVMe.`,
    });
  });

  // 2. Telegram Bot Hosting (Tier 1 - 25): 256MB to 32GB
  const tgRamTiers = [...waRamTiers];
  tgRamTiers.forEach((ram, idx) => {
    const tier = idx + 1;
    const price = Math.round((ram / 1024) * 18000) > 7000 ? Math.round((ram / 1024) * 18000) : 7000;
    const cpu = Math.min(400, Math.round(40 + (ram / 1024) * 20));
    const disk = Math.max(1, Math.round((ram / 1024) * 2.5));

    packages.push({
      id: `tg-tier-${tier}`,
      category: 'telegram',
      tier,
      name: `Telegram Bot Plan ${tier} (${ram >= 1024 ? `${ram / 1024}GB` : `${ram}MB`})`,
      price,
      ramMb: ram,
      cpuPercent: cpu,
      diskGb: disk,
      eggId: 16,
      nestId: 5,
      dockerImage: 'ghcr.io/pterodactyl/yolks:python_3.11',
      description: `Python 3.11 / Node.js Telegraf. RAM ${ram >= 1024 ? `${ram / 1024}GB` : `${ram}MB`}, CPU ${cpu}%, Disk ${disk}GB NVMe.`,
    });
  });

  // 3. Minecraft Server Java (Tier 1 - 25): 1GB to 64GB
  const mcRamTiers = [
    1024, 1536, 2048, 3072, 4096, 5120, 6144, 8192, 10240, 12288,
    14336, 16384, 18432, 20480, 24576, 28672, 32768, 36864, 40960, 45056,
    49152, 53248, 57344, 61440, 65536
  ];

  mcRamTiers.forEach((ram, idx) => {
    const tier = idx + 1;
    const price = Math.round((ram / 1024) * 25000);
    const cpu = Math.min(600, Math.round(100 + (ram / 1024) * 20));
    const disk = Math.max(5, Math.round((ram / 1024) * 5));

    packages.push({
      id: `mc-tier-${tier}`,
      category: 'minecraft',
      tier,
      name: `Minecraft Java Plan ${tier} (${ram / 1024}GB RAM)`,
      price,
      ramMb: ram,
      cpuPercent: cpu,
      diskGb: disk,
      eggId: 2,
      nestId: 1,
      dockerImage: 'ghcr.io/pterodactyl/yolks:java_21',
      description: `Paper/Purpur TPS 20.0. RAM ${ram / 1024}GB, CPU ${cpu}%, Disk ${disk}GB NVMe, Anti-DDoS 100 Gbps.`,
    });
  });

  return packages;
}

export const ALL_100_PACKAGES = generate100Packages();
