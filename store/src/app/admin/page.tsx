'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order, ProvisionedServer, Ticket, Coupon } from '@/types';
import { formatRupiah, formatDate } from '@/lib/utils';
import {
  ShieldAlert,
  Server,
  DollarSign,
  ShoppingCart,
  Users,
  LifeBuoy,
  Tag,
  Settings,
  Activity,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Send,
  Loader2,
  Terminal,
  Radio,
  BarChart3,
  Cpu,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'servers' | 'coupons' | 'tickets' | 'settings'>('overview');
  const [stats, setStats] = useState<Record<string, number | string>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [servers, setServers] = useState<ProvisionedServer[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTabChanging, setIsTabChanging] = useState(false);

  // Ticket reply in admin
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [adminReply, setAdminReply] = useState('');

  // Settings State
  const [brandName, setBrandName] = useState('RullzyeStore Indonesia');
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const res = await fetch('/api/admin');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setOrders(data.orders);
          setServers(data.servers);
          setTickets(data.tickets);
          setCoupons(data.coupons);
          if (data.tickets.length > 0) setSelectedTicket(data.tickets[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    }

    fetchAdminData();
  }, []);

  const handleTabChange = (tab: 'overview' | 'orders' | 'servers' | 'coupons' | 'tickets' | 'settings') => {
    if (tab === activeTab) return;
    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTabChanging(false);
    }, 180);
  };

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !adminReply.trim()) return;

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          sender: 'support',
          senderName: 'RullzyeStore Admin',
          message: adminReply,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedTicket(data.data);
        setTickets(tickets.map(t => t.id === data.data.id ? data.data : t));
        setAdminReply('');
      }
    } catch {
      alert('Gagal membalas tiket');
    }
  };

  return (
    <div className="min-h-screen py-8 bg-[#120b08] text-[#fdfbf7] relative selection:bg-[#d97736] selection:text-white">
      {/* Background Cozy Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d97736]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#f59e0b]/5 rounded-full blur-3xl" />
      </div>

      {/* Steam Loading Animation Screen */}
      {(isLoading || isTabChanging) && (
        <div className="fixed inset-0 z-50 bg-[#120b08]/85 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#2b1b13] to-[#1a100a] border border-[#d97736]/40 flex items-center justify-center shadow-2xl shadow-[#d97736]/30 animate-ambient-pulse mb-4">
            <div className="absolute -top-3 left-6 w-1 h-4 bg-gradient-to-t from-[#d97736] to-transparent rounded-full animate-steam-1" />
            <div className="absolute -top-4 left-9 w-1 h-5 bg-gradient-to-t from-[#f59e0b] to-transparent rounded-full animate-steam-2" />
            <div className="absolute -top-3 left-12 w-1 h-4 bg-gradient-to-t from-[#d97736] to-transparent rounded-full animate-steam-1" />
            <span className="text-3xl filter drop-shadow-md">☕</span>
          </div>
          <span className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-[#fdfbf7] via-[#d97736] to-[#fdfbf7] bg-clip-text text-transparent animate-pulse">
            MEMUAT CONTROL CENTER...
          </span>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Bar */}
        <div className="bg-[#1e130d]/90 border border-[#d97736]/20 p-5 sm:p-6 rounded-3xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d97736] to-[#8a4216] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#d97736]/30 border border-[#f59e0b]/40">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Admin Command Center
                </h1>
                <span className="text-[11px] font-black uppercase tracking-wider bg-[#d97736]/20 text-[#f59e0b] px-3 py-0.5 rounded-full border border-[#d97736]/40">
                  ROOT ADMIN
                </span>
              </div>
              <p className="text-xs text-[#bfa995] mt-0.5">
                Sistem Pengawasan Server, Finansial, Tiket & Provisioning Realtime
              </p>
            </div>
          </div>

          <a
            href="https://ptero.rullzyestorepremium.my.id/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-[#2b1b13] hover:bg-[#362319] text-[#fdfbf7] font-bold text-xs border border-[#d97736]/30 flex items-center justify-center gap-2 transition-all shadow-md hover:border-[#d97736]/60"
          >
            <Terminal className="w-4 h-4 text-[#d97736]" />
            Buka Pterodactyl Admin Area
            <ExternalLink className="w-3.5 h-3.5 text-[#bfa995]" />
          </a>
        </div>

        {/* Layout with Left Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ══════════════════════════════════════════════════════════════
              LEFT SIDEBAR MENU
              ══════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-4 space-y-2 backdrop-blur-xl shadow-xl">
              <span className="text-[10px] font-black tracking-widest uppercase text-[#8c7663] px-3 py-1 block">
                ADMINISTRATION
              </span>

              <button
                onClick={() => handleTabChange('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-[#d97736]/25 to-[#f59e0b]/10 text-white border border-[#d97736]/50 shadow-md'
                    : 'text-[#bfa995] hover:bg-[#281a12] hover:text-[#fdfbf7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#d97736]' : 'text-[#8c7663]'}`} />
                  <span>Overview & Stats</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8c7663]" />
              </button>

              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#d97736]/25 to-[#f59e0b]/10 text-white border border-[#d97736]/50 shadow-md'
                    : 'text-[#bfa995] hover:bg-[#281a12] hover:text-[#fdfbf7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className={`w-4 h-4 ${activeTab === 'orders' ? 'text-[#d97736]' : 'text-[#8c7663]'}`} />
                  <span>Pesanan & Order</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'orders' ? 'bg-[#d97736] text-[#120b08]' : 'bg-[#281a12] text-[#bfa995]'
                }`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('servers')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'servers'
                    ? 'bg-gradient-to-r from-[#d97736]/25 to-[#f59e0b]/10 text-white border border-[#d97736]/50 shadow-md'
                    : 'text-[#bfa995] hover:bg-[#281a12] hover:text-[#fdfbf7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Server className={`w-4 h-4 ${activeTab === 'servers' ? 'text-[#d97736]' : 'text-[#8c7663]'}`} />
                  <span>Server Terbuat</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'servers' ? 'bg-[#d97736] text-[#120b08]' : 'bg-[#281a12] text-[#bfa995]'
                }`}>
                  {servers.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('coupons')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'coupons'
                    ? 'bg-gradient-to-r from-[#d97736]/25 to-[#f59e0b]/10 text-white border border-[#d97736]/50 shadow-md'
                    : 'text-[#bfa995] hover:bg-[#281a12] hover:text-[#fdfbf7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Tag className={`w-4 h-4 ${activeTab === 'coupons' ? 'text-[#d97736]' : 'text-[#8c7663]'}`} />
                  <span>Kupon Diskon</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'coupons' ? 'bg-[#d97736] text-[#120b08]' : 'bg-[#281a12] text-[#bfa995]'
                }`}>
                  {coupons.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('tickets')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'tickets'
                    ? 'bg-gradient-to-r from-[#d97736]/25 to-[#f59e0b]/10 text-white border border-[#d97736]/50 shadow-md'
                    : 'text-[#bfa995] hover:bg-[#281a12] hover:text-[#fdfbf7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LifeBuoy className={`w-4 h-4 ${activeTab === 'tickets' ? 'text-[#d97736]' : 'text-[#8c7663]'}`} />
                  <span>Tiket Pelanggan</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'tickets' ? 'bg-[#d97736] text-[#120b08]' : 'bg-[#281a12] text-[#bfa995]'
                }`}>
                  {tickets.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('settings')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-[#d97736]/25 to-[#f59e0b]/10 text-white border border-[#d97736]/50 shadow-md'
                    : 'text-[#bfa995] hover:bg-[#281a12] hover:text-[#fdfbf7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-[#d97736]' : 'text-[#8c7663]'}`} />
                  <span>Pengaturan Sistem</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8c7663]" />
              </button>
            </div>

            {/* Quick Node Status */}
            <div className="bg-[#1e130d]/80 border border-[#d97736]/20 rounded-3xl p-4 space-y-2 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#fdfbf7] flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#10b981] animate-pulse" />
                  Wings Daemon Node
                </span>
                <span className="text-[10px] font-black text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-full border border-[#10b981]/30">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-[#bfa995]">Port 8085 / SFTP 2022 Terkoneksi</p>
            </div>
          </aside>

          {/* ══════════════════════════════════════════════════════════════
              MAIN ADMIN CONTENT AREA
              ══════════════════════════════════════════════════════════════ */}
          <main className="lg:col-span-9 space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-[#1e130d]/90 border border-[#d97736]/20 p-5 rounded-3xl space-y-1 shadow-xl">
                    <div className="flex items-center justify-between text-xs text-[#8c7663] font-bold uppercase">
                      <span>Total Revenue</span>
                      <DollarSign className="w-4 h-4 text-[#10b981]" />
                    </div>
                    <div className="text-2xl font-black text-[#10b981]">
                      {formatRupiah(Number(stats.totalRevenue) || 0)}
                    </div>
                    <div className="text-[11px] text-[#bfa995]">Pendapatan Terverifikasi</div>
                  </div>

                  <div className="bg-[#1e130d]/90 border border-[#d97736]/20 p-5 rounded-3xl space-y-1 shadow-xl">
                    <div className="flex items-center justify-between text-xs text-[#8c7663] font-bold uppercase">
                      <span>Active Servers</span>
                      <Server className="w-4 h-4 text-[#d97736]" />
                    </div>
                    <div className="text-2xl font-black text-white">
                      {stats.activeServersCount || servers.length}
                    </div>
                    <div className="text-[11px] text-[#10b981]">Running di Node Cyber</div>
                  </div>

                  <div className="bg-[#1e130d]/90 border border-[#d97736]/20 p-5 rounded-3xl space-y-1 shadow-xl">
                    <div className="flex items-center justify-between text-xs text-[#8c7663] font-bold uppercase">
                      <span>Total Orders</span>
                      <ShoppingCart className="w-4 h-4 text-[#f59e0b]" />
                    </div>
                    <div className="text-2xl font-black text-white">
                      {stats.totalOrders || orders.length}
                    </div>
                    <div className="text-[11px] text-[#bfa995]">Transaksi Masuk</div>
                  </div>

                  <div className="bg-[#1e130d]/90 border border-[#d97736]/20 p-5 rounded-3xl space-y-1 shadow-xl">
                    <div className="flex items-center justify-between text-xs text-[#8c7663] font-bold uppercase">
                      <span>Pterodactyl Node</span>
                      <Activity className="w-4 h-4 text-[#10b981]" />
                    </div>
                    <div className="text-2xl font-black text-[#10b981]">100% ONLINE 💚</div>
                    <div className="text-[11px] text-[#bfa995]">Auto Failover Active</div>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-6 space-y-4 shadow-xl">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">5 Pesanan Terakhir Pelanggan</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#d6c6b4]">
                      <thead className="bg-[#140d09] text-[11px] uppercase tracking-wider text-[#d97736] font-black border-b border-[#d97736]/20">
                        <tr>
                          <th className="px-4 py-3">Order Number</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Paket</th>
                          <th className="px-4 py-3">Nominal</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d97736]/10 font-mono">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="hover:bg-[#281a12]/60">
                            <td className="px-4 py-3 text-white font-bold">{o.orderNumber}</td>
                            <td className="px-4 py-3 font-sans text-slate-300">{o.customer.name}</td>
                            <td className="px-4 py-3 font-sans text-[#bfa995]">{o.item.planName}</td>
                            <td className="px-4 py-3 text-[#10b981] font-bold">{formatRupiah(o.amount)}</td>
                            <td className="px-4 py-3 font-sans">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                o.paymentStatus === 'paid' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                              }`}>
                                {o.paymentStatus.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SERVERS TAB */}
            {activeTab === 'servers' && (
              <div className="bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#d6c6b4]">
                    <thead className="bg-[#140d09] border-b border-[#d97736]/20 text-[11px] uppercase tracking-wider text-[#d97736] font-black">
                      <tr>
                        <th className="px-6 py-4">Server Name</th>
                        <th className="px-6 py-4">Customer Email</th>
                        <th className="px-6 py-4">Node & Port</th>
                        <th className="px-6 py-4">Alokasi RAM/CPU</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d97736]/10 font-mono">
                      {servers.map(s => (
                        <tr key={s.id} className="hover:bg-[#281a12]/60">
                          <td className="px-6 py-4 font-sans font-bold text-white">{s.name}</td>
                          <td className="px-6 py-4 text-[#bfa995] font-sans">{s.customerEmail}</td>
                          <td className="px-6 py-4 text-[#f59e0b]">{s.ipAddress}:{s.port}</td>
                          <td className="px-6 py-4 text-[#d6c6b4]">{s.ram} / {s.cpu}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] text-[10px] font-sans font-black">
                              ONLINE
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href="https://ptero.rullzyestorepremium.my.id/admin/servers"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#d97736] hover:text-[#f59e0b] underline font-sans font-bold"
                            >
                              Manage Panel
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#d6c6b4]">
                    <thead className="bg-[#140d09] border-b border-[#d97736]/20 text-[11px] uppercase tracking-wider text-[#d97736] font-black">
                      <tr>
                        <th className="px-6 py-4">No. Order</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Paket</th>
                        <th className="px-6 py-4">Metode</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d97736]/10 font-mono">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-[#281a12]/60">
                          <td className="px-6 py-4 font-bold text-white">{o.orderNumber}</td>
                          <td className="px-6 py-4 font-sans text-[#fdfbf7]">{o.customer.name}</td>
                          <td className="px-6 py-4 font-sans text-[#bfa995]">{o.item.planName}</td>
                          <td className="px-6 py-4 uppercase text-[#bfa995]">{o.paymentMethod}</td>
                          <td className="px-6 py-4 font-black text-[#10b981]">{formatRupiah(o.amount)}</td>
                          <td className="px-6 py-4 font-sans">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              o.paymentStatus === 'paid' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                            }`}>
                              {o.paymentStatus.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div className="bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-6 space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Daftar Voucher Promo Aktif</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {coupons.map(c => (
                    <div key={c.code} className="bg-[#140d09] p-5 rounded-2xl border border-[#d97736]/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-black font-mono text-[#d97736]">{c.code}</span>
                        <span className="text-xs font-black text-[#10b981]">{c.discountPercentage}% OFF</span>
                      </div>
                      <p className="text-[11px] text-[#bfa995]">
                        Min. Belanja: {formatRupiah(c.minSpend || 0)}
                      </p>
                      <div className="text-[10px] text-[#8c7663] flex justify-between pt-2 border-t border-[#d97736]/10">
                        <span>Terpakai: {c.usageCount}/{c.maxUsage}</span>
                        <span>Berlaku s/d {c.validUntil}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TICKETS TAB */}
            {activeTab === 'tickets' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-4 space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#d97736] px-2">Tiket Masuk Pelanggan</h3>
                  {tickets.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs transition-all ${
                        selectedTicket?.id === t.id
                          ? 'border-[#d97736] bg-[#d97736]/15 text-white font-bold shadow-md'
                          : 'border-[#d97736]/15 bg-[#140d09] text-[#bfa995] hover:border-[#d97736]/40'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] text-[#8c7663] mb-1">
                        <span>{t.ticketNumber} • {t.customerName}</span>
                        <span className="capitalize text-[#f59e0b] font-bold">{t.status.replace('_', ' ')}</span>
                      </div>
                      <div className="font-bold text-[#fdfbf7] truncate">{t.subject}</div>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-7 bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-6 space-y-4 shadow-2xl">
                  {selectedTicket ? (
                    <div className="space-y-4">
                      <div className="border-b border-[#d97736]/15 pb-3">
                        <span className="text-[10px] font-mono text-[#d97736]">{selectedTicket.ticketNumber}</span>
                        <h3 className="text-base font-bold text-white">{selectedTicket.subject}</h3>
                        <p className="text-xs text-[#bfa995]">Dari: {selectedTicket.customerName} ({selectedTicket.customerEmail})</p>
                      </div>

                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                        {selectedTicket.messages.map(m => (
                          <div
                            key={m.id}
                            className={`p-4 rounded-2xl text-xs space-y-1 ${
                              m.sender === 'customer'
                                ? 'bg-[#140d09] border border-[#d97736]/20 mr-4'
                                : 'bg-[#281a12] border border-[#d97736]/40 ml-4 text-[#fdfbf7]'
                            }`}
                          >
                            <div className="flex justify-between items-center text-[10px] text-[#8c7663]">
                              <strong className={m.sender === 'support' ? 'text-[#f59e0b] font-black' : 'text-white'}>
                                {m.senderName}
                              </strong>
                              <span>{formatDate(m.timestamp)}</span>
                            </div>
                            <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleAdminReply} className="flex gap-2 pt-2 border-t border-[#d97736]/15">
                        <input
                          type="text"
                          required
                          value={adminReply}
                          onChange={e => setAdminReply(e.target.value)}
                          placeholder="Ketik balasan resmi CS..."
                          className="flex-1 bg-[#140d09] border border-[#d97736]/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d97736]"
                        />
                        <button
                          type="submit"
                          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d97736] to-[#f59e0b] text-[#120b08] font-black text-xs flex items-center gap-1.5 shadow-lg shadow-[#d97736]/20"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Kirim
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-[#8c7663] text-xs">Pilih tiket untuk membalas.</div>
                  )}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <h3 className="text-base font-black text-white border-b border-[#d97736]/15 pb-3">Pengaturan Global Store</h3>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[#d6c6b4] font-bold">Nama Brand Hosting</label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={e => setBrandName(e.target.value)}
                      className="w-full bg-[#140d09] border border-[#d97736]/20 rounded-xl p-3.5 text-white focus:outline-none focus:border-[#d97736]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#d6c6b4] font-bold">Pterodactyl Panel Endpoint</label>
                    <input
                      type="text"
                      disabled
                      value="https://ptero.rullzyestorepremium.my.id"
                      className="w-full bg-[#140d09]/60 border border-[#d97736]/20 rounded-xl p-3.5 text-[#8c7663] font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#140d09] rounded-2xl border border-[#d97736]/20">
                    <div>
                      <div className="font-bold text-white">Mode Maintenance</div>
                      <div className="text-[11px] text-[#8c7663]">Tampilkan halaman maintenance untuk pengunjung biasa</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isMaintenance}
                      onChange={e => setIsMaintenance(e.target.checked)}
                      className="w-5 h-5 accent-[#d97736] cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSavedSettings(true);
                    setTimeout(() => setSavedSettings(false), 2500);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#d97736] to-[#f59e0b] text-[#120b08] font-black text-xs shadow-lg shadow-[#d97736]/25"
                >
                  {savedSettings ? 'Pengaturan Disimpan! ✔' : 'Simpan Perubahan'}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

