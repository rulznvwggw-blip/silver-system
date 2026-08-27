# 🌟 NexaCloud - Multi-Purpose Pterodactyl Hosting & Storefront Platform

Platform lengkap cloud hosting dan toko online otomatis berbasis **Pterodactyl Panel + Wings Daemon Node** untuk menjual dan mengelola:
1. **Bot WhatsApp (Baileys / Node.js)**
2. **Bot Telegram (Python / Node.js)**
3. **Minecraft Server (Java Edition Multi-Core)**
4. **SIAO / Custom Application Server**
5. **Generic Linux Container Application**

---

## 🚀 Komponen Sistem yang Berjalan

| Layanan | Port / Domain | Keterangan |
| :--- | :--- | :--- |
| **Pterodactyl Panel** | `https://ptero.rullzyestorepremium.my.id` | Web UI, File Manager, Console, User Management |
| **Wings Daemon Node** | `pteronode.rullzyestorepremium.my.id:8085` | Runtime Docker Container Daemon (Status: 💚 ONLINE) |
| **Storefront Web App** | `http://localhost:3000` (PM2 Service) | Website Penjualan, Checkout QRIS, Auto Provisioning |
| **Database Cluster** | Internal MariaDB 10.11 & Redis Alpine | Database & Queue Cache |

---

## ⚡ Fitur Utama Toko Online NexaCloud (Next.js 14 + Tailwind)

- 🛒 **Katalog Paket & Pricing Dinamis:** WhatsApp Bot (Mulai Rp 15.000), Telegram Bot (Mulai Rp 12.000), Minecraft SMP (Mulai Rp 35.000).
- 🏷️ **Sistem Kupon Promo:** `WELCOME10` (10% OFF), `DISKON20` (20% OFF), `MC50` (25% OFF).
- 💳 **Metode Pembayaran Modular:** QRIS (Semua E-Wallet & M-Banking), BCA VA, Mandiri VA, BRI VA.
- ⚙️ **Automated Pterodactyl Provisioning:** Server langsung dibuat dan di-deploy ke Node-Main-01 secara otomatis setelah webhook pembayaran terverifikasi.
- 📱 **Client Dashboard:** Monitoring server aktif, detail IP & Port, tombol *Manage Server in Pterodactyl*, dan Sistem Tiket Bantuan.
- 🛡️ **Admin Control Center (`/admin`):** Monitoring Total Revenue, Order realtime, Provisioned Servers, dan Pengaturan Store.
- 📈 **Realtime Status Page (`/status`):** Monitoring latency dan uptime 99.99% setiap service.
- 🔍 **SEO Super Lengkap:** Dynamic Metadata, OpenGraph, Breadcrumb, Schema JSON-LD (Organization, Product, FAQ, Article), Sitemap.xml, & Robots.txt.

---

## 🛠️ Perintah Manajemen Server & Store

```bash
# Menjalankan / Restart Store Web App
pm2 restart nexacloud-store

# Memeriksa Log Store
pm2 logs nexacloud-store

# Memeriksa Status Wings Daemon
sudo /usr/local/bin/wings --debug

# Memeriksa Container Docker Pterodactyl
docker compose ps
```
