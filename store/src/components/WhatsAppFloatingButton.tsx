'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const phoneNumber = '6281234567890';
  const defaultText = encodeURIComponent('Halo Admin RullzyeStore, saya ingin bertanya tentang hosting bot & server.');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${defaultText}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-500/40 flex items-center gap-2.5 hover:scale-105 transition-all group font-bold text-sm"
      aria-label="Chat WhatsApp Admin"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="hidden sm:inline">Tanya Admin WA</span>
    </a>
  );
}
