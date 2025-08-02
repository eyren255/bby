// === Global Settings System ===
class GlobalSettingsManager {
  constructor() {
    this.settings = this.loadSettings();
    this.initSettings();
  }

  loadSettings() {
    const defaultSettings = {
      theme: 'light',
      bgMusic: true,
      soundEffects: true,
      volume: 50,
      fontSize: 'medium',
      animationSpeed: 'normal',
      layout: 'grid',
      quickAccess: true,
      progress: true,
      mood: true,
      countdown: true,
      notes: true,
      sync: true,
      autoSave: true,
      performance: false
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
    } catch (error) {
      console.error('Error saving settings:', error);
    }
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
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    // Open settings
    settingsBtn?.addEventListener('click', () => {
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
      });
    });

    // Toggle switches
    const toggles = {
      'bgMusicToggle': 'bgMusic',
      'soundEffectsToggle': 'soundEffects',
      'quickAccessToggle': 'quickAccess',
      'progressToggle': 'progress',
      'moodToggle': 'mood',
      'countdownToggle': 'countdown',
      'notesToggle': 'notes',
      'syncToggle': 'sync',
      'autoSaveToggle': 'autoSave',
      'performanceToggle': 'performance'
    };

    Object.entries(toggles).forEach(([toggleId, settingKey]) => {
      const toggle = document.getElementById(toggleId);
      if (toggle) {
        toggle.checked = this.settings[settingKey];
        toggle.addEventListener('change', (e) => {
          this.settings[settingKey] = e.target.checked;
          this.applySettings();
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
      });
    }

    // Select dropdowns
    const selects = {
      'fontSizeSelect': 'fontSize',
      'animationSpeedSelect': 'animationSpeed',
      'layoutSelect': 'layout'
    };

    Object.entries(selects).forEach(([selectId, settingKey]) => {
      const select = document.getElementById(selectId);
      if (select) {
        select.value = this.settings[settingKey];
        select.addEventListener('change', (e) => {
          this.settings[settingKey] = e.target.value;
          this.applySettings();
        });
      }
    });

    // Action buttons
    document.getElementById('exportDataBtn')?.addEventListener('click', () => {
      this.exportData();
    });

    document.getElementById('importDataBtn')?.addEventListener('click', () => {
      this.importData();
    });

    document.getElementById('resetSettingsBtn')?.addEventListener('click', () => {
      this.resetSettings();
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

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('userSettings');
      this.settings = this.loadSettings();
      this.applySettings();
      this.setupFormControls();
      this.showSaveMessage('Settings reset to default!');
    }
  }

  exportData() {
    const data = {
      settings: this.settings,
      messages: localStorage.getItem('allLoveMessages'),
      scores: localStorage.getItem('gameScores'),
      notes: localStorage.getItem('personalNotes'),
      mood: localStorage.getItem('moodData'),
      progress: localStorage.getItem('progressData')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'baby-love-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    this.showSaveMessage('Data exported successfully!');
  }

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            if (data.settings) {
              this.settings = { ...this.settings, ...data.settings };
              this.saveSettings();
              this.applySettings();
              this.setupFormControls();
              this.showSaveMessage('Data imported successfully!');
            }
          } catch (error) {
            alert('Error importing data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize global settings
  window.settingsManager = new GlobalSettingsManager();
}); 