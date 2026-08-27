import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (email) {
    const servers = store.getServersByEmail(email);
    return NextResponse.json({ success: true, data: servers });
  }

  const servers = store.getServers();
  return NextResponse.json({ success: true, data: servers });
}
