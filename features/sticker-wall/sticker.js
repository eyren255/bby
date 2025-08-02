// 🎨 Enhanced Sticker Wall JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvas = document.getElementById('canvas');
  const stickerGrid = document.getElementById('stickerGrid');
  const clearBtn = document.getElementById('clearBtn');
  const saveBtn = document.getElementById('saveBtn');
  const exportBtn = document.getElementById('exportBtn');
  const unlockedCount = document.getElementById('unlockedCount');
  const totalCount = document.getElementById('totalCount');
  const unlockProgress = document.getElementById('unlockProgress');
  const stickersUsed = document.getElementById('stickersUsed');
  const designsSaved = document.getElementById('designsSaved');
  const stickersUnlocked = document.getElementById('stickersUnlocked');
  const achievementModal = document.getElementById('achievementModal');
  const achievementDesc = document.getElementById('achievementDesc');

  // Audio elements
  const clickSound = document.getElementById('clickSound');
  const stickerSound = document.getElementById('stickerSound');
  const achievementSound = document.getElementById('achievementSound');

  // Canvas context
  const ctx = canvas.getContext('2d');
  
  // State variables
  let currentCategory = 'love';
  let stickersPlaced = 0;
  let designsSavedCount = 0;
  let unlockedStickers = 0;
  let currentDesign = [];
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Enhanced sticker data with unlock system
  const stickerData = {
    love: {
      name: 'Love Stickers',
      stickers: [
        { emoji: '💖', unlocked: true, name: 'Heart' },
        { emoji: '💕', unlocked: true, name: 'Two Hearts' },
        { emoji: '💝', unlocked: true, name: 'Heart with Ribbon' },
        { emoji: '💗', unlocked: true, name: 'Growing Heart' },
        { emoji: '💓', unlocked: true, name: 'Beating Heart' },
        { emoji: '💞', unlocked: true, name: 'Revolving Hearts' },
        { emoji: '💟', unlocked: true, name: 'Heart Decoration' },
        { emoji: '💌', unlocked: false, name: 'Love Letter' },
        { emoji: '💋', unlocked: false, name: 'Kiss Mark' },
        { emoji: '💍', unlocked: false, name: 'Ring' },
        { emoji: '🌹', unlocked: false, name: 'Rose' },
        { emoji: '🌺', unlocked: false, name: 'Hibiscus' }
      ]
    },
    nature: {
      name: 'Nature Stickers',
      stickers: [
        { emoji: '🌿', unlocked: true, name: 'Herb' },
        { emoji: '🌸', unlocked: true, name: 'Cherry Blossom' },
        { emoji: '🌺', unlocked: true, name: 'Hibiscus' },
        { emoji: '🌹', unlocked: true, name: 'Rose' },
        { emoji: '🌷', unlocked: true, name: 'Tulip' },
        { emoji: '🌻', unlocked: true, name: 'Sunflower' },
        { emoji: '🌼', unlocked: true, name: 'Daisy' },
        { emoji: '🌾', unlocked: false, name: 'Sheaf of Rice' },
        { emoji: '🍃', unlocked: false, name: 'Leaf Fluttering' },
        { emoji: '🌱', unlocked: false, name: 'Seedling' },
        { emoji: '🌲', unlocked: false, name: 'Evergreen Tree' },
        { emoji: '🌳', unlocked: false, name: 'Deciduous Tree' }
      ]
    },
    food: {
      name: 'Food Stickers',
      stickers: [
        { emoji: '🍕', unlocked: true, name: 'Pizza' },
        { emoji: '🍔', unlocked: true, name: 'Hamburger' },
        { emoji: '🍟', unlocked: true, name: 'French Fries' },
        { emoji: '🌭', unlocked: true, name: 'Hot Dog' },
        { emoji: '🍿', unlocked: true, name: 'Popcorn' },
        { emoji: '🍩', unlocked: true, name: 'Doughnut' },
        { emoji: '🍪', unlocked: true, name: 'Cookie' },
        { emoji: '🍰', unlocked: false, name: 'Shortcake' },
        { emoji: '🍦', unlocked: false, name: 'Soft Ice Cream' },
        { emoji: '🍧', unlocked: false, name: 'Shaved Ice' },
        { emoji: '🍨', unlocked: false, name: 'Ice Cream' },
        { emoji: '🍩', unlocked: false, name: 'Doughnut' }
      ]
    },
    animals: {
      name: 'Animal Stickers',
      stickers: [
        { emoji: '🐰', unlocked: true, name: 'Rabbit' },
        { emoji: '🐱', unlocked: true, name: 'Cat' },
        { emoji: '🐶', unlocked: true, name: 'Dog' },
        { emoji: '🐼', unlocked: true, name: 'Panda' },
        { emoji: '🐨', unlocked: true, name: 'Koala' },
        { emoji: '🐯', unlocked: true, name: 'Tiger' },
        { emoji: '🦁', unlocked: true, name: 'Lion' },
        { emoji: '🐸', unlocked: false, name: 'Frog' },
        { emoji: '🐙', unlocked: false, name: 'Octopus' },
        { emoji: '🦄', unlocked: false, name: 'Unicorn' },
        { emoji: '🦋', unlocked: false, name: 'Butterfly' },
        { emoji: '🐞', unlocked: false, name: 'Lady Beetle' }
      ]
    },
    objects: {
      name: 'Object Stickers',
      stickers: [
        { emoji: '🎁', unlocked: true, name: 'Wrapped Gift' },
        { emoji: '🎈', unlocked: true, name: 'Balloon' },
        { emoji: '🎀', unlocked: true, name: 'Ribbon' },
        { emoji: '🎊', unlocked: true, name: 'Confetti Ball' },
        { emoji: '🎉', unlocked: true, name: 'Party Popper' },
        { emoji: '✨', unlocked: true, name: 'Sparkles' },
        { emoji: '💎', unlocked: true, name: 'Gem Stone' },
        { emoji: '🔮', unlocked: false, name: 'Crystal Ball' },
        { emoji: '🎭', unlocked: false, name: 'Performing Arts' },
        { emoji: '🎪', unlocked: false, name: 'Circus Tent' },
        { emoji: '🎨', unlocked: false, name: 'Artist Palette' },
        { emoji: '🎭', unlocked: false, name: 'Performing Arts' }
      ]
    },
    special: {
      name: 'Special Stickers',
      stickers: [
        { emoji: '⭐', unlocked: true, name: 'Star' },
        { emoji: '🌟', unlocked: true, name: 'Glowing Star' },
        { emoji: '💫', unlocked: true, name: 'Dizzy' },
        { emoji: '⚡', unlocked: true, name: 'High Voltage' },
        { emoji: '🔥', unlocked: true, name: 'Fire' },
        { emoji: '💎', unlocked: true, name: 'Gem Stone' },
        { emoji: '🌈', unlocked: false, name: 'Rainbow' },
        { emoji: '☀️', unlocked: false, name: 'Sun' },
        { emoji: '🌙', unlocked: false, name: 'Crescent Moon' },
        { emoji: '☁️', unlocked: false, name: 'Cloud' },
        { emoji: '❄️', unlocked: false, name: 'Snowflake' },
        { emoji: '🎆', unlocked: false, name: 'Fireworks' }
      ]
    }
  };

  // Challenges data
  const challenges = {
    'first-sticker': { name: 'First Sticker', description: 'Add your first sticker to the canvas!', requirement: 1, type: 'stickers' },
    'five-stickers': { name: 'Sticker Collector', description: 'Use 5 stickers in your designs!', requirement: 5, type: 'stickers' },
    'ten-stickers': { name: 'Sticker Master', description: 'Use 10 stickers in your designs!', requirement: 10, type: 'stickers' },
    'save-design': { name: 'Design Saver', description: 'Save your first design!', requirement: 1, type: 'saves' }
  };

  // Initialize the app
  function initApp() {
    console.log('🎨 Initializing Enhanced Sticker Wall...');
    
    loadUserProgress();
    setupCanvas();
    setupEventListeners();
    loadStickers();
    updateStatistics();
    updateUnlockProgress();
    
    console.log('✅ Sticker Wall initialized successfully!');
  }

  // Setup canvas
  function setupCanvas() {
    // Set canvas background
    ctx.fillStyle = '#fff0fb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Add canvas event listeners
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
  }

  // Setup event listeners
  function setupEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (clickSound) {
          clickSound.currentTime = 0;
          clickSound.volume = 0.3;
          clickSound.play().catch(() => {});
        }
        
        switchCategory(btn.dataset.category);
      });
    });

    // Action buttons
    if (clearBtn) clearBtn.addEventListener('click', clearCanvas);
    if (saveBtn) saveBtn.addEventListener('click', saveDesign);
    if (exportBtn) exportBtn.addEventListener('click', exportCanvas);

    // Challenge items
    document.querySelectorAll('.challenge-item').forEach(item => {
      item.addEventListener('click', () => {
        showChallengeInfo(item.dataset.challenge);
      });
    });
  }

  // Switch category
  function switchCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-category="${category}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
    
    loadStickers();
  }

  // Load stickers for current category
  function loadStickers() {
    if (!stickerGrid) return;
    
    const categoryData = stickerData[currentCategory];
    if (!categoryData) return;
    
    stickerGrid.innerHTML = '';
    
    categoryData.stickers.forEach(sticker => {
      const stickerEl = document.createElement('div');
      stickerEl.className = `sticker-item ${sticker.unlocked ? 'unlocked' : 'locked'}`;
      stickerEl.innerHTML = `
        <span class="sticker-emoji">${sticker.emoji}</span>
        <span class="sticker-name">${sticker.name}</span>
        ${!sticker.unlocked ? '<span class="lock-icon">🔒</span>' : ''}
      `;
      
      if (sticker.unlocked) {
        stickerEl.addEventListener('click', () => {
          if (stickerSound) {
            stickerSound.currentTime = 0;
            stickerSound.volume = 0.3;
            stickerSound.play().catch(() => {});
          }
          
          addStickerToCanvas(sticker.emoji);
        });
      }
      
      stickerGrid.appendChild(stickerEl);
    });
  }

  // Add sticker to canvas
  function addStickerToCanvas(emoji) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.random() * (canvas.width - 40) + 20;
    const y = Math.random() * (canvas.height - 40) + 20;
    
    // Add to current design
    currentDesign.push({
      type: 'sticker',
      emoji: emoji,
      x: x,
      y: y,
      timestamp: Date.now()
    });
    
    // Draw on canvas
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, x, y);
    
    stickersPlaced++;
    updateStatistics();
    checkChallenges();
  }

  // Handle canvas click
  function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add a random sticker at click position
    const categories = Object.keys(stickerData);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryData = stickerData[randomCategory];
    const unlockedStickers = categoryData.stickers.filter(s => s.unlocked);
    
    if (unlockedStickers.length > 0) {
      const randomSticker = unlockedStickers[Math.floor(Math.random() * unlockedStickers.length)];
      addStickerToCanvas(randomSticker.emoji);
    }
  }

  // Drawing functionality
  function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  }

  function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    lastX = x;
    lastY = y;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  // Clear canvas
  function clearCanvas() {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    ctx.fillStyle = '#fff0fb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border back
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    currentDesign = [];
    updateStatistics();
  }

  // Save design
  function saveDesign() {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    const design = {
      data: currentDesign,
      timestamp: Date.now(),
      stickerCount: stickersPlaced
    };
    
    const savedDesigns = JSON.parse(localStorage.getItem('stickerDesigns') || '[]');
    savedDesigns.push(design);
    localStorage.setItem('stickerDesigns', JSON.stringify(savedDesigns));
    
    designsSavedCount++;
    updateStatistics();
    checkChallenges();
    
    showMessage('Design saved! 💾');
  }

  // Export canvas
  function exportCanvas() {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
    
    const link = document.createElement('a');
    link.download = `sticker-wall-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    showMessage('Canvas exported! 📤');
  }

  // Check challenges
  function checkChallenges() {
    Object.keys(challenges).forEach(challengeId => {
      const challenge = challenges[challengeId];
      const challengeEl = document.querySelector(`[data-challenge="${challengeId}"]`);
      
      if (!challengeEl) return;
      
      let progress = 0;
      switch (challenge.type) {
        case 'stickers':
          progress = stickersPlaced;
          break;
        case 'saves':
          progress = designsSavedCount;
          break;
      }
      
      if (progress >= challenge.requirement) {
        unlockChallenge(challengeId, challenge);
      }
    });
  }

  // Unlock challenge
  function unlockChallenge(challengeId, challenge) {
    const challengeEl = document.querySelector(`[data-challenge="${challengeId}"]`);
    if (!challengeEl || challengeEl.classList.contains('completed')) return;
    
    challengeEl.classList.add('completed');
    const statusEl = challengeEl.querySelector('.challenge-status');
    if (statusEl) {
      statusEl.textContent = '✅';
    }
    
    // Unlock new stickers
    unlockNewStickers();
    
    // Show achievement
    showAchievement(challenge.name, challenge.description);
  }

  // Unlock new stickers
  function unlockNewStickers() {
    let unlocked = 0;
    
    Object.keys(stickerData).forEach(category => {
      stickerData[category].stickers.forEach(sticker => {
        if (!sticker.unlocked && Math.random() < 0.3) { // 30% chance to unlock
          sticker.unlocked = true;
          unlocked++;
        }
      });
    });
    
    if (unlocked > 0) {
      unlockedStickers += unlocked;
      updateUnlockProgress();
      loadStickers(); // Refresh display
      showMessage(`Unlocked ${unlocked} new stickers! 🔓`);
    }
  }

  // Show achievement
  function showAchievement(title, description) {
    if (achievementSound) {
      achievementSound.currentTime = 0;
      achievementSound.volume = 0.3;
      achievementSound.play().catch(() => {});
    }
    
    achievementDesc.textContent = description;
    achievementModal.style.display = 'flex';
    
    setTimeout(() => {
      achievementModal.style.display = 'none';
    }, 3000);
  }

  // Close achievement modal
  window.closeAchievementModal = function() {
    achievementModal.style.display = 'none';
  };

  // Show challenge info
  function showChallengeInfo(challengeId) {
    const challenge = challenges[challengeId];
    if (!challenge) return;
    
    let progress = 0;
    switch (challenge.type) {
      case 'stickers':
        progress = stickersPlaced;
        break;
      case 'saves':
        progress = designsSavedCount;
        break;
    }
    
    showMessage(`${challenge.name}: ${progress}/${challenge.requirement} - ${challenge.description}`);
  }

  // Update statistics
  function updateStatistics() {
    if (stickersUsed) stickersUsed.textContent = stickersPlaced;
    if (designsSaved) designsSaved.textContent = designsSavedCount;
    if (stickersUnlocked) stickersUnlocked.textContent = unlockedStickers;
  }

  // Update unlock progress
  function updateUnlockProgress() {
    let total = 0;
    let unlocked = 0;
    
    Object.keys(stickerData).forEach(category => {
      stickerData[category].stickers.forEach(sticker => {
        total++;
        if (sticker.unlocked) unlocked++;
      });
    });
    
    if (unlockedCount) unlockedCount.textContent = unlocked;
    if (totalCount) totalCount.textContent = total;
    if (unlockProgress) {
      const percentage = (unlocked / total) * 100;
      unlockProgress.style.width = `${percentage}%`;
    }
  }

  // Load user progress
  function loadUserProgress() {
    const saved = localStorage.getItem('stickerWallProgress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        stickersPlaced = progress.stickersPlaced || 0;
        designsSavedCount = progress.designsSaved || 0;
        unlockedStickers = progress.unlockedStickers || 0;
        
        // Load unlocked stickers
        if (progress.unlockedStickerIds) {
          Object.keys(stickerData).forEach(category => {
            stickerData[category].stickers.forEach(sticker => {
              if (progress.unlockedStickerIds.includes(`${category}-${sticker.emoji}`)) {
                sticker.unlocked = true;
              }
            });
          });
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }

  // Save user progress
  function saveUserProgress() {
    const progress = {
      stickersPlaced,
      designsSaved: designsSavedCount,
      unlockedStickers,
      unlockedStickerIds: []
    };
    
    Object.keys(stickerData).forEach(category => {
      stickerData[category].stickers.forEach(sticker => {
        if (sticker.unlocked) {
          progress.unlockedStickerIds.push(`${category}-${sticker.emoji}`);
        }
      });
    });
    
    localStorage.setItem('stickerWallProgress', JSON.stringify(progress));
  }

  // Show message
  function showMessage(message) {
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.remove();
    }, 3000);
  }

  // Save progress periodically
  setInterval(saveUserProgress, 30000);

  // Initialize the app
  initApp();
});