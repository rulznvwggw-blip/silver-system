import React from 'react';
import { Zap, Rocket, Shield, HardDrive, RotateCcw, Gamepad2, Bot, Headphones, Users, Server, Activity, CheckCircle } from 'lucide-react';

export default function TrustSection() {
  const stats = [
    { label: 'Total Server Dikelola', value: '1,840+', icon: Server, color: 'text-brand-400' },
    { label: 'Customer Aktif', value: '1,250+', icon: Users, color: 'text-emerald-400' },
    { label: 'Rata-rata Uptime', value: '99.99%', icon: Activity, color: 'text-cyan-400' },
    { label: 'Order Selesai Diproses', value: '4,500+', icon: CheckCircle, color: 'text-amber-400' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Setup Otomatis',
      desc: 'Bayar lewat QRIS atau Virtual Account, server Anda langsung dibuat oleh sistem otomatis dalam hitungan detik tanpa nunggu admin.',
      accent: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    },
    {
      icon: Rocket,
      title: 'High Performance CPU',
      desc: 'Ditenagai prosesor berkecepatan tinggi dengan clock kencang untuk komputasi bot dan game server tanpa lag.',
      accent: 'from-brand-500/20 to-emerald-500/20 text-brand-400',
    },
    {
      icon: Shield,
      title: 'DDoS Protection 100 Gbps',
      desc: 'Setiap server dilindungi firewall anti-DDoS gaming yang memfilter serangan UDP/TCP flood secara instan.',
      accent: 'from-blue-500/20 to-indigo-500/20 text-blue-400',
    },
    {
      icon: HardDrive,
      title: 'NVMe Gen4 Storage',
      desc: 'Kecepatan read/write storage hingga 7000 MB/s memastikan booting bot dan loading chunk Minecraft super instan.',
      accent: 'from-purple-500/20 to-fuchsia-500/20 text-purple-400',
    },
    {
      icon: RotateCcw,
      title: 'Auto Restart saat Crash',
      desc: 'Bot WhatsApp atau script error? Pterodactyl daemon akan otomatis me-restart container Anda agar tetap online 24 jam.',
      accent: 'from-rose-500/20 to-pink-500/20 text-rose-400',
    },
    {
      icon: Gamepad2,
      title: 'Minecraft Multi-Version Ready',
      desc: 'Dukungan PaperMC, Purpur, Spigot, Fabric, dan Forge dengan Java selector lengkap (Java 8, 17, 21).',
      accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    },
    {
      icon: Bot,
      title: 'Bot Engine Terlengkap',
      desc: 'Mendukung Node.js 18/20/22, Python 3.11/3.12, Baileys, Telegraf, Pyrogram, dan framework modern lainnya.',
      accent: 'from-cyan-500/20 to-sky-500/20 text-cyan-400',
    },
    {
      icon: Headphones,
      title: 'Customer Support Cepat',
      desc: 'Tim support teknis kami siap membantu Anda melalui live chat WhatsApp dan sistem tiket bantuan.',
      accent: 'from-green-500/20 to-emerald-500/20 text-green-400',
    },
  ];

  return (
    <section className="py-20 bg-slate-900/40 border-y border-dark-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4 hover:border-slate-700 transition-colors"
              >
                <div className={`p-3 rounded-xl bg-slate-800/80 ${s.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Kelebihan Layanan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kenapa Memilih <span className="text-brand-400">RULLZYESTORE</span>?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Kami merancang infrastruktur hosting khusus developer dan gamer yang mengutamakan kecepatan, kemudahan kontrol panel, dan stabilitas server 24 jam nonstop.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
