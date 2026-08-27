import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { code, amount } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Kode kupon wajib diisi' }, { status: 400 });
    }

    const coupon = store.getCoupon(code);
    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Kupon tidak valid atau sudah kadaluarsa' }, { status: 404 });
    }

    if (coupon.minSpend && amount < coupon.minSpend) {
      return NextResponse.json({
        success: false,
        message: `Minimal belanja Rp ${coupon.minSpend.toLocaleString('id-ID')} untuk menggunakan kupon ini`,
      }, { status: 400 });
    }

    let discount = 0;
    if (coupon.discountPercentage) {
      discount = Math.round((amount * coupon.discountPercentage) / 100);
    } else if (coupon.discountFixed) {
      discount = coupon.discountFixed;
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discount,
        finalAmount: Math.max(0, amount - discount),
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal memvalidasi kupon' }, { status: 500 });
  }
}
