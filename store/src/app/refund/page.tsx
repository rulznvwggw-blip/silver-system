import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Pengembalian Dana (Refund) - RullzyeStore',
  description: 'Garansi dan kebijakan pengembalian dana 100% di RullzyeStore Indonesia.',
};

export default function RefundPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-black text-white">Kebijakan Garansi & Pengembalian Dana (Refund)</h1>
        <div className="prose prose-invert text-slate-300 text-sm leading-relaxed space-y-4">
          <p>Terakhir diperbarui: 26 Agustus 2026</p>
          <h3 className="text-white font-bold text-base mt-4">1. Garansi 3 Hari Uang Kembali</h3>
          <p>Kami memberikan garansi 3 hari uang kembali jika layanan kami mengalami kendala teknis dari sisi server/infrastruktur kami yang tidak dapat diselesaikan oleh tim support.</p>
          <h3 className="text-white font-bold text-base mt-4">2. Pengecualian Refund</h3>
          <p>Pengembalian dana tidak berlaku jika terjadi pelanggaran terhadap Terms of Service (misal: bot spamming/DDoS) atau kesalahan penulisan kode skrip bot dari pihak pengguna sendiri.</p>
        </div>
      </div>
    </div>
  );
}
