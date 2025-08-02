// === Enhanced Settings System ===
// Improved settings management with better functionality

// === Audio Management ===
// Prevent overlapping background music across pages
function manageBackgroundMusic() {
  try {
    // Stop all background music on other pages
    const allAudio = document.querySelectorAll('audio[id="bgMusic"]');
    allAudio.forEach(audio => {
      if (audio !== document.querySelector('#bgMusic')) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    // Start background music on current page
    const currentBgMusic = document.querySelector('#bgMusic');
    if (currentBgMusic) {
      currentBgMusic.play().catch(() => {
        console.log('Background music autoplay blocked');
      });
    }
  } catch (error) {
    console.error('Error managing background music:', error);
  }
}

// Stop all background music when leaving page
function stopAllBackgroundMusic() {
  try {
    const allAudio = document.querySelectorAll('audio[id="bgMusic"]');
    allAudio.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  } catch (error) {
    console.error('Error stopping background music:', error);
  }
}

class SimpleSettingsManager {
  constructor() {
    this.settings = this.loadSettings();
    this.isInitialized = false;
    this.isModalOpen = false;
    this.currentTab = 'appearance';
    this.init();
  }

  // === Core Settings Management ===
  loadSettings() {
    try {
      const saved = localStorage.getItem('userSettings');
      return saved ? JSON.parse(saved) : this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      this.showNotification('Failed to load settings', 'error');
      return this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      theme: 'light',
      fontSize: 'medium',
      layout: 'default',
      animationSpeed: 'normal',
      volume: 50,
      bgMusic: true,
      soundEffects: true,
      language: 'en',
      preferences: {
        notifications: true,
        autoSave: true,
        performanceMode: false
      }
    };
  }

  saveSettings() {
    try {
      this.settings.lastModified = Date.now();
      const settingsToSave = JSON.stringify(this.settings);
      localStorage.setItem('userSettings', settingsToSave);
      console.log('💾 Settings saved:', this.settings);
      
      // Broadcast settings change to other pages
      this.broadcastSettingsChange();
      
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showNotification('Failed to save settings', 'error');
      return false;
    }
  }

  // === Settings Application ===
  applySettings() {
    try {
      console.log('🔧 Applying settings globally...');
      
      // Apply theme
      this.applyTheme();
      
      // Apply font size
      this.applyFontSize();
      
      // Apply layout
      this.applyLayout();
      
      // Apply animation speed
      this.applyAnimationSpeed();
      
      // Apply audio settings
      this.applyAudioSettings();
      
      console.log('✅ Settings applied successfully');
    } catch (error) {
      console.error('❌ Error applying settings:', error);
    }
  }

  applyTheme() {
    try {
      if (this.settings.theme === 'dark') {
        document.body.classList.add('dark-mode');
        console.log('🌙 Dark mode applied');
      } else {
        document.body.classList.remove('dark-mode');
        console.log('☀️ Light mode applied');
      }
    } catch (error) {
      console.error('❌ Error applying theme:', error);
    }
  }

  applyFontSize() {
    try {
      let fontSize = '1rem';
      switch (this.settings.fontSize) {
        case 'small': fontSize = '0.9rem'; break;
        case 'large': fontSize = '1.2rem'; break;
        default: fontSize = '1rem'; break;
      }
      document.body.style.fontSize = fontSize;
      console.log('📝 Font size applied:', fontSize);
    } catch (error) {
      console.error('❌ Error applying font size:', error);
    }
  }

  applyLayout() {
    try {
      // Apply layout changes if needed
      console.log('📐 Layout applied:', this.settings.layout);
    } catch (error) {
      console.error('❌ Error applying layout:', error);
    }
  }

  applyAnimationSpeed() {
    try {
      let speed = '0.6s';
      switch (this.settings.animationSpeed) {
        case 'fast': speed = '0.3s'; break;
        case 'slow': speed = '1.2s'; break;
        default: speed = '0.6s'; break;
      }
      document.body.style.setProperty('--animation-speed', speed);
      console.log('⚡ Animation speed applied:', speed);
    } catch (error) {
      console.error('❌ Error applying animation speed:', error);
    }
  }

  applyAudioSettings() {
    try {
      // Apply volume to all audio elements
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.volume = (this.settings.volume || 50) / 100;
        audio.muted = !this.settings.soundEffects;
      });
      
      // Handle background music
      const bgMusic = document.querySelector('#bgMusic');
      if (bgMusic) {
        if (this.settings.bgMusic) {
          bgMusic.play().catch(() => {
            console.log('Background music autoplay blocked');
          });
        } else {
          bgMusic.pause();
        }
      }
      
      console.log('🔊 Audio settings applied');
    } catch (error) {
      console.error('❌ Error applying audio settings:', error);
    }
  }

  broadcastSettingsChange() {
    try {
      // Dispatch custom event for other pages to listen to
      window.dispatchEvent(new CustomEvent('settingsChanged', {
        detail: this.settings
      }));
      
      // Also trigger storage event for cross-tab communication
      localStorage.setItem('settingsLastUpdated', Date.now().toString());
      
      console.log('📡 Settings change broadcasted to all pages');
    } catch (error) {
      console.error('❌ Error broadcasting settings change:', error);
    }
  }

  // === Modal Management ===
  setupModal() {
    try {
      const settingsModal = document.getElementById('settingsModal');
      const closeBtn = document.getElementById('closeSettingsBtn');
      const saveBtn = document.getElementById('saveSettingsBtn');

      // Create modal content if it doesn't exist
      this.createModalContent();

      // Note: The settings button uses onclick="openSettings()" in HTML
      // So we don't need to add an event listener here
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => { this.closeModal(); });
      }
      
      if (saveBtn) {
        saveBtn.addEventListener('click', () => { this.saveCurrentSettings(); });
      }
      
      if (settingsModal) {
        settingsModal.addEventListener('click', (e) => { 
          if (e.target === settingsModal) {
            this.closeModal(); 
          } 
        });
      }

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (this.isModalOpen) {
          if (e.key === 'Escape') {
            this.closeModal();
          } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            this.saveCurrentSettings();
          }
        }
      });

      console.log('Modal setup completed');
    } catch (error) {
      console.error('Error setting up modal:', error);
    }
  }

  createModalContent() {
    try {
      const modal = document.getElementById('settingsModal');
      if (modal && !modal.querySelector('.modal-content')) {
        modal.innerHTML = `
          <div class="modal-content settings-content">
            <div class="modal-header">
              <h2>⚙️ Settings</h2>
              <button class="modal-close" onclick="window.settingsManager.closeModal()">×</button>
            </div>
            <div class="modal-body">
              <div class="settings-tabs">
                <button class="tab-btn active" data-tab="general">General</button>
                <button class="tab-btn" data-tab="appearance">Appearance</button>
                <button class="tab-btn" data-tab="audio">Audio</button>
              </div>
              <div class="settings-content">
                <div class="tab-content active" id="general">
                  <div class="setting-group">
                    <label>Language</label>
                    <select id="languageSelect">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div class="setting-group">
                    <label>Notifications</label>
                    <input type="checkbox" id="notificationsToggle" />
                  </div>
                  <div class="setting-group">
                    <label>Auto Save</label>
                    <input type="checkbox" id="autoSaveToggle" />
                  </div>
                  <div class="setting-group">
                    <label>Performance Mode</label>
                    <input type="checkbox" id="performanceToggle" />
                  </div>
                </div>
                <div class="tab-content" id="appearance">
                  <div class="setting-group">
                    <label>Theme</label>
                    <div class="theme-options">
                      <label><input type="radio" name="theme" value="light"> Light</label>
                      <label><input type="radio" name="theme" value="dark"> Dark</label>
                    </div>
                  </div>
                  <div class="setting-group">
                    <label>Font Size</label>
                    <select id="fontSizeSelect">
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div class="setting-group">
                    <label>Animation Speed</label>
                    <select id="animationSpeedSelect">
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </div>
                  <div class="setting-group">
                    <label>Layout</label>
                    <select id="layoutSelect">
                      <option value="default">Default</option>
                      <option value="compact">Compact</option>
                      <option value="list">List</option>
                    </select>
                  </div>
                </div>
                <div class="tab-content" id="audio">
                  <div class="setting-group">
                    <label>Background Music</label>
                    <input type="checkbox" id="bgMusicToggle" />
                  </div>
                  <div class="setting-group">
                    <label>Sound Effects</label>
                    <input type="checkbox" id="soundEffectsToggle" />
                  </div>
                  <div class="setting-group">
                    <label>Volume</label>
                    <input type="range" id="volumeSlider" min="0" max="100" value="50" />
                    <span id="volumeValue">50%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="save-btn" onclick="window.settingsManager.saveCurrentSettings()">Save Settings</button>
            </div>
          </div>
        `;
        console.log('Settings modal content created');
      }
    } catch (error) {
      console.error('Error creating modal content:', error);
    }
  }

  openModal() {
    try {
      console.log('🔧 openModal() called');
      const modal = document.getElementById('settingsModal');
      console.log('🔧 Modal element:', modal);
      if (modal) {
        console.log('🔧 Setting modal display to flex');
        modal.style.display = 'flex';
        this.isModalOpen = true;
        
        // Create modal content if it doesn't exist
        this.createModalContent();
        
        // Set up tabs and form controls after content is created
    this.setupTabs();
        this.setupFormControls();
        
        // Load current settings into form
        this.loadSettingsIntoForm();
        
        setTimeout(() => {
          const firstTab = document.querySelector('.tab-btn');
          if (firstTab) firstTab.focus();
        }, 100);
        
        console.log('✅ Settings modal opened successfully');
      } else {
        console.error('❌ Settings modal not found');
      }
    } catch (error) {
      console.error('❌ Error opening modal:', error);
    }
  }

  closeModal() {
    try {
      const modal = document.getElementById('settingsModal');
      if (modal) {
        modal.style.display = 'none';
        this.isModalOpen = false;
        console.log('Settings modal closed');
      }
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  }

  loadSettingsIntoForm() {
    try {
      console.log('🔧 Loading settings into form...');
      console.log('🔧 Current settings:', this.settings);
      
      // Load theme
      const themeRadios = document.querySelectorAll('input[name="theme"]');
      console.log('🔧 Found theme radios in loadSettingsIntoForm:', themeRadios.length);
      themeRadios.forEach((radio, index) => {
        console.log(`🔧 Theme radio ${index}:`, radio.value, 'current checked:', radio.checked);
        radio.checked = radio.value === this.settings.theme;
        console.log(`🔧 Set theme radio ${index} (${radio.value}) to:`, radio.checked);
      });

      // Load toggles
      const toggleSelectors = [
        'bgMusicToggle', 'soundEffectsToggle', 'notificationsToggle', 'autoSaveToggle', 'performanceToggle'
      ];
      toggleSelectors.forEach(id => {
        const toggle = document.getElementById(id);
        if (toggle) {
          const value = this.getToggleValue(id);
          toggle.checked = value;
          console.log(`🔧 Set ${id} to:`, value);
        }
      });

      // Load selects
      const selectIds = ['fontSizeSelect', 'layoutSelect', 'animationSpeedSelect', 'languageSelect'];
      selectIds.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
          select.value = this.getSelectValue(id);
        }
      });

      // Load volume
      const volumeSlider = document.getElementById('volumeSlider');
      const volumeValue = document.getElementById('volumeValue');
      if (volumeSlider) {
        volumeSlider.value = this.settings.volume;
        console.log('🔧 Set volume slider to:', this.settings.volume);
      }
      if (volumeValue) {
        volumeValue.textContent = `${this.settings.volume}%`;
        console.log('🔧 Set volume value to:', this.settings.volume);
      }

      console.log('✅ Settings loaded into form');
    } catch (error) {
      console.error('❌ Error loading settings into form:', error);
    }
  }

  saveCurrentSettings() {
    try {
      if (this.saveSettings()) {
        this.applySettings();
        this.closeModal();
        this.showNotification('Settings saved successfully! ✨', 'success');
        console.log('Settings saved and applied');
      }
    } catch (error) {
      console.error('Error saving current settings:', error);
      this.showNotification('Failed to save settings', 'error');
    }
  }

  // === Tab Management ===
  setupTabs() {
    try {
      const tabButtons = document.querySelectorAll('.tab-btn');
      tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
          this.switchToTab(btn.getAttribute('data-tab'));
        });
      });
      console.log('Tabs setup completed');
    } catch (error) {
      console.error('Error setting up tabs:', error);
    }
  }

  switchToTab(tabName) {
    try {
      console.log(`🔧 Switching to tab: ${tabName}`);
      
      // Update tab buttons
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
      if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
      }

      // Update tab content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });

      const activeContent = document.getElementById(tabName);
      if (activeContent) {
        activeContent.classList.add('active');
      }

      this.currentTab = tabName;
      console.log(`✅ Switched to tab: ${tabName}`);
    } catch (error) {
      console.error('❌ Error switching tabs:', error);
    }
  }

  // === Form Controls ===
  setupFormControls() {
    try {
      console.log('🔧 Setting up form controls...');
      
      // Check if elements exist
      const themeRadios = document.querySelectorAll('input[name="theme"]');
      const bgMusicToggle = document.getElementById('bgMusicToggle');
      const soundEffectsToggle = document.getElementById('soundEffectsToggle');
      const volumeSlider = document.getElementById('volumeSlider');
      const volumeValue = document.getElementById('volumeValue');
      const fontSizeSelect = document.getElementById('fontSizeSelect');
      const animationSpeedSelect = document.getElementById('animationSpeedSelect');
      const layoutSelect = document.getElementById('layoutSelect');
      const languageSelect = document.getElementById('languageSelect');
      const notificationsToggle = document.getElementById('notificationsToggle');
      const autoSaveToggle = document.getElementById('autoSaveToggle');
      const performanceToggle = document.getElementById('performanceToggle');
      
      console.log('🔧 Found elements:', {
        themeRadios: themeRadios.length,
        bgMusicToggle: !!bgMusicToggle,
        soundEffectsToggle: !!soundEffectsToggle,
        volumeSlider: !!volumeSlider,
        volumeValue: !!volumeValue,
        fontSizeSelect: !!fontSizeSelect,
        animationSpeedSelect: !!animationSpeedSelect,
        layoutSelect: !!layoutSelect,
        languageSelect: !!languageSelect,
        notificationsToggle: !!notificationsToggle,
        autoSaveToggle: !!autoSaveToggle,
        performanceToggle: !!performanceToggle
      });
      
      // Log each element individually for debugging
      if (themeRadios.length > 0) {
        themeRadios.forEach((radio, index) => {
          console.log(`🔧 Theme radio ${index}:`, radio.value, 'checked:', radio.checked);
        });
      }
      
      if (bgMusicToggle) console.log('🔧 bgMusicToggle found:', bgMusicToggle.checked);
      if (soundEffectsToggle) console.log('🔧 soundEffectsToggle found:', soundEffectsToggle.checked);
      if (volumeSlider) console.log('🔧 volumeSlider found:', volumeSlider.value);
      if (volumeValue) console.log('🔧 volumeValue found:', volumeValue.textContent);
      if (fontSizeSelect) console.log('🔧 fontSizeSelect found:', fontSizeSelect.value);
      if (animationSpeedSelect) console.log('🔧 animationSpeedSelect found:', animationSpeedSelect.value);
      if (layoutSelect) console.log('🔧 layoutSelect found:', layoutSelect.value);
      if (languageSelect) console.log('🔧 languageSelect found:', languageSelect.value);
      if (notificationsToggle) console.log('🔧 notificationsToggle found:', notificationsToggle.checked);
      if (autoSaveToggle) console.log('🔧 autoSaveToggle found:', autoSaveToggle.checked);
      if (performanceToggle) console.log('🔧 performanceToggle found:', performanceToggle.checked);
      
      this.setupThemeControls();
      this.setupToggleControls();
      this.setupSliderControls();
      this.setupSelectControls();
      console.log('✅ Form controls setup completed');
    } catch (error) {
      console.error('❌ Error setting up form controls:', error);
    }
  }

  setupThemeControls() {
    try {
      console.log('🔧 setupThemeControls() called');
      const themeRadios = document.querySelectorAll('input[name="theme"]');
      console.log('🔧 Found theme radio buttons:', themeRadios.length);
      
      themeRadios.forEach((radio, index) => {
        console.log(`🔧 Radio ${index}:`, radio.value, 'checked:', radio.checked);
      radio.checked = radio.value === this.settings.theme;
        console.log(`🔧 Set radio ${index} (${radio.value}) to:`, radio.checked);
        
      radio.addEventListener('change', (e) => {
          console.log('🔧 Theme radio changed to:', e.target.value);
          console.log('🔧 Previous theme setting:', this.settings.theme);
        this.settings.theme = e.target.value;
          console.log('🔧 New theme setting:', this.settings.theme);
        this.applySettings();
          this.saveSettings();
          this.showNotification(`Theme changed to ${e.target.value} mode! ✨`, 'success');
        });
      });
      console.log('✅ Theme controls setup completed');
    } catch (error) {
      console.error('❌ Error setting up theme controls:', error);
    }
  }

  setupToggleControls() {
    try {
      const toggles = {
        'bgMusicToggle': 'bgMusic',
        'soundEffectsToggle': 'soundEffects',
        'notificationsToggle': 'notifications',
        'autoSaveToggle': 'autoSave',
        'performanceToggle': 'performanceMode'
      };

      Object.entries(toggles).forEach(([toggleId, settingKey]) => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
          // Set initial value based on settings
          let initialValue = false;
          if (settingKey === 'notifications' || settingKey === 'autoSave' || settingKey === 'performanceMode') {
            initialValue = this.settings.preferences?.[settingKey] || false;
          } else {
            initialValue = this.settings[settingKey] || false;
          }
          
          toggle.checked = initialValue;
          console.log(`🔧 Set ${toggleId} initial value to:`, initialValue);
          
          toggle.addEventListener('change', (e) => {
            console.log(`🔧 ${settingKey} changed to:`, e.target.checked);
            
            // Update settings based on the toggle type
            if (settingKey === 'notifications' || settingKey === 'autoSave' || settingKey === 'performanceMode') {
              if (!this.settings.preferences) this.settings.preferences = {};
              this.settings.preferences[settingKey] = e.target.checked;
            } else {
              this.settings[settingKey] = e.target.checked;
            }
            
            // Save settings immediately
            this.saveSettings();
            this.applySettings();
            
            this.showNotification(`${this.getToggleLabel(toggleId)} ${e.target.checked ? 'enabled' : 'disabled'}! ✨`, 'success');
          });
        } else {
          console.warn(`⚠️ Toggle element not found: ${toggleId}`);
        }
      });
      console.log('✅ Toggle controls setup completed');
    } catch (error) {
      console.error('❌ Error setting up toggle controls:', error);
    }
  }

  getToggleValue(id) {
    const settingMap = {
      'bgMusicToggle': this.settings.bgMusic,
      'soundEffectsToggle': this.settings.soundEffects,
      'notificationsToggle': this.settings.preferences?.notifications || false,
      'autoSaveToggle': this.settings.preferences?.autoSave || false,
      'performanceToggle': this.settings.preferences?.performanceMode || false
    };
    return settingMap[id] || false;
  }

  getToggleLabel(id) {
    const labelMap = {
      'bgMusicToggle': 'Background music',
      'soundEffectsToggle': 'Sound effects',
      'notificationsToggle': 'Notifications',
      'autoSaveToggle': 'Auto save',
      'performanceToggle': 'Performance mode'
    };
    return labelMap[id] || 'Setting';
  }

  updateToggleSetting(id, value) {
    const settingMap = {
      'bgMusicToggle': () => this.settings.bgMusic = value,
      'soundEffectsToggle': () => this.settings.soundEffects = value,
      'notificationsToggle': () => {
        if (!this.settings.preferences) this.settings.preferences = {};
        this.settings.preferences.notifications = value;
      },
      'autoSaveToggle': () => {
        if (!this.settings.preferences) this.settings.preferences = {};
        this.settings.preferences.autoSave = value;
      },
      'performanceToggle': () => {
        if (!this.settings.preferences) this.settings.preferences = {};
        this.settings.preferences.performanceMode = value;
      }
    };
    
    if (settingMap[id]) {
      settingMap[id]();
    }
  }

  setupSliderControls() {
    try {
      const volumeSlider = document.getElementById('volumeSlider');
      const volumeValue = document.getElementById('volumeValue');
      
      if (volumeSlider && volumeValue) {
        const initialVolume = this.settings.volume || 50;
        volumeSlider.value = initialVolume;
        volumeValue.textContent = `${initialVolume}%`;
        console.log(`🔧 Set volume slider initial value to:`, initialVolume);
        
        volumeSlider.addEventListener('input', (e) => {
          const newVolume = parseInt(e.target.value);
          console.log('🔧 Volume changed to:', newVolume);
          this.settings.volume = newVolume;
          volumeValue.textContent = `${newVolume}%`;
          
          // Save settings immediately
          this.saveSettings();
          this.applySettings();
        });
      } else {
        console.warn('⚠️ Volume slider elements not found');
      }
      
      console.log('✅ Slider controls setup completed');
    } catch (error) {
      console.error('❌ Error setting up slider controls:', error);
    }
  }

  setupSelectControls() {
    try {
      const selects = {
        'fontSizeSelect': 'fontSize',
        'animationSpeedSelect': 'animationSpeed',
        'layoutSelect': 'layout',
        'languageSelect': 'language'
      };

      Object.entries(selects).forEach(([selectId, settingKey]) => {
        const select = document.getElementById(selectId);
        if (select) {
          // Set initial value based on settings
          let initialValue = '';
          if (settingKey === 'language') {
            initialValue = this.settings.language || 'en';
          } else {
            initialValue = this.settings[settingKey] || 'medium';
          }
          
          select.value = initialValue;
          console.log(`🔧 Set ${selectId} initial value to:`, initialValue);
          
          select.addEventListener('change', (e) => {
            console.log(`🔧 ${settingKey} changed to:`, e.target.value);
            
            // Update settings based on the select type
            if (settingKey === 'language') {
              this.settings.language = e.target.value;
              this.showNotification(`Language changed to ${e.target.value}! ✨`, 'success');
            } else {
              this.settings[settingKey] = e.target.value;
              this.applySettings();
              this.showNotification(`${this.getSelectLabel(selectId)} changed to ${e.target.value}! ✨`, 'success');
            }
            
            // Save settings immediately
            this.saveSettings();
          });
        } else {
          console.warn(`⚠️ Select element not found: ${selectId}`);
        }
      });
      console.log('✅ Select controls setup completed');
    } catch (error) {
      console.error('❌ Error setting up select controls:', error);
    }
  }

  getSelectValue(id) {
    const valueMap = {
      'fontSizeSelect': this.settings.fontSize,
      'layoutSelect': this.settings.layout,
      'animationSpeedSelect': this.settings.animationSpeed,
      'languageSelect': this.settings.language || 'en'
    };
    return valueMap[id] || '';
  }

  getSelectLabel(id) {
    const labelMap = {
      'fontSizeSelect': 'Font size',
      'layoutSelect': 'Layout style',
      'animationSpeedSelect': 'Animation speed',
      'languageSelect': 'Language'
    };
    return labelMap[id] || 'Setting';
  }

  updateSelectSetting(id, value) {
    const settingMap = {
      'fontSizeSelect': () => { this.settings.fontSize = value; this.applyFontSize(); },
      'layoutSelect': () => { this.settings.layout = value; this.applyLayout(); },
      'animationSpeedSelect': () => { this.settings.animationSpeed = value; this.applyAnimationSpeed(); },
      'languageSelect': () => { this.settings.language = value; }
    };
    
    if (settingMap[id]) {
      settingMap[id]();
    }
  }

  // === Utility Methods ===
  showNotification(message, type = 'info') {
    try {
    const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <span class="notification-icon">${this.getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  getNotificationIcon(type) {
    const iconMap = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    };
    return iconMap[type] || 'ℹ️';
  }

  // === Initialization ===
  init() {
    try {
      console.log('🔧 Initializing settings manager...');
      
      // Add notification styles
      this.addNotificationStyles();
      
      // Setup modal
      this.setupModal();
      
      // Apply settings immediately
      this.applySettings();
      
      // Listen for storage changes (for cross-tab sync)
      window.addEventListener('storage', (e) => {
        if (e.key === 'userSettings') {
          console.log('📡 Settings changed in another tab, reloading...');
          this.settings = this.loadSettings();
          this.applySettings();
          this.loadSettingsIntoForm();
        }
      });
      
      // Listen for custom settings change events
      window.addEventListener('settingsChanged', (e) => {
        console.log('📡 Settings changed event received:', e.detail);
        this.settings = e.detail;
        this.applySettings();
      });
      
      this.isInitialized = true;
      console.log('✅ Settings manager initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing settings manager:', error);
    }
  }

  addNotificationStyles() {
    try {
      const style = document.createElement('style');
      style.textContent = `
        .notification {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: linear-gradient(135deg, #ff69b4, #ff8fab);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(255, 105, 180, 0.3);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          max-width: 300px;
        }
        
        .notification.show {
          transform: translateX(0);
        }
        
        .notification-icon {
          font-size: 1.2rem;
        }
        
        .notification-message {
          font-weight: 500;
        }
      `;
      document.head.appendChild(style);
    } catch (error) {
      console.error('Error adding notification styles:', error);
    }
  }

  getFontSizeValue() {
    const sizes = {
      'small': '14px',
      'medium': '16px',
      'large': '18px'
    };
    return sizes[this.settings.fontSize] || '16px';
  }

  getAnimationSpeedValue() {
    const speeds = {
      'slow': '0.8s',
      'normal': '0.3s',
      'fast': '0.1s'
    };
    return speeds[this.settings.animationSpeed] || '0.3s';
  }

  // === Testing Functions ===
  testTheme() {
    console.log('🧪 Testing theme functionality...');
    console.log('🧪 Current theme setting:', this.settings.theme);
    console.log('🧪 Current body classes:', document.body.className);
    console.log('🧪 Has dark-mode class:', document.body.classList.contains('dark-mode'));
    
    // Test switching to dark theme
    console.log('🧪 Testing dark theme...');
    this.settings.theme = 'dark';
    this.applyTheme();
    console.log('🧪 After dark theme - body classes:', document.body.className);
    console.log('🧪 Has dark-mode class:', document.body.classList.contains('dark-mode'));
    
    // Test switching to light theme
    console.log('🧪 Testing light theme...');
    this.settings.theme = 'light';
    this.applyTheme();
    console.log('🧪 After light theme - body classes:', document.body.className);
    console.log('🧪 Has dark-mode class:', document.body.classList.contains('dark-mode'));
    
    console.log('🧪 Theme test completed');
  }
}

// === Global Settings Instance ===
let settingsManager = null;
function initializeSettings() {
  console.log('🔧 initializeSettings() called');
  if (!settingsManager) {
    console.log('🔧 Creating new SimpleSettingsManager...');
    settingsManager = new SimpleSettingsManager();
    window.settingsManager = settingsManager;
    console.log('🔧 Settings manager assigned to window.settingsManager:', window.settingsManager);
  } else {
    console.log('🔧 Settings manager already exists');
  }
  return settingsManager;
}

console.log('🔧 Settings.js loaded, document.readyState:', document.readyState);

// Global test function
window.testThemeFunction = function() {
  if (window.settingsManager) {
    window.settingsManager.testTheme();
  } else {
    console.error('❌ Settings manager not available');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 DOMContentLoaded fired, initializing settings...');
  initializeSettings(); 
});

if (document.readyState === 'loading') {
  console.log('🔧 Document still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', initializeSettings);
} else {
  console.log('🔧 Document already loaded, initializing immediately...');
  initializeSettings();
} 