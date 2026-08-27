import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID wajib disertakan' }, { status: 400 });
    }

    // Trigger instant payment verification and automatic server provisioning on Pterodactyl
    const updatedOrder = await PaymentService.completePaymentAndProvision(orderId);

    return NextResponse.json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi dan server telah selesai dibuat!',
      data: updatedOrder,
    });
  } catch (err: unknown) {
    console.error('Payment processing error:', err);
    return NextResponse.json({
      success: false,
      message: (err as Error).message || 'Gagal memproses pembayaran dan provisioning',
    }, { status: 500 });
  }
}
