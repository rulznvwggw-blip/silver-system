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
  Terminal
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'servers' | 'coupons' | 'tickets' | 'settings'>('overview');
  const [stats, setStats] = useState<Record<string, number | string>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [servers, setServers] = useState<ProvisionedServer[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      }
    }

    fetchAdminData();
  }, []);

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
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">RullzyeStore Admin Control Center</h1>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                  Root Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">Monitoring Revenue, Provisioning Server, & Support</p>
            </div>
          </div>

          <a
            href="https://ptero.rullzyestorepremium.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Terminal className="w-4 h-4 text-brand-400" />
            Pterodactyl Admin Panel
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview' ? 'border-brand-400 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders' ? 'border-brand-400 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('servers')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'servers' ? 'border-brand-400 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            Provisioned Servers ({servers.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'coupons' ? 'border-brand-400 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            Voucher & Kupon ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'tickets' ? 'border-brand-400 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            Support Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings' ? 'border-brand-400 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Pengaturan Sistem
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-400 mx-auto" />
          </div>
        ) : (
          <div>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Total Revenue</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-emerald-400">
                      {formatRupiah(Number(stats.totalRevenue) || 0)}
                    </div>
                    <div className="text-[11px] text-slate-500">Pendapatan Terverifikasi</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Active Servers</span>
                      <Server className="w-4 h-4 text-brand-400" />
                    </div>
                    <div className="text-2xl font-black text-white">
                      {stats.activeServersCount || servers.length}
                    </div>
                    <div className="text-[11px] text-emerald-400">Running di Node-Main-01</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Total Orders</span>
                      <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-black text-white">
                      {stats.totalOrders || orders.length}
                    </div>
                    <div className="text-[11px] text-slate-500">Pesanan Masuk</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Wings Daemon Node</span>
                      <Activity className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-emerald-400">ONLINE 💚</div>
                    <div className="text-[11px] text-slate-500">Port 8085 / SFTP 2022</div>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">5 Pesanan Terakhir</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Order Number</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Paket</th>
                          <th className="px-4 py-3">Nominal</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id}>
                            <td className="px-4 py-3 text-white font-bold">{o.orderNumber}</td>
                            <td className="px-4 py-3 font-sans text-slate-300">{o.customer.name}</td>
                            <td className="px-4 py-3 font-sans text-slate-400">{o.item.planName}</td>
                            <td className="px-4 py-3 text-emerald-400 font-bold">{formatRupiah(o.amount)}</td>
                            <td className="px-4 py-3 font-sans">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                o.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      <tr>
                        <th className="px-6 py-4">Server Name</th>
                        <th className="px-6 py-4">Customer Email</th>
                        <th className="px-6 py-4">Node & Port</th>
                        <th className="px-6 py-4">Alokasi RAM/CPU</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {servers.map(s => (
                        <tr key={s.id} className="hover:bg-slate-800/40">
                          <td className="px-6 py-4 font-sans font-bold text-white">{s.name}</td>
                          <td className="px-6 py-4 text-slate-400 font-sans">{s.customerEmail}</td>
                          <td className="px-6 py-4 text-brand-400">{s.ipAddress}:{s.port}</td>
                          <td className="px-6 py-4 text-slate-300">{s.ram} / {s.cpu}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-sans font-bold">
                              ONLINE
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href="https://ptero.rullzyestorepremium.my.id/admin/servers"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-brand-400 hover:text-brand-300 underline font-sans"
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

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Daftar Voucher Promo</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {coupons.map(c => (
                    <div key={c.code} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-black font-mono text-brand-400">{c.code}</span>
                        <span className="text-xs font-bold text-emerald-400">{c.discountPercentage}% OFF</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Min. Belanja: {formatRupiah(c.minSpend || 0)}
                      </p>
                      <div className="text-[10px] text-slate-500 flex justify-between pt-2 border-t border-slate-900">
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Tiket Customer</h3>
                  {tickets.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                        selectedTicket?.id === t.id
                          ? 'border-purple-500 bg-purple-500/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                        <span>{t.ticketNumber} • {t.customerName}</span>
                        <span className="capitalize text-brand-400">{t.status.replace('_', ' ')}</span>
                      </div>
                      <div className="font-bold truncate">{t.subject}</div>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  {selectedTicket ? (
                    <div className="space-y-4">
                      <div className="border-b border-slate-800 pb-3">
                        <span className="text-[10px] font-mono text-purple-400">{selectedTicket.ticketNumber}</span>
                        <h3 className="text-base font-bold text-white">{selectedTicket.subject}</h3>
                        <p className="text-xs text-slate-400">Dari: {selectedTicket.customerName} ({selectedTicket.customerEmail})</p>
                      </div>

                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                        {selectedTicket.messages.map(m => (
                          <div
                            key={m.id}
                            className={`p-4 rounded-xl text-xs space-y-1 ${
                              m.sender === 'customer'
                                ? 'bg-slate-950 border border-slate-800 mr-4'
                                : 'bg-purple-950/40 border border-purple-500/30 ml-4 text-purple-100'
                            }`}
                          >
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                              <strong className={m.sender === 'support' ? 'text-purple-400 font-bold' : 'text-white'}>
                                {m.senderName}
                              </strong>
                              <span>{formatDate(m.timestamp)}</span>
                            </div>
                            <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleAdminReply} className="flex gap-2 pt-2 border-t border-slate-800">
                        <input
                          type="text"
                          required
                          value={adminReply}
                          onChange={e => setAdminReply(e.target.value)}
                          placeholder="Ketik balasan resmi customer support..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Kirim
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-500 text-xs">Pilih tiket untuk membalas.</div>
                  )}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Pengaturan Global Store</h3>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Nama Brand Hosting</label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={e => setBrandName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Pterodactyl Panel Endpoint</label>
                    <input
                      type="text"
                      disabled
                      value="https://ptero.rullzyestorepremium.my.id"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-slate-400 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <div className="font-bold text-white">Mode Maintenance</div>
                      <div className="text-[11px] text-slate-400">Tampilkan halaman maintenance untuk pengunjung biasa</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isMaintenance}
                      onChange={e => setIsMaintenance(e.target.checked)}
                      className="w-5 h-5 accent-brand-500 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSavedSettings(true);
                    setTimeout(() => setSavedSettings(false), 2500);
                  }}
                  className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-bg font-bold text-xs"
                >
                  {savedSettings ? 'Pengaturan Disimpan! ✔' : 'Simpan Perubahan'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
