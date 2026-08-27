import { NextResponse } from 'next/server';
import { CATEGORIES, PRODUCT_PLANS } from '@/data/products';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  if (category) {
    const filtered = PRODUCT_PLANS.filter(p => p.category === category);
    return NextResponse.json({ success: true, data: filtered });
  }

  return NextResponse.json({
    success: true,
    categories: CATEGORIES,
    plans: PRODUCT_PLANS,
  });
}
