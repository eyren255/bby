// Client API helper for optional server sync and realtime leaderboard
// - submitScore({ playerName, score, game, meta })
// - getLeaderboard(game, limit)
// - syncQueue()
// - onLeaderboardUpdate(cb)
// Uses localStorage queue when offline. Server URL and sync toggle come from Settings.
(function(){
  const STORAGE_PREFIX = 'hb';
  const QUEUE_KEY = `${STORAGE_PREFIX}.queue`;
  const SETTINGS_KEY = `${STORAGE_PREFIX}.settings`;

  function getSettings(){
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; }
  }
  function getServerUrl(){
    const s = getSettings();
    return s.serverUrl || 'http://localhost:4000';
  }
  function isSyncEnabled(){
    const s = getSettings();
    return !!s.syncEnabled;
  }
  function getPlayerName(){
    const s = getSettings();
    return s.playerName || 'Player';
  }
  function readQueue(){
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; } catch { return []; }
  }
  function writeQueue(items){ localStorage.setItem(QUEUE_KEY, JSON.stringify(items)); }

  async function submitScore({ playerName, score, game, meta }){
    const body = { playerName: playerName || getPlayerName(), score, game, meta: meta || {} };
    if (!isSyncEnabled()) {
      queueItem(body);
      throw new Error('Sync disabled. Score queued locally.');
    }
    try {
      const res = await fetch(`${getServerUrl()}/api/v1/scores`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.saved || data;
    } catch (err) {
      queueItem(body);
      throw new Error('Network error. Score queued locally.');
    }
  }

  function queueItem(item){
    const q = readQueue();
    q.push({ ...item, queuedAt: Date.now() });
    writeQueue(q);
    updateSyncBadge('pending');
  }

  async function syncQueue(){
    const q = readQueue();
    if (!q.length) return { ok: true, synced: 0 };
    if (!isSyncEnabled()) return { ok: false, reason: 'disabled' };
    try {
      const res = await fetch(`${getServerUrl()}/api/v1/sync`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: q })
      });
      if (!res.ok) throw new Error('sync failed');
      writeQueue([]);
      updateSyncBadge('online');
      return { ok: true, synced: q.length };
    } catch (e) {
      updateSyncBadge('pending');
      return { ok: false, reason: 'network' };
    }
  }

  async function getLeaderboard(game, limit){
    try {
      const res = await fetch(`${getServerUrl()}/api/v1/leaderboard?game=${encodeURIComponent(game)}&limit=${limit||10}`);
      if (!res.ok) throw new Error('HTTP '+res.status);
      return await res.json();
    } catch (e) {
      // Fallback to local highscores
      const key = `${STORAGE_PREFIX}.${game}.highscores`;
      try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
    }
  }

  // Socket subscription
  let socket = null;
  function connectSocket(){
    try {
      if (typeof io === 'undefined') return null;
      socket = io(getServerUrl(), { transports: ['websocket','polling'], timeout: 5000 });
      socket.on('connect', () => updateOnlineBadge(true));
      socket.on('disconnect', () => updateOnlineBadge(navigator.onLine));
      socket.on('leaderboard:update', (payload) => {
        window.dispatchEvent(new CustomEvent('hb.leaderboard.update', { detail: payload }));
      });
      return socket;
    } catch { return null; }
  }

  function onLeaderboardUpdate(cb){
    window.addEventListener('hb.leaderboard.update', (e) => cb(e.detail));
    if (!socket) connectSocket();
  }

  function updateOnlineBadge(isOnline){
    const el = document.getElementById('onlineStatus');
    if (!el) return;
    el.textContent = isOnline ? 'Online' : 'Offline';
    el.classList.toggle('online', !!isOnline);
    el.classList.toggle('offline', !isOnline);
  }
  function updateSyncBadge(state){
    const el = document.getElementById('syncStatus');
    if (!el) return;
    const mapping = { online: 'Sync: on', pending: 'Sync: pending', off: 'Sync: off' };
    el.textContent = mapping[state] || 'Sync: off';
    el.className = 'badge ' + (state === 'pending' ? 'pending' : (state === 'online' ? 'online' : ''));
  }

  // Periodic retry and online event
  setInterval(syncQueue, 30000);
  window.addEventListener('online', () => { updateOnlineBadge(true); syncQueue(); });
  window.addEventListener('offline', () => updateOnlineBadge(false));

  // Initial badges
  updateOnlineBadge(navigator.onLine);
  updateSyncBadge(isSyncEnabled() ? 'online' : 'off');

  window.HBApi = { submitScore, getLeaderboard, syncQueue, onLeaderboardUpdate, getSettings, isSyncEnabled, getPlayerName, getServerUrl };
})();