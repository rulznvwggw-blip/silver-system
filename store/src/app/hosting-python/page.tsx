import React from 'react';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import Link from 'next/link';
import { Terminal, Zap, Layers, Server } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hosting Python & Flask/FastAPI 24 Jam - RullzyeStore Indonesia',
  description: 'Hosting script Python, automation bot, FastAPI, Flask, dan web scraping 24/7 di Pterodactyl Panel.',
};

export default function HostingPythonPage() {
  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <Terminal className="w-4 h-4" />
            Python 3.11 & 3.12 Engine Hosting
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Hosting Python Cloud{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              Auto Pip & Always Online
            </span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Jalankan skrip otomasi Python, web scraper, bot trading, atau FastAPI/Flask backend dengan manajemen resource terisolasi.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="#pricing"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-extrabold text-sm shadow-xl shadow-brand-500/20 hover:scale-105 transition-all"
            >
              Lihat Paket Python
            </Link>
          </div>
        </div>
      </div>

      <PricingSection initialCategory="telegram" />
      <FaqSection />
    </div>
  );
}
