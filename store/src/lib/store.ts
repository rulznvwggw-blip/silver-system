import { Order, ProvisionedServer, Ticket, BlogPost, Coupon } from '@/types';

// In-memory global store that persists during development runtime
class StoreManager {
  private orders: Order[] = [];
  private servers: ProvisionedServer[] = [];
  private tickets: Ticket[] = [];
  private coupons: Coupon[] = [
    {
      code: 'WELCOME10',
      discountPercentage: 10,
      minSpend: 15000,
      validUntil: '2026-12-31',
      usageCount: 142,
      maxUsage: 1000,
    },
    {
      code: 'DISKON20',
      discountPercentage: 20,
      minSpend: 50000,
      validUntil: '2026-12-31',
      usageCount: 88,
      maxUsage: 500,
    },
    {
      code: 'MC50',
      discountPercentage: 25,
      minSpend: 65000,
      validUntil: '2026-12-31',
      usageCount: 54,
      maxUsage: 200,
    },
  ];

  private blogPosts: BlogPost[] = [
    {
      id: '1',
      slug: 'cara-membuat-bot-whatsapp-24-jam-baileys',
      title: 'Panduan Lengkap Cara Deploy Bot WhatsApp 24 Jam dengan Baileys & Pterodactyl',
      excerpt: 'Pelajari cara membuat dan menjalankan bot WhatsApp berbasis Baileys agar selalu aktif 24/7 tanpa takut banned dan tanpa perlu laptop menyala terus.',
      category: 'Tutorial',
      author: 'RullzyeStore Dev Team',
      readTime: '5 Menit Baca',
      publishedAt: '2026-08-15',
      tags: ['WhatsApp Bot', 'Baileys', 'NodeJS', 'Pterodactyl'],
      content: `## Mengapa Membutuhkan Hosting Bot WhatsApp Khusus?
Menjalankan bot WhatsApp di komputer lokal sering kali terputus saat laptop sleep atau koneksi WiFi putus. Dengan **Pterodactyl Panel di RullzyeStore**, bot Anda berjalan di dalam container Docker dengan sistem auto-restart saat crash dan integrasi Git pull otomatis.

### Langkah Praktis:
1. Pilih paket **WA Basic (1GB RAM)** di RullzyeStore.
2. Upload file bot Anda (atau hubungkan via Git repo).
3. Jalankan bot melalui tombol Start di Web Console.
4. Scan QR Code WhatsApp langsung dari console browser.
5. Bot Anda aktif 24 jam nonstop!`,
    },
    {
      id: '2',
      slug: 'hosting-minecraft-indonesia-anti-ddos-low-latency',
      title: 'Tips Memilih Hosting Minecraft Indonesia Terbaik: Low Latency & Anti-DDoS',
      excerpt: 'Membangun server Minecraft SMP atau Network yang lancar tanpa lag dengan konfigurasi PaperMC dan Aikar JVM Flags terbaru.',
      category: 'Minecraft',
      author: 'Arya Pratama',
      readTime: '6 Menit Baca',
      publishedAt: '2026-08-20',
      tags: ['Minecraft', 'PaperMC', 'Server Hosting', 'DDoS Protection'],
      content: `## Kunci Server Minecraft Bebas Lag
Server Minecraft sangat membutuhkan single-thread CPU performance yang tinggi dan I/O disk NVMe super cepat. Di RullzyeStore, kami menggunakan prosesor clock tinggi dan proteksi DDoS khusus gaming hingga 100 Gbps.

### Rekomendasi Alokasi RAM:
- **1-5 Pemain (Vanilla):** 2 GB RAM
- **10-25 Pemain (SMP + Plugins):** 4 GB RAM
- **30+ Pemain (Heavy Modpack / Network):** 8 GB - 16 GB RAM`,
    },
    {
      id: '3',
      slug: 'perbedaan-vps-dan-pterodactyl-hosting',
      title: 'Perbedaan Hosting Pterodactyl vs VPS Tradisional: Mana yang Lebih Praktis?',
      excerpt: 'Bandingkan kemudahan kontrol panel Pterodactyl dengan manajemen VPS CLI untuk pemula dan developer.',
      category: 'Edukasi',
      author: 'RullzyeStore Dev Team',
      readTime: '4 Menit Baca',
      publishedAt: '2026-08-24',
      tags: ['VPS', 'Pterodactyl', 'Cloud', 'Docker'],
      content: `## Kemudahan Pterodactyl vs VPS Biasa
Menggunakan VPS biasa mengharuskan Anda melakukan setup Linux, Nginx, firewall, systemd, dan instalasi Node.js/Java manual lewat terminal SSH hitam putih.

Dengan **Pterodactyl Game & App Panel**:
- Antarmuka web modern & responsive
- File Manager, Unzip, dan SFTP bawaan
- Monitoring RAM, CPU, dan Network real-time
- Console interaktif langsung di browser
- Tombol Start, Stop, Restart dalam 1 klik`,
    }
  ];

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    // Seed sample provisioned servers
    this.servers = [
      {
        id: 'srv-1',
        pteroId: 101,
        uuid: 'd8c71a2e-4b89-4c12-98ab-8c9f8e123456',
        identifier: 'd8c71a2e',
        name: 'Store Bot WhatsApp Main',
        category: 'whatsapp',
        planName: 'WA Basic (1GB)',
        customerEmail: 'admin_dc693d@local.host',
        customerName: 'Super Admin',
        ipAddress: 'pteronode.rullzyestorepremium.my.id',
        port: 3001,
        ram: '1024 MB',
        cpu: '150%',
        disk: '10240 MB',
        status: 'running',
        createdAt: '2026-08-25T10:00:00Z',
        expiresAt: '2026-09-25T10:00:00Z',
        panelUrl: 'https://ptero.rullzyestorepremium.my.id',
      },
      {
        id: 'srv-2',
        pteroId: 102,
        uuid: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        identifier: 'a1b2c3d4',
        name: 'NexaCraft SMP Season 1',
        category: 'minecraft',
        planName: 'Minecraft SMP (4GB)',
        customerEmail: 'admin_dc693d@local.host',
        customerName: 'Super Admin',
        ipAddress: 'pteronode.rullzyestorepremium.my.id',
        port: 25565,
        ram: '4096 MB',
        cpu: '300%',
        disk: '30720 MB',
        status: 'running',
        createdAt: '2026-08-26T14:30:00Z',
        expiresAt: '2026-09-26T14:30:00Z',
        panelUrl: 'https://ptero.rullzyestorepremium.my.id',
      }
    ];

    // Seed sample orders
    this.orders = [
      {
        id: 'ord-1',
        orderNumber: 'RULLZYE-2608-WA01',
        customer: {
          id: 'cust-1',
          name: 'Super Admin',
          email: 'admin_dc693d@local.host',
          whatsapp: '081234567890',
          username: 'admin_dc693d',
          createdAt: '2026-08-25T10:00:00Z',
        },
        item: {
          planId: 'wa-basic',
          planName: 'WA Basic',
          category: 'whatsapp',
          billingCycle: 'monthly',
          serverName: 'Store Bot WhatsApp Main',
          price: 25000,
          discount: 0,
          total: 25000,
        },
        paymentMethod: 'qris',
        paymentStatus: 'paid',
        amount: 25000,
        createdAt: '2026-08-25T09:55:00Z',
        paidAt: '2026-08-25T09:58:00Z',
        serverId: 'srv-1',
      }
    ];

    // Seed sample tickets
    this.tickets = [
      {
        id: 'tkt-1',
        ticketNumber: 'TKT-8821',
        customerEmail: 'admin_dc693d@local.host',
        customerName: 'Super Admin',
        subject: 'Panduan Pasang GeyserMC di Server Minecraft',
        category: 'technical',
        priority: 'medium',
        status: 'answered',
        createdAt: '2026-08-26T15:00:00Z',
        updatedAt: '2026-08-26T15:30:00Z',
        messages: [
          {
            id: 'm1',
            sender: 'customer',
            senderName: 'Super Admin',
            message: 'Halo min, bagaimana cara menghubungkan GeyserMC agar pemain Bedrock (HP) bisa masuk ke server Minecraft Java?',
            timestamp: '2026-08-26T15:00:00Z',
          },
          {
            id: 'm2',
            sender: 'support',
            senderName: 'Support Agent - Kevin',
            message: 'Halo! Anda cukup mendownload plugin Geyser-Spigot.jar dan Floodgate.jar, lalu letakkan di folder /plugins melalui File Manager Panel. Kemudian restart server!',
            timestamp: '2026-08-26T15:30:00Z',
          }
        ]
      }
    ];
  }

  // Order Operations
  createOrder(order: Order): Order {
    this.orders.unshift(order);
    return order;
  }

  getOrder(id: string): Order | undefined {
    return this.orders.find(o => o.id === id || o.orderNumber === id);
  }

  getOrders(): Order[] {
    return [...this.orders];
  }

  updateOrderStatus(orderId: string, status: Order['paymentStatus'], paidAt?: string) {
    const order = this.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.paymentStatus = status;
      if (paidAt) order.paidAt = paidAt;
    }
    return order;
  }

  // Server Operations
  addServer(server: ProvisionedServer) {
    this.servers.unshift(server);
    return server;
  }

  getServers(): ProvisionedServer[] {
    return [...this.servers];
  }

  getServersByEmail(email: string): ProvisionedServer[] {
    return this.servers.filter(s => s.customerEmail.toLowerCase() === email.toLowerCase());
  }

  // Coupon Operations
  getCoupon(code: string): Coupon | undefined {
    return this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  }

  getCoupons(): Coupon[] {
    return [...this.coupons];
  }

  // Ticket Operations
  getTickets(): Ticket[] {
    return [...this.tickets];
  }

  createTicket(ticket: Ticket): Ticket {
    this.tickets.unshift(ticket);
    return ticket;
  }

  addTicketMessage(ticketId: string, message: { sender: 'customer' | 'support'; senderName: string; message: string }) {
    const ticket = this.tickets.find(t => t.id === ticketId || t.ticketNumber === ticketId);
    if (ticket) {
      ticket.messages.push({
        id: `msg-${Date.now()}`,
        ...message,
        timestamp: new Date().toISOString(),
      });
      ticket.status = message.sender === 'customer' ? 'customer_reply' : 'answered';
      ticket.updatedAt = new Date().toISOString();
    }
    return ticket;
  }

  // Blog Operations
  getBlogPosts(): BlogPost[] {
    return [...this.blogPosts];
  }

  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.blogPosts.find(p => p.slug === slug);
  }
}

// Global singleton instance
const globalForStore = globalThis as unknown as { storeManager?: StoreManager };
export const store = globalForStore.storeManager || new StoreManager();
if (process.env.NODE_ENV !== 'production') globalForStore.storeManager = store;
