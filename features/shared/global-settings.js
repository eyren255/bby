// === Global Settings System ===
// This script ensures settings are applied globally across all pages

class GlobalSettingsManager {
  constructor() {
    console.log('🌐 GlobalSettingsManager: Initializing...');
    this.settings = this.loadSettings();
    this.setupGlobalListener();
    this.applySettings();
    console.log('🌐 GlobalSettingsManager: Initialized with settings:', this.settings);
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
      const settings = saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
      console.log('🌐 GlobalSettingsManager: Loaded settings:', settings);
      return settings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  }

  applySettings() {
    console.log('🌐 GlobalSettingsManager: Applying settings...');
    
    // Apply theme
    if (this.settings.theme === 'dark') {
      document.body.classList.add('dark-mode');
      console.log('�� Applied dark theme - body classes:', document.body.className);
    } else {
      document.body.classList.remove('dark-mode');
      console.log('🌐 Applied light theme - body classes:', document.body.className);
    }

    // Apply font size
    const fontSize = this.getFontSizeValue();
    document.body.style.fontSize = fontSize;
    console.log('🌐 Applied font size:', fontSize);

    // Apply animation speed
    const animationSpeed = this.getAnimationSpeedValue();
    document.body.style.setProperty('--animation-speed', animationSpeed);
    console.log('🌐 Applied animation speed:', animationSpeed);

    // Apply volume to all audio elements
    const audioElements = document.querySelectorAll('audio');
    console.log('🌐 Found audio elements:', audioElements.length);
    audioElements.forEach((audio, index) => {
      audio.volume = this.settings.volume / 100;
      console.log(`🌐 Applied volume ${this.settings.volume}% to audio ${index + 1}:`, audio.src);
    });

    // Apply background music settings
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
      if (this.settings.bgMusic) {
        bgMusic.play().catch(() => {});
        console.log('🌐 Started background music');
      } else {
        bgMusic.pause();
        console.log('🌐 Paused background music');
      }
    } else {
      console.log('🌐 No background music element found');
    }

    // Force a repaint to ensure theme changes are visible
    document.body.offsetHeight; // Trigger reflow
    
    console.log('🌐 GlobalSettingsManager: Settings applied successfully');
    console.log('🌐 Current body classes:', document.body.className);
    console.log('🌐 Current body style:', document.body.style.cssText);
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

  setupGlobalListener() {
    console.log('🌐 GlobalSettingsManager: Setting up global listeners...');
    
    // Listen for settings changes from other pages
    window.addEventListener('storage', (e) => {
      console.log('🌐 Storage event detected:', e.key);
      if (e.key === 'userSettings' || e.key === 'settingsLastUpdated') {
        console.log('🌐 Settings changed via storage, reloading...');
        this.settings = this.loadSettings();
        this.applySettings();
      }
    });

    // Listen for custom settings change events
    window.addEventListener('settingsChanged', (e) => {
      console.log('🌐 Settings changed event detected:', e.detail);
      this.settings = e.detail;
      this.applySettings();
    });

    console.log('🌐 GlobalSettingsManager: Global listeners set up');
  }
}

// Function to initialize global settings
function initializeGlobalSettings() {
  console.log('🌐 Initializing global settings...');
  if (!window.globalSettingsManager) {
    window.globalSettingsManager = new GlobalSettingsManager();
  } else {
    console.log('🌐 GlobalSettingsManager already exists, reapplying settings...');
    window.globalSettingsManager.applySettings();
  }
}

// Initialize global settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌐 DOMContentLoaded: Initializing global settings...');
  initializeGlobalSettings();
});

// Also apply settings immediately if DOM is already loaded
if (document.readyState === 'loading') {
  console.log('🌐 DOM still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', () => {
    initializeGlobalSettings();
  });
} else {
  console.log('🌐 DOM already loaded, initializing immediately...');
  initializeGlobalSettings();
}

// Also run after a short delay to ensure all elements are loaded
setTimeout(() => {
  console.log('🌐 Delayed initialization...');
  initializeGlobalSettings();
}, 100);

// Also run after a longer delay to catch any late-loading elements
setTimeout(() => {
  console.log('🌐 Final delayed initialization...');
  initializeGlobalSettings();
}, 1000);

// Periodic check to ensure settings are applied (every 2 seconds for first 10 seconds)
let checkCount = 0;
const checkInterval = setInterval(() => {
  if (checkCount < 5) {
    console.log('🌐 Periodic settings check...');
    initializeGlobalSettings();
    checkCount++;
  } else {
    clearInterval(checkInterval);
    console.log('🌐 Stopped periodic checks');
  }
}, 2000); 