/**
 * db.js — Firebase Realtime Database 抽象层
 * 未配置时自动降级为 localStorage（本地测试）
 *
 * 数据结构：
 * votes/          { styleId: count }
 * devices/        { fingerprint: { liked, firstVisit, lastVisit, ... } }
 * interactions/   { fingerprint/ts: { action, styleId, ts } }
 * stats/          { totalVisitors: N }
 */

let _db = null;
let _firebaseReady = false;

function _isConfigured() {
  return (
    typeof FIREBASE_CONFIG !== 'undefined' &&
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY' &&
    FIREBASE_CONFIG.databaseURL &&
    !FIREBASE_CONFIG.databaseURL.includes('YOUR_PROJECT_ID')
  );
}

function initFirebase() {
  if (!_isConfigured()) {
    console.info('[DB] Firebase 未配置，使用本地存储');
    return;
  }
  try {
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    _db = firebase.database();
    _firebaseReady = true;
    console.info('[DB] Firebase 连接成功');
  } catch (e) {
    console.warn('[DB] Firebase 初始化失败:', e);
  }
}

function isFirebaseReady() { return _firebaseReady; }

// ─── 票数 ────────────────────────────────────────────────────

async function syncVotesFromRemote() {
  if (!_firebaseReady) return;
  try {
    const snap = await _db.ref('votes').once('value');
    localStorage.setItem(ALL_VOTES_KEY, JSON.stringify(snap.val() || {}));
  } catch (e) {
    console.warn('[DB] 票数同步失败:', e);
  }
}

function watchVotes(callback) {
  if (!_firebaseReady) return;
  _db.ref('votes').on('value', snap => {
    const votes = snap.val() || {};
    localStorage.setItem(ALL_VOTES_KEY, JSON.stringify(votes));
    callback(votes);
  });
}

async function pushVoteDelta(styleId, delta) {
  if (!_firebaseReady) return;
  try {
    await _db.ref(`votes/${styleId}`).transaction(cur => Math.max(0, (cur || 0) + delta));
  } catch (e) {
    console.warn('[DB] 投票写入失败:', e);
  }
}

// ─── 点赞状态同步（Firebase 权威）────────────────────────────
// 有记录 → 恢复该设备历史点赞；无记录 → 清空本地，显示全部未点赞

async function syncLikedFromRemote(deviceId) {
  if (!_firebaseReady) return;
  try {
    const snap = await _db.ref(`devices/${deviceId}/liked`).once('value');
    const liked = (snap.exists() && Array.isArray(snap.val())) ? snap.val() : [];
    localStorage.setItem(LIKED_STYLES_KEY, JSON.stringify(liked));
  } catch (e) {
    console.warn('[DB] 点赞状态同步失败:', e);
  }
}

// ─── 设备访问记录 ─────────────────────────────────────────────

async function recordDeviceVisit(deviceId) {
  if (!_firebaseReady) return;
  try {
    const ref = _db.ref(`devices/${deviceId}`);
    let isNewDevice = false;

    // 用事务原子写入，避免同一设备多个浏览器同时打开时重复计数
    await ref.transaction(current => {
      if (current === null) {
        isNewDevice = true;
        return {
          firstVisit: Date.now(),
          lastVisit:  Date.now(),
          userAgent:  navigator.userAgent.slice(0, 200),
          liked:      [],
        };
      }
      // 已存在：只更新 lastVisit
      return { ...current, lastVisit: Date.now() };
    });

    if (isNewDevice) {
      await _db.ref('stats/totalVisitors').transaction(n => (n || 0) + 1);
    }
  } catch (e) {
    console.warn('[DB] 访问记录失败:', e);
  }
}

async function syncDeviceLikes(deviceId, likedStyles) {
  if (!_firebaseReady) return;
  try {
    await _db.ref(`devices/${deviceId}`).update({
      liked:    likedStyles,
      lastVote: firebase.database.ServerValue.TIMESTAMP,
    });
  } catch (e) {
    console.warn('[DB] 点赞记录失败:', e);
  }
}

// ─── 交互日志 ─────────────────────────────────────────────────

function logInteraction(deviceId, action, styleId) {
  if (!_firebaseReady) return;
  _db.ref(`interactions/${deviceId}/${Date.now()}`).set({
    action, styleId,
    ts: firebase.database.ServerValue.TIMESTAMP,
  }).catch(() => {});
}

// ─── 统计 ─────────────────────────────────────────────────────

async function fetchTotalVisitors() {
  if (!_firebaseReady) {
    return JSON.parse(localStorage.getItem(DEVICE_REGISTRY_KEY) || '[]').length;
  }
  try {
    const snap = await _db.ref('stats/totalVisitors').once('value');
    return snap.val() || 0;
  } catch (e) { return 0; }
}

// ─── 全量重置（管理员用）──────────────────────────────────────

async function resetAllData() {
  // 清 Firebase
  if (_firebaseReady) {
    await _db.ref('/').set({
      votes:        {},
      devices:      {},
      interactions: {},
      stats:        { totalVisitors: 0 },
    });
  }
  // 清本地缓存
  localStorage.setItem(LIKED_STYLES_KEY, JSON.stringify([]));
  localStorage.setItem(ALL_VOTES_KEY,    JSON.stringify({}));
}
