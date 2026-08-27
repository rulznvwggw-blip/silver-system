'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES, PRODUCT_PLANS } from '@/data/products';
import { ProductCategory, BillingCycle } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { Check, Zap, Sparkles, Server, MessageSquare, Send, Gamepad2, Layers, Cpu, HardDrive } from 'lucide-react';

export default function PricingSection({ initialCategory }: { initialCategory?: ProductCategory }) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory || 'whatsapp');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  // Filter plans for the active category
  const activePlans = PRODUCT_PLANS.filter(p => p.category === selectedCategory);

  // Discount multiplier calculation
  const getCycleMultiplier = (cycle: BillingCycle) => {
    switch (cycle) {
      case 'quarterly': return 3 * 0.95;
      case 'semi_annually': return 6 * 0.90;
      case 'annually': return 12 * 0.80;
      default: return 1;
    }
  };

  const getCycleLabel = (cycle: BillingCycle) => {
    switch (cycle) {
      case 'quarterly': return '/ 3 bulan';
      case 'semi_annually': return '/ 6 bulan';
      case 'annually': return '/ tahun';
      default: return '/ bulan';
    }
  };

  const getCategoryIcon = (catId: ProductCategory) => {
    switch (catId) {
      case 'whatsapp': return MessageSquare;
      case 'telegram': return Send;
      case 'minecraft': return Gamepad2;
      case 'siao': return Layers;
      default: return Server;
    }
  };

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Daftar Paket & Harga
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Pilih Paket Hosting Sesuai Kebutuhan
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Semua paket sudah termasuk akses penuh Pterodactyl Panel, SFTP File Manager, Anti-DDoS, dan otomatis aktif setelah pembayaran.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {CATEGORIES.map(cat => {
            const Icon = getCategoryIcon(cat.id);
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-500 to-emerald-500 text-dark-bg font-bold shadow-lg shadow-brand-500/25 scale-[1.02]'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-dark-bg' : 'text-brand-400'}`} />
                <span>{cat.name}</span>
                {cat.popular && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isActive ? 'bg-dark-bg/20 text-dark-bg' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    Populer
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                billingCycle === 'monthly' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1 Bulan
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                billingCycle === 'quarterly' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              3 Bulan <span className="text-[10px] text-brand-400 font-bold">-5%</span>
            </button>
            <button
              onClick={() => setBillingCycle('semi_annually')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                billingCycle === 'semi_annually' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              6 Bulan <span className="text-[10px] text-cyan-400 font-bold">-10%</span>
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                billingCycle === 'annually' ? 'bg-gradient-to-r from-brand-600 to-emerald-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              1 Tahun <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1 rounded font-bold">-20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {activePlans.map(plan => {
            const rawPrice = plan.priceMonthly * getCycleMultiplier(billingCycle);
            const displayPrice = Math.round(rawPrice);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-brand-500/80 shadow-2xl shadow-brand-500/15 lg:-translate-y-2'
                    : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular Ribbon */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Category */}
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">Deploy otomatis dalam 10 detik</p>
                  </div>

                  {/* Price Header */}
                  <div className="pt-2 pb-4 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        {formatRupiah(displayPrice)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {getCycleLabel(billingCycle)}
                      </span>
                    </div>
                    {billingCycle !== 'monthly' && (
                      <div className="text-[11px] text-emerald-400 font-medium mt-1">
                        Hemat hingga {formatRupiah(Math.round(plan.priceMonthly * (billingCycle === 'annually' ? 12 : billingCycle === 'semi_annually' ? 6 : 3) - displayPrice))}
                      </div>
                    )}
                  </div>

                  {/* Specs Quick Pills */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-200">
                      <Cpu className="w-4 h-4 text-brand-400" />
                      <span>{plan.specs.ram} RAM</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-200">
                      <HardDrive className="w-4 h-4 text-cyan-400" />
                      <span>{plan.specs.disk}</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-200">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>{plan.specs.cpu}</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-200">
                      <Server className="w-4 h-4 text-purple-400" />
                      <span>{plan.specs.ports} Port Alokasi</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-2">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fitur Utama:</p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Buy Button */}
                <div className="pt-8">
                  <Link
                    href={`/checkout?plan=${plan.id}&cycle=${billingCycle}`}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2 shadow-lg ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 hover:to-emerald-300 text-dark-bg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02]'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    BELI SEKARANG
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
