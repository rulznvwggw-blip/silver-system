import { Context } from 'grammy';

export class AnimationManager {
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async aiThinking(ctx: Context, finalContent?: string): Promise<void> {
    try {
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: '🤖 AI sedang berpikir...', show_alert: false });
      }

      const frames = [
        '🤖 **AI sedang berpikir...**\n━━━━━━━━━━━━━━\n🟩⬜⬜⬜⬜',
        '🤖 **AI sedang menganalisis data...**\n━━━━━━━━━━━━━━\n🟩🟩🟩⬜⬜',
        '✨ **AI selesai membuat respons!**\n━━━━━━━━━━━━━━\n🟩🟩🟩🟩🟩',
      ];

      for (const frame of frames) {
        try {
          if (ctx.callbackQuery?.message) {
            await ctx.api.editMessageText(
              ctx.chat!.id,
              ctx.callbackQuery.message.message_id,
              frame,
              { parse_mode: 'Markdown' }
            );
          }
          await this.sleep(300);
        } catch {
          break;
        }
      }
    } catch {}
  }

  static async processing(ctx: Context, action = 'Memproses data'): Promise<void> {
    try {
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: `⏳ ${action}...`, show_alert: false });
      }
    } catch {}
  }

  static async saving(ctx: Context, item = 'perubahan'): Promise<void> {
    try {
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: `💾 Menyimpan ${item}...`, show_alert: false });
      }
    } catch {}
  }

  static async searching(ctx: Context, query = ''): Promise<void> {
    try {
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: `🔍 Mencari "${query}"...`, show_alert: false });
      }
    } catch {}
  }

  static async deleting(ctx: Context, item = 'data'): Promise<void> {
    try {
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: `🗑️ Menghapus ${item}...`, show_alert: false });
      }
    } catch {}
  }

  static async deploying(ctx: Context, server = 'Server'): Promise<void> {
    try {
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: `🚀 Mendeploy container ${server}...`, show_alert: false });
      }
    } catch {}
  }

  static async broadcasting(ctx: Context): Promise<void> {
    try {
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery({ text: '📡 Mengirim broadcast ke tujuan...', show_alert: false });
      }
    } catch {}
  }
}
