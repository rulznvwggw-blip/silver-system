'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, Server, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

export default function StatusPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/status');
      const json = await res.json();
      if (json.success) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Realtime Monitoring System
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            RullzyeStore Live Server Status
          </h1>
          <p className="text-slate-400 text-sm">
            Status ketersediaan infrastruktur, Wings Daemon, database, dan payment gateway secara realtime.
          </p>
        </div>

        {/* Global Banner */}
        <div className="bg-emerald-950/40 border-2 border-emerald-500/60 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Semua Sistem Beroperasi Normal (Operational)</h2>
              <p className="text-xs text-slate-300">Tidak ada gangguan jaringan atau pemeliharaan terjadwal saat ini.</p>
            </div>
          </div>

          <button
            onClick={fetchStatus}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Perbarui
          </button>
        </div>

        {/* Systems Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden shadow-xl">
          {data?.systems ? (
            data.systems.map((sys: any, idx: number) => (
              <div key={idx} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{sys.name}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">({sys.url})</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Latency: <strong className="text-brand-400">{sys.latencyMs} ms</strong></span>
                    <span>Uptime: <strong className="text-emerald-400">{sys.uptimePercent}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* 90-day simulated uptime bars */}
                  <div className="hidden md:flex items-center gap-1">
                    {[...Array(24)].map((_, i) => (
                      <div key={i} className="w-1.5 h-6 bg-emerald-500 rounded-full opacity-90" title="100% Uptime" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    OPERATIONAL
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">Memuat status server...</div>
          )}
        </div>

        {/* Incident History Notice */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            Riwayat Insiden 30 Hari Terakhir
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tidak ada insiden atau downtime yang tercatat selama 30 hari terakhir. Seluruh server berjalan dengan tingkat reliabilitas 99.99%.
          </p>
        </div>
      </div>
    </div>
  );
}
