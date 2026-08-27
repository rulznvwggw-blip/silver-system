'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CATEGORIES, PRODUCT_PLANS } from '@/data/products';
import { ProductCategory, BillingCycle } from '@/types';
import { formatRupiah } from '@/lib/utils';
import {
  Check,
  Zap,
  Sparkles,
  Server,
  MessageSquare,
  Send,
  Gamepad2,
  Layers,
  Cpu,
  HardDrive,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function PricingSection({ initialCategory }: { initialCategory?: ProductCategory | 'all' }) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'ram_desc' | 'popular'>('popular');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  // Filter & Search Logic
  const filteredPlans = useMemo(() => {
    return PRODUCT_PLANS.filter(plan => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && plan.category !== selectedCategory) {
        return false;
      }

      // 2. Duration Filter
      if (selectedDuration !== 'all') {
        if (selectedDuration === '7d' && !plan.id.includes('7d') && !plan.name.includes('7 Hari')) return false;
        if (selectedDuration === '14d' && !plan.id.includes('14d') && !plan.name.includes('14 Hari')) return false;
        if (selectedDuration === '30d' && !plan.id.includes('30d') && !plan.name.includes('30 Hari')) return false;
      }

      // 3. RAM / Tier Capacity Filter
      if (selectedTier !== 'all') {
        const ram = plan.specs.ramMb;
        if (selectedTier === '1-2gb' && (ram < 512 || ram > 2048)) return false;
        if (selectedTier === '3-4gb' && (ram < 3072 || ram > 4096)) return false;
        if (selectedTier === '6-8gb' && (ram < 6144 || ram > 8192)) return false;
        if (selectedTier === '12-32gb' && ram < 12288) return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = plan.name.toLowerCase().includes(query);
        const matchCategory = plan.category.toLowerCase().includes(query);
        const matchFeatures = plan.features.some(f => f.toLowerCase().includes(query));
        const matchRam = plan.specs.ram.toLowerCase().includes(query);
        const matchBadge = plan.badge?.toLowerCase().includes(query);
        if (!matchName && !matchCategory && !matchFeatures && !matchRam && !matchBadge) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceMonthly - b.priceMonthly;
      if (sortBy === 'price_desc') return b.priceMonthly - a.priceMonthly;
      if (sortBy === 'ram_desc') return b.specs.ramMb - a.specs.ramMb;
      if (sortBy === 'popular') {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.priceMonthly - b.priceMonthly;
      }
      return 0;
    });
  }, [selectedCategory, selectedDuration, selectedTier, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage) || 1;
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPlans.slice(start, start + itemsPerPage);
  }, [filteredPlans, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleDurationChange = (dur: string) => {
    setSelectedDuration(dur);
    setCurrentPage(1);
  };

  const handleTierChange = (tier: string) => {
    setSelectedTier(tier);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedDuration('all');
    setSelectedTier('all');
    setSearchQuery('');
    setSortBy('popular');
    setCurrentPage(1);
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'whatsapp': return MessageSquare;
      case 'telegram': return Send;
      case 'minecraft': return Gamepad2;
      case 'application':
      case 'siao': return Layers;
      default: return Server;
    }
  };

  const getCategoryColor = (catId: string) => {
    switch (catId) {
      case 'whatsapp': return 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30';
      case 'telegram': return 'from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/30';
      case 'minecraft': return 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30';
      case 'application':
      case 'siao': return 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30';
      default: return 'from-brand-500/20 to-brand-500/5 text-brand-400 border-brand-500/30';
    }
  };

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Katalog Resmi 200 Paket Hosting</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Pilih Server & Deploy Instan 24 Jam
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Tersedia berbagai pilihan paket bot dan game server berkecepatan tinggi. Pembayaran QRIS otomatis langsung mengaktifkan server di Pterodactyl Panel.
          </p>
        </div>

        {/* 1. Category Main Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-extrabold shadow-lg shadow-brand-500/25 scale-[1.02]'
                : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Server className={`w-4 h-4 ${selectedCategory === 'all' ? 'text-dark-bg' : 'text-brand-400'}`} />
            <span>Semua Produk (200)</span>
          </button>

          {CATEGORIES.map(cat => {
            const Icon = getCategoryIcon(cat.id);
            const isActive = selectedCategory === cat.id;
            const count = PRODUCT_PLANS.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-extrabold shadow-lg shadow-brand-500/25 scale-[1.02]'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-dark-bg' : 'text-brand-400'}`} />
                <span>{cat.name} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* 2. Sub-Filters & Controls Toolbar */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-4 max-w-6xl mx-auto shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari paket: nama, RAM (cth: 2GB), harga, fitur..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Duration Pills */}
            <div className="md:col-span-4 flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                Durasi:
              </span>
              {[
                { id: 'all', label: 'Semua' },
                { id: '30d', label: '30 Hari' },
                { id: '14d', label: '14 Hari' },
                { id: '7d', label: '7 Hari' },
              ].map(dur => (
                <button
                  key={dur.id}
                  onClick={() => handleDurationChange(dur.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedDuration === dur.id
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800/80'
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">Urutkan:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-950/90 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
              >
                <option value="popular">⭐ Terpopuler</option>
                <option value="price_asc">💵 Termurah</option>
                <option value="price_desc">💎 Tertinggi</option>
                <option value="ram_desc">🚀 RAM Terbesar</option>
              </select>
            </div>
          </div>

          {/* Tier Capacity Quick Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/70 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Kapasitas RAM:
            </span>
            {[
              { id: 'all', label: 'Semua RAM' },
              { id: '1-2gb', label: '1 - 2 GB (Starter)' },
              { id: '3-4gb', label: '3 - 4 GB (Standard)' },
              { id: '6-8gb', label: '6 - 8 GB (Pro / Heavy)' },
              { id: '12-32gb', label: '12 - 32 GB (Enterprise)' },
            ].map(tier => (
              <button
                key={tier.id}
                onClick={() => handleTierChange(tier.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedTier === tier.id
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tier.label}
              </button>
            ))}

            {(selectedCategory !== 'all' || selectedDuration !== 'all' || selectedTier !== 'all' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="ml-auto text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-4"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 max-w-6xl mx-auto px-1">
          <div>
            Menemukan <strong className="text-white font-bold">{filteredPlans.length} paket</strong> hosting sesuai filter
          </div>
          <div>
            Halaman <strong className="text-brand-400 font-bold">{currentPage}</strong> dari {totalPages}
          </div>
        </div>

        {/* Empty State */}
        {filteredPlans.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto space-y-4">
            <Server className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Tidak Ada Paket yang Sesuai Filter</h3>
            <p className="text-xs text-slate-400">
              Coba kurangi kata kunci pencarian atau ubah filter durasi dan RAM untuk melihat paket lainnya.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-brand-500 text-dark-bg font-bold text-xs hover:bg-brand-400 transition-colors"
            >
              Tampilkan Semua 200 Paket
            </button>
          </div>
        )}

        {/* 3. Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {paginatedPlans.map(plan => {
            const Icon = getCategoryIcon(plan.category);
            const colorClass = getCategoryColor(plan.category);
            const durationLabel = plan.id.includes('7d') ? '7 Hari' : plan.id.includes('14d') ? '14 Hari' : '30 Hari';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-slate-950 border ${
                  plan.popular
                    ? 'border-brand-500/80 shadow-xl shadow-brand-500/10 scale-[1.01]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Badge Header */}
                {plan.badge && (
                  <div className="absolute -top-3 right-5 bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Category & Title */}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} border flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-extrabold text-white truncate">{plan.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span className="capitalize">{plan.category}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">{durationLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-2 pb-3 border-y border-slate-800/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        {formatRupiah(plan.priceMonthly)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        / {durationLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{plan.features[0] || 'Deploy instan 5-10 detik'}</p>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                    <div className="bg-slate-950/90 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-200">
                      <Cpu className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span>{plan.specs.ram}</span>
                    </div>
                    <div className="bg-slate-950/90 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-200">
                      <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{plan.specs.disk}</span>
                    </div>
                    <div className="bg-slate-950/90 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-200">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{plan.specs.cpu}</span>
                    </div>
                    <div className="bg-slate-950/90 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-200">
                      <Server className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{plan.specs.ports} Port Publik</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                    {plan.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Checkout CTA */}
                <div className="pt-5 mt-2 border-t border-slate-800/60">
                  <Link
                    href={`/checkout?plan=${plan.id}`}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow-md ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 hover:to-emerald-300 text-dark-bg shadow-brand-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    PESAN SEKARANG (QRIS INSTAN)
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Pagination Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-brand-500 text-dark-bg'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

