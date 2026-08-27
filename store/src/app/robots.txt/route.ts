import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Disallow: /api/payments/pay

Sitemap: https://ptero.rullzyestorepremium.my.id/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
