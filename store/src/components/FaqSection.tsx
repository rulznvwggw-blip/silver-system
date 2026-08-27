'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Apa itu hosting Bot & Game berbasis Pterodactyl?',
    a: 'Hosting Pterodactyl adalah platform cloud modern yang mengisolasi server Anda ke dalam container Docker mandiri. Anda mendapatkan akses Web UI canggih, File Manager, Web Console, dan SFTP untuk mengontrol bot atau server game tanpa perlu setup VPS rumit.',
  },
  {
    q: 'Apakah server akan online 24 jam nonstop?',
    a: 'Ya, semua server kami berjalan 24/7 di datacenter berkecepatan tinggi dengan koneksi listrik redundan dan proteksi crash auto-restart dari Pterodactyl daemon.',
  },
  {
    q: 'Apakah mendukung Bot WhatsApp (Baileys / WhiskeySockets)?',
    a: 'Sangat mendukung! Kami menyediakan Egg khusus Node.js yang sudah dioptimasi untuk Baileys, auto-install npm dependencies, dan menampilkan QR Code login langsung di console browser Anda.',
  },
  {
    q: 'Apakah mendukung Minecraft Java (Paper, Purpur, Spigot)?',
    a: 'Ya, Nest Minecraft kami mendukung seluruh varian Java Edition (Paper, Purpur, Spigot, Vanilla, Forge, Fabric) dengan pilihan versi Java 8, 17, dan 21.',
  },
  {
    q: 'Bagaimana cara melakukan pembayaran dan aktivasinya?',
    a: 'Pembayaran dapat dilakukan secara instan melalui QRIS (GoPay, OVO, DANA, ShopeePay, BCA, Mandiri, BRI, dll) serta Virtual Account. Setelah pembayaran terverifikasi otomatis dalam 5-10 detik, server Anda langsung dibuat dan siap digunakan.',
  },
  {
    q: 'Bagaimana jika saya butuh bantuan setup atau konfigurasi?',
    a: 'Tim support kami siap membantu Anda 24/7 melalui Live Chat WhatsApp resmi dan sistem Tiket Bantuan di Client Area.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // Generate JSON-LD Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQS.map(faq => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a,
      },
    })),
  };

  return (
    <section id="faq" className="py-20 relative">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Pertanyaan Umum
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-slate-400 text-sm">
            Jawaban lengkap seputar layanan hosting, aktivasi otomatis, dan fitur Pterodactyl.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-brand-300 transition-colors"
                >
                  <span className="text-base flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-400 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
