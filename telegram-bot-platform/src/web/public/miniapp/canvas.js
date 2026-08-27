// Initialize Telegram WebApp SDK if running inside Telegram
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  if (tg.setHeaderColor) tg.setHeaderColor('#090d16');
  if (tg.setBackgroundColor) tg.setBackgroundColor('#090d16');
}

// 1. HTML5 Canvas Particle Cyber Grid Animation
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = canvas.parentElement.clientWidth);
let height = (canvas.height = canvas.parentElement.clientHeight);

window.addEventListener('resize', () => {
  width = canvas.width = canvas.parentElement.clientWidth;
  height = canvas.height = canvas.parentElement.clientHeight;
});

const particles = [];
for (let i = 0; i < 40; i++) {
  particles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    color: Math.random() > 0.5 ? '#38bdf8' : '#34d399',
  });
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  // Draw grid lines
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
  ctx.lineWidth = 1;
  const gridSize = 25;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Update & draw particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Connect close particles
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (dist < 60) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 - dist / 150})`;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// 2. Generate 300 Dynamic Packages (7d, 14d, 30d x 100 Tiers)
const RAM_LIST = [
  256, 512, 768, 1024, 1536, 2048, 2560, 3072, 4096, 5120,
  6144, 7168, 8192, 10240, 12288, 14336, 16384, 18432, 20480, 22528,
  24576, 26624, 28672, 30720, 32768
];

const MC_RAM_LIST = [
  1024, 1536, 2048, 3072, 4096, 5120, 6144, 8192, 10240, 12288,
  14336, 16384, 18432, 20480, 24576, 28672, 32768, 36864, 40960, 45056,
  49152, 53248, 57344, 61440, 65536
];

function generateCatalog() {
  const store = {
    '7d': { whatsapp: [], telegram: [], minecraft: [], vps: [] },
    '14d': { whatsapp: [], telegram: [], minecraft: [], vps: [] },
    '30d': { whatsapp: [], telegram: [], minecraft: [], vps: [] },
  };

  ['7d', '14d', '30d'].forEach(dur => {
    const mult = dur === '7d' ? 0.35 : dur === '14d' ? 0.60 : 1.0;
    const durLabel = dur === '7d' ? '7 Hari' : dur === '14d' ? '14 Hari' : '30 Hari';

    // WA (25)
    RAM_LIST.forEach((ram, idx) => {
      const tier = idx + 1;
      const ramLabel = ram >= 1024 ? `${ram / 1024} GB` : `${ram} MB`;
      const base = Math.max(2000, Math.round((ram / 1024) * 3500));
      const price = Math.max(1000, Math.round(base * mult));
      store[dur].whatsapp.push({
        id: `wa-${dur}-t${tier}`,
        name: `WA Bot T${tier} (${ramLabel})`,
        price: `Rp ${price.toLocaleString('id-ID')}`,
        duration: durLabel,
        specs: `${ramLabel} RAM • ${Math.min(400, Math.round(40 + (ram / 1024) * 20))}% CPU • ${Math.max(1, Math.round((ram / 1024) * 2.5))}GB NVMe`,
        desc: 'Baileys Multi-Device Ready dengan auto QR di console browser.',
        badge: tier === 1 ? 'STARTER' : tier === 4 ? 'POPULAR' : `TIER ${tier}`,
      });
    });

    // TG (25)
    RAM_LIST.forEach((ram, idx) => {
      const tier = idx + 1;
      const ramLabel = ram >= 1024 ? `${ram / 1024} GB` : `${ram} MB`;
      const base = Math.max(2000, Math.round((ram / 1024) * 3000));
      const price = Math.max(1000, Math.round(base * mult));
      store[dur].telegram.push({
        id: `tg-${dur}-t${tier}`,
        name: `TG Bot T${tier} (${ramLabel})`,
        price: `Rp ${price.toLocaleString('id-ID')}`,
        duration: durLabel,
        specs: `${ramLabel} RAM • ${Math.min(400, Math.round(35 + (ram / 1024) * 20))}% CPU • ${Math.max(1, Math.round((ram / 1024) * 2.0))}GB NVMe`,
        desc: 'Python 3.11 & Node.js Telegraf dengan crash auto-restart.',
        badge: tier === 1 ? 'HEMAT' : tier === 4 ? 'FAVORIT' : `TIER ${tier}`,
      });
    });

    // MC (25)
    MC_RAM_LIST.forEach((ram, idx) => {
      const tier = idx + 1;
      const ramLabel = `${ram / 1024} GB`;
      const base = Math.max(5000, Math.round((ram / 1024) * 4500));
      const price = Math.max(2000, Math.round(base * mult));
      store[dur].minecraft.push({
        id: `mc-${dur}-t${tier}`,
        name: `Minecraft Java T${tier} (${ramLabel})`,
        price: `Rp ${price.toLocaleString('id-ID')}`,
        duration: durLabel,
        specs: `${ramLabel} RAM • ${Math.min(600, Math.round(80 + (ram / 1024) * 20))}% CPU • ${Math.max(5, Math.round((ram / 1024) * 4))}GB NVMe`,
        desc: 'Paper / Purpur TPS 20.0 dengan Java Selector & Anti-DDoS 100 Gbps.',
        badge: tier === 1 ? 'MABAR' : tier === 4 ? 'SURVIVAL PRO' : `TIER ${tier}`,
      });
    });

    // VPS (25)
    RAM_LIST.forEach((ram, idx) => {
      const tier = idx + 1;
      const ramLabel = ram >= 1024 ? `${ram / 1024} GB` : `${ram} MB`;
      const base = Math.max(3000, Math.round((ram / 1024) * 4000));
      const price = Math.max(1500, Math.round(base * mult));
      store[dur].vps.push({
        id: `vps-${dur}-t${tier}`,
        name: `Linux Container T${tier} (${ramLabel})`,
        price: `Rp ${price.toLocaleString('id-ID')}`,
        duration: durLabel,
        specs: `${ramLabel} RAM • ${Math.min(600, Math.round(60 + (ram / 1024) * 25))}% CPU • ${Math.max(3, Math.round((ram / 1024) * 5))}GB NVMe`,
        desc: 'Custom Docker Container VPS dengan alokasi port mandiri.',
        badge: tier === 1 ? 'MICRO' : tier === 4 ? 'DEVELOPER' : `TIER ${tier}`,
      });
    });
  });

  return store;
}

const STORE_DATA = generateCatalog();
let currentDuration = '30d';
let currentCategory = 'whatsapp';

function renderProducts() {
  const list = STORE_DATA[currentDuration]?.[currentCategory] || [];
  const container = document.getElementById('products-list');

  container.innerHTML = list
    .map(
      p => `
    <div class="glass-card p-4 rounded-2xl space-y-3 hover:border-slate-700 transition-all">
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-white text-sm">${p.name}</h3>
            <span class="text-[9px] font-black px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">${p.badge}</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5">${p.specs}</p>
        </div>
        <div class="text-right">
          <div class="text-xs font-black text-emerald-400">${p.price}</div>
          <span class="text-[10px] text-slate-500">/${p.duration}</span>
        </div>
      </div>
      <p class="text-xs text-slate-300 italic bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">"${p.desc}"</p>
      <a href="https://rullzyestorepremium.my.id/checkout?plan=${p.id}" target="_blank" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md">
        <i data-lucide="zap" class="w-3.5 h-3.5"></i>
        Pesan & Bayar QRIS Instan (${p.duration})
      </a>
    </div>
  `
    )
    .join('');

  lucide.createIcons();
}

function switchDuration(dur) {
  currentDuration = dur;
  ['7d', '14d', '30d'].forEach(d => {
    const btn = document.getElementById(`dur-${d}`);
    if (btn) {
      if (d === dur) {
        btn.className = 'flex-1 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md transition-all';
      } else {
        btn.className = 'flex-1 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold text-xs transition-all';
      }
    }
  });
  renderProducts();
}

function switchTab(cat) {
  currentCategory = cat;
  ['whatsapp', 'telegram', 'minecraft', 'vps'].forEach(c => {
    const btn = document.getElementById(`tab-${c}`);
    if (btn) {
      if (c === cat) {
        btn.className = 'px-4 py-2 rounded-xl bg-brand-500 text-slate-950 font-bold whitespace-nowrap shadow-md transition-all';
      } else {
        btn.className = 'px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold whitespace-nowrap transition-all';
      }
    }
  });
  renderProducts();
}

function applyCoupon() {
  const code = (document.getElementById('coupon-input').value || '').trim().toUpperCase();
  const res = document.getElementById('coupon-result');
  res.classList.remove('hidden');

  if (code === 'WELCOME10') {
    res.className = 'text-xs font-bold text-emerald-400';
    res.innerText = '✅ Kupon WELCOME10 Aktif! Diskon 10% di checkout.';
  } else if (code === 'DISKON20') {
    res.className = 'text-xs font-bold text-emerald-400';
    res.innerText = '✅ Kupon DISKON20 Aktif! Diskon 20% di checkout.';
  } else if (code === 'MC50') {
    res.className = 'text-xs font-bold text-emerald-400';
    res.innerText = '✅ Kupon MC50 Aktif! Diskon 25% khusus paket Minecraft.';
  } else {
    res.className = 'text-xs font-bold text-rose-400';
    res.innerText = '❌ Kode voucher tidak ditemukan atau telah kedaluwarsa.';
  }
}

// Initial Render
renderProducts();

// Jitter latency slightly for dynamic visual
setInterval(() => {
  const ping = Math.floor(Math.random() * 8) + 14;
  const el = document.getElementById('latency-val');
  if (el) el.innerText = `${ping} ms`;
}, 3000);
