import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const baseUrl = 'https://ptero.rullzyestorepremium.my.id';
  const posts = store.getBlogPosts();

  const staticUrls = [
    '',
    '/hosting-whatsapp',
    '/hosting-telegram',
    '/hosting-minecraft',
    '/hosting-nodejs',
    '/hosting-python',
    '/hosting-application',
    '/status',
    '/blog',
    '/about',
    '/terms',
    '/privacy',
    '/refund',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls
    .map(
      url => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
  ${posts
    .map(
      p => `
  <url>
    <loc>${baseUrl}/blog/${p.slug}</loc>
    <lastmod>${p.publishedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
