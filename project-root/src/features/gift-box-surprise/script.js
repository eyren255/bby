(function(){
  const btn = document.getElementById('box');
  const msg = document.getElementById('message');
  let opened = false; let data = [];
  fetch('./data.json').then(r=>r.json()).then(d=> data = d.messages||[]);
  btn.addEventListener('click', () => {
    if (!opened) {
      opened = true; btn.setAttribute('aria-expanded','true');
      const text = data[Math.floor(Math.random()*data.length)] || 'A big hug just for you!';
      msg.textContent = text; msg.hidden = false;
      if (window.gsap) gsap.fromTo(msg, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
    } else {
      opened = false; btn.setAttribute('aria-expanded','false'); msg.hidden = true;
    }
  });
})();