import React from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { BookOpen, Clock, Calendar, ArrowRight, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Tutorial Hosting Bot WhatsApp, Telegram & Minecraft - RullzyeStore',
  description: 'Kumpulan artikel panduan, tutorial cara membuat bot WhatsApp, optimasi server Minecraft, dan tips hosting Pterodactyl.',
};

export default function BlogPage() {
  const posts = store.getBlogPosts();

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            RullzyeStore Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tutorial & Artikel Hosting
          </h1>
          <p className="text-slate-400 text-sm">
            Panduan praktis cara deploy bot, konfigurasi server Minecraft, dan tips manajemen Pterodactyl.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <article
              key={post.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors group shadow-xl"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="bg-brand-500/10 text-brand-400 font-bold px-2.5 py-0.5 rounded border border-brand-500/20">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">{post.author}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
