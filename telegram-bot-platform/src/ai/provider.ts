import { env } from '../config/env.js';
import {
  AIBroadcastOptions,
  FALLBACK_BROADCAST_TEMPLATES,
  FALLBACK_COMMUNITY_DECORATION,
} from './fallbackTemplates.js';

export interface AIModerationResult {
  isSpam: boolean;
  confidence: number;
  reason: string;
  recommendedAction: 'none' | 'warn' | 'mute' | 'ban' | 'delete';
}

export interface GeneratedCommunityPlan {
  name: string;
  description: string;
  rules: string;
  welcomePost: string;
  pinnedAnnouncement: string;
  brandingTags: string[];
}

export class AIProviderService {
  private lastTemplateIdx = 0;

  async generateBroadcast(options: AIBroadcastOptions = {}): Promise<{ title: string; content: string; model: string }> {
    const tone = options.tone || 'friendly';
    const lang = options.language || 'Indonesia';
    const topic = options.topic || 'Update & Tips Komunitas';

    // If Gemini/OpenAI API Key is available, try fetching live AI content
    if (env.aiApiKey) {
      try {
        const prompt = `Buat 1 postingan broadcast Telegram profesional, informatif, dan bervariasi dengan tema: "${topic}".
Tone: ${tone}, Bahasa: ${lang}.
Gunakan format markdown Telegram (bold, bullet points, emoji yang rapi).
Awali dengan headline pembuka, berikan 2-3 poin informasi berharga, dan ajakan interaksi sopan di akhir.`;

        const res = await this.callAI(prompt);
        if (res) {
          return {
            title: `🚀 AI ${topic.toUpperCase()} (${tone.toUpperCase()})`,
            content: res,
            model: 'gemini-1.5-flash',
          };
        }
      } catch (err: any) {
        console.warn('[AI Provider] AI API call failed, using dynamic template:', err.message);
      }
    }

    // Dynamic Rotating Fallback
    const template = FALLBACK_BROADCAST_TEMPLATES[this.lastTemplateIdx % FALLBACK_BROADCAST_TEMPLATES.length];
    this.lastTemplateIdx++;
    return {
      title: template.title,
      content: template.content,
      model: 'template-engine-v2',
    };
  }

  async generateCommunityPlan(topic: string, category: string): Promise<GeneratedCommunityPlan> {
    return {
      name: `🚀 ${topic} Indonesia Community`,
      description: `Komunitas resmi diskusi dan berbagi seputar ${topic} dan ${category} di Indonesia. Mabar, sharing tips, dan update 24 jam.`,
      rules: `1️⃣ Saling menghormati sesama anggota\n2️⃣ Dilarang spam, flood link, atau jualan ilegal\n3️⃣ Gunakan bahasa yang sopan dan santun\n4️⃣ Taati keputusan admin komunitas`,
      welcomePost: `👋 Selamat datang di ${topic} Indonesia! Jangan lupa kenalan dan baca rules di pinned message ya!`,
      pinnedAnnouncement: `📌 **PENGUMUMAN RESMI ${topic.toUpperCase()}**\n\nSelamat datang semua! Dilarang keras melakukan penipuan atau promosi tanpa izin admin.`,
      brandingTags: [`#${category}`, `#${topic.replace(/\s+/g, '_').toLowerCase()}`, '#indonesia_community', '#rullzyestore'],
    };
  }

  async generateDecoration(name: string): Promise<string> {
    return FALLBACK_COMMUNITY_DECORATION.welcome.replace(/{name}/g, name);
  }

  async moderateMessage(text: string): Promise<AIModerationResult> {
    const lower = text.toLowerCase();
    
    // Quick heuristic patterns
    const spamKeywords = ['slot gacor', 'promo vcs', 'crypto gratis', 't.me/joinchat/scam', 'klaim saldo dana 100k', 'bokep', 'pinjol'];
    const hasSpamWord = spamKeywords.some(k => lower.includes(k));
    
    // Link spam detection
    const linkMatches = (text.match(/https?:\/\/[^\s]+/g) || []).length;
    const isLinkSpam = linkMatches >= 3;

    if (hasSpamWord) {
      return {
        isSpam: true,
        confidence: 0.96,
        reason: 'Terdeteksi kata kunci spam / judi / penipuan terlarang.',
        recommendedAction: 'delete',
      };
    }

    if (isLinkSpam) {
      return {
        isSpam: true,
        confidence: 0.88,
        reason: 'Mengirimkan terlalu banyak link dalam satu pesan (Mass link spam).',
        recommendedAction: 'warn',
      };
    }

    return {
      isSpam: false,
      confidence: 0.05,
      reason: 'Pesan aman.',
      recommendedAction: 'none',
    };
  }

  private async callAI(prompt: string): Promise<string | null> {
    // If Gemini key is set, call Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.aiApiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as any;
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }
}

export const aiProvider = new AIProviderService();
