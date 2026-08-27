'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PRODUCT_PLANS } from '@/data/products';
import { ProductPlan, BillingCycle, PaymentMethod, Order } from '@/types';
import { formatRupiah } from '@/lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  QrCode,
  CreditCard,
  Lock,
  Server,
  Loader2,
  Tag,
  Copy,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planParam = searchParams.get('plan') || 'wa-basic';
  const cycleParam = (searchParams.get('cycle') as BillingCycle) || 'monthly';

  const [selectedPlan, setSelectedPlan] = useState<ProductPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(cycleParam);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');

  // Customer Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [username, setUsername] = useState('');
  const [serverName, setServerName] = useState('');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Checkout & Provisioning State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [provisioningStep, setProvisioningStep] = useState<number>(0);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    const plan = PRODUCT_PLANS.find(p => p.id === planParam) || PRODUCT_PLANS[0];
    setSelectedPlan(plan);
    setServerName(`${plan.name} - Server`);
  }, [planParam]);

  if (!selectedPlan) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-400" />
      </div>
    );
  }

  // Calculate pricing
  const getCycleMultiplier = (cycle: BillingCycle) => {
    switch (cycle) {
      case 'quarterly': return 3 * 0.95;
      case 'semi_annually': return 6 * 0.90;
      case 'annually': return 12 * 0.80;
      default: return 1;
    }
  };

  const rawTotal = selectedPlan.priceMonthly * (billingCycle === 'annually' ? 12 : billingCycle === 'semi_annually' ? 6 : billingCycle === 'quarterly' ? 3 : 1);
  const discountedBase = Math.round(selectedPlan.priceMonthly * getCycleMultiplier(billingCycle));
  const cycleDiscount = rawTotal - discountedBase;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPrice = Math.max(0, discountedBase - couponDiscount);

  // Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, amount: discountedBase }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({ code: data.data.code, discount: data.data.discount });
      } else {
        setCouponError(data.message || 'Kupon tidak valid');
      }
    } catch {
      setCouponError('Gagal memvalidasi kupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Create Order
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !whatsapp) {
      alert('Mohon lengkapi Nama, Email, dan Nomor WhatsApp Anda.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          billingCycle,
          serverName: serverName || `${selectedPlan.name} - ${name}`,
          customerName: name,
          customerEmail: email,
          customerWhatsapp: whatsapp,
          customerUsername: username || email.split('@')[0],
          couponCode: appliedCoupon?.code,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentOrder(data.data);
      } else {
        alert(data.message || 'Gagal memproses pesanan');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate Instant Payment & Live Provisioning
  const handleConfirmPayment = async () => {
    if (!currentOrder) return;
    setIsProvisioning(true);

    // Simulated progress stages
    setProvisioningStep(1); // Verifying payment
    await new Promise(r => setTimeout(r, 1200));

    setProvisioningStep(2); // Creating user account
    await new Promise(r => setTimeout(r, 1500));

    setProvisioningStep(3); // Allocating port & spawning docker container
    try {
      const res = await fetch('/api/payments/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: currentOrder.id }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentOrder(data.data);
      }
    } catch (err) {
      console.error(err);
    }

    setProvisioningStep(4); // Finished
    await new Promise(r => setTimeout(r, 800));
    setIsProvisioning(false);
    setIsSuccess(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Checkout Aman & Instan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Konfigurasi & Pembayaran Hosting
          </h1>
          <p className="text-slate-400 text-sm">
            Server Anda akan otomatis dibuat dan siap digunakan dalam hitungan detik setelah pembayaran.
          </p>
        </div>

        {/* If Order is in Payment or Provisioning Step */}
        {currentOrder ? (
          <div className="max-w-3xl mx-auto space-y-8">
            {!isSuccess ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                  <div>
                    <span className="text-xs font-mono text-brand-400">{currentOrder.orderNumber}</span>
                    <h2 className="text-xl font-bold text-white mt-1">{currentOrder.item.planName}</h2>
                    <p className="text-xs text-slate-400">Atas nama: {currentOrder.customer.name} ({currentOrder.customer.email})</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Tagihan</div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {formatRupiah(currentOrder.amount)}
                    </div>
                  </div>
                </div>

                {/* Payment Instructions according to method */}
                {isProvisioning ? (
                  <div className="py-10 text-center space-y-6">
                    <Loader2 className="w-12 h-12 animate-spin text-brand-400 mx-auto" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white">
                        {provisioningStep === 1 && 'Memverifikasi Pembayaran Anda...'}
                        {provisioningStep === 2 && 'Mendaftarkan Akun di Pterodactyl Panel...'}
                        {provisioningStep === 3 && 'Mengalokasikan Port & Membuat Container Docker...'}
                        {provisioningStep === 4 && 'Server Berhasil Dibuat!'}
                      </h3>
                      <p className="text-xs text-slate-400">Mohon jangan menutup halaman ini.</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="max-w-md mx-auto w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${provisioningStep * 25}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentOrder.paymentMethod === 'qris' ? (
                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-300">
                          <QrCode className="w-4 h-4 text-brand-400" />
                          <span>SCAN QRIS DENGAN SEMUA E-WALLET / M-BANKING</span>
                        </div>

                        {/* Simulated QR Code Canvas */}
                        <div className="w-56 h-56 bg-white p-3 rounded-2xl mx-auto flex flex-col items-center justify-center shadow-lg relative">
                          {/* QR Code graphic pattern */}
                          <div className="w-full h-full border-4 border-slate-900 rounded-lg p-2 flex flex-col items-center justify-between">
                            <div className="w-full flex justify-between">
                              <div className="w-10 h-10 bg-slate-900 rounded-sm" />
                              <div className="w-10 h-10 bg-slate-900 rounded-sm" />
                            </div>
                            <div className="text-[10px] font-black text-slate-900 text-center">
                              RULLZYESTORE QRIS
                              <br />
                              <span className="font-mono text-[8px] text-slate-600">{currentOrder.orderNumber}</span>
                            </div>
                            <div className="w-full flex justify-between items-end">
                              <div className="w-10 h-10 bg-slate-900 rounded-sm" />
                              <div className="w-6 h-6 bg-brand-600 rounded-sm" />
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400">
                          Gunakan GoPay, OVO, DANA, ShopeePay, BCA Mobile, Livin Mandiri, atau aplikasi QRIS lainnya.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Nomor Virtual Account:</span>
                          <span className="uppercase font-bold text-white">{currentOrder.paymentMethod.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                          <span className="text-xl sm:text-2xl font-mono font-black text-brand-400 tracking-wider">
                            {currentOrder.vaNumber || '827708991283'}
                          </span>
                          <button
                            onClick={() => copyToClipboard(currentOrder.vaNumber || '827708991283')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            {copiedText ? 'Tersalin!' : 'Salin'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400">
                          Transfer tepat sesuai nominal tagihan <strong>{formatRupiah(currentOrder.amount)}</strong>.
                        </p>
                      </div>
                    )}

                    {/* Instant Simulated Confirm Payment Button */}
                    <div className="space-y-3 pt-2">
                      <button
                        onClick={handleConfirmPayment}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-dark-bg font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      >
                        <Zap className="w-5 h-5 fill-current" />
                        SAYA SUDAH BAYAR (AKTIFKAN SERVER SEKARANG)
                      </button>
                      <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-brand-400" />
                        Pembayaran diverifikasi secara instan via Webhook Gateway.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Success / Server Ready Screen */
              <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Payment Successful & Server Ready
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Server Anda Berhasil Diaktifkan! 🎉
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                    Detail server dan informasi akun Pterodactyl telah dikirim ke email <strong>{currentOrder.customer.email}</strong>.
                  </p>
                </div>

                {/* Server Credential Card */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left space-y-4 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">NAMA SERVER:</span>
                    <span className="text-white font-bold">{currentOrder.serverDetails?.name || currentOrder.item.serverName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">NODE HOSTNAME:</span>
                    <span className="text-brand-400 font-bold">{currentOrder.serverDetails?.ipAddress || 'pteronode.rullzyestorepremium.my.id'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">PORT ALOKASI:</span>
                    <span className="text-emerald-400 font-bold">{currentOrder.serverDetails?.port || 3001}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">USERNAME PANEL:</span>
                    <span className="text-white font-bold">{currentOrder.serverDetails?.username || currentOrder.customer.email.split('@')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PANEL URL:</span>
                    <span className="text-cyan-400 font-bold">https://ptero.rullzyestorepremium.my.id</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <a
                    href="https://ptero.rullzyestorepremium.my.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-black text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    BUKA PTERODACTYL PANEL
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
                  >
                    Ke Dashboard Client
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Main Checkout Form */
          <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form & Payment Selector */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Customer Information Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-400" />
                  1. Informasi Pemilik Server
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Contoh: Rian Pratama"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Email Aktif *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="email@domain.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">No. WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="08123456789"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Username Panel (Opsional)</label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="rian_bot"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 text-xs">
                  <label className="text-slate-300 font-medium">Nama Server / Bot (Opsional)</label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={e => setServerName(e.target.value)}
                    placeholder="Contoh: My WhatsApp Bot 24h"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* 2. Payment Method Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-400" />
                  2. Pilih Metode Pembayaran
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-brand-500 bg-brand-500/10 text-white font-bold ring-1 ring-brand-500'
                        : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <QrCode className="w-5 h-5 text-brand-400" />
                      <div>
                        <div>QRIS Instant Pay</div>
                        <div className="text-[10px] text-slate-400 font-normal">GoPay, OVO, DANA, ShopeePay, BCA, dll</div>
                      </div>
                    </div>
                    {paymentMethod === 'qris' && <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bca_va')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                      paymentMethod === 'bca_va'
                        ? 'border-brand-500 bg-brand-500/10 text-white font-bold ring-1 ring-brand-500'
                        : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div>BCA Virtual Account</div>
                      <div className="text-[10px] text-slate-400 font-normal">Otomatis Verifikasi 24 Jam</div>
                    </div>
                    {paymentMethod === 'bca_va' && <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mandiri_va')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                      paymentMethod === 'mandiri_va'
                        ? 'border-brand-500 bg-brand-500/10 text-white font-bold ring-1 ring-brand-500'
                        : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div>Mandiri Virtual Account</div>
                      <div className="text-[10px] text-slate-400 font-normal">Otomatis Verifikasi 24 Jam</div>
                    </div>
                    {paymentMethod === 'mandiri_va' && <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bri_va')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                      paymentMethod === 'bri_va'
                        ? 'border-brand-500 bg-brand-500/10 text-white font-bold ring-1 ring-brand-500'
                        : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div>BRI Virtual Account</div>
                      <div className="text-[10px] text-slate-400 font-normal">Otomatis Verifikasi 24 Jam</div>
                    </div>
                    {paymentMethod === 'bri_va' && <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Coupon */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-24">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                  Ringkasan Pesanan
                </h3>

                {/* Plan Card Mini */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{selectedPlan.name}</h4>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wider">{selectedPlan.category} Hosting</p>
                    </div>
                    <span className="text-xs font-bold text-brand-400">
                      {formatRupiah(selectedPlan.priceMonthly)}/bln
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-900 text-[10px] text-slate-300">
                    <div>RAM: {selectedPlan.specs.ram}</div>
                    <div>Disk: {selectedPlan.specs.disk}</div>
                    <div>CPU: {selectedPlan.specs.cpu}</div>
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-brand-400" />
                    Punya Kode Voucher / Kupon?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Cth: WELCOME10, DISKON20"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 disabled:opacity-50"
                    >
                      {isApplyingCoupon ? 'Cek...' : 'Terapkan'}
                    </button>
                  </div>

                  {appliedCoupon && (
                    <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Kupon {appliedCoupon.code} berhasil memotong {formatRupiah(appliedCoupon.discount)}!
                    </div>
                  )}
                  {couponError && (
                    <div className="text-xs text-rose-400 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {couponError}
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs border-t border-slate-800 pt-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Harga Paket</span>
                    <span>{formatRupiah(rawTotal)}</span>
                  </div>
                  {cycleDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Diskon Periode ({billingCycle})</span>
                      <span>-{formatRupiah(cycleDiscount)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Diskon Kupon</span>
                      <span>-{formatRupiah(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Biaya Setup & Pterodactyl</span>
                    <span className="text-emerald-400 font-bold">GRATIS</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-800 text-sm">
                    <span className="font-bold text-white">Total Pembayaran</span>
                    <span className="text-2xl font-black text-brand-400">
                      {formatRupiah(finalPrice)}
                    </span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 hover:to-emerald-300 text-dark-bg font-black text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses Pesanan...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      LANJUTKAN KE PEMBAYARAN
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Dengan melanjutkan, Anda menyetujui Ketentuan Layanan & Garansi Uptime RullzyeStore.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Memuat Formulir Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
