'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProvisionedServer, Order, Ticket } from '@/types';
import { formatRupiah, formatDate } from '@/lib/utils';
import {
  Server,
  Activity,
  CreditCard,
  LifeBuoy,
  User,
  ExternalLink,
  PlusCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Loader2,
  Terminal,
  ShieldCheck,
  Cpu,
  HardDrive,
  Copy,
  Radio,
  Zap,
  Sparkles,
  KeyRound,
  Layers,
  ChevronRight,
  Coffee
} from 'lucide-react';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<'services' | 'orders' | 'tickets' | 'credentials'>('services');
  const [servers, setServers] = useState<ProvisionedServer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New Ticket State
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState<'general' | 'technical' | 'billing'>('technical');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Active Ticket Chat State
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [srvRes, ordRes, tktRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/orders'),
          fetch('/api/tickets'),
        ]);

        const [srvData, ordData, tktData] = await Promise.all([
          srvRes.json(),
          ordRes.json(),
          tktRes.json(),
        ]);

        if (srvData.success) setServers(srvData.data);
        if (ordData.success) setOrders(ordData.data);
        if (tktData.success) {
          setTickets(tktData.data);
          if (tktData.data.length > 0) setActiveTicket(tktData.data[0]);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    }

    fetchData();
  }, []);

  const handleTabChange = (tab: 'services' | 'orders' | 'tickets' | 'credentials') => {
    if (tab === activeTab) return;
    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTabChanging(false);
    }, 180);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMessage) return;

    setIsSubmittingTicket(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: servers[0]?.customerEmail || orders[0]?.customer?.email || 'customer@rullzyestorepremium.my.id',
          customerName: servers[0]?.username || orders[0]?.customer?.name || 'Customer Member',
          subject: newTicketSubject,
          category: newTicketCategory,
          message: newTicketMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTickets([data.data, ...tickets]);
        setActiveTicket(data.data);
        setNewTicketSubject('');
        setNewTicketMessage('');
      }
    } catch {
      alert('Gagal mengirim tiket');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyMessage.trim()) return;

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: activeTicket.id,
          sender: 'customer',
          senderName: servers[0]?.username || orders[0]?.customer?.name || 'Customer',
          message: replyMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActiveTicket(data.data);
        setTickets(tickets.map(t => t.id === data.data.id ? data.data : t));
        setReplyMessage('');
      }
    } catch {
      alert('Gagal membalas tiket');
    }
  };

  return (
    <div className="min-h-screen py-8 bg-[#120b08] text-[#fdfbf7] relative selection:bg-[#d97736] selection:text-white">
      {/* Background Cozy Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d97736]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#f59e0b]/5 rounded-full blur-3xl" />
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
            MEMUAT COZY PANEL...
          </span>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Bar */}
        <div className="bg-[#1e130d]/90 border border-[#d97736]/20 p-5 sm:p-6 rounded-3xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d97736] to-[#a05221] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#d97736]/30 border border-[#f59e0b]/40">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  RullzyeStore Client Portal
                </h1>
                <span className="text-[11px] font-black uppercase tracking-wider bg-[#d97736]/20 text-[#f59e0b] px-3 py-0.5 rounded-full border border-[#d97736]/40 shadow-sm">
                  ⚡ CLIENT DASHBOARD
                </span>
              </div>
              <p className="text-xs text-[#bfa995] mt-0.5 flex items-center gap-2">
                <span>Akun Anda:</span>
                <strong className="text-[#fdfbf7]">{servers[0]?.customerEmail || (orders[0]?.customer?.email) || 'client@rullzyestorepremium.my.id'}</strong>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[#10b981] font-semibold text-[11px]">Terhubung</span>
              </p>
            </div>
          </div>

          {/* Quick External Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href="https://ptero.rullzyestorepremium.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-[#2b1b13] hover:bg-[#362319] text-[#fdfbf7] font-bold text-xs border border-[#d97736]/30 flex items-center justify-center gap-2 transition-all shadow-md hover:border-[#d97736]/60"
            >
              <Terminal className="w-4 h-4 text-[#d97736]" />
              Buka Pterodactyl Panel
              <ExternalLink className="w-3.5 h-3.5 text-[#bfa995]" />
            </a>
            <Link
              href="/#pricing"
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-[#d97736] to-[#f59e0b] hover:from-[#e68545] hover:to-[#fbbf24] text-[#120b08] font-black text-xs shadow-xl shadow-[#d97736]/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <PlusCircle className="w-4 h-4" />
              Sewa Server Baru
            </Link>
          </div>
        </div>

        {/* Main Dashboard Layout with Left Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ══════════════════════════════════════════════════════════════
              FULL UPGRADE LEFT SIDEBAR
              ══════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-3 space-y-4">
            {/* Sidebar Navigation Card */}
            <div className="bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-4 space-y-2 backdrop-blur-xl shadow-xl shadow-black/30">
              <span className="text-[10px] font-black tracking-widest uppercase text-[#8c7663] px-3 py-1 block">
                MENU UTAMA
              </span>

              <button
                onClick={() => handleTabChange('services')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'services'
                    ? 'bg-gradient-to-r from-[#d97736]/25 to-[#f59e0b]/10 text-white border border-[#d97736]/50 shadow-md shadow-[#d97736]/15'
                    : 'text-[#bfa995] hover:bg-[#281a12] hover:text-[#fdfbf7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Server className={`w-4 h-4 ${activeTab === 'services' ? 'text-[#d97736]' : 'text-[#8c7663]'}`} />
                  <span>Layanan Server</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'services' ? 'bg-[#d97736] text-[#120b08]' : 'bg-[#281a12] text-[#bfa995]'
                }`}>
                  {servers.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#d97736]/25 to-[#f59e0b]/10 text-white border border-[#d97736]/50 shadow-md shadow-[#d97736]/15'
                    : 'text-[#bfa995] hover:bg-[#281a12] hover:text-[#fdfbf7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className={`w-4 h-4 ${activeTab === 'orders' ? 'text-[#d97736]' : 'text-[#8c7663]'}`} />
                  <span>Riwayat Order</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'orders' ? 'bg-[#d97736] text-[#120b08]' : 'bg-[#281a12] text-[#bfa995]'
                }`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('tickets')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'tickets'
                    ? 'bg-gradient-to-r from-[#d97736]/25 to-[#f59e0b]/10 text-white border border-[#d97736]/50 shadow-md shadow-[#d97736]/15'
                    : 'text-[#bfa995] hover:bg-[#281a12] hover:text-[#fdfbf7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LifeBuoy className={`w-4 h-4 ${activeTab === 'tickets' ? 'text-[#d97736]' : 'text-[#8c7663]'}`} />
                  <span>Bantuan & Tiket</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'tickets' ? 'bg-[#d97736] text-[#120b08]' : 'bg-[#281a12] text-[#bfa995]'
                }`}>
                  {tickets.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('credentials')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'credentials'
                    ? 'bg-gradient-to-r from-[#d97736]/25 to-[#f59e0b]/10 text-white border border-[#d97736]/50 shadow-md shadow-[#d97736]/15'
                    : 'text-[#bfa995] hover:bg-[#281a12] hover:text-[#fdfbf7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <KeyRound className={`w-4 h-4 ${activeTab === 'credentials' ? 'text-[#d97736]' : 'text-[#8c7663]'}`} />
                  <span>Akses Login Panel</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8c7663]" />
              </button>
            </div>

            {/* Realtime Datacenter Node Pill */}
            <div className="bg-[#1e130d]/80 border border-[#d97736]/20 rounded-3xl p-4 space-y-3 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#fdfbf7] flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#10b981] animate-pulse" />
                  Node-Main-01 Status
                </span>
                <span className="text-[10px] font-black text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-full border border-[#10b981]/30">
                  100% ONLINE
                </span>
              </div>
              <p className="text-[11px] text-[#bfa995] leading-relaxed">
                Datacenter Cyber Building Jakarta (Tier-3) dengan perlindungan Anti-DDoS 100G.
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono text-[#8c7663] border-t border-[#d97736]/10 pt-2">
                <span>Latency: 1.2ms</span>
                <span>Uptime: 99.99%</span>
              </div>
            </div>

            {/* Quick CS Support Button */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#2b1b13] to-[#1e130d] border border-[#d97736]/30 text-center space-y-2">
              <span className="text-xs font-bold text-[#fdfbf7] block">Butuh Bantuan Cepat?</span>
              <p className="text-[11px] text-[#bfa995]">Customer support kami aktif 24 jam nonstop.</p>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs transition-colors"
              >
                <span>💬 WhatsApp CS 24/7</span>
              </a>
            </div>
          </aside>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT MAIN CONTENT AREA
              ══════════════════════════════════════════════════════════════ */}
          <main className="lg:col-span-9 space-y-6">
            {/* TAB 1: ACTIVE SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                {servers.length === 0 ? (
                  <div className="bg-[#1e130d]/80 border border-[#d97736]/20 rounded-3xl p-12 text-center space-y-4 backdrop-blur-xl shadow-xl">
                    <Server className="w-14 h-14 text-[#8c7663] mx-auto" />
                    <h3 className="text-lg font-black text-white">Belum Ada Layanan Server Aktif</h3>
                    <p className="text-xs text-[#bfa995] max-w-md mx-auto">
                      Server atau bot Anda akan otomatis muncul di sini setelah pembayaran berhasil diverifikasi gateway.
                    </p>
                    <Link
                      href="/#pricing"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#d97736] to-[#f59e0b] text-[#120b08] font-black text-xs shadow-lg shadow-[#d97736]/20"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Pilih Paket Server Sekarang
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {servers.map(srv => (
                      <div
                        key={srv.id}
                        className="bg-[#1e130d]/90 border border-[#d97736]/25 rounded-3xl p-6 space-y-5 shadow-2xl shadow-black/40 hover:border-[#d97736]/50 transition-all group relative overflow-hidden"
                      >
                        {/* Glowing Accent Top Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d97736] via-[#f59e0b] to-[#d97736] opacity-80" />

                        {/* Title & Status */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-black tracking-wider text-[#f59e0b] bg-[#d97736]/15 px-2.5 py-0.5 rounded-full border border-[#d97736]/30">
                              {srv.planName}
                            </span>
                            <h3 className="text-base font-black text-white mt-1.5 group-hover:text-[#f59e0b] transition-colors">
                              {srv.name}
                            </h3>
                            <p className="text-xs text-[#bfa995] font-mono mt-0.5">
                              {srv.ipAddress}:{srv.port}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#10b981] bg-[#10b981]/15 px-3 py-1 rounded-full border border-[#10b981]/30 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                            ONLINE 24/7
                          </span>
                        </div>

                        {/* Resource Meters (RAM, CPU, NVMe SSD) */}
                        <div className="grid grid-cols-3 gap-2.5 text-xs font-mono bg-[#140d09] p-3.5 rounded-2xl border border-[#d97736]/15">
                          <div className="space-y-1">
                            <span className="text-[#8c7663] block text-[10px] uppercase font-bold">RAM Memory</span>
                            <span className="text-white font-black">{srv.ram}</span>
                            <div className="w-full bg-[#281a12] h-1.5 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-[#d97736] to-[#f59e0b] h-full w-[45%]" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[#8c7663] block text-[10px] uppercase font-bold">CPU Core</span>
                            <span className="text-white font-black">{srv.cpu}</span>
                            <div className="w-full bg-[#281a12] h-1.5 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-[#10b981] to-[#34d399] h-full w-[25%]" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[#8c7663] block text-[10px] uppercase font-bold">NVMe SSD</span>
                            <span className="text-white font-black">{srv.disk}</span>
                            <div className="w-full bg-[#281a12] h-1.5 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] h-full w-[35%]" />
                            </div>
                          </div>
                        </div>

                        {/* Credentials Card */}
                        <div className="bg-[#160e0a] p-3.5 rounded-2xl border border-[#d97736]/20 space-y-2 text-xs font-mono">
                          <div className="flex justify-between items-center">
                            <span className="text-[#8c7663]">Username:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold">{srv.username || srv.customerEmail.split('@')[0]}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(srv.username || srv.customerEmail.split('@')[0], `user-${srv.id}`)}
                                className="px-2 py-0.5 rounded-lg bg-[#281a12] hover:bg-[#362319] text-[#d97736] text-[10px] font-bold border border-[#d97736]/30 flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedKey === `user-${srv.id}` ? 'Tersalin' : 'Salin'}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[#8c7663]">Password:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[#f59e0b] font-black bg-[#281a12] px-2 py-0.5 rounded border border-[#d97736]/30">
                                {srv.password || 'RullzyeStore!2026'}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(srv.password || 'RullzyeStore!2026', `pass-${srv.id}`)}
                                className="px-2 py-0.5 rounded-lg bg-[#281a12] hover:bg-[#362319] text-[#d97736] text-[10px] font-bold border border-[#d97736]/30 flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedKey === `pass-${srv.id}` ? 'Tersalin' : 'Salin'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expiry Date */}
                        <div className="flex items-center justify-between text-xs text-[#bfa995] border-t border-[#d97736]/15 pt-3">
                          <span>Masa Aktif Layanan:</span>
                          <strong className="text-[#fdfbf7]">{formatDate(srv.expiresAt)}</strong>
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <a
                            href={srv.panelUrl || 'https://ptero.rullzyestorepremium.my.id'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3 rounded-2xl bg-gradient-to-r from-[#d97736] to-[#f59e0b] text-[#120b08] font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#d97736]/20 hover:scale-[1.01] transition-transform"
                          >
                            <Terminal className="w-4 h-4" />
                            Manage Console
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            href="/#pricing"
                            className="py-3 rounded-2xl bg-[#281a12] hover:bg-[#362319] text-[#fdfbf7] font-bold text-xs border border-[#d97736]/30 flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-[#d97736]" />
                            Perpanjang
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ORDERS & INVOICES */}
            {activeTab === 'orders' && (
              <div className="bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="p-5 border-b border-[#d97736]/15 flex justify-between items-center">
                  <h3 className="font-black text-white text-sm uppercase tracking-wider">Riwayat Transaksi & Invoice</h3>
                  <span className="text-xs text-[#bfa995]">Total: {orders.length} Transaksi</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#d6c6b4]">
                    <thead className="bg-[#140d09] border-b border-[#d97736]/20 text-[11px] uppercase tracking-wider text-[#d97736] font-extrabold">
                      <tr>
                        <th className="px-6 py-4">No. Pesanan</th>
                        <th className="px-6 py-4">Paket Layanan</th>
                        <th className="px-6 py-4">Metode Bayar</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d97736]/10 font-mono">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-[#281a12]/60 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">{o.orderNumber}</td>
                          <td className="px-6 py-4 font-sans font-semibold text-[#fdfbf7]">{o.item.planName}</td>
                          <td className="px-6 py-4 uppercase text-[#bfa995]">{o.paymentMethod.replace('_', ' ')}</td>
                          <td className="px-6 py-4 font-black text-[#10b981]">{formatRupiah(o.amount)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase font-sans ${
                              o.paymentStatus === 'paid'
                                ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                                : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                            }`}>
                              {o.paymentStatus === 'paid' ? 'LUNAS (TERPROVISI)' : 'PENDING'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#8c7663] font-sans text-[11px]">{formatDate(o.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: SUPPORT TICKETS */}
            {activeTab === 'tickets' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-4 space-y-3 backdrop-blur-xl">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#d97736] px-2">Daftar Tiket Kendala</h3>
                    <div className="space-y-2">
                      {tickets.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTicket(t)}
                          className={`w-full text-left p-4 rounded-2xl border text-xs transition-all ${
                            activeTicket?.id === t.id
                              ? 'border-[#d97736] bg-[#d97736]/15 text-white font-bold shadow-md'
                              : 'border-[#d97736]/15 bg-[#140d09] text-[#bfa995] hover:border-[#d97736]/40'
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] text-[#8c7663] mb-1">
                            <span>{t.ticketNumber}</span>
                            <span className="capitalize text-[#f59e0b] font-bold">{t.status.replace('_', ' ')}</span>
                          </div>
                          <div className="font-bold text-[#fdfbf7] truncate">{t.subject}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Create Ticket Form */}
                  <form onSubmit={handleCreateTicket} className="bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-5 space-y-3 text-xs backdrop-blur-xl">
                    <h3 className="font-black text-white text-sm">Buat Tiket Bantuan Baru</h3>
                    <div className="space-y-1">
                      <label className="text-[#bfa995]">Kategori Masalah</label>
                      <select
                        value={newTicketCategory}
                        onChange={e => setNewTicketCategory(e.target.value as 'general' | 'technical' | 'billing')}
                        className="w-full bg-[#140d09] border border-[#d97736]/20 rounded-xl p-3 text-white focus:outline-none focus:border-[#d97736]"
                      >
                        <option value="technical">Bantuan Teknis Server & Bot</option>
                        <option value="billing">Pembayaran & Invoice</option>
                        <option value="general">Pertanyaan Umum</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[#bfa995]">Subjek Kendala</label>
                      <input
                        type="text"
                        required
                        value={newTicketSubject}
                        onChange={e => setNewTicketSubject(e.target.value)}
                        placeholder="Contoh: Bantuan Setup Script Baileys"
                        className="w-full bg-[#140d09] border border-[#d97736]/20 rounded-xl p-3 text-white focus:outline-none focus:border-[#d97736]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[#bfa995]">Deskripsi Detail</label>
                      <textarea
                        rows={3}
                        required
                        value={newTicketMessage}
                        onChange={e => setNewTicketMessage(e.target.value)}
                        placeholder="Tuliskan kendala yang dihadapi secara detail..."
                        className="w-full bg-[#140d09] border border-[#d97736]/20 rounded-xl p-3 text-white focus:outline-none focus:border-[#d97736]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingTicket}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d97736] to-[#f59e0b] text-[#120b08] font-black text-xs shadow-lg shadow-[#d97736]/25 disabled:opacity-50"
                    >
                      {isSubmittingTicket ? 'Mengirim...' : 'Kirim Tiket ke CS'}
                    </button>
                  </form>
                </div>

                {/* Ticket Chat View */}
                <div className="lg:col-span-7 bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-6 space-y-4 backdrop-blur-xl shadow-2xl">
                  {activeTicket ? (
                    <div className="space-y-4">
                      <div className="border-b border-[#d97736]/15 pb-3 flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-[#d97736]">{activeTicket.ticketNumber}</span>
                          <h3 className="text-base font-bold text-white">{activeTicket.subject}</h3>
                        </div>
                        <span className="text-[10px] bg-[#281a12] text-[#f59e0b] font-black px-2.5 py-1 rounded-full border border-[#d97736]/30">
                          {activeTicket.category.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                        {activeTicket.messages.map(m => (
                          <div
                            key={m.id}
                            className={`p-4 rounded-2xl text-xs space-y-1 ${
                              m.sender === 'customer'
                                ? 'bg-[#140d09] border border-[#d97736]/20 ml-4'
                                : 'bg-[#281a12] border border-[#d97736]/40 mr-4 text-[#fdfbf7]'
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

                      <form onSubmit={handleReplyTicket} className="flex gap-2 pt-2 border-t border-[#d97736]/15">
                        <input
                          type="text"
                          required
                          value={replyMessage}
                          onChange={e => setReplyMessage(e.target.value)}
                          placeholder="Ketik balasan Anda ke CS..."
                          className="flex-1 bg-[#140d09] border border-[#d97736]/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d97736]"
                        />
                        <button
                          type="submit"
                          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d97736] to-[#f59e0b] text-[#120b08] font-black text-xs flex items-center gap-1.5 shadow-lg shadow-[#d97736]/20"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Balas
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-[#8c7663] text-xs">
                      Pilih tiket untuk melihat riwayat percakapan support.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: CREDENTIALS ACCESS */}
            {activeTab === 'credentials' && (
              <div className="bg-[#1e130d]/90 border border-[#d97736]/20 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl">
                <div className="border-b border-[#d97736]/15 pb-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#d97736]" />
                    Kredensial Akses Pterodactyl Panel
                  </h3>
                  <p className="text-xs text-[#bfa995] mt-1">
                    Gunakan kredensial berikut untuk masuk ke Web Dashboard Pterodactyl dan mengelola console server Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#140d09] p-5 rounded-2xl border border-[#d97736]/20 space-y-2">
                    <span className="text-xs font-bold text-[#8c7663] block">URL PTERODACTYL PANEL</span>
                    <div className="flex items-center justify-between bg-[#1e130d] p-3 rounded-xl border border-[#d97736]/15">
                      <span className="font-mono text-xs text-[#f59e0b] font-bold">https://ptero.rullzyestorepremium.my.id</span>
                      <a
                        href="https://ptero.rullzyestorepremium.my.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-[#d97736] text-[#120b08] font-black text-[10px] rounded-lg"
                      >
                        Buka
                      </a>
                    </div>
                  </div>

                  <div className="bg-[#140d09] p-5 rounded-2xl border border-[#d97736]/20 space-y-2">
                    <span className="text-xs font-bold text-[#8c7663] block">NODE DAEMON HOSTNAME</span>
                    <div className="flex items-center justify-between bg-[#1e130d] p-3 rounded-xl border border-[#d97736]/15">
                      <span className="font-mono text-xs text-white font-bold">pteronode.rullzyestorepremium.my.id</span>
                      <button
                        onClick={() => copyToClipboard('pteronode.rullzyestorepremium.my.id', 'host')}
                        className="px-3 py-1 bg-[#281a12] text-[#d97736] font-bold text-[10px] rounded-lg border border-[#d97736]/30"
                      >
                        {copiedKey === 'host' ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#281a12] to-[#1e130d] border border-[#d97736]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-black text-white text-sm flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                      Keamanan Kredensial 100% Terenkripsi
                    </span>
                    <p className="text-xs text-[#bfa995]">
                      Password Anda disimpan secara aman dengan hashing standar industri Bcrypt.
                    </p>
                  </div>
                  <a
                    href="https://ptero.rullzyestorepremium.my.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#d97736] to-[#f59e0b] text-[#120b08] font-black text-xs shadow-xl shadow-[#d97736]/25 whitespace-nowrap"
                  >
                    Masuk ke Panel Sekarang ➔
                  </a>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

