import { Context } from 'grammy';

export interface ProgressStep {
  message: string;
  delayMs?: number;
}

export async function runProgressAnimation(
  ctx: Context,
  messageId: number,
  chatId: number | string,
  steps: ProgressStep[]
): Promise<void> {
  for (const step of steps) {
    try {
      await ctx.api.editMessageText(chatId, messageId, step.message, {
        parse_mode: 'Markdown',
      });
      await new Promise(r => setTimeout(r, step.delayMs || 700));
    } catch {
      // Ignore Telegram message not modified error
    }
  }
}

export const ANIMATION_PRESETS = {
  aiBroadcastGeneration: [
    { message: '⏳ **Memproses Permintaan AI...**\n`[▫️▫️▫️▫️▫️]`', delayMs: 400 },
    { message: '🤖 **AI sedang menganalisis topik & persona...**\n`[🟩🟩▫️▫️▫️]`', delayMs: 600 },
    { message: '✨ **Menyusun copywriting & formatting markdown...**\n`[🟩🟩🟩🟩▫️]`', delayMs: 600 },
    { message: '📡 **Validasi target tujuan broadcast...**\n`[🟩🟩🟩🟩🟩]`', delayMs: 500 },
  ],
  communityGeneration: [
    { message: '⏳ **Menghubungi AI Community Architect...**\n`[▫️▫️▫️▫️▫️]`', delayMs: 400 },
    { message: '🎨 **Menyusun branding, nama & deskripsi komunitas...**\n`[🟩🟩▫️▫️▫️]`', delayMs: 600 },
    { message: '📜 **Membuat aturan grup (Rules) & Template Welcome...**\n`[🟩🟩🟩🟩▫️]`', delayMs: 600 },
    { message: '✨ **Finalisasi blueprint komunitas...**\n`[🟩🟩🟩🟩🟩]`', delayMs: 400 },
  ],
  decorating: [
    { message: '⏳ **Mengambil blueprint dekorasi...**', delayMs: 400 },
    { message: '🎨 **Menghias banner & formatting Unicode...**', delayMs: 600 },
    { message: '✨ **Dekorasi Komunitas Siap Diterapkan!**', delayMs: 400 },
  ],
};
