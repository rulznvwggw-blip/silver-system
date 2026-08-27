import React from 'react';
import { Star, ShieldCheck, MessageSquareQuote } from 'lucide-react';

export default function TestimonialSection() {
  const reviews = [
    {
      name: 'Rian Hidayat',
      role: 'Owner Komunitas Bot WhatsApp Store',
      product: 'WA Basic (1GB)',
      rating: 5,
      comment: 'Bot Baileys toko saya jalan 24 jam nonstop tanpa pernah crash. Fitur Pterodactyl-nya sangat memudahkan saat scan QR code langsung dari console.',
    },
    {
      name: 'Dimas Kurniawan',
      role: 'Server Admin Minecraft SMP',
      product: 'Minecraft SMP (4GB)',
      rating: 5,
      comment: 'PaperMC berjalan sangat smooth, TPS stabil di 20.0 meski ada 20 player online barengan. Alokasi port gratis dan SFTP cepat banget!',
    },
    {
      name: 'Fauzan Akbar',
      role: 'Python & Telegram Bot Developer',
      product: 'Telegram Pro Store',
      rating: 5,
      comment: 'Sangat puas! Pembayaran via QRIS langsung aktif dalam 10 detik. Tinggal git clone repo bot langsung jalan lancar.',
    },
    {
      name: 'Budi Santoso',
      role: 'Fullstack Dev & Microservice SIAO',
      product: 'SIAO Standard',
      rating: 5,
      comment: 'Container Linux-nya sangat fleksibel untuk webhook dan custom API backend. Support WhatsApp-nya juga sangat ramah dan responsif.',
    }
  ];

  return (
    <section className="py-20 bg-slate-900/30 border-t border-dark-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Ulasan Pengguna
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Apa Kata Customer Kami?
          </h2>
          <p className="text-slate-400 text-sm">
            Ratusan developer dan komunitas mempercayakan server mereka di RullzyeStore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{rev.name}</h4>
                  <p className="text-slate-400 text-[11px]">{rev.role}</p>
                </div>
                <span className="text-[10px] bg-brand-500/10 text-brand-400 font-semibold px-2 py-0.5 rounded border border-brand-500/20">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Ulasan diverifikasi melalui sistem pesanan aktif (Demo sample review).
          </span>
        </div>
      </div>
    </section>
  );
}
