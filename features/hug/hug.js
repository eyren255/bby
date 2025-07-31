const video = document.getElementById('hugVideo');
const overlay = document.getElementById('tapOverlay');

window.addEventListener('click', () => {
  overlay.style.display = 'none';
  video.style.display = 'block';
  video.currentTime = 0;
  video.play().catch(err => console.error("Video play failed:", err));
}, { once: true });
