(function(){
  const btn = document.getElementById('crack');
  const out = document.getElementById('fortune');
  let fortunes = [];
  fetch('./data.json').then(r=>r.json()).then(d=> fortunes = d.fortunes||[]);
  btn.addEventListener('click', ()=>{
    const t = fortunes[Math.floor(Math.random()*fortunes.length)] || 'You are loved more than words can say.';
    out.textContent = t;
    if (window.gsap) gsap.fromTo(out, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 });
  });
})();