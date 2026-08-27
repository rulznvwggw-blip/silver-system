# 🤖 Rullzye AI Telegram Bot Management Platform

Platform manajemen bot Telegram profesional berbasis **AI & BullMQ Queue System** dengan fitur **Automated Broadcast (Setiap 30 Menit)**, **Community Generator**, **Auto-Decoration**, **Directory & Search Komunitas**, **AI Moderation**, dan **Web Monitoring Dashboard**.

---

## 👑 Identitas Administrator Utama (RBAC)

- **Primary Super Admin ID:** `7128038268`
- Seluruh endpoint & command administrator diverifikasi secara ketat di sisi server (*Server-Side Authorization Guard*).
- Sistem **RBAC (Role-Based Access Control)** memungkinkan penambahan admin baru tanpa mengubah kode sumber.

---

## 🌟 Fitur Utama Platform

1. 🤖 **AI Broadcast 30-Menit Otomatis:**
   - Scheduler terintegrasi (Timezone: `Asia/Jakarta`).
   - Copywriting dinamis (Announcement, Edukasi, Tips, Promosi, Update Komunitas) agar tidak mengirim pesan yang identik.
   - Dispatcher ke antrean **BullMQ + Redis** dengan *Exponential Backoff* & penghormatan *Telegram 429 Rate Limit*.
2. 🎯 **Target Filter Dinamis:**
   - Semua Komunitas, Grup Saja, Channel Saja, atau Kategori Tertentu (Gaming, Minecraft, Hosting, dll).
   - Layar konfirmasi pra-kirim: `"⚠️ Broadcast akan dikirim ke X tujuan."`
3. 🛑 **Global Emergency Kill-Switch:**
   - Tombol darurat di panel admin untuk menghentikan seketika seluruh antrean pengiriman pesan.
4. ➕ **AI Community Architect:**
   - Otomasi pembuatan nama komunitas, deskripsi, template rules, pesan pinned, dan greeting welcome dengan kepatuhan penuh terhadap kebijakan resmi Telegram API.
5. 🎨 **Auto Decoration Engine:**
   - Menghias grup dan channel dengan template banner Unicode modern dan link resmi.
6. 🔎 **Search Engine Internal (`/search`):**
   - Indeks database lokal tanpa scraping privat.
7. 🛡️ **Anti-Spam & AI Moderation Guard:**
   - Deteksi flood (5 pesan / 5 detik), mass-link filter, dan AI spam classifier (Confidence threshold > 85%).
8. 📊 **Web Dashboard Realtime (Port 3005):**
   - Monitoring grafik jangkauan member, success rate, status scheduler, dan dispatch broadcast manual.

---

## 📁 Struktur Direktori Proyek

```
telegram-bot-platform/
├── src/
│   ├── index.ts                # Main unified entrypoint
│   ├── config/
│   │   ├── env.ts              # Type-safe environment config
│   │   └── constants.ts        # Admin ID (7128038268), Enums, Categories
│   ├── database/
│   │   ├── db.ts               # Resilient Hybrid DB Pool
│   │   └── schema.sql          # PostgreSQL DDL Schema & Indexes
│   ├── queue/
│   │   ├── redis.ts            # Redis connection client
│   │   ├── queues.ts           # BullMQ Queues
│   │   └── workers/
│   │       ├── broadcastWorker.ts  # Queue Worker with rate-limit backoff
│   │       └── schedulerWorker.ts  # 30-Minute AI scheduler
│   ├── ai/
│   │   ├── provider.ts         # AI Provider abstraction
│   │   └── fallbackTemplates.ts# Rotating dynamic fallback templates
│   ├── bot/
│   │   ├── bot.ts              # Grammy instance & routing
│   │   ├── animations/         # Progress animation state machine
│   │   ├── middlewares/        # RBAC Auth & Anti-Spam
│   │   ├── handlers/           # /start, /admin, /broadcast, /search, /create, dll.
│   │   └── events/             # Welcome greeting & message guard
│   └── web/
│       ├── server.ts           # Express API Server
│       └── public/             # Dark-mode Web Dashboard UI
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Panduan Instalasi & Menjalankan Bot

### 1. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env` lalu masukkan token bot Telegram Anda:
```bash
cp .env.example .env
```
Isi variabel berikut:
```env
BOT_TOKEN=1234567890:AAHxxxxxx... (Dapatkan dari @BotFather)
ADMIN_ID=7128038268
AI_API_KEY=AIzaSy... (Opsional untuk Google Gemini)
```

### 2. Menjalankan secara Lokal
```bash
# Install dependensi
npm install

# Compile & jalankan aplikasi
npm run build
npm start
```

### 3. Menjalankan via Docker Compose
```bash
docker compose up -d --build
```

---

## 🎮 Daftar Command Bot Telegram

| Command | Akses | Fungsi |
| :--- | :--- | :--- |
| `/start` | Semua User | Membuka menu navigasi interaktif |
| `/help` | Semua User | Menampilkan panduan dan daftar command |
| `/search <query>` | Semua User | Mencari grup & channel komunitas |
| `/groups` | Semua User | Menampilkan direktori grup aktif |
| `/channels` | Semua User | Menampilkan direktori channel resmi |
| `/stats` | Semua User | Melihat statistik & metrik platform |
| `/admin` | **Khusus Admin (`7128038268`)** | Membuka Admin Control Center (14 Modul) |
| `/aibroadcast` | **Khusus Admin** | Generate & kirim broadcast AI instan |
| `/scheduler` | **Khusus Admin** | Manajemen jadwal auto-broadcast 30 menit |
| `/create` | **Khusus Admin** | AI Community Generator (Group/Channel) |
| `/settings` | **Khusus Admin** | Pengaturan sistem & emergency switch |

---

## 🌐 Web Dashboard Admin
Buka browser di alamat:
👉 **[http://localhost:3005](http://localhost:3005)**
