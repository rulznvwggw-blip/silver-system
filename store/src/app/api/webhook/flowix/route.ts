import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { PaymentService } from '@/lib/payment';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('[FLOWIX WEBHOOK STORE] Received payload:', payload);

    const { event, data } = payload;
    if (event === 'deposit.status' && data?.reff_id) {
      const orders = store.getOrders();
      const order = orders.find(o => o.flowixReffId === data.reff_id || o.orderNumber === data.reff_id);

      if (order && data.status === 'success' && order.paymentStatus !== 'paid') {
        await PaymentService.completePaymentAndProvision(order.id);
        console.log(`[FLOWIX WEBHOOK STORE] Auto provisioned order ${order.id}`);
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (err: unknown) {
    console.error('Flowix webhook store error:', err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 200 });
  }
}
