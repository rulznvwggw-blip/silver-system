import { NextResponse } from 'next/server';

export async function GET() {
  const systems = [
    {
      name: 'Pterodactyl Web Panel',
      status: 'operational',
      url: 'https://ptero.rullzyestorepremium.my.id',
      latencyMs: 38,
      uptimePercent: '99.99%',
    },
    {
      name: 'Wings Node-Main-01 (Jakarta)',
      status: 'operational',
      url: 'pteronode.rullzyestorepremium.my.id:8085',
      latencyMs: 12,
      uptimePercent: '100.00%',
    },
    {
      name: 'Database Cluster (MariaDB & Redis)',
      status: 'operational',
      url: 'Internal Cloud Network',
      latencyMs: 2,
      uptimePercent: '100.00%',
    },
    {
      name: 'Payment Gateway & QRIS Engine',
      status: 'operational',
      url: 'Instant Settlement API',
      latencyMs: 45,
      uptimePercent: '99.98%',
    },
    {
      name: 'Game & DDoS Shield (100 Gbps)',
      status: 'operational',
      url: 'Cloudflare Magic Transit Filter',
      latencyMs: 8,
      uptimePercent: '100.00%',
    },
  ];

  return NextResponse.json({
    success: true,
    overallStatus: 'all_systems_operational',
    updatedAt: new Date().toISOString(),
    systems,
  });
}
