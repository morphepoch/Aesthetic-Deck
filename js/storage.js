const LIKED_STYLES_KEY    = 'user_liked_styles';
const ALL_VOTES_KEY       = 'all_votes';
const DEVICE_REGISTRY_KEY = 'voter_devices';

// ─── 设备指纹（跨浏览器一致）────────────────────────────────
// 用硬件特征生成确定性 ID，同一台物理设备无论用哪个浏览器都得到相同值

function generateDeviceFingerprint() {
  // 只用各浏览器都稳定一致的硬件信号，排除 deviceMemory / availSize / maxTouchPoints
  const signals = [
    navigator.platform || '',              // MacIntel / Win32 等，跨浏览器一致
    String(navigator.hardwareConcurrency || ''), // CPU 逻辑核数，跨浏览器一致
    screen.width + 'x' + screen.height,   // 物理屏幕分辨率，跨浏览器一致
    String(screen.colorDepth),            // 色深，跨浏览器一致
    String(window.devicePixelRatio || 1), // 像素比，跨浏览器一致
    Intl.DateTimeFormat().resolvedOptions().timeZone || '', // 时区，跨浏览器一致
    navigator.language || '',             // 系统语言，跨浏览器一致
  ].join('||');

  // FNV-1a 32-bit hash
  let hash = 0x811c9dc5;
  for (let i = 0; i < signals.length; i++) {
    hash ^= signals.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return 'fp_' + hash.toString(36);
}

function getDeviceId() {
  // 每次实时计算指纹（无需存 localStorage，确保跨浏览器一致）
  return generateDeviceFingerprint();
}

function registerDevice(deviceId) {
  const devices = JSON.parse(localStorage.getItem(DEVICE_REGISTRY_KEY) || '[]');
  if (!devices.includes(deviceId)) {
    devices.push(deviceId);
    localStorage.setItem(DEVICE_REGISTRY_KEY, JSON.stringify(devices));
  }
}

// ─── 点赞状态（以 Firebase 为权威，localStorage 为缓存）───────

function getLikedStyles() {
  return JSON.parse(localStorage.getItem(LIKED_STYLES_KEY) || '[]');
}

function isLiked(styleId) {
  return getLikedStyles().includes(styleId);
}

// ─── 票数（Firebase 同步后缓存到 localStorage）────────────────

function getAllVotes() {
  return JSON.parse(localStorage.getItem(ALL_VOTES_KEY) || '{}');
}

function getVoteCount(styleId) {
  return getAllVotes()[styleId] || 0;
}

function getTotalVotes() {
  return Object.values(getAllVotes()).reduce((s, v) => s + v, 0);
}

// ─── 点赞 / 取消点赞 ─────────────────────────────────────────

function toggleLike(styleId) {
  const liked    = getLikedStyles();
  const votes    = getAllVotes();
  const deviceId = getDeviceId();

  if (liked.includes(styleId)) {
    const newLiked = liked.filter(id => id !== styleId);
    localStorage.setItem(LIKED_STYLES_KEY, JSON.stringify(newLiked));
    votes[styleId] = Math.max(0, (votes[styleId] || 0) - 1);
    localStorage.setItem(ALL_VOTES_KEY, JSON.stringify(votes));
    pushVoteDelta(styleId, -1);
    syncDeviceLikes(deviceId, newLiked);
    logInteraction(deviceId, 'unlike', styleId);
    return false;
  } else {
    liked.push(styleId);
    localStorage.setItem(LIKED_STYLES_KEY, JSON.stringify(liked));
    votes[styleId] = (votes[styleId] || 0) + 1;
    localStorage.setItem(ALL_VOTES_KEY, JSON.stringify(votes));
    pushVoteDelta(styleId, 1);
    syncDeviceLikes(deviceId, liked);
    logInteraction(deviceId, 'like', styleId);
    return true;
  }
}

// ─── 初始化 ──────────────────────────────────────────────────

async function initStorage() {
  const deviceId = getDeviceId();
  registerDevice(deviceId);
  initFirebase();
  await Promise.all([
    syncVotesFromRemote(),
    syncLikedFromRemote(deviceId), // Firebase 为权威：有记录则恢复，无记录则全部未点赞
    recordDeviceVisit(deviceId),
  ]);
}
