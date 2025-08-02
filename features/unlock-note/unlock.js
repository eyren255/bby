// Enhanced Love Note with Interactive Features
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loveMessage = document.getElementById('loveMessage');
  const heartButton = document.getElementById('heartButton');
  const loveCount = document.getElementById('loveCount');
  const clickSound = document.getElementById('clickSound');
  const unlockSound = document.getElementById('unlockSound');

  // Enhanced message with better formatting and daily variations
  const messages = [
    `Hey Honey Bun 💕,

Even when we're apart, you're always in my thoughts.
Your smile lights up even the darkest days.
Your voice is my favorite melody.
Your love is my favorite place.

I might not always say it right, but I mean it every time:
I love you. Always. Deeply. Truly. Softly.

You're my happy place, my peace, my everything.

Forever yours,`,

    `My Dearest Love 💖,

Every day with you is a new adventure.
Your laughter is the sweetest sound.
Your touch is the warmest comfort.
Your love is my greatest treasure.

You make every moment magical.
You turn ordinary days into extraordinary memories.
You are my dream come true.

With all my heart,`,

    `Sweetheart 💕,

You are the missing piece to my puzzle.
The answer to my prayers.
The light in my darkness.
The joy in my heart.

Every day I fall in love with you more.
Every moment with you is precious.
Every smile you give me is a gift.

Yours forever,`
  ];

  // Get today's message based on date
  const today = new Date().getDate();
  const messageIndex = today % messages.length;
  const message = messages[messageIndex];

  // Initialize love counter
  let loveCountValue = parseInt(localStorage.getItem('loveCount') || '0');
  loveCount.textContent = loveCountValue;

  // Display message with simple typing effect
  function displayMessage() {
    // Clear any existing content
    loveMessage.innerHTML = '';
    
    // Split message into lines and filter out empty lines
    const lines = message.split('\n').filter(line => line.trim() !== '');
    
    lines.forEach((line, lineIndex) => {
      // Create line container
      const lineElement = document.createElement('div');
      lineElement.className = 'message-line';
      lineElement.style.marginBottom = line.trim() === '' ? '4px' : '8px';
      
      // Add line to message container
      loveMessage.appendChild(lineElement);
      
      // Type out the line character by character
      let charIndex = 0;
      const typeLine = () => {
        if (charIndex < line.length) {
          const char = line[charIndex];
          const span = document.createElement('span');
          span.textContent = char;
          span.style.opacity = '0';
          span.style.animation = 'fadeInChar 0.1s ease forwards';
          lineElement.appendChild(span);
          charIndex++;
          setTimeout(typeLine, 50);
        }
      };
      
      // Start typing this line after a delay
      setTimeout(typeLine, lineIndex * 100);
    });
  }

  // Heart button functionality with improved feedback
  heartButton?.addEventListener('click', () => {
    // Play sounds with error handling
    try {
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.3;
        clickSound.play().catch(() => {});
      }
      
      if (unlockSound) {
        unlockSound.currentTime = 0;
        unlockSound.volume = 0.4;
        unlockSound.play().catch(() => {});
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }

    // Update love counter
    loveCountValue++;
    localStorage.setItem('loveCount', loveCountValue.toString());
    loveCount.textContent = loveCountValue;

    // Enhanced visual feedback
    heartButton.style.transform = 'scale(0.9)';
    heartButton.style.filter = 'brightness(1.2)';
    
    setTimeout(() => {
      heartButton.style.transform = '';
      heartButton.style.filter = '';
    }, 200);

    // Show love sent message
    showLoveSentMessage();

    // Spawn floating hearts
    spawnHearts();
  });

  // Show love sent message with better styling
  function showLoveSentMessage() {
    const message = document.createElement('div');
    message.className = 'love-sent-message';
    message.innerHTML = `
      <div class="message-content">
        <span class="heart-icon">💖</span>
        <span class="message-text">Love Sent!</span>
        <span class="heart-icon">💖</span>
      </div>
    `;
    
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(145deg, #ff69b4, #ff8fab);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-weight: bold;
      font-size: 1.1rem;
      box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
      z-index: 1000;
      animation: loveMessagePop 0.6s ease-out;
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.style.animation = 'loveMessageFade 0.5s ease-out forwards';
      setTimeout(() => {
        if (message.parentNode) {
          document.body.removeChild(message);
        }
      }, 500);
    }, 1500);
  }

  // Enhanced floating hearts with better positioning
  function spawnHearts() {
    const hearts = ['💖', '💕', '💗', '💓', '💝'];
    const colors = ['#ff69b4', '#ff8fab', '#ffb6c1', '#ffc0cb', '#ff1493'];
    
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}vw;
          top: 100vh;
          font-size: ${Math.random() * 20 + 20}px;
          color: ${colors[Math.floor(Math.random() * colors.length)]};
          pointer-events: none;
          z-index: 999;
          animation: fall ${Math.random() * 3 + 2}s linear forwards;
        `;

        document.body.appendChild(heart);

        setTimeout(() => {
          if (heart.parentNode) {
            document.body.removeChild(heart);
          }
        }, 5000);
      }, i * 100);
    }
  }

  // Initialize the note - only call displayMessage once
  displayMessage();

  // Add some interactive decorations
  addFloatingDecorations();
});

// Add floating decorations for visual appeal
function addFloatingDecorations() {
  const decorations = ['✨', '💫', '⭐', '🌟'];
  
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const decoration = document.createElement('div');
      decoration.className = 'floating-decoration';
      decoration.textContent = decorations[Math.floor(Math.random() * decorations.length)];
      decoration.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        font-size: ${Math.random() * 15 + 10}px;
        opacity: 0.6;
        pointer-events: none;
        z-index: 1;
        animation: float ${Math.random() * 4 + 3}s ease-in-out infinite;
      `;

      document.body.appendChild(decoration);
    }, i * 500);
  }
}
