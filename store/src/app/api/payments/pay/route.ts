import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment';
import { store } from '@/lib/store';

const FLOWIX_API_KEY = process.env.FLOWIX_API_KEY || 'sk-e4205e73-1eebcf3dab17-55fb83b7b4ad';
const FLOWIX_MERCHANT_ID = process.env.FLOWIX_MERCHANT_ID || 'MID-FAR3217';
const FLOWIX_BASE_URL = process.env.FLOWIX_BASE_URL || 'https://flowix.web.id/api/v1';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID wajib disertakan' }, { status: 400 });
    }

    const order = store.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (order.paymentStatus === 'paid' && order.serverId) {
      return NextResponse.json({
        success: true,
        message: 'Pesanan ini sudah aktif dan terbayar.',
        data: order,
      });
    }

    // 1. Verify Flowix QRIS Gateway status if order has flowixReffId
    if (order.paymentMethod === 'qris' && order.flowixReffId) {
      try {
        const flowixRes = await fetch(`${FLOWIX_BASE_URL}/deposit/${encodeURIComponent(order.flowixReffId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api_key': FLOWIX_API_KEY,
            'merchant_id': FLOWIX_MERCHANT_ID,
          },
        });

        const flowixData = await flowixRes.json();
        console.log('[FLOWIX CHECK RESULT]', flowixData);

        if (!flowixData.success || !flowixData.data) {
          return NextResponse.json({
            success: false,
            message: flowixData.message || 'Gagal memeriksa status pembayaran di Flowix',
          }, { status: 400 });
        }

        const depositStatus = flowixData.data.status;
        if (depositStatus !== 'success') {
          return NextResponse.json({
            success: false,
            message: `Pembayaran QRIS belum terdeteksi (Status: ${depositStatus.toUpperCase()}). Silakan selesaikan pembayaran di aplikasi e-wallet / m-banking Anda lalu klik cek kembali.`,
          }, { status: 400 });
        }
      } catch (checkErr: any) {
        console.error('[FLOWIX VERIFY ERROR]', checkErr);
        return NextResponse.json({
          success: false,
          message: `Gagal memverifikasi status QRIS ke Flowix: ${checkErr.message}`,
        }, { status: 500 });
      }
    }

    // 2. Only if payment is strictly verified, provision the server
    const updatedOrder = await PaymentService.completePaymentAndProvision(orderId);

    return NextResponse.json({
      success: true,
      message: 'Pembayaran berhasil diverifikasi dan server telah selesai dibuat!',
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
