// 🌸 Enhanced floating hearts with better distribution
function createFloatingHearts() {
  for (let i = 0; i < 25; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDelay = Math.random() * 5 + "s";
    heart.style.animationDuration = (Math.random() * 3 + 4) + "s";
    heart.style.opacity = Math.random() * 0.5 + 0.3;
    document.body.appendChild(heart);
  }
}

// Initialize floating hearts
createFloatingHearts();

// Check for new messages when page loads
checkForNewMessages();

// 🎵 Enhanced tap-to-start screen with better UX
window.addEventListener('click', () => {
  const music = document.getElementById('bgMusic');
  const tapScreen = document.getElementById('tapToStart');
  const menu = document.querySelector('.menu');
  const passwordModal = document.getElementById('passwordModal');

  // Only handle tap if password modal is not visible
  if (passwordModal && passwordModal.style.display === 'flex') {
    return;
  }

  if (tapScreen && tapScreen.style.opacity !== '0' && tapScreen.style.display !== 'none') {
    // Fade out tap screen
    tapScreen.style.opacity = '0';
    tapScreen.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      tapScreen.remove();
      // Show menu with animation
      if (menu) {
        menu.style.display = 'block';
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(20px)';
        
        // Animate menu appearance
        requestAnimationFrame(() => {
          menu.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
          menu.style.opacity = '1';
          menu.style.transform = 'translateY(0)';
        });
      }
    }, 800);
  }

  // Start music with better error handling
  if (music && music.paused) {
    music.muted = false;
    music.volume = 0.3; // Lower volume for better UX
    music.play().catch((e) => {
      console.log("Audio play error:", e);
      // Create a user-friendly message for audio issues
      showAudioMessage();
    });
  }
}, { once: true });

// 🎧 Show audio message if autoplay is blocked
function showAudioMessage() {
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(145deg, #ff69b4, #ff8fab);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 0.9rem;
    box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
    z-index: 10001;
    animation: slideInRight 0.5s ease;
  `;
  message.textContent = '🎵 Click anywhere to enable music';
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.style.animation = 'slideOutRight 0.5s ease';
    setTimeout(() => message.remove(), 500);
  }, 3000);
}

// 👀 Enhanced reveal surprise section
document.getElementById("revealBtn")?.addEventListener("click", () => {
  const surprise = document.querySelector(".surprise");
  const revealBtn = document.getElementById("revealBtn");
  
  if (surprise && revealBtn) {
    // Animate button disappearance
    revealBtn.style.transform = 'scale(0.8)';
    revealBtn.style.opacity = '0';
    
    setTimeout(() => {
      revealBtn.style.display = 'none';
      
      // Animate surprise section appearance
      surprise.classList.remove("hidden");
      surprise.style.opacity = '0';
      surprise.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        surprise.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        surprise.style.opacity = '1';
        surprise.style.transform = 'translateY(0)';
      });
    }, 300);
  }

  // Start background music as safeguard
  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic && bgMusic.paused) {
    bgMusic.muted = false;
    bgMusic.volume = 0.3;
    bgMusic.play().catch((e) => console.log("Autoplay still blocked:", e));
  }
});

// 🎯 Enhanced click sound with better timing and visual feedback
document.addEventListener('click', function (e) {
  const clickSound = document.getElementById('clickSound');
  const link = e.target.closest('a.menu-button');
  const button = e.target.closest('button.reveal-button');
  const passwordModal = document.getElementById('passwordModal');

  // Don't handle menu clicks if password modal is visible
  if (passwordModal && passwordModal.style.display === 'flex') {
    return;
  }

  if (link) {
    e.preventDefault(); // Stop instant navigation

    // Add visual feedback
    link.style.transform = 'scale(0.95)';
    setTimeout(() => {
      link.style.transform = '';
    }, 150);

    // Play sound with better error handling
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.4;
      clickSound.play().catch(() => {});
    }

    // Navigate after short delay with loading effect
    const href = link.getAttribute('href');
    setTimeout(() => {
      // Add loading state
      document.body.style.cursor = 'wait';
      window.location.href = href;
    }, 300);
  }

  if (button) {
    // Add visual feedback for reveal button
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);

    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.4;
      clickSound.play().catch(() => {});
    }
  }
});

// 🌟 Enhanced hover effects for menu buttons
document.addEventListener('DOMContentLoaded', function() {
  const menuButtons = document.querySelectorAll('.menu-button');
  
  menuButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      // Add subtle glow effect
      this.style.boxShadow = '0 8px 25px rgba(255, 105, 180, 0.3)';
    });
    
    button.addEventListener('mouseleave', function() {
      // Remove glow effect
      this.style.boxShadow = '';
    });
  });
});

// 🎨 Add CSS animations for slide effects
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .menu-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .reveal-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
document.head.appendChild(style);

// 📱 Add touch support for mobile devices
document.addEventListener('touchstart', function() {
  // Handle touch events similar to click
}, { passive: true });

// 🎵 Auto-resume music when page becomes visible
document.addEventListener('visibilitychange', function() {
  const music = document.getElementById('bgMusic');
  if (music && !document.hidden && music.paused) {
    music.play().catch(() => {});
  }
});

// 🌈 Add subtle parallax effect to floating hearts
window.addEventListener('scroll', function() {
  const hearts = document.querySelectorAll('.heart');
  const scrolled = window.pageYOffset;
  
  hearts.forEach((heart, index) => {
    const speed = 0.5 + (index % 3) * 0.2;
    heart.style.transform = `translateY(${scrolled * speed}px) rotate(45deg)`;
  });
});

// 💌 Check for new messages and show notification
async function checkForNewMessages() {
  try {
    const lastVisit = localStorage.getItem('lastVisitTime') || '0';
    const currentTime = new Date().toISOString();
    
    // Check if there are new messages since last visit
    const newMessages = await MessageService.getNewMessages(lastVisit);
    
    if (newMessages.length > 0) {
      showMessageNotification(newMessages.length);
    }
    
    // Update last visit time
    localStorage.setItem('lastVisitTime', currentTime);
  } catch (error) {
    console.error('Error checking for new messages:', error);
  }
}

// 📬 Show message notification
function showMessageNotification(count) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(145deg, #ff69b4, #ff8fab);
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: bold;
    box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
    z-index: 10000;
    animation: bounceIn 0.6s ease;
    cursor: pointer;
  `;
  
  notification.innerHTML = `
    💌 You have ${count} new love message${count > 1 ? 's' : ''}!
    <br><small>Click to view</small>
  `;
  
  // Add click handler to go to messages
  notification.addEventListener('click', () => {
    window.location.href = 'features/message/message.html';
  });
  
  document.body.appendChild(notification);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 10000);
}

// Add CSS for message notification animations
const messageStyle = document.createElement('style');
messageStyle.textContent = `
  @keyframes bounceIn {
    0% { transform: translateX(-50%) scale(0.3); opacity: 0; }
    50% { transform: translateX(-50%) scale(1.05); }
    70% { transform: translateX(-50%) scale(0.9); }
    100% { transform: translateX(-50%) scale(1); opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(-50%) scale(1); }
    to { opacity: 0; transform: translateX(-50%) scale(0.8); }
  }
`;
document.head.appendChild(messageStyle);

// 💌 Quick Message Button Functionality
document.addEventListener('DOMContentLoaded', function() {
  const quickMessageBtn = document.getElementById('quickMessageBtn');
  const messageNotification = document.getElementById('messageNotification');
  
  // Quick message button click
  if (quickMessageBtn) {
    quickMessageBtn.addEventListener('click', () => {
      // Play click sound
      const clickSound = document.getElementById('clickSound');
      if (clickSound) {
        clickSound.volume = 0.3;
        clickSound.play().catch(() => {});
      }
      
      // Navigate to message page
      window.location.href = 'features/message/message.html';
    });
  }
  
  // Message notification click
  if (messageNotification) {
    messageNotification.addEventListener('click', () => {
      window.location.href = 'features/message/message.html';
    });
    
    // Close notification button
    const closeBtn = messageNotification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        messageNotification.classList.add('hidden');
      });
    }
  }
  
  // Check for new messages every 30 seconds
  setInterval(checkForNewMessages, 30000);
});

// 📬 Enhanced message notification system
function showMessageNotification(count) {
  const existingNotification = document.getElementById('messageNotification');
  
  if (existingNotification) {
    // Update existing notification
    const notificationText = existingNotification.querySelector('.notification-text');
    if (notificationText) {
      notificationText.textContent = `You have ${count} new love message${count > 1 ? 's' : ''}!`;
    }
    existingNotification.classList.remove('hidden');
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      existingNotification.classList.add('hidden');
    }, 8000);
  } else {
    // Create new notification (fallback)
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(145deg, #ff69b4, #ff8fab);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: bold;
      box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
      z-index: 10000;
      animation: bounceIn 0.6s ease;
      cursor: pointer;
    `;
    
    notification.innerHTML = `
      💌 You have ${count} new love message${count > 1 ? 's' : ''}!
      <br><small>Click to view</small>
    `;
    
    notification.addEventListener('click', () => {
      window.location.href = 'features/message/message.html';
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.5s ease';
      setTimeout(() => notification.remove(), 500);
    }, 10000);
  }
}

  // === Settings System ===
  class SettingsManager {
    constructor() {
      this.settings = this.loadSettings();
      this.initSettings();
      this.setupGlobalListener();
    }

    loadSettings() {
      const defaultSettings = {
        theme: 'light',
        bgMusic: true,
        soundEffects: true,
        volume: 50,
        fontSize: 'medium',
        animationSpeed: 'normal'
      };

      try {
        const saved = localStorage.getItem('userSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
      } catch (error) {
        console.error('Error loading settings:', error);
        return defaultSettings;
      }
    }

    saveSettings() {
      try {
        localStorage.setItem('userSettings', JSON.stringify(this.settings));
        // Broadcast settings change to all pages
        this.broadcastSettingsChange();
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }

    // Broadcast settings change to all open pages
    broadcastSettingsChange() {
      console.log('🔧 SettingsManager: Broadcasting settings change:', this.settings);
      
      // Dispatch custom event for other pages to listen to
      window.dispatchEvent(new CustomEvent('settingsChanged', {
        detail: this.settings
      }));
      
      // Also use localStorage event for cross-tab communication
      localStorage.setItem('settingsLastUpdated', Date.now().toString());
      
      console.log('🔧 SettingsManager: Settings broadcast completed');
    }

    // Setup global listener for settings changes
    setupGlobalListener() {
      // Listen for settings changes from other pages
      window.addEventListener('storage', (e) => {
        if (e.key === 'userSettings' || e.key === 'settingsLastUpdated') {
          this.settings = this.loadSettings();
          this.applySettings();
        }
      });

      // Listen for custom settings change events
      window.addEventListener('settingsChanged', (e) => {
        this.settings = e.detail;
        this.applySettings();
      });
    }

    initSettings() {
      this.applySettings();
      this.setupSettingsModal();
    }

    applySettings() {
      // Apply theme
      if (this.settings.theme === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }

      // Apply font size
      document.body.style.fontSize = this.getFontSizeValue();

      // Apply animation speed
      document.body.style.setProperty('--animation-speed', this.getAnimationSpeedValue());

      // Apply volume to all audio elements
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.volume = this.settings.volume / 100;
      });

      // Apply background music settings
      const bgMusic = document.getElementById('bgMusic');
      if (bgMusic) {
        if (this.settings.bgMusic) {
          bgMusic.play().catch(() => {});
        } else {
          bgMusic.pause();
        }
      }
    }

    getFontSizeValue() {
      switch (this.settings.fontSize) {
        case 'small': return '0.9rem';
        case 'large': return '1.2rem';
        default: return '1rem';
      }
    }

    getAnimationSpeedValue() {
      switch (this.settings.animationSpeed) {
        case 'fast': return '0.3s';
        case 'slow': return '1.2s';
        default: return '0.6s';
      }
    }

    setupSettingsModal() {
      const openSettingsBtn = document.getElementById('openSettingsBtn');
      const settingsModal = document.getElementById('settingsModal');
      const closeSettingsBtn = document.getElementById('closeSettingsBtn');
      const saveSettingsBtn = document.getElementById('saveSettingsBtn');

      // Open settings
      openSettingsBtn?.addEventListener('click', () => {
        this.openSettingsModal();
      });

      // Close settings
      closeSettingsBtn?.addEventListener('click', () => {
        this.closeSettingsModal();
      });

      // Save settings
      saveSettingsBtn?.addEventListener('click', () => {
        this.saveCurrentSettings();
        this.closeSettingsModal();
        this.showSaveMessage();
      });

      // Click outside to close
      settingsModal?.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
          this.closeSettingsModal();
        }
      });

      // Setup tabs
      this.setupTabs();
      
      // Setup form controls
      this.setupFormControls();
    }

    setupTabs() {
      const tabBtns = document.querySelectorAll('.tab-btn');

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabName = btn.getAttribute('data-tab');
          this.switchToTab(tabName);
        });
      });
    }

    switchToTab(tabName) {
      // Remove active class from all tabs and contents
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

      // Add active class to selected tab and content
      document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
      document.getElementById(`${tabName}Tab`)?.classList.add('active');
    }

    setupFormControls() {
      // Theme radio buttons
      document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.checked = radio.value === this.settings.theme;
        radio.addEventListener('change', (e) => {
          this.settings.theme = e.target.value;
          this.applySettings();
          this.saveSettings(); // Save immediately on change
        });
      });

      // Toggle switches
      const toggles = {
        'bgMusicToggle': 'bgMusic',
        'soundEffectsToggle': 'soundEffects'
      };

      Object.entries(toggles).forEach(([toggleId, settingKey]) => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
          toggle.checked = this.settings[settingKey];
          toggle.addEventListener('change', (e) => {
            this.settings[settingKey] = e.target.checked;
            this.applySettings();
            this.saveSettings(); // Save immediately on change
          });
        }
      });

      // Volume slider
      const volumeSlider = document.getElementById('volumeSlider');
      const volumeValue = document.getElementById('volumeValue');
      if (volumeSlider && volumeValue) {
        volumeSlider.value = this.settings.volume;
        volumeValue.textContent = `${this.settings.volume}%`;
        volumeSlider.addEventListener('input', (e) => {
          this.settings.volume = e.target.value;
          volumeValue.textContent = `${e.target.value}%`;
          this.applySettings();
          this.saveSettings(); // Save immediately on change
        });
      }

      // Select dropdowns
      const selects = {
        'fontSizeSelect': 'fontSize',
        'animationSpeedSelect': 'animationSpeed'
      };

      Object.entries(selects).forEach(([selectId, settingKey]) => {
        const select = document.getElementById(selectId);
        if (select) {
          select.value = this.settings[settingKey];
          select.addEventListener('change', (e) => {
            this.settings[settingKey] = e.target.value;
            this.applySettings();
            this.saveSettings(); // Save immediately on change
          });
        }
      });
    }

    openSettingsModal() {
      const settingsModal = document.getElementById('settingsModal');
      if (settingsModal) {
        settingsModal.style.display = 'flex';
        // Play click sound
        const clickSound = document.getElementById('clickSound');
        if (clickSound && this.settings.soundEffects) {
          clickSound.currentTime = 0;
          clickSound.volume = this.settings.volume / 100;
          clickSound.play().catch(() => {});
        }
      }
    }

    closeSettingsModal() {
      const settingsModal = document.getElementById('settingsModal');
      if (settingsModal) {
        settingsModal.style.display = 'none';
      }
    }

    saveCurrentSettings() {
      this.saveSettings();
      this.applySettings();
    }

    showSaveMessage(message = 'Settings saved successfully!') {
      const notification = document.createElement('div');
      notification.className = 'save-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(145deg, #28a745, #20c997);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        z-index: 10001;
        animation: slideInDown 0.5s ease;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.5s ease';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 2000);
    }
  }

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

  // Apply settings immediately when script loads
  loadAndApplyGlobalSettings();

  // Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize existing functionality
  createFloatingHearts();
  checkForNewMessages();
  
  // Initialize settings
  window.settingsManager = new SettingsManager();
  
  // Check for new messages every 30 seconds
  setInterval(checkForNewMessages, 30000);
});

