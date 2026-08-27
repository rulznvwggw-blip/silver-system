import React from 'react';
import Link from 'next/link';
import { Server, Shield, Zap, Heart, CheckCircle2, QrCode } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-dark-border text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 p-0.5 shadow-md shadow-brand-500/20">
                <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                  <Server className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                RULLZYE<span className="text-brand-400">STORE</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Platform cloud hosting server terdepan di Indonesia berbasis Pterodactyl. Solusi cepat, murah, dan handal untuk Bot WhatsApp, Telegram, Minecraft, dan Aplikasi Linux 24/7.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Uptime SLA 99.99%
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-brand-400" />
                DDoS Shield 100 Gbps
              </span>
            </div>
          </div>

          {/* Col 1: Layanan */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Layanan Cloud</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/hosting-whatsapp" className="hover:text-white transition-colors">
                  Hosting Bot WhatsApp
                </Link>
              </li>
              <li>
                <Link href="/hosting-telegram" className="hover:text-white transition-colors">
                  Hosting Bot Telegram
                </Link>
              </li>
              <li>
                <Link href="/hosting-minecraft" className="hover:text-white transition-colors">
                  Hosting Minecraft Java
                </Link>
              </li>
              <li>
                <Link href="/hosting-nodejs" className="hover:text-white transition-colors">
                  Hosting Node.js
                </Link>
              </li>
              <li>
                <Link href="/hosting-python" className="hover:text-white transition-colors">
                  Hosting Python App
                </Link>
              </li>
              <li>
                <Link href="/hosting-application" className="hover:text-white transition-colors">
                  Generic Linux Container
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Fitur & Dukungan */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Pusat Bantuan</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/status" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Live Server Status
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Tutorial & Panduan
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Client Area Login
                </Link>
              </li>
              <li>
                <Link href="https://wa.me/6281234567890" target="_blank" className="hover:text-white transition-colors text-emerald-400">
                  Hubungi Admin WhatsApp
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legalitas & Keamanan */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Kebijakan</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Syarat & Ketentuan (TOS)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Kebijakan Garansi & Refund
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Tentang RullzyeStore
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-slate-200 transition-colors text-xs text-slate-500">
                  Staff Admin Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods Banner */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-slate-400">
            <span>Metode Pembayaran Instan:</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 font-semibold text-slate-300">QRIS (Semua E-Wallet)</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 font-medium text-slate-300">BCA VA</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 font-medium text-slate-300">Mandiri VA</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 font-medium text-slate-300">BRI VA</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 font-medium text-slate-300">GoPay / DANA / OVO</span>
          </div>

          <p className="text-xs text-slate-400 text-center md:text-right">
            © 2026 <strong className="text-slate-300 font-semibold">RULLZYESTORE INDONESIA</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
