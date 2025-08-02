// Enhanced Memory Match Game with Multiple Difficulty Levels
document.addEventListener('DOMContentLoaded', () => {
  // Game Configuration
  const gameLevels = {
    easy: {
      name: 'Easy',
      gridSize: 4,
      emojis: ['🐰', '💌', '🌸', '🧸', '💖', '⭐️', '🍓', '🎀'],
      maxTime: 120
    },
    medium: {
      name: 'Medium',
      gridSize: 5,
      emojis: ['🐰', '💌', '🌸', '🧸', '💖', '⭐️', '🍓', '🎀', '🌹', '🎵', '🍫', '🎁'],
      maxTime: 180
    },
    hard: {
      name: 'Hard',
      gridSize: 6,
      emojis: ['🐰', '💌', '🌸', '🧸', '💖', '⭐️', '🍓', '🎀', '🌹', '🎵', '🍫', '🎁', '🦋', '🌈', '🍭', '🎪', '🎨', '🎭'],
      maxTime: 300
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
  const playAgainBtn = document.getElementById('playAgainBtn');
  const nextLevelBtn = document.getElementById('nextLevelBtn');
  const newGameBtn = document.getElementById('newGameBtn');
  const levelBtn = document.getElementById('levelBtn');
  const levelModal = document.getElementById('levelModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const flipSound = document.getElementById('flipSound');
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
    createBoard();
    resetGame();
    startBackgroundMusic();
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

  // Create game board
  function createBoard() {
    board.innerHTML = '';
    const level = gameLevels[currentLevel];
    const totalPairs = (level.gridSize * level.gridSize) / 2;
    const selectedEmojis = level.emojis.slice(0, totalPairs);
    
    cards = [...selectedEmojis, ...selectedEmojis];
    cards = shuffle(cards);
    
    // Set grid template columns and rows for perfect alignment
    board.style.gridTemplateColumns = `repeat(${level.gridSize}, 85px)`;
    board.style.gridTemplateRows = `repeat(${level.gridSize}, 85px)`;
    board.style.justifyContent = 'center';
    board.style.alignItems = 'center';
    
    cards.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.index = index;
      card.dataset.emoji = emoji;
      card.innerHTML = '<span class="card-back">❓</span>';
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
    
    // Reset all cards
    document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('flipped', 'matched');
      card.innerHTML = '<span class="card-back">❓</span>';
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

  // Background music function
  function startBackgroundMusic() {
    if (bgMusic) {
      bgMusic.volume = 0.2;
      bgMusic.play().catch(() => {
        console.log('Background music autoplay blocked');
      });
    }
  }

  // Flip card function
  function flipCard(card) {
    if (card.classList.contains('flipped') || card.classList.contains('matched') || flipped.length === 2 || gameCompleted) return;

    // Start timer on first card flip
    startTimer();

    // Play flip sound
    if (flipSound) {
      flipSound.currentTime = 0;
      flipSound.volume = 0.3;
      flipSound.play().catch(() => {});
    }

    // Flip the card
    card.classList.add('flipped');
    card.innerHTML = `<span class="card-front">${card.dataset.emoji}</span>`;
    flipped.push(card);

    // Add flip animation
    card.style.animation = 'flipCard 0.6s ease-in-out';

    if (flipped.length === 2) {
      moves++;
      moveCount.textContent = moves;
      setTimeout(checkMatch, 600);
    }
  }

  // Check for match
  function checkMatch() {
    const [a, b] = flipped;
    
    if (a.dataset.emoji === b.dataset.emoji) {
      // Match found
      a.classList.add('matched');
      b.classList.add('matched');
      matched += 1;

      // Play match sound only (removed hug sound to avoid double sound)
      if (matchSound) {
        matchSound.currentTime = 0;
        matchSound.volume = 0.4;
        matchSound.play().catch(() => {});
      }

      // Show match message
      if (matchText) {
        matchText.innerHTML = `
          <span class="match-icon">🎉</span>
          <span class="match-text">Perfect Match!</span>
        `;
        matchText.classList.remove('hidden');
        matchText.classList.add('show');
        
        setTimeout(() => {
          matchText.classList.remove('show');
          matchText.classList.add('hidden');
        }, 1500);
      }

      // Check for win
      const totalPairs = cards.length / 2;
      if (matched === totalPairs) {
        setTimeout(showWinMessage, 500);
      }
    } else {
      // No match
      setTimeout(() => {
        a.innerHTML = '<span class="card-back">❓</span>';
        b.innerHTML = '<span class="card-back">❓</span>';
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        a.style.animation = 'shakeCard 0.5s ease-in-out';
        b.style.animation = 'shakeCard 0.5s ease-in-out';
      }, 1000);
    }
    
    flipped = [];
  }

  // Show win message
  async function showWinMessage() {
    gameCompleted = true;
    stopTimer();
    const elapsedTime = getElapsedTime();
    
    // Play win sound
    if (winSound) {
      winSound.currentTime = 0;
      winSound.volume = 0.5;
      winSound.play().catch(() => {});
    }
    
    // Play notification sound for achievement
    if (notiSound) {
      setTimeout(() => {
        notiSound.currentTime = 0;
        notiSound.volume = 0.4;
        notiSound.play().catch(() => {});
      }, 500);
    }

    // Update final stats
    finalMoves.textContent = moves;
    finalTime.textContent = formatTime(elapsedTime);
    finalLevel.textContent = gameLevels[currentLevel].name;

    // Check for best score and save to cloud
    const currentScore = `${moves} moves in ${formatTime(elapsedTime)}`;
    const savedBestScore = localStorage.getItem(`memoryBestScore_${currentLevel}`);
    
    if (!savedBestScore || moves < parseInt(savedBestScore.split(' ')[0])) {
      // Save to synced storage
      try {
        await ScoreboardService.saveScore(`memory_${currentLevel}`, moves, {
          time: formatTime(elapsedTime),
          level: currentLevel,
          scoreText: currentScore
        });
      } catch (error) {
        console.error('Error saving score to cloud:', error);
        // Fallback to localStorage
        localStorage.setItem(`memoryBestScore_${currentLevel}`, currentScore);
      }
      bestScore.textContent = currentScore;
    }

    // Show win message
    winMessage.classList.remove('hidden');
    winMessage.style.animation = 'fadeInScale 0.8s ease-out';

    // Spawn celebration hearts
    spawnHearts();
  }

  // Floating hearts effect
  function spawnHearts() {
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animationDelay = Math.random() * 2 + 's';
      heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 5000);
    }
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
        createBoard();
        resetGame();
      }
      
      hideLevelModal();
    });
  });

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flipCard {
      0% { transform: rotateY(0deg); }
      50% { transform: rotateY(90deg); }
      100% { transform: rotateY(180deg); }
    }
    
    @keyframes shakeCard {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // Initialize game
  initializeGame();
});


