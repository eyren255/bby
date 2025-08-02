// 🏆 Modern Scoreboard JavaScript - Robust & Bug-Free
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const totalGamesEl = document.getElementById('totalGames');
  const totalPointsEl = document.getElementById('totalPoints');
  const bestScoreEl = document.getElementById('bestScore');
  const memoryBestScoreEl = document.getElementById('memoryBestScore');
  const memoryFastestTimeEl = document.getElementById('memoryFastestTime');
  const memoryGamesCompletedEl = document.getElementById('memoryGamesCompleted');
  const memoryScoresEl = document.getElementById('memoryScores');
  const badgesContainerEl = document.getElementById('badgesContainer');
  const refreshBtn = document.getElementById('refreshBtn');
  const clickSound = document.getElementById('clickSound');
  const achievementSound = document.getElementById('achievementSound');

  // Current memory difficulty level
  let currentMemoryLevel = 'easy';
  let achievements = [];
  let isInitialized = false;

  // Local Storage Keys
  const STORAGE_KEYS = {
    MEMORY_SCORES: 'loveMemoryScores',
    ACHIEVEMENTS: 'loveAchievements',
    OVERVIEW_STATS: 'loveOverviewStats'
  };

  // Initialize scoreboard with error handling
  async function initializeScoreboard() {
    try {
      if (isInitialized) return;
      
      console.log('🏆 Initializing Scoreboard...');
      
      // Load data in parallel for better performance
      await Promise.all([
        loadOverviewStats(),
        loadMemoryStats(),
        loadAchievements()
      ]);
      
      createAchievementBadges();
      setupEventListeners();
      
      // Show welcome message only once
      if (!localStorage.getItem('scoreboardWelcomeShown')) {
        showWelcomeMessage();
        localStorage.setItem('scoreboardWelcomeShown', 'true');
      }
      
      isInitialized = true;
      console.log('✅ Scoreboard initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing scoreboard:', error);
      showErrorMessage('Failed to load scoreboard data. Please try refreshing.');
    }
  }

  // Show error message
  function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff6b6b;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // Show welcome message for new users
  function showWelcomeMessage() {
    const totalGames = parseInt(totalGamesEl.textContent) || 0;
    if (totalGames === 0) {
      const welcomeMsg = document.createElement('div');
      welcomeMsg.className = 'welcome-message';
      welcomeMsg.innerHTML = `
        <div class="welcome-content">
          <h3>🎉 Welcome to Your Love Scoreboard!</h3>
          <p>Start playing games to earn achievements and track your progress! 💕</p>
          <button class="welcome-btn" onclick="this.parentElement.parentElement.remove()">Got it! 💖</button>
        </div>
      `;
      document.body.appendChild(welcomeMsg);
    }
  }

  // Load overview statistics from cloud or localStorage
  async function loadOverviewStats() {
    try {
      let stats = {
        totalGames: 0,
        totalPoints: 0,
        bestScore: 0
      };
      let cloudDataAvailable = false;

      // Try to load from cloud first
      try {
        if (typeof ScoreboardService !== 'undefined' && ScoreboardService.getGameStats) {
          const memoryEasyStats = await ScoreboardService.getGameStats('memory_easy');
          const memoryMediumStats = await ScoreboardService.getGameStats('memory_medium');
          const memoryHardStats = await ScoreboardService.getGameStats('memory_hard');
          
          if (memoryEasyStats || memoryMediumStats || memoryHardStats) {
            // Calculate totals from cloud data
            const totalGames = (memoryEasyStats?.stats?.gamesCompleted || 0) +
                              (memoryMediumStats?.stats?.gamesCompleted || 0) +
                              (memoryHardStats?.stats?.gamesCompleted || 0);
            
            const totalPoints = (memoryEasyStats?.stats?.totalPoints || 0) +
                               (memoryMediumStats?.stats?.totalPoints || 0) +
                               (memoryHardStats?.stats?.totalPoints || 0);
            
            const bestScore = Math.max(
              memoryEasyStats?.stats?.bestScore || 0,
              memoryMediumStats?.stats?.bestScore || 0,
              memoryHardStats?.stats?.bestScore || 0
            );

            stats = { totalGames, totalPoints, bestScore };
            cloudDataAvailable = true;
            console.log('☁️ Loaded overview stats from cloud');
          }
        }
      } catch (error) {
        console.log('📱 Cloud data not available, using localStorage');
      }

      // Fallback to localStorage if cloud data is not available
      if (!cloudDataAvailable) {
        const savedStats = localStorage.getItem(STORAGE_KEYS.OVERVIEW_STATS);
        if (savedStats) {
          stats = JSON.parse(savedStats);
        } else {
          stats = calculateOverviewStats();
        }
        console.log('📱 Loaded overview stats from localStorage');
      }

      // Update overview stats with animations
      animateNumber(totalGamesEl, stats.totalGames);
      animateNumber(totalPointsEl, stats.totalPoints);
      animateNumber(bestScoreEl, stats.bestScore);
      
    } catch (error) {
      console.error('Error loading overview stats:', error);
      // Set default values
      totalGamesEl.textContent = '0';
      totalPointsEl.textContent = '0';
      bestScoreEl.textContent = '0';
    }
  }

  // Calculate overview stats from memory scores
  function calculateOverviewStats() {
    const memoryScores = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMORY_SCORES) || '{}');
    let totalGames = 0;
    let totalPoints = 0;
    let bestScore = 0;

    Object.values(memoryScores).forEach(levelScores => {
      if (Array.isArray(levelScores)) {
        totalGames += levelScores.length;
        levelScores.forEach(score => {
          totalPoints += score.score || 0;
          if (score.score > bestScore) {
            bestScore = score.score;
          }
        });
      }
    });

    const stats = { totalGames, totalPoints, bestScore };
    localStorage.setItem(STORAGE_KEYS.OVERVIEW_STATS, JSON.stringify(stats));
    return stats;
  }

  // Animate number changes with improved performance
  function animateNumber(element, targetValue) {
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    const difference = targetValue - currentValue;
    
    if (difference === 0) return;
    
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = difference / steps;
    let current = currentValue;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current += increment;
      
      if (step >= steps) {
        element.textContent = targetValue;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, duration / steps);
  }

  // Load memory statistics from cloud or localStorage
  async function loadMemoryStats() {
    try {
      let levelScores = [];
      let cloudDataAvailable = false;

      // Try to load from cloud first
      try {
        if (typeof ScoreboardService !== 'undefined' && ScoreboardService.getGameScores) {
          const cloudScores = await ScoreboardService.getGameScores(`memory_${currentMemoryLevel}`);
          if (cloudScores && Array.isArray(cloudScores)) {
            levelScores = cloudScores;
            cloudDataAvailable = true;
            console.log('☁️ Loaded scores from cloud');
          }
        }
      } catch (error) {
        console.log('📱 Cloud data not available, using localStorage');
      }

      // Fallback to localStorage if cloud data is not available
      if (!cloudDataAvailable) {
        const memoryScores = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMORY_SCORES) || '{}');
        levelScores = memoryScores[`memory_${currentMemoryLevel}`] || [];
        console.log('📱 Loaded scores from localStorage');
      }
      
      // Calculate stats for current level
      const stats = calculateLevelStats(levelScores);
      
      // Update display
      memoryBestScoreEl.textContent = stats.bestScore || 'None';
      memoryFastestTimeEl.textContent = stats.fastestTime || 'None';
      memoryGamesCompletedEl.textContent = stats.gamesCompleted || 0;
      
      // Display recent scores
      displayMemoryScores(levelScores);
      
    } catch (error) {
      console.error('Error loading memory stats:', error);
      // Set default values
      memoryBestScoreEl.textContent = 'None';
      memoryFastestTimeEl.textContent = 'None';
      memoryGamesCompletedEl.textContent = '0';
      displayMemoryScores([]);
    }
  }

  // Calculate stats for a specific level
  function calculateLevelStats(scores) {
    if (!Array.isArray(scores) || scores.length === 0) {
      return { bestScore: null, fastestTime: null, gamesCompleted: 0 };
    }

    const bestScore = Math.min(...scores.map(s => s.score));
    const fastestTime = Math.min(...scores.map(s => s.time || Infinity));
    const gamesCompleted = scores.length;

    return {
      bestScore: bestScore === Infinity ? null : bestScore,
      fastestTime: fastestTime === Infinity ? null : formatTime(fastestTime),
      gamesCompleted
    };
  }

  // Format time for display
  function formatTime(seconds) {
    if (!seconds || seconds === Infinity) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Display memory scores with enhanced UI
  function displayMemoryScores(scores) {
    if (!memoryScoresEl) return;
    
    memoryScoresEl.innerHTML = '';
    
    if (!Array.isArray(scores) || scores.length === 0) {
      memoryScoresEl.innerHTML = `
        <div class="no-scores">
          <div class="no-scores-icon">🎮</div>
          <div class="no-scores-text">No scores yet</div>
          <div class="no-scores-subtext">Start playing to see your achievements!</div>
        </div>
      `;
      return;
    }
    
    // Sort scores by score (lower is better for memory match)
    const sortedScores = scores.sort((a, b) => a.score - b.score);
    
    sortedScores.slice(0, 5).forEach((score, index) => {
      const scoreItem = document.createElement('div');
      scoreItem.className = 'score-item';
      scoreItem.style.animationDelay = `${index * 0.1}s`;
      
      const date = new Date(score.timestamp || Date.now()).toLocaleDateString();
      const time = new Date(score.timestamp || Date.now()).toLocaleTimeString([], {
        hour: '2-digit', 
        minute: '2-digit'
      });
      
      // Add medal for top scores
      let medal = '';
      if (index === 0) medal = '🥇';
      else if (index === 1) medal = '🥈';
      else if (index === 2) medal = '🥉';
      
      scoreItem.innerHTML = `
        <div class="score-medal">${medal}</div>
        <div class="score-info">
          <div class="score-value">${score.score} moves</div>
          <div class="score-details">${score.time ? formatTime(score.time) : 'No time recorded'}</div>
        </div>
        <div class="score-date">
          <div class="score-date-day">${date}</div>
          <div class="score-date-time">${time}</div>
        </div>
      `;
      
      memoryScoresEl.appendChild(scoreItem);
    });
  }

  // Load achievements from localStorage
  async function loadAchievements() {
    try {
      const savedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (savedAchievements) {
        achievements = JSON.parse(savedAchievements);
      } else {
        achievements = createDefaultAchievements();
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      }
      
      // Update achievement progress
      updateAchievementProgress();
      
    } catch (error) {
      console.error('Error loading achievements:', error);
      achievements = createDefaultAchievements();
    }
  }

  // Create default achievements
  function createDefaultAchievements() {
    return [
      {
        id: 'memory_beginner',
        icon: '🧠',
        title: 'Memory Beginner',
        description: 'Complete Easy level',
        unlocked: false,
        progress: 0,
        required: 1
      },
      {
        id: 'memory_expert',
        icon: '🧩',
        title: 'Memory Expert',
        description: 'Complete Medium level',
        unlocked: false,
        progress: 0,
        required: 1
      },
      {
        id: 'memory_master',
        icon: '🎯',
        title: 'Memory Master',
        description: 'Complete Hard level',
        unlocked: false,
        progress: 0,
        required: 1
      },
      {
        id: 'speed_demon',
        icon: '⚡',
        title: 'Speed Demon',
        description: 'Complete game in under 2 minutes',
        unlocked: false,
        progress: 0,
        required: 1
      },
      {
        id: 'perfect_match',
        icon: '💖',
        title: 'Perfect Match',
        description: 'Complete with no mistakes',
        unlocked: false,
        progress: 0,
        required: 1
      },
      {
        id: 'dedicated_player',
        icon: '🎮',
        title: 'Dedicated Player',
        description: 'Play 10 games total',
        unlocked: false,
        progress: 0,
        required: 10
      },
      {
        id: 'love_champion',
        icon: '🏆',
        title: 'Love Champion',
        description: 'Unlock all achievements',
        unlocked: false,
        progress: 0,
        required: 6
      }
    ];
  }

  // Update achievement progress based on current data
  function updateAchievementProgress() {
    const memoryScores = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMORY_SCORES) || '{}');
    const totalGames = Object.values(memoryScores).reduce((total, scores) => {
      return total + (Array.isArray(scores) ? scores.length : 0);
    }, 0);

    // Update achievements based on current data
    achievements.forEach(achievement => {
      switch (achievement.id) {
        case 'memory_beginner':
          achievement.progress = memoryScores.memory_easy?.length || 0;
          achievement.unlocked = achievement.progress >= achievement.required;
          break;
        case 'memory_expert':
          achievement.progress = memoryScores.memory_medium?.length || 0;
          achievement.unlocked = achievement.progress >= achievement.required;
          break;
        case 'memory_master':
          achievement.progress = memoryScores.memory_hard?.length || 0;
          achievement.unlocked = achievement.progress >= achievement.required;
          break;
        case 'dedicated_player':
          achievement.progress = totalGames;
          achievement.unlocked = achievement.progress >= achievement.required;
          break;
        case 'love_champion':
          const unlockedCount = achievements.filter(a => a.unlocked && a.id !== 'love_champion').length;
          achievement.progress = unlockedCount;
          achievement.unlocked = achievement.progress >= achievement.required;
          break;
      }
    });

    // Save updated achievements
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  // Create achievement badges with enhanced UI
  function createAchievementBadges() {
    if (!badgesContainerEl) return;
    
    badgesContainerEl.innerHTML = '';
    
    achievements.forEach(badge => {
      const badgeEl = document.createElement('div');
      badgeEl.className = `badge ${badge.unlocked ? 'unlocked' : 'locked'}`;
      
      const progressPercent = Math.min((badge.progress / badge.required) * 100, 100);
      
      badgeEl.innerHTML = `
        <div class="badge-content">
          <span class="badge-icon">${badge.icon}</span>
          <div class="badge-info">
            <div class="badge-title">${badge.title}</div>
            <div class="badge-description">${badge.description}</div>
            <div class="badge-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
              </div>
              <span class="progress-text">${badge.progress}/${badge.required}</span>
            </div>
          </div>
        </div>
        ${badge.unlocked ? '<div class="unlock-sparkle">✨</div>' : ''}
      `;
      
      badgeEl.addEventListener('click', () => {
        showBadgeDetails(badge);
      });
      
      badgesContainerEl.appendChild(badgeEl);
    });
  }

  // Show badge details with enhanced modal
  function showBadgeDetails(badge) {
    try {
      if (achievementSound) {
        achievementSound.currentTime = 0;
        achievementSound.volume = 0.3;
        achievementSound.play().catch(() => {});
      }
      
      const modal = document.createElement('div');
      modal.className = 'badge-modal';
      modal.innerHTML = `
        <div class="badge-modal-content">
          <div class="badge-modal-header">
            <span class="badge-modal-icon">${badge.icon}</span>
            <h3>${badge.title}</h3>
            <button class="modal-close">×</button>
          </div>
          <div class="badge-modal-body">
            <p>${badge.description}</p>
            <div class="badge-progress-detail">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(badge.progress / badge.required) * 100}%"></div>
              </div>
              <span>${badge.progress}/${badge.required}</span>
            </div>
            ${badge.unlocked ? '<div class="achievement-unlocked">🎉 Achievement Unlocked!</div>' : ''}
          </div>
          <button class="modal-close-btn">Got it! 💕</button>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Close modal functionality
      modal.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.remove();
        });
      });
      
      // Close on outside click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
    } catch (error) {
      console.error('Error showing badge details:', error);
    }
  }

  // Setup event listeners with error handling
  function setupEventListeners() {
    try {
      // Refresh button with loading state
      if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
          try {
            if (clickSound) {
              clickSound.currentTime = 0;
              clickSound.volume = 0.3;
              clickSound.play().catch(() => {});
            }
            
            refreshBtn.innerHTML = '<span class="refresh-icon spinning">🔄</span><span class="refresh-text">Refreshing...</span>';
            refreshBtn.disabled = true;
            
            await initializeScoreboard();
            
          } catch (error) {
            console.error('Error refreshing:', error);
            showErrorMessage('Failed to refresh data. Please try again.');
          } finally {
            refreshBtn.innerHTML = '<span class="refresh-icon">🔄</span><span class="refresh-text">Refresh Scores</span>';
            refreshBtn.disabled = false;
          }
        });
      }

      // Memory difficulty tabs with enhanced feedback
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            if (clickSound) {
              clickSound.currentTime = 0;
              clickSound.volume = 0.3;
              clickSound.play().catch(() => {});
            }
            
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update current level and reload stats
            currentMemoryLevel = btn.dataset.level;
            await loadMemoryStats();
            
          } catch (error) {
            console.error('Error switching tabs:', error);
          }
        });
      });
      
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  // Initialize the scoreboard
  initializeScoreboard();
}); 