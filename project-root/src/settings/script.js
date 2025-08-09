(function(){
  const SETTINGS_KEY = 'hb.settings';
  function getSettings(){ try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; } }
  function saveSettings(s){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

  const form = document.getElementById('settingsForm');
  const playerName = document.getElementById('playerName');
  const serverUrl = document.getElementById('serverUrl');
  const syncEnabled = document.getElementById('syncEnabled');
  const animationsEnabled = document.getElementById('animationsEnabled');
  const syncNow = document.getElementById('syncNow');

  const s = getSettings();
  playerName.value = s.playerName || '';
  serverUrl.value = s.serverUrl || '';
  syncEnabled.checked = !!s.syncEnabled;
  animationsEnabled.checked = window.HBAnimations ? window.HBAnimations.isEnabled() : true;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const next = {
      playerName: playerName.value.trim() || 'Player',
      serverUrl: serverUrl.value.trim() || 'http://localhost:4000',
      syncEnabled: !!syncEnabled.checked
    };
    saveSettings(next);
    if (window.HBAnimations) {
      if (animationsEnabled.checked) window.HBAnimations.enable(); else window.HBAnimations.disable();
    }
    alert('Settings saved');
  });

  syncNow.addEventListener('click', async () => {
    try {
      const res = await window.HBApi.syncQueue();
      alert(res.ok ? `Synced ${res.synced||0} items` : `Sync error: ${res.reason}`);
    } catch (e) {
      alert('Sync failed');
    }
  });
})();