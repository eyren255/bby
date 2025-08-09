(function(){
  const GAME_KEY = 'memory-match';
  const HIGH_KEY = `hb.${GAME_KEY}.highscores`; // store best (minimum) moves
  const grid = document.getElementById('grid');
  const movesEl = document.getElementById('moves');
  const bestLocalEl = document.getElementById('bestLocal');
  const submitBtn = document.getElementById('submitBtn');
  const globalList = document.getElementById('globalList');

  const icons = ['💗','⭐','🌸','🍓','🧸','🎀','🌈','🍰'];
  let deck = shuffle([...icons, ...icons]);
  let first = null, second = null, lock = false, matches = 0, moves = 0;

  function render(){
    grid.innerHTML = '';
    deck.forEach((icon, idx) => {
      const cell = document.createElement('button');
      cell.className = 'card-tile';
      cell.setAttribute('role','gridcell');
      cell.setAttribute('aria-label','card');
      cell.dataset.idx = String(idx);
      cell.textContent = '❔';
      cell.addEventListener('click', onFlip);
      grid.appendChild(cell);
    });
  }

  function onFlip(e){
    if (lock) return;
    const idx = Number(e.currentTarget.dataset.idx);
    const btn = e.currentTarget;
    if (btn.classList.contains('revealed')) return;
    reveal(btn, deck[idx]);
    if (!first) { first = { idx, btn }; return; }
    if (first.idx === idx) return; // same card
    second = { idx, btn }; lock = true; moves++; movesEl.textContent = String(moves);
    if (deck[first.idx] === deck[second.idx]) {
      matches++;
      setTimeout(()=>{ first=null; second=null; lock=false; checkWin(); }, 300);
    } else {
      setTimeout(()=>{ hide(first.btn); hide(second.btn); first=null; second=null; lock=false; }, 700);
    }
  }

  function reveal(btn, icon){ btn.textContent = icon; btn.classList.add('revealed'); }
  function hide(btn){ btn.textContent = '❔'; btn.classList.remove('revealed'); }

  function checkWin(){
    if (matches === icons.length) {
      updateLocalBest(moves);
      alert(`All matched in ${moves} moves!`);
    }
  }

  function shuffle(arr){
    for (let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  }

  function getLocalHighscores(){ try { return JSON.parse(localStorage.getItem(HIGH_KEY)) || []; } catch { return []; } }
  function updateLocalBest(m){
    const hs = getLocalHighscores();
    hs.push({ playerName: (window.HBApi && HBApi.getPlayerName())||'Player', score: m, at: Date.now() });
    hs.sort((a,b)=>a.score-b.score); // fewest moves is best
    localStorage.setItem(HIGH_KEY, JSON.stringify(hs.slice(0,20)));
    bestLocalEl.textContent = String(hs[0]?.score||'—');
  }

  submitBtn.addEventListener('click', async () => {
    try {
      await HBApi.submitScore({ playerName: HBApi.getPlayerName(), score: moves, game: GAME_KEY, meta: { moves } });
      alert('Score submitted!');
      fetchLeaderboards();
    } catch (e) {
      alert('Saved locally; will sync later.');
    }
  });

  async function fetchLeaderboards(){
    const data = await HBApi.getLeaderboard(GAME_KEY, 10);
    globalList.innerHTML = '';
    data.sort((a,b)=>a.score-b.score); // ensure fewest first
    data.forEach((row, idx) => {
      const li = document.createElement('li');
      li.textContent = `#${idx+1} ${row.player_name||row.playerName||'Player'} — ${row.score} moves`;
      globalList.appendChild(li);
    });
  }

  if (window.HBApi) HBApi.onLeaderboardUpdate((payload)=>{ if (payload.game===GAME_KEY) fetchLeaderboards(); });

  bestLocalEl.textContent = String(getLocalHighscores()[0]?.score || '—');
  render(); fetchLeaderboards();
})();