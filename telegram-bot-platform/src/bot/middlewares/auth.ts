import { Context, NextFunction } from 'grammy';
import { db } from '../../database/db.js';
import { SUPER_ADMIN_ID } from '../../config/constants.js';

export async function adminGuard(ctx: Context, next: NextFunction): Promise<void> {
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply('⛔ Anda tidak memiliki izin untuk menggunakan fitur ini.');
    return;
  }

  const isAdmin = await db.isAdmin(userId);

  if (!isAdmin) {
    await ctx.reply('⛔ **Akses Ditolak.**\n\nAnda tidak memiliki izin untuk menggunakan fitur administrator.', {
      parse_mode: 'Markdown',
    });
    return;
  }

  return next();
}

export function isSuperAdmin(userId?: number): boolean {
  return userId === SUPER_ADMIN_ID;
}
