import React from 'react';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import Link from 'next/link';
import { Server, Layers, Zap, HardDrive, Cpu, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hosting Aplikasi Linux & Generic Container - RullzyeStore',
  description: 'Hosting container Linux serbaguna dengan custom Docker image dan startup script di Pterodactyl Panel.',
};

export default function HostingApplicationPage() {
  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
            <Server className="w-4 h-4" />
            Custom Container & Linux Binary Hosting
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Generic Application Hosting{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-rose-300">
              Bebas Custom Docker Image
            </span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Jalankan aplikasi berbasis Go, Rust, PHP, Python, Node.js, atau binary Linux kustom dengan kontrol penuh environment variables, alokasi port, dan limit resource Cgroups v2.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="#pricing"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-extrabold text-sm shadow-xl shadow-brand-500/20 hover:scale-105 transition-all"
            >
              Lihat Paket Application
            </Link>
          </div>
        </div>
      </div>

      <PricingSection initialCategory="generic" />
      <FaqSection />
    </div>
  );
}
