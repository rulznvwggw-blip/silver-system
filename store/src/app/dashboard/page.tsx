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
  ShieldCheck
} from 'lucide-react';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<'services' | 'orders' | 'tickets' | 'profile'>('services');
  const [servers, setServers] = useState<ProvisionedServer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMessage) return;

    setIsSubmittingTicket(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: 'admin_dc693d@local.host',
          customerName: 'Super Admin',
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
          senderName: 'Super Admin',
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
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-lg">
              SA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Client Portal Area</h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Verified Customer
                </span>
              </div>
              <p className="text-xs text-slate-400">Login sebagai: <strong>admin_dc693d@local.host</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://ptero.rullzyestorepremium.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Terminal className="w-4 h-4 text-brand-400" />
              Pterodactyl Panel
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <Link
              href="/#pricing"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Beli Layanan Baru
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-brand-400 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            Layanan Aktif ({servers.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-brand-400 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Riwayat Pesanan ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'tickets'
                ? 'border-brand-400 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            Bantuan / Tiket ({tickets.length})
          </button>
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-400 mx-auto" />
          </div>
        ) : (
          <div>
            {/* TAB 1: My Services */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                {servers.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
                    <Server className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold text-white">Belum Ada Layanan Aktif</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Anda belum memiliki server atau bot aktif. Silakan pilih paket hosting untuk memulai.
                    </p>
                    <Link
                      href="/#pricing"
                      className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 text-dark-bg font-bold text-xs"
                    >
                      Pilih Paket Sekarang
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {servers.map(srv => (
                      <div
                        key={srv.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                              {srv.planName}
                            </span>
                            <h3 className="text-base font-bold text-white mt-1.5">{srv.name}</h3>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              {srv.ipAddress}:{srv.port}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            ONLINE (24/7)
                          </span>
                        </div>

                        {/* Specs Pills */}
                        <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                          <div>
                            <span className="text-slate-500 block text-[10px]">RAM</span>
                            <span className="text-white font-bold">{srv.ram}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">CPU</span>
                            <span className="text-white font-bold">{srv.cpu}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">DISK</span>
                            <span className="text-white font-bold">{srv.disk}</span>
                          </div>
                        </div>

                        {/* Login Credentials Box */}
                        <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs font-mono">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">Username:</span>
                            <span className="text-white font-bold">{srv.username || srv.customerEmail.split('@')[0]}</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">Password:</span>
                            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                              {srv.password || 'RullzyeStore!2026'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                          <div>
                            Kedaluwarsa: <strong className="text-slate-200">{formatDate(srv.expiresAt)}</strong>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <a
                            href={srv.panelUrl || 'https://ptero.rullzyestorepremium.my.id'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] transition-transform"
                          >
                            <Terminal className="w-4 h-4" />
                            Manage Server
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            href="/#pricing"
                            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-brand-400" />
                            Perpanjang
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Orders & Invoices */}
            {activeTab === 'orders' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      <tr>
                        <th className="px-6 py-4">No. Pesanan</th>
                        <th className="px-6 py-4">Paket Layanan</th>
                        <th className="px-6 py-4">Metode Bayar</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-800/40">
                          <td className="px-6 py-4 font-bold text-white">{o.orderNumber}</td>
                          <td className="px-6 py-4 font-sans font-medium text-slate-200">{o.item.planName}</td>
                          <td className="px-6 py-4 uppercase text-slate-400">{o.paymentMethod.replace('_', ' ')}</td>
                          <td className="px-6 py-4 font-bold text-emerald-400">{formatRupiah(o.amount)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-sans ${
                              o.paymentStatus === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {o.paymentStatus === 'paid' ? 'LUNAS (TERPROVISI)' : 'PENDING'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-sans text-[11px]">{formatDate(o.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: Support Tickets */}
            {activeTab === 'tickets' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Tickets List */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Daftar Tiket Anda</h3>
                    <div className="space-y-2">
                      {tickets.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTicket(t)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                            activeTicket?.id === t.id
                              ? 'border-brand-500 bg-brand-500/10 text-white font-bold'
                              : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                            <span>{t.ticketNumber}</span>
                            <span className="capitalize text-brand-400">{t.status.replace('_', ' ')}</span>
                          </div>
                          <div className="font-bold truncate">{t.subject}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Create New Ticket Form */}
                  <form onSubmit={handleCreateTicket} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                    <h3 className="font-bold text-white text-sm">Buat Tiket Bantuan Baru</h3>
                    <div className="space-y-1">
                      <label className="text-slate-400">Kategori</label>
                      <select
                        value={newTicketCategory}
                        onChange={e => setNewTicketCategory(e.target.value as 'general' | 'technical' | 'billing')}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                      >
                        <option value="technical">Bantuan Teknis / Script</option>
                        <option value="billing">Pembayaran & Invoice</option>
                        <option value="general">Pertanyaan Umum</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Subjek</label>
                      <input
                        type="text"
                        required
                        value={newTicketSubject}
                        onChange={e => setNewTicketSubject(e.target.value)}
                        placeholder="Contoh: Bantuan Setup Baileys"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                      >
                      </input>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Pesan Pertanyaan</label>
                      <textarea
                        rows={3}
                        required
                        value={newTicketMessage}
                        onChange={e => setNewTicketMessage(e.target.value)}
                        placeholder="Tuliskan kendala Anda secara detail..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingTicket}
                      className="w-full py-2.5 rounded-xl bg-brand-500 text-dark-bg font-bold text-xs hover:bg-brand-400 disabled:opacity-50"
                    >
                      {isSubmittingTicket ? 'Mengirim...' : 'Kirim Tiket'}
                    </button>
                  </form>
                </div>

                {/* Ticket Chat View */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  {activeTicket ? (
                    <div className="space-y-4">
                      <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-brand-400">{activeTicket.ticketNumber}</span>
                          <h3 className="text-base font-bold text-white">{activeTicket.subject}</h3>
                        </div>
                        <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-1 rounded">
                          {activeTicket.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Messages Flow */}
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                        {activeTicket.messages.map(m => (
                          <div
                            key={m.id}
                            className={`p-4 rounded-xl text-xs space-y-1 ${
                              m.sender === 'customer'
                                ? 'bg-slate-950 border border-slate-800 ml-4'
                                : 'bg-brand-950/40 border border-brand-500/30 mr-4 text-emerald-100'
                            }`}
                          >
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                              <strong className={m.sender === 'support' ? 'text-brand-400 font-bold' : 'text-white'}>
                                {m.senderName}
                              </strong>
                              <span>{formatDate(m.timestamp)}</span>
                            </div>
                            <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Reply Box */}
                      <form onSubmit={handleReplyTicket} className="flex gap-2 pt-2 border-t border-slate-800">
                        <input
                          type="text"
                          required
                          value={replyMessage}
                          onChange={e => setReplyMessage(e.target.value)}
                          placeholder="Ketik balasan Anda..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-dark-bg font-bold text-xs flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Balas
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-500 text-xs">
                      Pilih tiket untuk melihat riwayat percakapan support.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
