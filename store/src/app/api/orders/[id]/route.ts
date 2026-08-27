import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const order = store.getOrder(params.id);
  if (!order) {
    return NextResponse.json({ success: false, message: 'Pesanan tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: order });
}
