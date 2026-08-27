async function loadDashboard() {
  try {
    const [statsRes, commRes, bcRes] = await Promise.all([
      fetch('/api/stats'),
      fetch('/api/communities'),
      fetch('/api/broadcasts'),
    ]);

    const statsData = await statsRes.json();
    const commData = await commRes.json();
    const bcData = await bcRes.json();

    if (statsData.success) {
      const s = statsData.stats;
      document.getElementById('stat-communities').innerText = `${s.totalCommunities} (${s.groupsCount} G / ${s.channelsCount} C)`;
      document.getElementById('stat-members').innerText = s.totalMembers.toLocaleString('id-ID');
      document.getElementById('stat-rate').innerText = `${s.successRate}%`;
      document.getElementById('stat-scheduler').innerText = s.isAutoBroadcast ? 'RUNNING 🟢' : 'PAUSED ⏸️';
    }

    if (commData.success) {
      const container = document.getElementById('communities-list');
      container.innerHTML = commData.data.map(c => `
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
          <div>
            <div class="font-bold text-white">${c.type === 'group' ? '👥' : '📣'} ${c.name}</div>
            <div class="text-[11px] text-slate-400">🏷️ ${c.category} • 👥 ${c.member_count} Member</div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">AKTIF</span>
        </div>
      `).join('');
    }

    if (bcData.success) {
      const container = document.getElementById('broadcasts-list');
      container.innerHTML = bcData.data.slice(0, 8).map(b => `
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
          <div>
            <div class="font-bold text-slate-200">#${b.id} ${b.title || 'Broadcast'}</div>
            <div class="text-[11px] text-slate-400 font-sans">Sukses: <strong class="text-emerald-400">${b.success_count}</strong> / Gagal: <strong class="text-rose-400">${b.failed_count}</strong></div>
          </div>
          <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded ${b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}">${b.status}</span>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Failed to load dashboard:', err);
  }
}

// Generate AI button
document.getElementById('btn-generate-ai')?.addEventListener('click', async () => {
  const topic = document.getElementById('bc-topic').value || 'Update Server Komunitas';
  const tone = document.getElementById('bc-tone').value || 'friendly';
  const btn = document.getElementById('btn-generate-ai');
  btn.innerText = '⏳ AI Sedang Menulis...';

  try {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, tone, language: 'Indonesia' }),
    });
    const json = await res.json();
    if (json.success) {
      document.getElementById('bc-content').value = json.data.content;
    }
  } catch (err) {
    alert('Gagal menghubungi AI Provider');
  } finally {
    btn.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4 inline mr-1"></i> 1. Generate Konten dengan AI';
    lucide.createIcons();
  }
});

// Submit Broadcast form
document.getElementById('broadcast-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const topic = document.getElementById('bc-topic').value;
  const targetType = document.getElementById('bc-target').value;
  const content = document.getElementById('bc-content').value;
  const btn = document.getElementById('btn-submit-bc');

  btn.innerText = 'Mengirim ke BullMQ Queue...';
  try {
    const res = await fetch('/api/broadcasts/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: topic, targetType, content }),
    });
    const json = await res.json();
    if (json.success) {
      alert(`Broadcast #${json.data.id} berhasil dijadwalkan ke queue!`);
      document.getElementById('bc-content').value = '';
      document.getElementById('bc-topic').value = '';
      loadDashboard();
    }
  } catch {
    alert('Terjadi kesalahan jaringan');
  } finally {
    btn.innerHTML = '<i data-lucide="send" class="w-4 h-4 inline mr-1"></i> 2. Kirim ke BullMQ Queue';
    lucide.createIcons();
  }
});

// Initial Load & polling
loadDashboard();
setInterval(loadDashboard, 15000);
