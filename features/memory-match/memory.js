// Enhanced Memory Match Game with Modern Design

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
    console.error('Error loading settings in memory match:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Load settings first
  loadAndApplySettings();
  
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
  
  // Game Configuration
  const gameLevels = {
    easy: {
      name: 'Easy',
      gridSize: 4,
      emojis: ['🐰', '💌', '🌸', '🧸', '💖', '⭐️', '🍓', '🎀'],
      maxTime: 120,
      totalPairs: 8
    },
    medium: {
      name: 'Medium',
      gridSize: 5,
      emojis: ['🐰', '💌', '🌸', '🧸', '💖', '⭐️', '🍓', '🎀', '🌹', '🎵', '🍫', '🎁'],
      maxTime: 180,
      totalPairs: 12
    },
    hard: {
      name: 'Hard',
      gridSize: 6,
      emojis: ['🐰', '💌', '🌸', '🧸', '💖', '⭐️', '🍓', '🎀', '🌹', '🎵', '🍫', '🎁', '🦋', '🌈', '🍭', '🎪', '🎨', '🎭'],
      maxTime: 300,
      totalPairs: 18
    }
  };

  // Game State
  let currentLevel = localStorage.getItem('memoryLevel') || 'easy';
  let cards = [];
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let gameStarted = false;
  let gameTimer = null;
  let startTime = null;
  let gameCompleted = false;

  // DOM Elements
  const board = document.getElementById('gameBoard');
  const matchText = document.getElementById('matchMessage');
  const winMessage = document.getElementById('winMessage');
  const moveCount = document.getElementById('moveCount');
  const timer = document.getElementById('timer');
  const bestScore = document.getElementById('bestScore');
  const levelDisplay = document.getElementById('level');
  const finalMoves = document.getElementById('finalMoves');
  const finalTime = document.getElementById('finalTime');
  const finalLevel = document.getElementById('finalLevel');
  const performance = document.getElementById('performance');
  const progressCount = document.getElementById('progressCount');
  const totalPairs = document.getElementById('totalPairs');
  const progressFill = document.getElementById('progressFill');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const nextLevelBtn = document.getElementById('nextLevelBtn');
  const newGameBtn = document.getElementById('newGameBtn');
  const levelBtn = document.getElementById('levelBtn');
  const levelModal = document.getElementById('levelModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const matchSound = document.getElementById('matchSound');
  const winSound = document.getElementById('winSound');
  const clickSound = document.getElementById('clickSound');
  const notiSound = document.getElementById('notiSound');
  const hugSound = document.getElementById('hugSound');
  const bgMusic = document.getElementById('bgMusic');

  // Initialize game
  async function initializeGame() {
    await loadBestScore();
    updateLevelDisplay();
    updateProgressDisplay();
    createBoard();
    resetGame();
    startBackgroundMusic();
    
    // Stop background music when leaving page
    window.addEventListener('beforeunload', stopBackgroundMusic);
  }

  // Load best score from localStorage
  async function loadBestScore() {
    try {
      // Try to load from synced storage first
      const bestScoreData = await ScoreboardService.getBestScore(`memory_${currentLevel}`);
      if (bestScoreData) {
        bestScore.textContent = bestScoreData.score;
      } else {
        // Fallback to localStorage
        const savedBestScore = localStorage.getItem(`memoryBestScore_${currentLevel}`);
        if (savedBestScore) {
          bestScore.textContent = savedBestScore;
        } else {
          bestScore.textContent = 'None';
        }
      }
    } catch (error) {
      console.error('Error loading best score:', error);
      // Fallback to localStorage
      const savedBestScore = localStorage.getItem(`memoryBestScore_${currentLevel}`);
      if (savedBestScore) {
        bestScore.textContent = savedBestScore;
      } else {
        bestScore.textContent = 'None';
      }
    }
  }

  // Update level display
  function updateLevelDisplay() {
    levelDisplay.textContent = gameLevels[currentLevel].name;
  }

  // Update progress display
  function updateProgressDisplay() {
    const level = gameLevels[currentLevel];
    totalPairs.textContent = level.totalPairs;
    progressCount.textContent = matched;
    const progressPercentage = (matched / level.totalPairs) * 100;
    progressFill.style.width = `${progressPercentage}%`;
  }

  // Create game board
  function createBoard() {
    board.innerHTML = '';
    const level = gameLevels[currentLevel];
    const totalPairs = (level.gridSize * level.gridSize) / 2;
    const selectedEmojis = level.emojis.slice(0, totalPairs);
    
    cards = [...selectedEmojis, ...selectedEmojis];
    cards = shuffle(cards);
    
    // Set grid class for CSS styling
    board.className = `game-board ${currentLevel}`;
    
    cards.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.index = index;
      card.dataset.emoji = emoji;
      board.appendChild(card);

      card.addEventListener('click', () => flipCard(card));
    });
  }

  // Reset game state
  function resetGame() {
    flipped = [];
    matched = 0;
    moves = 0;
    gameStarted = false;
    gameCompleted = false;
    startTime = null;
    
    moveCount.textContent = moves;
    timer.textContent = '00:00';
    updateProgressDisplay();
    
    // Reset all cards
    document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('flipped', 'matched');
      card.textContent = '';
    });
    
    stopTimer();
  }

  // Utility Functions
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function updateTimer() {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      timer.textContent = formatTime(elapsed);
    }
  }

  function startTimer() {
    if (!gameStarted) {
      gameStarted = true;
      startTime = Date.now();
      gameTimer = setInterval(updateTimer, 1000);
    }
  }

  function stopTimer() {
    if (gameTimer) {
      clearInterval(gameTimer);
      gameTimer = null;
    }
  }

  function getElapsedTime() {
    if (startTime) {
      return Math.floor((Date.now() - startTime) / 1000);
    }
    return 0;
  }

  // Calculate performance rating
  function calculatePerformance(moves, time, level) {
    const levelData = gameLevels[level];
    const optimalMoves = levelData.totalPairs * 2; // Minimum moves needed
    const moveEfficiency = optimalMoves / moves;
    const timeEfficiency = Math.max(0, 1 - (time / levelData.maxTime));
    const overallScore = (moveEfficiency + timeEfficiency) / 2;
    
    if (overallScore >= 0.9) return 'Perfect';
    if (overallScore >= 0.8) return 'Excellent';
    if (overallScore >= 0.7) return 'Great';
    if (overallScore >= 0.6) return 'Good';
    return 'Fair';
  }

  // Background music function
  function startBackgroundMusic() {
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
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
  }

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

  // Flip card function
  function flipCard(card) {
    if (card.classList.contains('flipped') || card.classList.contains('matched') || flipped.length === 2 || gameCompleted) return;

    // Start timer on first card flip
    startTimer();

    // Play flip sound
    playSound('clickSound');

    // Flip the card immediately
    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    
    // Ensure emoji is visible on mobile
    ensureEmojiVisibility(card);
    
    flipped.push(card);

    if (flipped.length === 2) {
      moves++;
      moveCount.textContent = moves;
      // Check match immediately with a short delay for visual feedback
      setTimeout(checkMatch, 300);
    }
  }

  // Ensure emoji is visible on mobile devices
  function ensureEmojiVisibility(card) {
    const emoji = card.dataset.emoji;
    
    // Check if emoji is visible by measuring its width
    setTimeout(() => {
      const rect = card.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(card);
      const fontSize = parseFloat(computedStyle.fontSize);
      
      // If the card has no width or the emoji seems invisible, try alternatives
      if (rect.width < 10 || card.textContent.trim() === '') {
        console.log('🔄 Emoji not visible, trying fallback for:', emoji);
        
        // Try different emoji representations
        const fallbackEmojis = {
          '🐰': '🐰',
          '💌': '💌',
          '🌸': '🌸',
          '🧸': '🧸',
          '💖': '💖',
          '⭐️': '⭐',
          '🍓': '🍓',
          '🎀': '🎀',
          '🌹': '🌹',
          '💕': '💕',
          '🎈': '🎈',
          '🍰': '🍰',
          '🎁': '🎁',
          '💝': '💝',
          '🌺': '🌺',
          '🎪': '🎪',
          '🎭': '🎭',
          '🎨': '🎨'
        };
        
        // Try the fallback emoji
        const fallback = fallbackEmojis[emoji] || emoji;
        card.textContent = fallback;
        
        // If still not visible, try using a simple text representation
        setTimeout(() => {
          const newRect = card.getBoundingClientRect();
          if (newRect.width < 10) {
            console.log('🔄 Using text fallback for:', emoji);
            // Use a simple text representation
            const textFallbacks = {
              '🐰': 'BUNNY',
              '💌': 'LOVE',
              '🌸': 'FLOWER',
              '🧸': 'BEAR',
              '💖': 'HEART',
              '⭐️': 'STAR',
              '🍓': 'STRAWBERRY',
              '🎀': 'BOW',
              '🌹': 'ROSE',
              '💕': 'HEARTS',
              '🎈': 'BALLOON',
              '🍰': 'CAKE',
              '🎁': 'GIFT',
              '💝': 'GIFT HEART',
              '🌺': 'FLOWER',
              '🎪': 'CIRCUS',
              '🎭': 'THEATER',
              '🎨': 'ART'
            };
            card.textContent = textFallbacks[emoji] || emoji;
            card.style.fontSize = '0.8rem';
            card.style.fontWeight = 'bold';
          }
        }, 100);
      }
    }, 50);
  }

  // Check for match
  function checkMatch() {
    const [a, b] = flipped;
    
    if (a.dataset.emoji === b.dataset.emoji) {
      // Match found - keep cards flipped
      a.classList.add('matched');
      b.classList.add('matched');
      matched += 1;
      updateProgressDisplay();

      // Play match sound
      playSound('matchSound');

      // Show match message
      if (matchText) {
        matchText.classList.remove('hidden');
        
        setTimeout(() => {
          matchText.classList.add('hidden');
        }, 1000);
      }

      // Check for win
      const totalPairs = cards.length / 2;
      if (matched === totalPairs) {
        // Play win sound
        playSound('winSound');
        setTimeout(showWinMessage, 300);
      }
    } else {
      // No match - flip back after a short delay
      setTimeout(() => {
        a.textContent = '';
        b.textContent = '';
        a.classList.remove('flipped');
        b.classList.remove('flipped');
      }, 500);
    }
    
    flipped = [];
  }

  // Show win message with enhanced stats
  async function showWinMessage() {
    stopTimer();
    const elapsedTime = getElapsedTime();
    const performance = calculatePerformance(moves, elapsedTime, currentLevel);
    
    // Update performance display
    performance.textContent = performance;
    
    // Check for best score and save with offline support
    const currentScore = `${moves} moves in ${formatTime(elapsedTime)}`;
    const savedBestScore = localStorage.getItem(`memoryBestScore_${currentLevel}`);
    
    // Always save locally first for immediate access
    try {
      const scoreData = {
        score: moves,
        time: elapsedTime,
        level: currentLevel,
        timestamp: Date.now(),
        performance: performance,
        scoreText: currentScore
      };
      
      // Get existing scores for this level
      const existingScores = JSON.parse(localStorage.getItem('loveMemoryScores') || '{}');
      const levelKey = `memory_${currentLevel}`;
      
      if (!existingScores[levelKey]) {
        existingScores[levelKey] = [];
      }
      
      // Add new score
      existingScores[levelKey].push(scoreData);
      
      // Keep only top 10 scores per level
      existingScores[levelKey] = existingScores[levelKey]
        .sort((a, b) => a.score - b.score) // Lower score is better for memory match
        .slice(0, 10);
      
      // Save to localStorage
      localStorage.setItem('loveMemoryScores', JSON.stringify(existingScores));
      
      // Update best score if this is better
      if (!savedBestScore || moves < parseInt(savedBestScore.split(' ')[0])) {
        localStorage.setItem(`memoryBestScore_${currentLevel}`, currentScore);
        bestScore.textContent = currentScore;
      }
      
      console.log('📱 Score saved locally');
      
    } catch (error) {
      console.error('❌ Error saving score to localStorage:', error);
    }
    
    // Submit score with offline support
    if (window.submitScoreWithOfflineSupport) {
      const scoreData = {
        game: 'memory-match',
        level: currentLevel,
        score: moves,
        time: elapsedTime,
        performance: performance,
        scoreText: currentScore,
        timestamp: Date.now()
      };
      
      window.submitScoreWithOfflineSupport(scoreData)
        .then(result => {
          if (result.offline) {
            console.log('📦 Score queued for offline sync');
            // Show offline notification
            showOfflineScoreNotification();
          } else {
            console.log('✅ Score submitted to leaderboard');
          }
        })
        .catch(error => {
          console.error('❌ Error submitting score:', error);
        });
    }

    // Show win message
    winMessage.classList.remove('hidden');
  }

  // Show offline score notification
  function showOfflineScoreNotification() {
    const notification = document.createElement('div');
    notification.className = 'offline-score-notification';
    notification.innerHTML = `
      <div class="offline-score-content">
        <span class="offline-score-icon">📦</span>
        <span class="offline-score-text">Score saved! Will sync when online</span>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .offline-score-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #FF9800, #FFB74D);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
        z-index: 10000;
        animation: slideInUp 0.5s ease-out;
        font-size: 0.9rem;
        font-weight: 500;
      }
      
      .offline-score-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .offline-score-icon {
        font-size: 1.1rem;
      }
      
      @keyframes slideInUp {
        from { transform: translateX(-50%) translateY(100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
    `;
    
    if (!document.querySelector('#offlineScoreNotificationStyles')) {
      style.id = 'offlineScoreNotificationStyles';
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutDown 0.5s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 500);
    }, 3000);
  }

  // Event Listeners
  playAgainBtn?.addEventListener('click', () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    winMessage.classList.add('hidden');
    resetGame();
  });

  nextLevelBtn?.addEventListener('click', () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    // Move to next level
    const levels = Object.keys(gameLevels);
    const currentIndex = levels.indexOf(currentLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    currentLevel = levels[nextIndex];
    
    localStorage.setItem('memoryLevel', currentLevel);
    
    winMessage.classList.add('hidden');
    loadBestScore();
    updateLevelDisplay();
    updateProgressDisplay();
    createBoard();
    resetGame();
  });

  newGameBtn?.addEventListener('click', () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    resetGame();
  });

  levelBtn?.addEventListener('click', () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    showLevelModal();
  });

  closeModalBtn?.addEventListener('click', () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    hideLevelModal();
  });

  // Level modal functions
  function showLevelModal() {
    levelModal.classList.remove('hidden');
    
    // Update selected level
    document.querySelectorAll('.level-option').forEach(option => {
      option.classList.remove('selected');
      if (option.dataset.level === currentLevel) {
        option.classList.add('selected');
      }
    });
  }

  function hideLevelModal() {
    levelModal.classList.add('hidden');
  }

  // Level option click handlers
  document.querySelectorAll('.level-option').forEach(option => {
    option.addEventListener('click', async () => {
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.3;
        clickSound.play().catch(() => {});
      }
      
      const newLevel = option.dataset.level;
      if (newLevel !== currentLevel) {
        currentLevel = newLevel;
        localStorage.setItem('memoryLevel', currentLevel);
        
        await loadBestScore();
        updateLevelDisplay();
        updateProgressDisplay();
        createBoard();
        resetGame();
      }
      
      hideLevelModal();
    });
  });

  // Initialize game
  initializeGame();
});


