import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat dan Ketentuan Layanan (TOS) - RullzyeStore',
  description: 'Syarat dan ketentuan penggunaan layanan cloud hosting di RullzyeStore Indonesia.',
};

export default function TermsPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-black text-white">Syarat & Ketentuan Layanan (Terms of Service)</h1>
        <div className="prose prose-invert text-slate-300 text-sm leading-relaxed space-y-4">
          <p>Terakhir diperbarui: 26 Agustus 2026</p>
          <h3 className="text-white font-bold text-base mt-4">1. Ketentuan Umum</h3>
          <p>Dengan memesan dan menggunakan layanan di RullzyeStore Indonesia, Anda menyetujui seluruh ketentuan operasional, batasan penggunaan, dan kebijakan keamanan yang kami terapkan.</p>
          
          <h3 className="text-white font-bold text-base mt-4">2. Aktivitas Terlarang (Acceptable Use Policy)</h3>
          <p>Pengguna dilarang keras melakukan aktivitas ilegal seperti: serangan DDoS keluar, cracking/bruteforce, mining cryptocurrency, pornografi anak, phishing, atau aktivitas lain yang melanggar hukum Republik Indonesia.</p>

          <h3 className="text-white font-bold text-base mt-4">3. Pembayaran & Perpanjangan (Billing)</h3>
          <p>Layanan ditagihkan sesuai siklus penagihan yang dipilih. Notifikasi perpanjangan akan dikirim 7 hari, 3 hari, dan 1 hari sebelum tanggal kedaluwarsa. Layanan yang tidak diperpanjang akan disuspend dan memiliki masa tenggang (grace period) selama 3 hari sebelum penghapusan data.</p>
        </div>
      </div>
    </div>
  );
}
