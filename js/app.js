let currentStyleId = null;
let currentIndex   = -1;
let filteredStyles = [...STYLE_MAPPING];
let isAdminMode    = false;
let adminClickCount = 0;
let adminClickTimer = null;

// ─── Sidebar ───────────────────────────────────────────────

function buildSidebar(styles) {
  const list  = document.getElementById('styleList');
  const empty = document.getElementById('sidebarEmpty');
  list.innerHTML = '';

  if (styles.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  styles.forEach(style => {
    const item = document.createElement('li');
    item.className = 'style-item';
    item.dataset.styleId = style.id;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'style-item-name';
    nameSpan.textContent = style.name;
    item.appendChild(nameSpan);

    if (isLiked(style.id)) {
      const mark = document.createElement('span');
      mark.className = 'style-item-liked';
      mark.textContent = '❤️';
      item.appendChild(mark);
    }

    if (isAdminMode) {
      const cnt = document.createElement('span');
      cnt.className = 'style-item-admin-count';
      cnt.textContent = getVoteCount(style.id) + '票';
      item.appendChild(cnt);
    }

    item.addEventListener('click', () => {
      currentIndex = filteredStyles.findIndex(s => s.id === style.id);
      selectStyle(style.id, style.name);
    });

    if (style.id === currentStyleId) item.classList.add('active');
    list.appendChild(item);
  });
}

function refreshSidebar() { buildSidebar(filteredStyles); }

// ─── Style Selection ───────────────────────────────────────

function selectStyle(styleId, styleName) {
  currentStyleId = styleId;

  document.querySelectorAll('.style-item').forEach(el => el.classList.remove('active'));
  const active = document.querySelector(`[data-style-id="${styleId}"]`);
  if (active) {
    active.classList.add('active');
    active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  loadIframe(`ppt-styles/${styleId}.html`);

  document.getElementById('currentStyleName').textContent = styleName;
  document.getElementById('voteArea').style.display = 'flex';

  if (isAdminMode) {
    const el = document.getElementById('adminVoteCount');
    el.style.display = 'inline';
    el.textContent = `❤️ ${getVoteCount(styleId)} 票`;
  }

  updateLikeButton(styleId);
  logInteraction(getDeviceId(), 'preview', styleId);
}

function loadIframe(src) {
  const iframe      = document.getElementById('previewFrame');
  const loader      = document.getElementById('iframeLoader');
  const placeholder = document.getElementById('previewPlaceholder');

  if (placeholder) placeholder.style.display = 'none';
  iframe.style.display = 'block';
  iframe.classList.remove('loaded');
  loader.style.display = 'flex';

  iframe.onload = () => {
    loader.style.display = 'none';
    iframe.classList.add('loaded');
  };
  iframe.src = src;
}

// ─── Like Button ───────────────────────────────────────────

function updateLikeButton(styleId) {
  const btn   = document.getElementById('likeBtn');
  const liked = isLiked(styleId);
  btn.classList.toggle('liked', liked);
  btn.querySelector('.heart-icon').textContent = liked ? '❤️' : '🤍';
  btn.querySelector('.btn-text').textContent   = liked ? '已点赞' : '点赞';
}

function handleLikeClick() {
  if (!currentStyleId) return;
  const nowLiked = toggleLike(currentStyleId);
  updateLikeButton(currentStyleId);
  refreshSidebar();

  const name = document.getElementById('currentStyleName').textContent;
  showToast(nowLiked ? `已点赞「${name}」` : `已取消「${name}」的点赞`);

  const btn = document.getElementById('likeBtn');
  btn.classList.add('pulse');
  setTimeout(() => btn.classList.remove('pulse'), 400);

  if (isAdminMode) {
    document.getElementById('adminVoteCount').textContent =
      `❤️ ${getVoteCount(currentStyleId)} 票`;
  }
}

// ─── Keyboard ──────────────────────────────────────────────
// ↑↓        → 切换风格（侧边栏）
// ←→ Space  → 转发给 iframe（PPT 翻页）
// Enter     → 点赞 / 取消

function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (document.activeElement.tagName === 'INPUT') return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        navigateSidebar(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        navigateSidebar(1);
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
      case ' ':
        if (currentStyleId) {
          e.preventDefault();
          forwardKeyToIframe(e.key);
        }
        break;
      case 'Enter':
        if (currentStyleId) {
          e.preventDefault();
          handleLikeClick();
        }
        break;
    }
  });
}

// 将按键事件派发给 iframe 内部（同源）
function forwardKeyToIframe(key) {
  const iframe = document.getElementById('previewFrame');
  if (!iframe || iframe.style.display === 'none') return;
  try {
    const opts = { key, bubbles: true, cancelable: true };
    const win  = iframe.contentWindow;
    const doc  = win.document;
    doc.dispatchEvent(new KeyboardEvent('keydown', opts));
    doc.dispatchEvent(new KeyboardEvent('keyup',   opts));
    win.dispatchEvent(new KeyboardEvent('keydown', opts));
    win.dispatchEvent(new KeyboardEvent('keyup',   opts));
  } catch (e) { /* cross-origin 保护 */ }
}

function navigateSidebar(delta) {
  if (filteredStyles.length === 0) return;
  if (currentIndex === -1) {
    currentIndex = delta === 1 ? 0 : filteredStyles.length - 1;
  } else {
    currentIndex = (currentIndex + delta + filteredStyles.length) % filteredStyles.length;
  }
  const style = filteredStyles[currentIndex];
  selectStyle(style.id, style.name);
}

// ─── Search / Filter ───────────────────────────────────────

function initSearch() {
  const input    = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');

  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearBtn.style.display = q ? 'block' : 'none';
    filteredStyles = q
      ? STYLE_MAPPING.filter(s => s.name.includes(q) || s.id.toLowerCase().includes(q.toLowerCase()))
      : [...STYLE_MAPPING];
    currentIndex = filteredStyles.findIndex(s => s.id === currentStyleId);
    buildSidebar(filteredStyles);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    filteredStyles = [...STYLE_MAPPING];
    currentIndex = filteredStyles.findIndex(s => s.id === currentStyleId);
    buildSidebar(filteredStyles);
    input.focus();
  });
}

// ─── Admin Mode（连击标题3次）──────────────────────────────

function initAdminMode() {
  const title = document.querySelector('.topbar-title');

  title.addEventListener('click', () => {
    adminClickCount++;
    clearTimeout(adminClickTimer);
    adminClickTimer = setTimeout(() => { adminClickCount = 0; }, 600);

    if (adminClickCount >= 3) {
      adminClickCount = 0;
      isAdminMode = !isAdminMode;

      document.getElementById('adminBadge').style.display = isAdminMode ? 'inline' : 'none';

      const el = document.getElementById('adminVoteCount');
      if (isAdminMode && currentStyleId) {
        el.style.display = 'inline';
        el.textContent = `❤️ ${getVoteCount(currentStyleId)} 票`;
      } else {
        el.style.display = 'none';
      }

      refreshSidebar();
      showToast(isAdminMode ? '🔓 管理员模式已开启' : '🔒 管理员模式已关闭');
    }
  });
}

// ─── Toast ─────────────────────────────────────────────────

function showToast(message) {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  });
}

// ─── URL Param ─────────────────────────────────────────────

function handleURLParam() {
  const targetId = new URLSearchParams(location.search).get('style');
  if (!targetId) return;
  const style = STYLE_MAPPING.find(s => s.id === targetId);
  if (!style) return;
  currentIndex = filteredStyles.findIndex(s => s.id === targetId);
  setTimeout(() => selectStyle(style.id, style.name), 80);
}

// ─── Init ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  await initStorage();
  buildSidebar(filteredStyles);
  initSearch();
  initKeyboard();
  initAdminMode();
  handleURLParam();
  document.getElementById('likeBtn').addEventListener('click', handleLikeClick);
  document.getElementById('styleCount').textContent = STYLE_MAPPING.length;
});
