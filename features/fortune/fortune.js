// Fortune configuration
const fortunes = [
  {
    message: "🌟 A beautiful surprise is waiting for you today!",
    advice: "Keep your heart open and embrace the unexpected moments of joy."
  },
  {
    message: "💕 Love will find its way to you in the most magical way!",
    advice: "Trust in the power of love and let it guide your path."
  },
  {
    message: "🎵 Your heart's melody will bring happiness to others!",
    advice: "Share your kindness and watch it multiply around you."
  },
  {
    message: "🌸 A gentle breeze of romance will sweep through your day!",
    advice: "Let yourself be carried away by the sweet moments of connection."
  },
  {
    message: "💖 Your smile will brighten someone's entire world today!",
    advice: "Never underestimate the power of your beautiful smile."
  },
  {
    message: "🎁 An unexpected gift of love is coming your way!",
    advice: "Be ready to receive the wonderful surprises life has planned."
  },
  {
    message: "🌈 Your dreams are closer than you think!",
    advice: "Keep believing in yourself and your beautiful dreams."
  },
  {
    message: "💝 Someone special is thinking of you right now!",
    advice: "Feel the warmth of their love surrounding you."
  },
  {
    message: "✨ Magic is real, and it's happening in your life!",
    advice: "Open your eyes to the everyday miracles around you."
  },
  {
    message: "💕 Your love story is just beginning its most beautiful chapter!",
    advice: "Embrace the journey ahead with an open heart."
  },
  {
    message: "🌟 You are surrounded by love, even when you can't see it!",
    advice: "Trust that love is always present in your life."
  },
  {
    message: "🎶 Your heart's song will create beautiful memories today!",
    advice: "Let your authentic self shine and create magic."
  }
];

// DOM elements
const crystalBall = document.getElementById('crystalBall');
const getFortuneBtn = document.getElementById('getFortune');
const resetFortuneBtn = document.getElementById('resetFortune');
const fortuneResult = document.getElementById('fortuneResult');
const fortuneMessage = document.getElementById('fortuneMessage');
const fortuneAdvice = document.getElementById('fortuneAdvice');
const fortuneText = document.getElementById('fortuneText');
const sparkles = document.getElementById('sparkles');
const crystalSound = document.getElementById('crystalSound');
const magicSound = document.getElementById('magicSound');

// State
let hasFortune = false;

// Initialize fortune feature
function initFortune() {
  getFortuneBtn.addEventListener('click', getFortune);
  resetFortuneBtn.addEventListener('click', resetFortune);
  crystalBall.addEventListener('click', getFortune);
  
  // Create initial sparkles
  createSparkles();
}

// Get a random fortune
function getFortune() {
  if (hasFortune) return;
  
  playSound(crystalSound);
  
  // Add reading animation
  crystalBall.classList.add('reading');
  
  // Update crystal ball text
  fortuneText.innerHTML = `
    <span class="crystal-emoji">🔮</span>
    <p>Reading your future...</p>
  `;
  
  // Create more sparkles
  createSparkles();
  
  // Simulate reading time
  setTimeout(() => {
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    
    // Show result
    fortuneMessage.textContent = fortune.message;
    fortuneAdvice.textContent = fortune.advice;
    
    // Play magic sound
    playSound(magicSound);
    
    // Show result with animation
    fortuneResult.classList.remove('hidden');
    getFortuneBtn.classList.add('hidden');
    resetFortuneBtn.classList.remove('hidden');
    
    // Reset crystal ball
    fortuneText.innerHTML = `
      <span class="crystal-emoji">✨</span>
      <p>Your fortune has been revealed!</p>
    `;
    
    crystalBall.classList.remove('reading');
    hasFortune = true;
    
    // Create celebration sparkles
    createCelebrationSparkles();
    
  }, 3000);
}

// Reset fortune
function resetFortune() {
  playSound(crystalSound);
  
  // Reset state
  hasFortune = false;
  
  // Hide result
  fortuneResult.classList.add('hidden');
  resetFortuneBtn.classList.add('hidden');
  getFortuneBtn.classList.remove('hidden');
  
  // Reset crystal ball
  fortuneText.innerHTML = `
    <span class="crystal-emoji">🔮</span>
    <p>Focus your energy and ask for your fortune...</p>
  `;
  
  // Create sparkles
  createSparkles();
}

// Create floating sparkles
function createSparkles() {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      createSparkle();
    }, i * 200);
  }
}

// Create celebration sparkles
function createCelebrationSparkles() {
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createSparkle();
    }, i * 100);
  }
}

// Create individual sparkle
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.left = Math.random() * 100 + 'vw';
  sparkle.style.top = Math.random() * 100 + 'vh';
  sparkle.style.animationDelay = Math.random() * 2 + 's';
  
  sparkles.appendChild(sparkle);
  
  // Remove sparkle after animation
  setTimeout(() => {
    sparkle.remove();
  }, 2000);
}

// Play sound effect
function playSound(audioElement) {
  if (audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(() => {
      // Ignore autoplay restrictions
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initFortune); 