(function(){
  const out = document.getElementById('compliment');
  const btn = document.getElementById('refresh');
  let list = [];
  fetch('./data.json').then(r=>r.json()).then(d=>{ list = d.compliments||[]; render(); });
  function pick(){
    const day = Math.floor(Date.now()/(1000*60*60*24));
    return list[day % (list.length||1)] || 'You are wonderfully you.';
  }
  function render(){ out.textContent = pick(); }
  btn.addEventListener('click', () => { out.textContent = list[Math.floor(Math.random()*list.length)] || out.textContent; });
})();