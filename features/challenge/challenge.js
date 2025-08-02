// 💕 Love Challenge Generator JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // === DOM Elements ===
  const generateBtn = document.getElementById('generateBtn');
  const generateAgainBtn = document.getElementById('generateAgainBtn');
  const closeResultBtn = document.getElementById('closeResultBtn');
  const challengeCard = document.getElementById('challengeCard');
  const challengeIcon = document.getElementById('challengeIcon');
  const challengeText = document.getElementById('challengeText');
  const challengeDescription = document.getElementById('challengeDescription');
  const result = document.getElementById('result');
  const resultContainer = document.getElementById('resultContainer');
  const challengeCount = document.getElementById('challengeCount');
  const lastChallenge = document.getElementById('lastChallenge');
  const flipSound = document.getElementById('flipSound');
  const winSound = document.getElementById('winSound');
  const clickSound = document.getElementById('clickSound');

  // === Challenge Configuration ===
  const challenges = [
    {
      icon: "💖",
      text: "Give me a kiss!",
      description: "Time for some sweet affection!"
    },
    {
      icon: "💌",
      text: "Write me a love letter!",
      description: "Write something beautiful for me!"
    },
    {
      icon: "🍓",
      text: "Share your favorite memory!",
      description: "Tell me about our special moments!"
    },
    {
      icon: "🧸",
      text: "Let's watch something cute together!",
      description: "Movie night with my favorite person!"
    },
    {
      icon: "🎶",
      text: "Send me a selfie!",
      description: "I want to see your beautiful face!"
    },
    {
      icon: "🌸",
      text: "Tell me why you love me!",
      description: "Share your feelings with me!"
    },
    {
      icon: "🎨",
      text: "Draw something for me!",
      description: "Create something special just for me!"
    },
    {
      icon: "🍫",
      text: "Make me a sweet treat!",
      description: "Cook or bake something delicious!"
    },
    {
      icon: "🎵",
      text: "Sing me a love song!",
      description: "Share your beautiful voice with me!"
    },
    {
      icon: "📸",
      text: "Take a cute photo together!",
      description: "Capture a special moment with me!"
    }
  ];

  // === State Variables ===
  let challengeCountValue = 0;
  let lastChallengeValue = 'None yet';
  let isGenerating = false;

  // === Initialize Stats ===
  function initializeStats() {
    try {
      // Load from localStorage only
      challengeCountValue = parseInt(localStorage.getItem('challengeCount') || '0');
      lastChallengeValue = localStorage.getItem('lastChallenge') || 'None yet';
      
      challengeCount.textContent = challengeCountValue;
      lastChallenge.textContent = lastChallengeValue;
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  // === Generate Challenge ===
  function generateChallenge() {
    if (isGenerating) return;
    
    isGenerating = true;
    generateBtn.disabled = true;
    
    // Play flip sound
    if (flipSound) {
      flipSound.currentTime = 0;
      flipSound.volume = 0.4;
      flipSound.play().catch(() => {});
    }
    
    // Play click sound
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    // Add button animation
    generateBtn.style.transform = 'scale(0.95)';
    
    // Randomly select a challenge
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const selectedChallenge = challenges[randomIndex];
    
    // Update challenge card
    challengeIcon.textContent = selectedChallenge.icon;
    challengeText.textContent = selectedChallenge.text;
    challengeDescription.textContent = selectedChallenge.description;
    
    // Flip the card
    challengeCard.classList.add('flipped');
    
    // Update statistics
    challengeCountValue++;
    lastChallengeValue = selectedChallenge.text;
    
    // Save to localStorage
    saveStatsToLocal();
    
    // Update display
    challengeCount.textContent = challengeCountValue;
    lastChallenge.textContent = lastChallengeValue;
    
    // Show result after card flip
    setTimeout(() => {
      showResult(selectedChallenge);
      
      // Reset button state
      generateBtn.style.transform = '';
      isGenerating = false;
      generateBtn.disabled = false;
    }, 800);
  }

  // === Save Stats to Local ===
  function saveStatsToLocal() {
    try {
      localStorage.setItem('challengeCount', challengeCountValue.toString());
      localStorage.setItem('lastChallenge', lastChallengeValue);
    } catch (error) {
      console.error('Error saving stats to local:', error);
    }
  }

  // === Show Result ===
  function showResult(challenge) {
    // Play win sound
    if (winSound) {
      winSound.currentTime = 0;
      winSound.volume = 0.5;
      winSound.play().catch(() => {});
    }
    
    // Update result text
    result.textContent = challenge.text;
    
    // Show result container with animation
    resultContainer.classList.remove('hidden');
    
    // Add floating hearts effect
    spawnHearts();
  }

  // === Floating Hearts Effect ===
  function spawnHearts() {
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDelay = Math.random() * 2 + 's';
      heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
      document.body.appendChild(heart);
      
      setTimeout(() => heart.remove(), 5000);
    }
  }

  // === Reset Card Function ===
  function resetCard() {
    // Reset card to front
    challengeCard.classList.remove('flipped');
    
    // Reset challenge content
    challengeIcon.textContent = '💖';
    challengeText.textContent = 'Your challenge will appear here!';
    challengeDescription.textContent = 'Complete this sweet task for me!';
    
    // Hide result container
    resultContainer.classList.add('hidden');
    
    // Reset button state
    isGenerating = false;
    generateBtn.disabled = false;
    generateBtn.style.transform = '';
  }

  // === Event Listeners ===
  generateBtn.addEventListener('click', generateChallenge);

  generateAgainBtn?.addEventListener('click', () => {
    // Play click sound
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    // Hide result and reset card
    resultContainer.classList.add('hidden');
    challengeCard.classList.remove('flipped');
    
    // Generate new challenge after a short delay
    setTimeout(generateChallenge, 300);
  });

  // Close result button
  closeResultBtn?.addEventListener('click', () => {
    // Play click sound
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    // Reset everything
    resetCard();
  });

  // Click outside result to close
  resultContainer?.addEventListener('click', (e) => {
    if (e.target === resultContainer) {
      resetCard();
    }
  });

  // Card click to flip
  challengeCard.addEventListener('click', () => {
    if (!isGenerating && !challengeCard.classList.contains('flipped')) {
      generateChallenge();
    }
  });

  // === Enhanced Hover Effects ===
  generateBtn.addEventListener('mouseenter', () => {
    if (!isGenerating) {
      generateBtn.style.transform = 'translateY(-2px) scale(1.02)';
    }
  });

  generateBtn.addEventListener('mouseleave', () => {
    if (!isGenerating) {
      generateBtn.style.transform = '';
    }
  });

  // === Add CSS animations for hearts ===
  const style = document.createElement('style');
  style.textContent = `
    .heart {
      position: fixed;
      font-size: 20px;
      color: #ff69b4;
      pointer-events: none;
      z-index: 1000;
      animation: fall 3s linear infinite;
    }
    
    @keyframes fall {
      0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // === Initialize on page load ===
  initializeStats();
  
  // Add floating hearts on page load
  setTimeout(spawnHearts, 1000);

  // === Global Settings Loader ===
  // This ensures settings are applied to all pages automatically
  function loadAndApplyGlobalSettings() {
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
      console.error('Error loading global settings:', error);
    }
  }

  // === Global Settings Listener ===
  // Listen for settings changes from main menu
  function setupGlobalSettingsListener() {
    // Listen for settings changes from other pages
    window.addEventListener('storage', (e) => {
      if (e.key === 'userSettings' || e.key === 'settingsLastUpdated') {
        loadAndApplyGlobalSettings();
      }
    });

    // Listen for custom settings change events
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
  }

  // Initialize challenge functionality
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize challenge game
    initializeChallenge();
    
    // Initialize global message system
    if (window.GlobalMessageSystem) {
      window.GlobalMessageSystem.init();
    }

    // Apply global settings
    loadAndApplyGlobalSettings();
    
    // Setup global settings listener
    setupGlobalSettingsListener();
  });
});
