import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const orders = store.getOrders();
  const servers = store.getServers();
  const tickets = store.getTickets();
  const coupons = store.getCoupons();

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  const activeServersCount = servers.filter(s => s.status === 'running').length;
  const pendingOrdersCount = orders.filter(o => o.paymentStatus === 'pending').length;
  const openTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'customer_reply').length;

  return NextResponse.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders: orders.length,
      activeServersCount,
      pendingOrdersCount,
      openTicketsCount,
      nodeStatus: 'online',
    },
    orders,
    servers,
    tickets,
    coupons,
  });
}
