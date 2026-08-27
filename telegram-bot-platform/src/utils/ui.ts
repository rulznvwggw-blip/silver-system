export function getDynamicGreeting(timezone = 'Asia/Jakarta'): { greeting: string; icon: string; timeLabel: string } {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    });
    const hour = parseInt(formatter.format(now), 10);

    if (hour >= 5 && hour < 12) {
      return { greeting: 'Good Morning', icon: '🌅', timeLabel: 'Pagi' };
    } else if (hour >= 12 && hour < 18) {
      return { greeting: 'Good Afternoon', icon: '☀️', timeLabel: 'Siang' };
    } else if (hour >= 18 && hour < 23) {
      return { greeting: 'Good Evening', icon: '🌆', timeLabel: 'Sore/Malam' };
    } else {
      return { greeting: 'Good Night', icon: '🌙', timeLabel: 'Malam' };
    }
  } catch {
    return { greeting: 'Welcome', icon: '✨', timeLabel: 'Hari ini' };
  }
}

export function createCozyHeader(title: string, subtitle?: string): string {
  const line = '─'.repeat(Math.max(24, Math.min(36, title.length + 4)));
  if (subtitle) {
    return `╭${line}╮\n│  ${title}\n│  _${subtitle}_\n╰${line}╯`;
  }
  return `╭${line}╮\n│  ${title}\n╰${line}╯`;
}

export function formatRupiah(amount: number): string {
  return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
}
