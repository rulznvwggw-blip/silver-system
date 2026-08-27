import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import StickyMobileCTA from '@/components/StickyMobileCTA';

export const metadata: Metadata = {
  title: 'RullzyeStore - Hosting Bot WhatsApp, Telegram & Minecraft Pterodactyl Indonesia',
  description: 'Pusat hosting server profesional untuk Bot WhatsApp (Baileys), Bot Telegram, Minecraft Server (Paper/Purpur), dan Linux Application berbasis Pterodactyl Panel. Murah, cepat, 24/7, dan otomatis aktif.',
  keywords: [
    'hosting bot whatsapp',
    'hosting whatsapp baileys',
    'hosting bot telegram',
    'hosting minecraft indonesia',
    'pterodactyl hosting murah',
    'vps bot 24 jam',
    'server minecraft indonesia',
    'hosting nodejs murah',
  ],
  authors: [{ name: 'RullzyeStore Indonesia' }],
  metadataBase: new URL('https://store.rullzyestorepremium.my.id'),
  openGraph: {
    title: 'RullzyeStore - Cloud Hosting Bot & Minecraft Server Indonesia',
    description: 'Deploy Bot WhatsApp, Telegram, Minecraft Server & Custom Apps dalam hitungan detik. Anti-DDoS, NVMe SSD, Pterodactyl Panel.',
    url: 'https://store.rullzyestorepremium.my.id',
    siteName: 'RullzyeStore Hosting',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RullzyeStore - Hosting Bot WhatsApp & Game Pterodactyl Indonesia',
    description: 'Deploy Bot WhatsApp, Telegram, Minecraft Server & Custom Apps dalam hitungan detik.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'RullzyeStore Hosting Indonesia',
    'url': 'https://ptero.rullzyestorepremium.my.id',
    'logo': 'https://ptero.rullzyestorepremium.my.id/logo.png',
    'sameAs': [
      'https://wa.me/6281234567890',
      'https://t.me/rullzyestore',
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+62-812-3456-7890',
      'contactType': 'customer support',
      'areaServed': 'ID',
      'availableLanguage': ['Indonesian', 'English'],
    },
  };

  return (
    <html lang="id" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen bg-dark-bg text-dark-text antialiased selection:bg-brand-500 selection:text-dark-bg">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <Footer />
        <WhatsAppFloatingButton />
        <StickyMobileCTA />
      </body>
    </html>
  );
}
