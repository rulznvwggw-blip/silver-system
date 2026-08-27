'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Server, Activity, Menu, X, Terminal, ChevronRight, ExternalLink, MessageSquare, Send, Gamepad2, Layers } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-dark-bg/90 border-b border-dark-border text-dark-text transition-colors">
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
                Cloud Hosting Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <div className="relative" onMouseLeave={() => setIsCatalogOpen(false)}>
              <button
                onMouseEnter={() => setIsCatalogOpen(true)}
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Katalog Hosting</span>
                <span className="text-xs text-brand-400 font-bold bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">200 Paket</span>
              </button>

              {/* Dropdown Menu */}
              {isCatalogOpen && (
                <div className="absolute top-full left-0 w-72 p-2 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    href="/#pricing"
                    onClick={() => setIsCatalogOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-dark-bg transition-colors">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Semua Paket Hosting</div>
                      <div className="text-[10px] text-slate-400">Pilihan 200 server lengkap</div>
                    </div>
                  </Link>
                  <Link
                    href="/hosting-whatsapp"
                    onClick={() => setIsCatalogOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-dark-bg transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Bot WhatsApp (60 Paket)</div>
                      <div className="text-[10px] text-slate-400">Node.js Baileys Auto QR</div>
                    </div>
                  </Link>
                  <Link
                    href="/hosting-telegram"
                    onClick={() => setIsCatalogOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-dark-bg transition-colors">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Bot Telegram (60 Paket)</div>
                      <div className="text-[10px] text-slate-400">Python 3.11 & Telegraf 24 Jam</div>
                    </div>
                  </Link>
                  <Link
                    href="/hosting-minecraft"
                    onClick={() => setIsCatalogOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-dark-bg transition-colors">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Minecraft Server (60 Paket)</div>
                      <div className="text-[10px] text-slate-400">Paper & Purpur TPS 20.0</div>
                    </div>
                  </Link>
                  <Link
                    href="/hosting-application"
                    onClick={() => setIsCatalogOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-dark-bg transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">App Cloud & Linux (20 Paket)</div>
                      <div className="text-[10px] text-slate-400">SIAO Engine & Generic Apps</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/status"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Status Server
            </Link>

            <Link
              href="/blog"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              Tutorial & Blog
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="https://ptero.rullzyestorepremium.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-brand-500/50 transition-all flex items-center gap-1.5"
            >
              <span>Pterodactyl Panel</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
            </a>

            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-200 hover:text-white px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-brand-400" />
              Client Area
            </Link>

            <Link
              href="/#pricing"
              className="text-xs font-bold text-dark-bg bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 px-4 py-2 rounded-lg shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center gap-1.5"
            >
              Sewa Server
              <ChevronRight className="w-3.5 h-3.5" />
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
            🛍️ Semua Paket Hosting (200 Pilihan)
          </Link>
          <Link
            href="/hosting-whatsapp"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            🟢 Hosting Bot WhatsApp
          </Link>
          <Link
            href="/hosting-telegram"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            🔵 Hosting Bot Telegram
          </Link>
          <Link
            href="/hosting-minecraft"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            ⛏️ Hosting Minecraft Server
          </Link>
          <Link
            href="/hosting-application"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            🚀 Generic App & Linux Cloud
          </Link>
          <Link
            href="/status"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-400 hover:bg-slate-800"
          >
            <Activity className="w-4 h-4" />
            Live Server Status (Online 💚)
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            📚 Tutorial & Panduan
          </Link>

          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-slate-700 text-slate-200 font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 text-brand-400" />
              Client Area & Tiket Bantuan
            </Link>
            <a
              href="https://ptero.rullzyestorepremium.my.id"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-brand-500/40 text-brand-300 font-medium hover:bg-brand-500/10 flex items-center justify-center gap-1.5"
            >
              <span>Buka Pterodactyl Panel</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
            </a>
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

