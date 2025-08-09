(function(){
  const GAME_KEY = 'catch-the-hearts';
  const HIGH_KEY = `hb.${GAME_KEY}.highscores`;
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestLocalEl = document.getElementById('bestLocal');
  const submitBtn = document.getElementById('submitBtn');
  const globalList = document.getElementById('globalList');
  const recentList = document.getElementById('recentList');

  // Game state
  let width = canvas.width; let height = canvas.height;
  let basket = { x: width/2 - 30, y: height - 30, w: 60, h: 12 };
  let hearts = [];
  let score = 0; let best = 0; let running = true;

  function resize(){
    // Keep internal resolution fixed for simplicity, CSS scales it
  }
  window.addEventListener('resize', resize);

  function spawnHeart(){
    const x = Math.random() * (width - 12) + 6;
    hearts.push({ x, y: -10, vy: 1.5 + Math.random()*1.5, r: 6 });
  }

  function drawHeart(x, y, r){
    ctx.save();
    ctx.translate(x, y); ctx.scale(r/6, r/6);
    ctx.fillStyle = '#ff8fb1';
    ctx.beginPath(); ctx.moveTo(0, 3);
    ctx.bezierCurveTo(0, -1, -4, -1, -4, 2);
    ctx.bezierCurveTo(-4, 5, 0, 8, 0, 10);
    ctx.bezierCurveTo(0, 8, 4, 5, 4, 2);
    ctx.bezierCurveTo(4, -1, 0, -1, 0, 3);
    ctx.fill();
    ctx.restore();
  }

  function update(){
    if (Math.random() < 0.03) spawnHeart();
    hearts.forEach(h => { h.y += h.vy; });
    // Collision
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      if (h.y > height + 20) { hearts.splice(i,1); continue; }
      if (h.y + h.r > basket.y && h.x > basket.x && h.x < basket.x + basket.w) {
        hearts.splice(i,1); score += 1; scoreEl.textContent = String(score);
      }
    }
  }
  function render(){
    ctx.clearRect(0,0,width,height);
    // Basket
    ctx.fillStyle = '#cdb4db'; ctx.fillRect(basket.x, basket.y, basket.w, basket.h);
    // Hearts
    hearts.forEach(h => drawHeart(h.x, h.y, h.r));
  }
  function loop(){ if (!running) return; update(); render(); requestAnimationFrame(loop); }

  // Controls
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left; basket.x = Math.max(0, Math.min(width - basket.w, (mx / rect.width) * width - basket.w/2));
  });
  window.addEventListener('keydown', (e) => {
    const step = 15;
    if (e.key === 'ArrowLeft') basket.x = Math.max(0, basket.x - step);
    if (e.key === 'ArrowRight') basket.x = Math.min(width - basket.w, basket.x + step);
  });

  // Highscore local
  function getLocalHighscores(){ try { return JSON.parse(localStorage.getItem(HIGH_KEY)) || []; } catch { return []; } }
  function saveLocalHighscore(name, s){ const hs = getLocalHighscores(); hs.push({ playerName: name, score: s, at: Date.now() }); hs.sort((a,b)=>b.score-a.score); localStorage.setItem(HIGH_KEY, JSON.stringify(hs.slice(0,20))); }
  function updateBest(){ const hs = getLocalHighscores(); best = hs[0]?.score || 0; bestLocalEl.textContent = String(best); }

  // Submit
  submitBtn.addEventListener('click', async () => {
    const name = (window.HBApi && HBApi.getPlayerName()) || 'Player';
    try {
      await HBApi.submitScore({ playerName: name, score, game: GAME_KEY, meta: { caught: score } });
      alert('Score submitted!');
      fetchLeaderboards();
    } catch (e) {
      alert('Saved locally; will sync when online.');
    }
    saveLocalHighscore(name, score); updateBest();
  });

  async function fetchLeaderboards(){
    if (!window.HBApi) return;
    const data = await HBApi.getLeaderboard(GAME_KEY, 10);
    globalList.innerHTML = '';
    data.forEach((row, idx) => {
      const li = document.createElement('li');
      li.textContent = `#${idx+1} ${row.player_name||row.playerName||'Player'} — ${row.score}`;
      globalList.appendChild(li);
    });
    // Recent list uses same endpoint or leave empty when offline
    recentList.innerHTML = data.slice(0,5).map((row)=>`<li>${row.player_name||row.playerName||'Player'} — ${row.score}</li>`).join('');
  }

  if (window.HBApi) {
    HBApi.onLeaderboardUpdate((payload) => {
      if (payload.game === GAME_KEY) fetchLeaderboards();
    });
  }

  updateBest(); loop(); fetchLeaderboards();
})();