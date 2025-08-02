// === Settings Loading ===
function loadAndApplySettings() {
  try {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      
      // Apply theme
      if (settings.theme === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }

      // Apply font size
      let fontSize = '1rem';
      switch (settings.fontSize) {
        case 'small': fontSize = '0.9rem'; break;
        case 'large': fontSize = '1.2rem'; break;
      }
      document.body.style.fontSize = fontSize;

      // Apply animation speed
      let animationSpeed = '0.6s';
      switch (settings.animationSpeed) {
        case 'fast': animationSpeed = '0.3s'; break;
        case 'slow': animationSpeed = '1.2s'; break;
      }
      document.body.style.setProperty('--animation-speed', animationSpeed);

      // Apply volume to all audio elements
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.volume = (settings.volume || 50) / 100;
      });
    }
  } catch (error) {
    console.error('Error loading settings in hug:', error);
  }
}

// Load settings when page loads
document.addEventListener('DOMContentLoaded', loadAndApplySettings);

// Start background music when page loads
document.addEventListener('DOMContentLoaded', () => {
  startBackgroundMusic();
  
  // Stop background music when leaving page
  window.addEventListener('beforeunload', stopBackgroundMusic);
});

// Background music management
function startBackgroundMusic() {
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) {
    // Stop all other background music first
    const allAudio = document.querySelectorAll('audio[id="bgMusic"]');
    allAudio.forEach(audio => {
      if (audio !== bgMusic) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    // Start current background music
    bgMusic.play().catch(() => {
      console.log('Background music autoplay blocked');
    });
  }
}

// Stop background music when leaving page
function stopBackgroundMusic() {
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
}

// === Settings Change Listener ===
// Listen for settings changes from main menu
window.addEventListener('settingsChanged', (e) => {
  const settings = e.detail;
  
  // Apply theme
  if (settings.theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Apply font size
  let fontSize = '1rem';
  switch (settings.fontSize) {
    case 'small': fontSize = '0.9rem'; break;
    case 'large': fontSize = '1.2rem'; break;
  }
  document.body.style.fontSize = fontSize;

  // Apply animation speed
  let animationSpeed = '0.6s';
  switch (settings.animationSpeed) {
    case 'fast': animationSpeed = '0.3s'; break;
    case 'slow': animationSpeed = '1.2s'; break;
  }
  document.body.style.setProperty('--animation-speed', animationSpeed);

  // Apply volume to all audio elements
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach(audio => {
    audio.volume = (settings.volume || 50) / 100;
  });
});

// Also listen for storage events (cross-tab communication)
window.addEventListener('storage', (e) => {
  if (e.key === 'userSettings' || e.key === 'settingsLastUpdated') {
    loadAndApplySettings();
  }
});

// === Audio Functions ===
function playSound(audioId) {
  try {
    const audio = document.getElementById(audioId);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay restrictions
      });
    }
  } catch (error) {
    console.log('Audio playback failed:', error);
  }
}

const overlay = document.getElementById('tapOverlay');
const gif = document.getElementById('hugGif');

function playHug() {
  // Play hug sound
  playSound('hugSound');
  
  // Play game sound for hug interaction
  playSound('gameSound');
  
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
    
    // Play notification sound when hug completes
    playSound('notiSound');
    
    // Play game1 sound for completion
    playSound('game1Sound');
  }, 4000);
}

overlay.addEventListener('click', playHug);
overlay.addEventListener('touchstart', playHug);
