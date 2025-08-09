(function(){
  const target = new Date('2025-07-28T00:00:00');
  const el = document.getElementById('countdown');
  const list = document.getElementById('milestones');

  function tick(){
    const now = new Date();
    const diff = Math.max(0, target - now);
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor((diff/(1000*60*60))%24);
    const m = Math.floor((diff/(1000*60))%60);
    const s = Math.floor((diff/1000)%60);
    el.textContent = `${d} days ${h}h ${m}m ${s}s until Jul 28, 2025`;
  }

  fetch('./data.json').then(r=>r.json()).then(data => {
    (data.milestones||[]).forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.date} — ${item.title}`;
      list.appendChild(li);
    });
  }).catch(()=>{});

  tick(); setInterval(tick, 1000);
})();