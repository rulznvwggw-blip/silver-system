import React from 'react';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import Link from 'next/link';
import { Send, Zap, ShieldCheck, Terminal, Bot } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hosting Bot Telegram Python & Node.js 24 Jam - RullzyeStore Indonesia',
  description: 'Hosting bot Telegram murah untuk Python (Aiogram, Telethon, Pyrogram) dan Node.js (Telegraf) di Pterodactyl Panel.',
};

export default function HostingTelegramPage() {
  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
            <Send className="w-4 h-4" />
            Python 3.11 & Node.js Telegram Bot Hosting
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Hosting Bot Telegram{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-300">
              Super Cepat & Always Online
            </span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Sewa server khusus bot Telegram untuk toko otomatis, bot download, bot AI, atau bot grup. Mendukung mode Long Polling dan Webhook dengan alokasi port publik.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="#pricing"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-extrabold text-sm shadow-xl shadow-brand-500/20 hover:scale-105 transition-all"
            >
              Lihat Paket Bot Telegram
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <Bot className="w-8 h-8 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Dual Engine Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pilih engine Python (3.11/3.12) atau Node.js (20/22) sesuai framework yang Anda gunakan (Aiogram, Pyrogram, Telegraf).
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <Zap className="w-8 h-8 text-brand-400" />
            <h3 className="text-base font-bold text-white">Auto Pip / NPM Install</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Otomatis mendeteksi `requirements.txt` atau `package.json` dan mengunduh library bot tanpa perlu perintah terminal manual.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <Terminal className="w-8 h-8 text-purple-400" />
            <h3 className="text-base font-bold text-white">Token Environment Secure</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simpan API Token BotFather Anda secara aman di tab Startup Configuration Pterodactyl tanpa hardcode di file skrip.
            </p>
          </div>
        </div>
      </div>

      <PricingSection initialCategory="telegram" />
      <FaqSection />
    </div>
  );
}
