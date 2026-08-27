import React from 'react';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import Link from 'next/link';
import { Terminal, Zap, Layers, Server } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hosting Node.js Murah 24 Jam Pterodactyl Panel - RullzyeStore',
  description: 'Deploy aplikasi Node.js, Express, Fastify, NestJS, dan Discord bot di server Pterodactyl murah, cepat, dan otomatis aktif.',
};

export default function HostingNodejsPage() {
  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Terminal className="w-4 h-4" />
            Node.js Application Cloud Hosting
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Hosting Node.js Modern{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-emerald-300">
              Cepat & Siap Pakai 24 Jam
            </span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Jalankan Express API, Discord Bot, Webhook Listener, atau microservice Node.js dalam container Docker berkinerja tinggi.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="#pricing"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-extrabold text-sm shadow-xl shadow-brand-500/20 hover:scale-105 transition-all"
            >
              Lihat Paket Node.js
            </Link>
          </div>
        </div>
      </div>

      <PricingSection initialCategory="whatsapp" />
      <FaqSection />
    </div>
  );
}
