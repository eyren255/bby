// 🏆 Scoreboard JavaScript
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

  // Initialize scoreboard
  async function initializeScoreboard() {
    try {
      await loadOverviewStats();
      await loadMemoryStats();
      createAchievementBadges();
      setupEventListeners();
    } catch (error) {
      console.error('Error initializing scoreboard:', error);
    }
  }

  // Load overview statistics
  async function loadOverviewStats() {
    try {
      // Load memory stats for all levels
      const memoryEasyStats = await ScoreboardService.getGameStats('memory_easy');
      const memoryMediumStats = await ScoreboardService.getGameStats('memory_medium');
      const memoryHardStats = await ScoreboardService.getGameStats('memory_hard');
      
      // Calculate totals (only memory games)
      const totalGames = (memoryEasyStats?.stats?.gamesCompleted || 0) +
                        (memoryMediumStats?.stats?.gamesCompleted || 0) +
                        (memoryHardStats?.stats?.gamesCompleted || 0);
      
      // No points system
      const totalPoints = 0;
      
      const bestScore = Math.max(
        memoryEasyStats?.stats?.bestScore || 0,
        memoryMediumStats?.stats?.bestScore || 0,
        memoryHardStats?.stats?.bestScore || 0
      );

      // Update overview stats
      totalGamesEl.textContent = totalGames;
      totalPointsEl.textContent = totalPoints;
      bestScoreEl.textContent = bestScore;
      
    } catch (error) {
      console.error('Error loading overview stats:', error);
    }
  }

  // Load memory statistics
  async function loadMemoryStats() {
    try {
      const stats = await ScoreboardService.getGameStats(`memory_${currentMemoryLevel}`);
      const scores = await ScoreboardService.getGameScores(`memory_${currentMemoryLevel}`);
      
      if (stats && stats.stats) {
        memoryBestScoreEl.textContent = stats.stats.bestScore || 'None';
        memoryFastestTimeEl.textContent = stats.stats.fastestTime || 'None';
        memoryGamesCompletedEl.textContent = stats.stats.gamesCompleted || 0;
      }
      
      // Display recent scores
      displayMemoryScores(scores);
      
    } catch (error) {
      console.error('Error loading memory stats:', error);
    }
  }

  // Display memory scores
  function displayMemoryScores(scores) {
    memoryScoresEl.innerHTML = '';
    
    if (scores.length === 0) {
      memoryScoresEl.innerHTML = '<div class="loading">No scores yet. Start playing!</div>';
      return;
    }
    
    scores.slice(0, 5).forEach(score => {
      const scoreItem = document.createElement('div');
      scoreItem.className = 'score-item';
      
      const date = new Date(score.created_at).toLocaleDateString();
      const details = score.details?.scoreText || `${score.score} moves`;
      
      scoreItem.innerHTML = `
        <div class="score-info">
          <div class="score-value">${score.score} moves</div>
          <div class="score-details">${details}</div>
        </div>
        <div class="score-date">${date}</div>
      `;
      
      memoryScoresEl.appendChild(scoreItem);
    });
  }

  // Create achievement badges
  function createAchievementBadges() {
    const badges = [
      {
        id: 'memory_beginner',
        icon: '🧠',
        title: 'Memory Beginner',
        description: 'Complete Easy level',
        unlocked: false
      },
      {
        id: 'memory_expert',
        icon: '🧩',
        title: 'Memory Expert',
        description: 'Complete Medium level',
        unlocked: false
      },
      {
        id: 'memory_master',
        icon: '🎯',
        title: 'Memory Master',
        description: 'Complete Hard level',
        unlocked: false
      },
      {
        id: 'speed_demon',
        icon: '⚡',
        title: 'Speed Demon',
        description: 'Complete game in under 2 minutes',
        unlocked: false
      },
      {
        id: 'perfect_match',
        icon: '💖',
        title: 'Perfect Match',
        description: 'Complete with no mistakes',
        unlocked: false
      }
    ];

    badgesContainerEl.innerHTML = '';
    
    badges.forEach(badge => {
      const badgeEl = document.createElement('div');
      badgeEl.className = `badge ${badge.unlocked ? '' : 'locked'}`;
      badgeEl.innerHTML = `
        <span class="badge-icon">${badge.icon}</span>
        <div class="badge-title">${badge.title}</div>
        <div class="badge-description">${badge.description}</div>
      `;
      
      badgeEl.addEventListener('click', () => {
        if (badge.unlocked) {
          showBadgeDetails(badge);
        }
      });
      
      badgesContainerEl.appendChild(badgeEl);
    });
  }

  // Show badge details
  function showBadgeDetails(badge) {
    if (achievementSound) {
      achievementSound.currentTime = 0;
      achievementSound.volume = 0.3;
      achievementSound.play().catch(() => {});
    }
    
    // Create a simple alert for now
    alert(`🏆 Achievement Unlocked!\n\n${badge.title}\n${badge.description}`);
  }

  // Setup event listeners
  function setupEventListeners() {
    // Refresh button
    refreshBtn.addEventListener('click', async () => {
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.3;
        clickSound.play().catch(() => {});
      }
      
      refreshBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        refreshBtn.style.transform = '';
      }, 200);
      
      await initializeScoreboard();
    });

    // Memory difficulty tabs
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