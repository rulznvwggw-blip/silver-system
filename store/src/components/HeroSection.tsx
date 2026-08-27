'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Cpu, HardDrive, Terminal, CheckCircle2, ArrowRight, Play, Server, Clock } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Gradients & Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-emerald-500/15 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Top Badges */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-xs font-medium text-slate-300 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              <span>Pterodactyl Panel + Wings Node 2026 Ready</span>
              <span className="text-slate-500">|</span>
              <span className="text-brand-400 font-semibold">Otomatis Aktif</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Hosting Powerful Untuk{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-200">
                Semua Kebutuhanmu
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Deploy Bot WhatsApp (Baileys), Bot Telegram, Minecraft Server, dan aplikasi Linux lainnya dalam hitungan detik. Nikmati kestabilan 24/7, NVMe ultra speed, dan auto-restart saat crash.
            </p>

            {/* Feature Highlights Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <Zap className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Instant Deployment</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Anti-DDoS 100 Gbps</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>SSD NVMe Gen4</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>24/7 Always Online</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <Terminal className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Pterodactyl Panel</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span>QRIS Instant Pay</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/#pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-400 text-dark-bg font-extrabold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5 group"
              >
                Mulai Hosting Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#pricing"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700 text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                Lihat Daftar Paket
              </Link>
            </div>
          </div>

          {/* Right Column: Live Simulated Server Panel Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-950 p-1 border border-slate-700/80 shadow-2xl shadow-black/80 backdrop-blur-xl">
              {/* Terminal Window Header */}
              <div className="bg-slate-900/90 rounded-t-xl px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">pterodactyl@node-main-01</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  CONNECTED
                </span>
              </div>

              {/* Console Body */}
              <div className="p-5 font-mono text-xs space-y-3 bg-slate-950/90 rounded-b-xl overflow-hidden">
                <div className="text-slate-500 flex justify-between text-[11px] border-b border-slate-900 pb-2">
                  <span>SERVER: Bot-WhatsApp-Baileys</span>
                  <span className="text-emerald-400">UPTIME: 14d 08h 12m</span>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <p className="text-cyan-400">[Pterodactyl Daemon] Container initialized with Node.js 20</p>
                  <p className="text-slate-400">[System] Loading Baileys multi-session auth state...</p>
                  <p className="text-emerald-400">✔ WhatsApp Socket Connected (24/7 Always On)</p>
                  <p className="text-brand-300">⚡ Webhook HTTP Listener: 0.0.0.0:3001</p>
                </div>

                {/* Resource Metrics Bar */}
                <div className="grid grid-cols-2 gap-3 pt-3 mt-2 border-t border-slate-900 text-[11px]">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Memory (RAM)</span>
                      <span className="text-white font-bold">248 MB / 1024 MB</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full w-[24%]" />
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>CPU Usage</span>
                      <span className="text-white font-bold">2.4% / 150%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full w-[8%]" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons Mock */}
                <div className="pt-2 flex items-center gap-2">
                  <button className="flex-1 py-1.5 rounded bg-emerald-600/90 text-white font-sans text-xs font-bold hover:bg-emerald-500 flex items-center justify-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> Start
                  </button>
                  <button className="flex-1 py-1.5 rounded bg-slate-800 text-slate-300 font-sans text-xs font-semibold hover:bg-slate-700">
                    Restart
                  </button>
                  <button className="flex-1 py-1.5 rounded bg-rose-900/60 text-rose-300 font-sans text-xs font-semibold hover:bg-rose-900">
                    Stop
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Trust Card */}
            <div className="absolute -bottom-6 -left-6 bg-slate-900/95 border border-brand-500/30 rounded-xl p-3 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instant Provisioning</p>
                <p className="text-[11px] text-slate-400">Server aktif dalam 10 detik</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
