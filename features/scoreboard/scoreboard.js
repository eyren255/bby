// 🏆 Enhanced Scoreboard JavaScript
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

  // Initialize scoreboard
  async function initializeScoreboard() {
    try {
      await loadOverviewStats();
      await loadMemoryStats();
      await loadAchievements();
      createAchievementBadges();
      setupEventListeners();
      showWelcomeMessage();
    } catch (error) {
      console.error('Error initializing scoreboard:', error);
    }
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

  // Load overview statistics
  async function loadOverviewStats() {
    try {
      // Load memory stats for all levels
      const memoryEasyStats = await ScoreboardService.getGameStats('memory_easy');
      const memoryMediumStats = await ScoreboardService.getGameStats('memory_medium');
      const memoryHardStats = await ScoreboardService.getGameStats('memory_hard');
      
      // Calculate totals
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

      // Update overview stats with animations
      animateNumber(totalGamesEl, totalGames);
      animateNumber(totalPointsEl, totalPoints);
      animateNumber(bestScoreEl, bestScore);
      
    } catch (error) {
      console.error('Error loading overview stats:', error);
    }
  }

  // Animate number changes
  function animateNumber(element, targetValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const increment = (targetValue - currentValue) / 20;
    let current = currentValue;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= targetValue) || 
          (increment < 0 && current <= targetValue)) {
        element.textContent = targetValue;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 50);
  }

  // Load memory statistics
  async function loadMemoryStats() {
    try {
      const stats = await ScoreboardService.getGameStats(`memory_${currentMemoryLevel}`);
      const scores = await ScoreboardService.getGameScores(`memory_${currentMemoryLevel}`);
      
      if (stats && stats.stats) {
        memoryBestScoreEl.textContent = stats.stats.bestScore || 'None';
        memoryFastestTimeEl.textContent = formatTime(stats.stats.fastestTime) || 'None';
        memoryGamesCompletedEl.textContent = stats.stats.gamesCompleted || 0;
      } else {
        memoryBestScoreEl.textContent = 'None';
        memoryFastestTimeEl.textContent = 'None';
        memoryGamesCompletedEl.textContent = '0';
      }
      
      // Display recent scores
      displayMemoryScores(scores);
      
    } catch (error) {
      console.error('Error loading memory stats:', error);
    }
  }

  // Format time for display
  function formatTime(seconds) {
    if (!seconds) return 'None';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Display memory scores with enhanced UI
  function displayMemoryScores(scores) {
    memoryScoresEl.innerHTML = '';
    
    if (scores.length === 0) {
      memoryScoresEl.innerHTML = `
        <div class="no-scores">
          <div class="no-scores-icon">🎮</div>
          <div class="no-scores-text">No scores yet</div>
          <div class="no-scores-subtext">Start playing to see your achievements!</div>
        </div>
      `;
      return;
    }
    
    scores.slice(0, 5).forEach((score, index) => {
      const scoreItem = document.createElement('div');
      scoreItem.className = 'score-item';
      scoreItem.style.animationDelay = `${index * 0.1}s`;
      
      const date = new Date(score.created_at).toLocaleDateString();
      const time = new Date(score.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const details = score.details?.scoreText || `${score.score} moves`;
      
      // Add medal for top scores
      let medal = '';
      if (index === 0) medal = '🥇';
      else if (index === 1) medal = '🥈';
      else if (index === 2) medal = '🥉';
      
      scoreItem.innerHTML = `
        <div class="score-medal">${medal}</div>
        <div class="score-info">
          <div class="score-value">${score.score} moves</div>
          <div class="score-details">${details}</div>
        </div>
        <div class="score-date">
          <div class="score-date-day">${date}</div>
          <div class="score-date-time">${time}</div>
        </div>
      `;
      
      memoryScoresEl.appendChild(scoreItem);
    });
  }

  // Load achievements from localStorage or create default ones
  async function loadAchievements() {
    const savedAchievements = localStorage.getItem('loveAchievements');
    if (savedAchievements) {
      achievements = JSON.parse(savedAchievements);
    } else {
      achievements = [
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
      localStorage.setItem('loveAchievements', JSON.stringify(achievements));
    }
  }

  // Create achievement badges with enhanced UI
  function createAchievementBadges() {
    badgesContainerEl.innerHTML = '';
    
    achievements.forEach(badge => {
      const badgeEl = document.createElement('div');
      badgeEl.className = `badge ${badge.unlocked ? 'unlocked' : 'locked'}`;
      
      const progressPercent = (badge.progress / badge.required) * 100;
      
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
  }

  // Setup event listeners
  function setupEventListeners() {
    // Refresh button with loading state
    refreshBtn.addEventListener('click', async () => {
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.3;
        clickSound.play().catch(() => {});
      }
      
      refreshBtn.innerHTML = '<span class="refresh-icon spinning">🔄</span><span class="refresh-text">Refreshing...</span>';
      refreshBtn.disabled = true;
      
      try {
        await initializeScoreboard();
      } finally {
        refreshBtn.innerHTML = '<span class="refresh-icon">🔄</span><span class="refresh-text">Refresh Scores</span>';
        refreshBtn.disabled = false;
      }
    });

    // Memory difficulty tabs with enhanced feedback
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
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
      });
    });
  }

  // Initialize the scoreboard
  initializeScoreboard();
}); 