import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { PaymentService } from '@/lib/payment';
import { FlowixStoreService } from '@/lib/flowix';
import { generateOrderNumber } from '@/lib/utils';
import { PRODUCT_PLANS } from '@/data/products';
import { Order, PaymentMethod, BillingCycle } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      planId,
      billingCycle = 'monthly',
      serverName,
      customerName,
      customerEmail,
      customerWhatsapp,
      customerUsername,
      couponCode,
      paymentMethod = 'qris',
    } = body;

    // Validation
    if (!planId || !customerName || !customerEmail || !customerWhatsapp) {
      return NextResponse.json({ success: false, message: 'Semua data formulir wajib diisi' }, { status: 400 });
    }

    const plan = PRODUCT_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ success: false, message: 'Paket hosting tidak ditemukan' }, { status: 404 });
    }

    // Calculate multiplier for billing cycle
    let multiplier = 1;
    let cycleDiscountPercent = 0;
    if (billingCycle === 'quarterly') {
      multiplier = 3;
      cycleDiscountPercent = 5;
    } else if (billingCycle === 'semi_annually') {
      multiplier = 6;
      cycleDiscountPercent = 10;
    } else if (billingCycle === 'annually') {
      multiplier = 12;
      cycleDiscountPercent = 20;
    }

    const rawPrice = plan.priceMonthly * multiplier;
    const cycleDiscount = Math.round((rawPrice * cycleDiscountPercent) / 100);
    let subtotal = rawPrice - cycleDiscount;

    let couponDiscount = 0;
    if (couponCode) {
      const coupon = store.getCoupon(couponCode);
      if (coupon) {
        if (coupon.discountPercentage) {
          couponDiscount = Math.round((subtotal * coupon.discountPercentage) / 100);
        } else if (coupon.discountFixed) {
          couponDiscount = coupon.discountFixed;
        }
      }
    }

    const finalAmount = Math.max(0, subtotal - couponDiscount);
    const orderNumber = generateOrderNumber();
    const orderId = `ord-${Date.now()}`;

    // Flowix QRIS Integration
    let flowixDeposit = null;
    if (paymentMethod === 'qris' && finalAmount >= 100) {
      flowixDeposit = await FlowixStoreService.createDeposit(finalAmount, 'QRIS');
    }

    // Payment details (Fallback QRIS string / VA number)
    const paymentDetails = PaymentService.createPaymentDetails(paymentMethod as PaymentMethod, orderNumber, finalAmount);

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customer: {
        id: `cust-${Date.now()}`,
        name: customerName,
        email: customerEmail,
        whatsapp: customerWhatsapp,
        username: customerUsername || customerEmail.split('@')[0],
        createdAt: new Date().toISOString(),
      },
      item: {
        planId: plan.id,
        planName: plan.name,
        category: plan.category,
        billingCycle: billingCycle as BillingCycle,
        serverName: serverName || `${plan.name} - ${customerName}`,
        price: rawPrice,
        discount: cycleDiscount + couponDiscount,
        total: finalAmount,
      },
      couponCode,
      paymentMethod: paymentMethod as PaymentMethod,
      paymentStatus: 'pending',
      amount: flowixDeposit?.amount_total || finalAmount,
      createdAt: new Date().toISOString(),
      flowixReffId: flowixDeposit?.reff_id,
      qrString: flowixDeposit?.qr_string || paymentDetails.qrString,
      qrImage: flowixDeposit?.qr_image,
      payUrl: flowixDeposit?.pay_url,
      vaNumber: paymentDetails.vaNumber,
    };

    store.createOrder(newOrder);

    return NextResponse.json({
      success: true,
      data: newOrder,
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ success: false, message: 'Gagal memproses pesanan' }, { status: 500 });
  }
}

export async function GET() {
  const orders = store.getOrders();
  return NextResponse.json({ success: true, data: orders });
}
