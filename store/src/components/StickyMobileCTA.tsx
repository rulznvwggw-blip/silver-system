'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck } from 'lucide-react';

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-dark-card/95 backdrop-blur-xl border-t border-dark-border p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
      <div>
        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Mulai dari Rp 12.000/bln
        </div>
        <div className="text-xs font-bold text-white">Instan Aktif 24/7</div>
      </div>
      <Link
        href="/#pricing"
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-extrabold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-1.5"
      >
        <Zap className="w-3.5 h-3.5" />
        PILIH PAKET
      </Link>
    </div>
  );
}
