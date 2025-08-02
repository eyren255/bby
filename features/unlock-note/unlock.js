// Enhanced Love Note with Interactive Features
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loveMessage = document.getElementById('loveMessage');
  const heartButton = document.getElementById('heartButton');
  const loveCount = document.getElementById('loveCount');
  const heartbeatSound = document.getElementById('heartbeatSound');
  const sparkleSound = document.getElementById('sparkleSound');
  const clickSound = document.getElementById('clickSound');

  // Enhanced message with better formatting
  const message = `
Hey Honey Bun 💕,

Even when we're apart, you're always in my thoughts.
Your smile lights up even the darkest days.
Your voice is my favorite melody.
Your love is my favorite place.

I might not always say it right, but I mean it every time:
I love you. Always. Deeply. Truly. Softly.

You're my happy place, my peace, my everything.

Forever yours,
  `;

  // Initialize love counter
  let loveCountValue = parseInt(localStorage.getItem('loveCount') || '0');
  loveCount.textContent = loveCountValue;

  // Display message with typing effect
  function displayMessage() {
    loveMessage.innerHTML = '';
    const words = message.split(' ');
    let index = 0;

    function typeWord() {
      if (index < words.length) {
        const word = words[index];
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0';
        span.style.animation = 'fadeInWord 0.3s ease forwards';
        loveMessage.appendChild(span);
        index++;
        setTimeout(typeWord, 100);
      }
    }

    typeWord();
  }

  // Heart button functionality
  heartButton?.addEventListener('click', () => {
    // Play sounds
    if (heartbeatSound) {
      heartbeatSound.currentTime = 0;
      heartbeatSound.volume = 0.4;
      heartbeatSound.play().catch(() => {});
    }
    
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }

    // Update love counter
    loveCountValue++;
    localStorage.setItem('loveCount', loveCountValue.toString());
    loveCount.textContent = loveCountValue;

    // Visual feedback
    heartButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
      heartButton.style.transform = '';
    }, 150);

    // Show love sent message
    showLoveSentMessage();

    // Spawn floating hearts
    spawnHearts();

    // Play sparkle sound after a delay
    setTimeout(() => {
      if (sparkleSound) {
        sparkleSound.currentTime = 0;
        sparkleSound.volume = 0.3;
        sparkleSound.play().catch(() => {});
      }
    }, 500);
  });

  // Show love sent message
  function showLoveSentMessage() {
    const message = document.createElement('div');
    message.className = 'love-sent-message';
    message.textContent = '💖 Love Sent! 💖';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(145deg, #ff69b4, #ff8fab);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-size: 1.2rem;
      font-weight: bold;
      z-index: 1000;
      animation: fadeInScale 0.5s ease;
      box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.animation = 'fadeOutScale 0.5s ease';
      setTimeout(() => message.remove(), 500);
    }, 1500);
  }

  // Floating hearts effect
  function spawnHearts() {
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDelay = Math.random() * 2 + 's';
      heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
      document.body.appendChild(heart);
      
      setTimeout(() => heart.remove(), 5000);
    }
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInWord {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInScale {
      from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes fadeOutScale {
      from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;
  document.head.appendChild(style);

  // Initialize floating hearts on page load
  setTimeout(spawnHearts, 2000);

  // Start displaying the message
  displayMessage();

  // Add hover effects
  heartButton?.addEventListener('mouseenter', () => {
    heartButton.style.transform = 'translateY(-2px) scale(1.02)';
  });

  heartButton?.addEventListener('mouseleave', () => {
    heartButton.style.transform = '';
  });

  // Add periodic floating hearts
  setInterval(() => {
    if (Math.random() < 0.3) { // 30% chance every interval
      spawnHearts();
    }
  }, 10000); // Every 10 seconds
});
