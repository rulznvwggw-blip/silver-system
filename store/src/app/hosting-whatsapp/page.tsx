import React from 'react';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import Link from 'next/link';
import { MessageSquare, Zap, ShieldCheck, Terminal, CheckCircle2, QrCode, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hosting Bot WhatsApp Baileys 24 Jam Nonstop - RullzyeStore Indonesia',
  description: 'Sewa hosting bot WhatsApp murah berbasis Node.js & Baileys di Pterodactyl Panel. Auto restart, scan QR langsung di console, dan anti-disconnect.',
};

export default function HostingWhatsAppPage() {
  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <MessageSquare className="w-4 h-4" />
            Specialist WhatsApp Bot Node.js Hosting
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Hosting Bot WhatsApp 24 Jam{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              Anti-Disconnect & Cepat
            </span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Jalankan bot WhatsApp store, bot komunitas, atau WhatsApp Gateway tanpa perlu laptop menyala. Didukung auto `npm install`, scan QR instan via Web Console, dan proteksi auto-restart.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="#pricing"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-extrabold text-sm shadow-xl shadow-brand-500/20 hover:scale-105 transition-all"
            >
              Lihat Paket Bot WhatsApp
            </Link>
          </div>
        </div>

        {/* Highlight Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <QrCode className="w-8 h-8 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Scan QR Code di Console</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tampilan Web Console Pterodactyl mendukung rendering ASCII QR Code sehingga Anda bisa langsung scan dari HP di layar browser.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <Zap className="w-8 h-8 text-brand-400" />
            <h3 className="text-base font-bold text-white">Auto Install Dependencies</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Egg kami secara cerdas mendeteksi `package.json` dan otomatis menjalankan `npm install` saat server pertama kali dihidupkan.
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <Terminal className="w-8 h-8 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Git Pull & Auto Update</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cukup hubungkan repository GitHub bot Anda dan aktifkan fitur auto-pull agar bot selalu terupdate setiap kali direstart.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Embed */}
      <PricingSection initialCategory="whatsapp" />

      {/* FAQ */}
      <FaqSection />
    </div>
  );
}
