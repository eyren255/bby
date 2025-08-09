// Animated background: floating hearts & sparkles using canvas. Falls back gracefully if disabled.
(function(){
  const SETTINGS_KEY = 'hb.animations.enabled';
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let width = 0, height = 0, rafId = 0;
  let particles = [];
  const HEART = 0, SPARKLE = 1;

  function resize(){
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function random(min, max){ return Math.random() * (max - min) + min; }

  function spawn(){
    const type = Math.random() < 0.6 ? HEART : SPARKLE;
    const base = {
      x: random(0, width),
      y: random(-40, -10),
      vy: random(0.3, 1.2),
      vx: random(-0.3, 0.3),
      life: random(6, 14),
      age: 0,
      size: random(8, 18),
      alpha: random(0.4, 0.9)
    };
    particles.push({ type, ...base });
  }

  function drawHeart(x, y, size, alpha){
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size/10, size/10);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ff8fb1';
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(0, -1, -4, -1, -4, 2);
    ctx.bezierCurveTo(-4, 5, 0, 8, 0, 10);
    ctx.bezierCurveTo(0, 8, 4, 5, 4, 2);
    ctx.bezierCurveTo(4, -1, 0, -1, 0, 3);
    ctx.fill();
    ctx.restore();
  }

  function drawSparkle(x, y, size, alpha){
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#cdb4db';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function update(dt){
    if (particles.length < 80) spawn();
    ctx.clearRect(0,0,width,height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt; p.x += p.vx; p.y += p.vy;
      p.alpha *= 0.997;
      if (p.type === HEART) drawHeart(p.x, p.y, p.size, p.alpha);
      else drawSparkle(p.x, p.y, p.size, p.alpha);
      if (p.y > height + 20 || p.alpha < 0.05 || p.age > p.life) particles.splice(i,1);
    }
  }

  let last = performance.now();
  function loop(ts){
    const dt = (ts - last) / 1000; last = ts;
    update(dt);
    rafId = requestAnimationFrame(loop);
  }

  function start(){
    if (rafId) return; resize(); last = performance.now(); loop(last);
  }
  function stop(){ cancelAnimationFrame(rafId); rafId = 0; ctx.clearRect(0,0,width,height); }

  window.addEventListener('resize', resize);

  const enabled = (localStorage.getItem(SETTINGS_KEY) ?? 'true') === 'true';
  if (enabled) start();

  // Public toggle API used by Settings
  window.HBAnimations = {
    enable(){ localStorage.setItem(SETTINGS_KEY, 'true'); start(); },
    disable(){ localStorage.setItem(SETTINGS_KEY, 'false'); stop(); },
    isEnabled(){ return (localStorage.getItem(SETTINGS_KEY) ?? 'true') === 'true'; }
  };
})();