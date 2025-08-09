(function(){
  const el = document.getElementById('letters');
  const btn = document.getElementById('next');
  let idx = 0;
  let notes = [];
  fetch('./data.json').then(r=>r.json()).then(d=>{ notes = d.notes||[]; show(0); });

  function show(i){
    if (!notes.length) { el.textContent = 'Loading…'; return; }
    idx = (i+notes.length)%notes.length;
    const text = notes[idx];
    if (window.gsap) {
      gsap.to(el, { opacity: 0, y: -10, duration: 0.25, onComplete(){
        el.textContent = text;
        gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
      }});
    } else {
      el.textContent = text;
    }
  }

  btn.addEventListener('click', ()=> show(idx+1));
})();