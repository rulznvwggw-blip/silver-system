import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi Data Pengguna - RullzyeStore',
  description: 'Kebijakan privasi dan perlindungan data pengguna di RullzyeStore Indonesia.',
};

export default function PrivacyPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-black text-white">Kebijakan Privasi (Privacy Policy)</h1>
        <div className="prose prose-invert text-slate-300 text-sm leading-relaxed space-y-4">
          <p>Terakhir diperbarui: 26 Agustus 2026</p>
          <p>RullzyeStore Indonesia berkomitmen melindungi privasi data pribadi dan keamanan file server seluruh pelanggan kami.</p>
          <h3 className="text-white font-bold text-base mt-4">1. Data yang Dikumpulkan</h3>
          <p>Kami hanya mengumpulkan informasi yang dibutuhkan untuk proses transaksi dan pembuatan akun: Nama, Alamat Email, Nomor WhatsApp, dan Username Pterodactyl.</p>
          <h3 className="text-white font-bold text-base mt-4">2. Keamanan File Server</h3>
          <p>Seluruh file yang diupload ke server dienkripsi dan diisolasi dalam container independen. Kami tidak pernah membagikan atau menjual data Anda kepada pihak ketiga.</p>
        </div>
      </div>
    </div>
  );
}
