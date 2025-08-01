const overlay = document.getElementById('tapOverlay');
const gif = document.getElementById('hugGif');

function playHug() {
  overlay.style.display = 'none';
  gif.style.display = 'block';

  // Reset the GIF by reassigning its src
  const src = gif.src;
  gif.src = '';
  gif.src = src;

  // Allow replay after 4s (you can adjust this to match your GIF duration)
  setTimeout(() => {
    gif.style.display = 'none';
    overlay.style.display = 'flex';
  }, 4000);
}

overlay.addEventListener('click', playHug);
overlay.addEventListener('touchstart', playHug);
