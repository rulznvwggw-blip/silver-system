import React from 'react';
import HeroSection from '@/components/HeroSection';
import TrustSection from '@/components/TrustSection';
import PricingSection from '@/components/PricingSection';
import TestimonialSection from '@/components/TestimonialSection';
import FaqSection from '@/components/FaqSection';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Sparkles, Terminal, Activity } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Section & Dynamic Statistics */}
      <TrustSection />

      {/* 3. Products & Pricing Section */}
      <PricingSection />

      {/* 4. Live Server Status Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-brand-950/40 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-lg font-bold text-white">Infrastruktur Node-Main-01 Berjalan Normal</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  99.99% UPTIME
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Semua layanan (WhatsApp Egg, Telegram Egg, Minecraft Node, & QRIS Engine) beroperasi dengan lancar.
              </p>
            </div>
          </div>

          <Link
            href="/status"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-colors shrink-0 flex items-center gap-2"
          >
            Lihat Detail Status
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <TestimonialSection />

      {/* 6. FAQ Section */}
      <FaqSection />

      {/* 7. Bottom Conversion Banner */}
      <section className="py-16 bg-gradient-to-b from-transparent to-slate-900/60 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 text-dark-bg flex items-center justify-center mx-auto shadow-xl shadow-brand-500/25">
            <Zap className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Siap Menjalankan Server & Bot Anda 24 Jam?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Pesan sekarang dan nikmati hosting murah berkinerja tinggi. Pembayaran otomatis diverifikasi dalam 5-10 detik.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 hover:to-emerald-300 text-dark-bg font-extrabold text-base shadow-xl shadow-brand-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              PILIH PAKET SEKARANG
            </Link>
            <Link
              href="https://wa.me/6281234567890"
              target="_blank"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-800 transition-all"
            >
              Konsultasi WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
