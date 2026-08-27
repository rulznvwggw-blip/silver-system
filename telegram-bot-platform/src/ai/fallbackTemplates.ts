export interface AIBroadcastOptions {
  topic?: string;
  category?: string;
  tone?: 'professional' | 'friendly' | 'casual' | 'promotional' | 'educational';
  language?: 'Indonesia' | 'English';
}

export const FALLBACK_BROADCAST_TEMPLATES = [
  {
    title: '🚀 TIPS OPTIMASI SERVER & BOT 24 JAM',
    content: `━━━━━━━━━━━━━━━━━━━━
🚀 **UPDATE TERBARU & TIPS KOMUNITAS**

💡 **Tahukah Anda?**
Menjalankan Bot WhatsApp atau Minecraft Server membutuhkan isolasi resource yang stabil agar tidak terjadi crash saat traffic tinggi.

✨ **Fitur Unggulan:**
• Auto-restart saat proses terhenti
• Alokasi port publik instan & Web Console
• Backup terjadwal & monitoring 24/7

👉 *Tetap ikuti update terbaru di komunitas kami!*
━━━━━━━━━━━━━━━━━━━━`,
  },
  {
    title: '⚡ PENGUMUMAN PENTING & EVENT KOMUNITAS',
    content: `━━━━━━━━━━━━━━━━━━━━
📢 **ANNOUNCEMENT KOMUNITAS**

Halo teman-teman! Terima kasih telah aktif berpartisipasi dan menjaga kenyamanan grup kita.

📌 **Peringatan Ringkas:**
1️⃣ Patuhi aturan komunitas & no spam
2️⃣ Gunakan fitur pencarian \`/search\` untuk menemukan channel partner
3️⃣ Hubungi admin jika butuh bantuan

🔥 *Mari bangun komunitas yang aktif dan saling mendukung!*
━━━━━━━━━━━━━━━━━━━━`,
  },
  {
    title: '🎮 INFO UPDATE MINECRAFT & GAMING SERVER',
    content: `━━━━━━━━━━━━━━━━━━━━
⛏️ **MINECRAFT & GAMING SERVER UPDATE**

Mabar lebih seru dengan TPS stabil 20.0 dan proteksi Anti-DDoS game aktif!

🎮 **Rekomendasi Minggu Ini:**
• Gunakan PaperMC / Purpur untuk survival SMP hemat RAM
• Selalu backup world sebelum memasang plugin baru
• Gabung voice channel saat event mabar berlangsung

👉 *Ketik \`/search\` untuk daftar grup mabar lainnya!*
━━━━━━━━━━━━━━━━━━━━`,
  },
  {
    title: '💻 TIPS CODING & OTOMASI TELEGRAM BOT',
    content: `━━━━━━━━━━━━━━━━━━━━
🤖 **KNOWLEDGE BASE: TELEGRAM & NODE.JS**

Membuat bot Telegram yang handal memerlukan penanganan rate limit yang tepat (Backoff Strategy) dan queue system seperti BullMQ.

🌟 **Best Practice:**
• Gunakan Webhook untuk traffic tinggi
• Pisahkan proses heavy computation ke Background Worker
• Jangan pernah hardcode API token di file publik

━━━━━━━━━━━━━━━━━━━━`,
  },
];

export const FALLBACK_WELCOME_TEMPLATES = [
  `🎉 **Selamat Datang, {name}!**\n\nKamu sekarang berada di komunitas resmi:\n👉 **{community_name}**\n\n📜 *Harap membaca rules grup kami sebelum memulai obrolan ya!*`,
];

export const FALLBACK_COMMUNITY_DECORATION = {
  welcome: `╔═════════════════════════════╗
   🚀 {name} OFFICIAL HUB
╚═════════════════════════════╝

🔥 **Selamat datang di komunitas {name}!**

📌 **ATURAN KOMUNITAS (RULES):**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Saling menghargai dan jaga kesopanan
2️⃣ Dilarang spam, flood, dan promosi tanpa izin admin
3️⃣ Dilarang scam atau konten ilegal
4️⃣ Gunakan bahasa yang santun

🔗 **LINK PENTING & OFFICIAL:**
• Website: https://store.rullzyestorepremium.my.id
• Channel: @rullzyestore_official
• Support Admin: @rullzye

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Dilindungi oleh AI Moderation & Auto Guard System*`,
};
