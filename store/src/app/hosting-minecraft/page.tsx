import React from 'react';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import Link from 'next/link';
import { Gamepad2, Zap, Shield, HardDrive, Cpu, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hosting Minecraft Indonesia Paper & Purpur Murah - RullzyeStore',
  description: 'Sewa server Minecraft Java Edition Indonesia murah, low latency, TPS stabil 20.0, anti-DDoS game 100 Gbps, dan Java 8/17/21 selector.',
};

export default function HostingMinecraftPage() {
  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Gamepad2 className="w-4 h-4" />
            Minecraft Java Edition Server Indonesia
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Hosting Minecraft Indonesia{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-200">
              Anti-Lag & TPS Stabil 20.0
            </span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Main bareng teman di server Survival SMP atau bangun Network server impian Anda. Ditenagai storage NVMe Gen4, CPU clock tinggi, dan proteksi DDoS game 100 Gbps.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="#pricing"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-extrabold text-sm shadow-xl shadow-brand-500/20 hover:scale-105 transition-all"
            >
              Lihat Paket Minecraft
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <Cpu className="w-8 h-8 text-brand-400" />
            <h3 className="text-base font-bold text-white">Java Version Selector</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bebas ganti versi Java 8 (1.8 - 1.12), Java 17 (1.17 - 1.20.4), dan Java 21 (1.20.5 - 1.21+) hanya dengan satu klik dropdown.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <Shield className="w-8 h-8 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Anti-DDoS Game Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Perlindungan otomatis terhadap serangan bot exploit, null ping flood, dan UDP flood agar gameplay tetap lancar.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <HardDrive className="w-8 h-8 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Full SFTP & Custom JAR</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload file server kustom (Paper, Purpur, Fabric, Forge, Mohist) atau plugin tak terbatas via File Manager & SFTP.
            </p>
          </div>
        </div>
      </div>

      <PricingSection initialCategory="minecraft" />
      <FaqSection />
    </div>
  );
}
