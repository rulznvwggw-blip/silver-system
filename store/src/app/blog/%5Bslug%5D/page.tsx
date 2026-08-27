import React from 'react';
import { notFound } from 'next/navigation';
import { store } from '@/lib/store';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, User, Tag, Zap, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = store.getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Artikel Tidak Ditemukan - RullzyeStore' };

  return {
    title: `${post.title} - RullzyeStore Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  const post = store.getBlogPostBySlug(params.slug);
  if (!post) notFound();

  // JSON-LD Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.excerpt,
    'author': {
      '@type': 'Person',
      'name': post.author,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'RullzyeStore Hosting',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://ptero.rullzyestorepremium.my.id/logo.png',
      },
    },
    'datePublished': post.publishedAt,
  };

  return (
    <article className="py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Artikel
        </Link>

        {/* Article Header */}
        <div className="space-y-4 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-brand-500/10 text-brand-400 font-bold px-3 py-1 rounded-full border border-brand-500/20">
              {post.category}
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
            <span>Ditulis oleh <strong className="text-slate-200">{post.author}</strong></span>
            <span>•</span>
            <span>Dipublikasikan pada {post.publishedAt}</span>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
          <div className="p-4 bg-slate-900 border-l-4 border-brand-400 rounded-r-xl text-slate-200 font-medium italic">
            {post.excerpt}
          </div>

          <div className="whitespace-pre-wrap font-sans space-y-4 text-slate-300">
            {post.content}
          </div>
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap gap-2">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-slate-900 text-slate-300 px-3 py-1 rounded-full border border-slate-800">
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA Box */}
        <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-brand-950/50 border border-brand-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Ingin Deploy Bot atau Server Sekarang?</h3>
            <p className="text-xs text-slate-400">Dapatkan hosting Pterodactyl mulai dari Rp 12.000/bulan.</p>
          </div>
          <Link
            href="/#pricing"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 text-dark-bg font-extrabold text-xs shadow-lg shrink-0"
          >
            PILIH PAKET HOSTING
          </Link>
        </div>
      </div>
    </article>
  );
}
