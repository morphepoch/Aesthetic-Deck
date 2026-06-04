function buildResultsGrid() {
  const votes  = getAllVotes();
  const liked  = getLikedStyles();
  const medals = ['🥇', '🥈', '🥉'];

  const sorted = [...STYLE_MAPPING].sort((a, b) =>
    (votes[b.id] || 0) - (votes[a.id] || 0)
  );

  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '';

  sorted.forEach((style, index) => {
    const count  = votes[style.id] || 0;
    const myLike = liked.includes(style.id);
    const rank   = (index < 3 && count > 0) ? `<span class="rank">${medals[index]}</span>` : '';

    const card = document.createElement('div');
    card.className = 'result-card' + (count === 0 ? ' zero-votes' : '');

    card.innerHTML = `
      <div class="iframe-thumb-wrapper">
        ${rank}
        <iframe
          class="card-iframe-thumb"
          src="ppt-styles/${style.id}.html"
          sandbox="allow-scripts allow-same-origin"
          scrolling="no"
          tabindex="-1"
          loading="lazy"
          title="${style.name} 预览"
        ></iframe>
      </div>
      <div class="card-footer">
        <div class="card-name">${style.name}</div>
        <div class="card-meta">
          <span class="vote-count">
            <span class="heart">${myLike ? '❤️' : '🤍'}</span>
            <span class="count-num">${count}</span>
          </span>
          <span class="card-hint">点击预览 →</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `index.html?style=${style.id}`;
    });

    grid.appendChild(card);
  });

  requestAnimationFrame(applyThumbScales);
}

function applyThumbScales() {
  document.querySelectorAll('.iframe-thumb-wrapper').forEach(wrapper => {
    const iframe = wrapper.querySelector('.card-iframe-thumb');
    if (!iframe) return;
    const scale = wrapper.offsetWidth / 1280;
    iframe.style.transform = `scale(${scale})`;
    wrapper.style.height = (720 * scale) + 'px';
  });
}

async function updateStats() {
  const votes      = getAllVotes();
  const total      = getTotalVotes();
  const active     = Object.values(votes).filter(v => v > 0).length;
  const visitors   = await fetchTotalVisitors();

  document.getElementById('totalVotes').textContent       = total;
  document.getElementById('totalParticipants').textContent = visitors;
  document.getElementById('activeStyles').textContent     = active;
}

function exportCSV() {
  const votes  = getAllVotes();
  const sorted = [...STYLE_MAPPING].sort((a, b) =>
    (votes[b.id] || 0) - (votes[a.id] || 0)
  );
  const rows = [
    ['排名', '中文名称', '英文ID', '票数'],
    ...sorted.map((s, i) => [i + 1, s.name, s.id, votes[s.id] || 0]),
  ];
  const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `ppt投票结果_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', async () => {
  await initStorage();
  await updateStats();
  buildResultsGrid();
  window.addEventListener('resize', applyThumbScales);
  document.getElementById('exportBtn').addEventListener('click', exportCSV);

  // 实时监听 Firebase 票数变化，自动刷新
  watchVotes(() => {
    buildResultsGrid();
    updateStats();
  });
});
