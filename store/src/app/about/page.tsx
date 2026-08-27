import React from 'react';
import { Server, ShieldCheck, Zap, Users, Globe, Award } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang RullzyeStore Indonesia - Solusi Cloud Hosting Modern',
  description: 'Mengenal RullzyeStore Indonesia, penyedia infrastruktur cloud hosting server game dan bot 24 jam berbasis Pterodactyl.',
};

export default function AboutPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Profil Perusahaan
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tentang <span className="text-brand-400">RullzyeStore Indonesia</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Menghadirkan infrastruktur hosting berkecepatan tinggi, terjangkau, dan mudah digunakan untuk developer, gamer, dan komunitas di seluruh Indonesia.
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
          <p>
            Didirikan pada tahun 2026, <strong>RullzyeStore Indonesia</strong> berfokus pada penyediaan server virtual terisolasi menggunakan teknologi containerisasi Docker dan antarmuka kontrol panel Pterodactyl. Kami memahami betapa pentingnya kestabilan dan kemudahan konfigurasi bagi pengembang bot WhatsApp, Telegram, serta pengelola server Minecraft.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 not-prose">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
              <Zap className="w-6 h-6 text-brand-400" />
              <h3 className="font-bold text-white text-sm">Otomatisasi Penuh</h3>
              <p className="text-xs text-slate-400">Aktivasi instan dan provisioning server otomatis tanpa campur tangan manual.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Keamanan Teruji</h3>
              <p className="text-xs text-slate-400">Proteksi Anti-DDoS 100 Gbps dan isolasi resource Linux Cgroups v2.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
              <Globe className="w-6 h-6 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Datacenter Indonesia</h3>
              <p className="text-xs text-slate-400">Routing Direct BGP dengan latency rendah ke seluruh operator di Indonesia.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
