'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Server, Shield, Activity, BookOpen, Menu, X, Terminal, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-dark-bg/85 border-b border-dark-border text-dark-text transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                <Server className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-brand-400">
                RULLZYE<span className="text-brand-400">STORE</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                Cloud Hosting Indonesia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/#pricing"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              Layanan & Paket
            </Link>
            <Link
              href="/hosting-whatsapp"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              Bot WA
            </Link>
            <Link
              href="/hosting-minecraft"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              Minecraft
            </Link>
            <Link
              href="/status"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Server Status
            </Link>
            <Link
              href="/blog"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-lg border border-slate-700/80 hover:border-slate-500 transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-4 h-4 text-brand-400" />
              Client Area
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-semibold text-dark-bg bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 px-4 py-2 rounded-lg shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center gap-1.5"
            >
              Mulai Hosting
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-dark-border bg-dark-card/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/#pricing"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Layanan & Paket
          </Link>
          <Link
            href="/hosting-whatsapp"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Hosting Bot WhatsApp
          </Link>
          <Link
            href="/hosting-telegram"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Hosting Bot Telegram
          </Link>
          <Link
            href="/hosting-minecraft"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Hosting Minecraft
          </Link>
          <Link
            href="/status"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-400 hover:bg-slate-800"
          >
            <Activity className="w-4 h-4" />
            Live Server Status (Online)
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Tutorial & Blog
          </Link>
          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-slate-700 text-slate-200 font-medium hover:bg-slate-800"
            >
              Client Area (Dashboard)
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-slate-700/60 text-slate-400 font-medium hover:bg-slate-800 text-sm"
            >
              Admin Portal
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-lg bg-gradient-to-r from-brand-400 to-emerald-400 text-dark-bg font-bold shadow-lg"
            >
              Pilih Paket Hosting
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
