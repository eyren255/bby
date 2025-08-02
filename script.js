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

  // === Background Music Management ===
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

  // Apply settings immediately when script loads
  loadAndApplyGlobalSettings();
  manageBackgroundMusic();

  // === Settings Change Broadcaster ===
  // This function broadcasts settings changes to all pages
  function broadcastSettingsChange() {
    try {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        const settings = JSON.parse(saved);
      
      // Dispatch custom event for other pages to listen to
      window.dispatchEvent(new CustomEvent('settingsChanged', {
          detail: settings
      }));
      
        // Also trigger storage event for cross-tab communication
      localStorage.setItem('settingsLastUpdated', Date.now().toString());
      
        console.log('📡 Settings change broadcasted to all pages');
      }
    } catch (error) {
      console.error('Error broadcasting settings change:', error);
    }
  }

  // Listen for settings changes from settings modal
  window.addEventListener('settingsUpdated', () => {
    loadAndApplyGlobalSettings();
    broadcastSettingsChange();
  });

  // Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize existing functionality
  createFloatingHearts();
  checkForNewMessages();
  
  // Check for new messages every 30 seconds
  setInterval(checkForNewMessages, 30000);
});

// Virtual Effects and Animations
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * window.innerWidth + 'px';
  particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
  particle.style.animationDelay = Math.random() * 2 + 's';
  document.body.appendChild(particle);
  
  // Remove particle after animation
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 8000);
}

function createFloatingHeart() {
  const heart = document.createElement('div');
  heart.innerHTML = '💖';
  heart.style.position = 'fixed';
  heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
  heart.style.left = Math.random() * window.innerWidth + 'px';
  heart.style.top = window.innerHeight + 'px';
  heart.style.zIndex = '-1';
  heart.style.pointerEvents = 'none';
  heart.style.opacity = '0.6';
  heart.style.animation = 'fall 6s linear';
  document.body.appendChild(heart);
  
  // Remove heart after animation
  setTimeout(() => {
    if (heart.parentNode) {
      heart.parentNode.removeChild(heart);
    }
  }, 6000);
}

function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.innerHTML = '✨';
  sparkle.style.position = 'fixed';
  sparkle.style.fontSize = '20px';
  sparkle.style.left = Math.random() * window.innerWidth + 'px';
  sparkle.style.top = Math.random() * window.innerHeight + 'px';
  sparkle.style.zIndex = '-1';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.animation = 'sparkle 2s ease-in-out';
  document.body.appendChild(sparkle);
  
  // Remove sparkle after animation
  setTimeout(() => {
    if (sparkle.parentNode) {
      sparkle.parentNode.removeChild(sparkle);
    }
  }, 2000);
}

// Add sparkle animation to CSS
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkle {
    0% { transform: scale(0) rotate(0deg); opacity: 0; }
    50% { transform: scale(1) rotate(180deg); opacity: 1; }
    100% { transform: scale(0) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(sparkleStyle);

// Interactive button effects
function addButtonEffects() {
  const buttons = document.querySelectorAll('.menu-button, .quick-message-btn, .reveal-button');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      createSparkle();
      createSparkle();
    });
    
    button.addEventListener('click', () => {
      // Create multiple sparkles on click
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createSparkle(), i * 100);
      }
    });
  });
}

// Background particle system
function startParticleSystem() {
  // Create particles periodically
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance
      createParticle();
    }
  }, 2000);
  
  // Create floating hearts periodically
  setInterval(() => {
    if (Math.random() > 0.8) { // 20% chance
      createFloatingHeart();
    }
  }, 3000);
}

// Enhanced tap to start with effects
function enhanceTapToStart() {
  const tapOverlay = document.getElementById('tapToStart');
  if (tapOverlay) {
    tapOverlay.addEventListener('click', () => {
      // Create explosion of sparkles
      for (let i = 0; i < 10; i++) {
        setTimeout(() => createSparkle(), i * 50);
      }
      
      // Create floating hearts
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createFloatingHeart(), i * 200);
      }
    });
  }
}

// Section reveal animations
function addSectionAnimations() {
  const sections = document.querySelectorAll('.menu-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'sectionReveal 0.8s ease-out';
        createSparkle();
        createSparkle();
      }
    });
  }, { threshold: 0.3 });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Add section reveal animation to CSS
const sectionRevealStyle = document.createElement('style');
sectionRevealStyle.textContent = `
  @keyframes sectionReveal {
    0% { 
      opacity: 0; 
      transform: translateY(30px) scale(0.95); 
    }
    100% { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
`;
document.head.appendChild(sectionRevealStyle);

// Mouse trail effect
function addMouseTrail() {
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Occasionally create sparkles at mouse position
    if (Math.random() > 0.95) {
      const sparkle = document.createElement('div');
      sparkle.innerHTML = '✨';
      sparkle.style.position = 'fixed';
      sparkle.style.left = mouseX + 'px';
      sparkle.style.top = mouseY + 'px';
      sparkle.style.fontSize = '15px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '1000';
      sparkle.style.animation = 'sparkle 1s ease-in-out';
      document.body.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 1000);
    }
  });
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Start particle system
  startParticleSystem();
  
  // Add button effects
  addButtonEffects();
  
  // Enhance tap to start
  enhanceTapToStart();
  
  // Add section animations
  addSectionAnimations();
  
  // Add mouse trail effect
  addMouseTrail();
  
  // Create initial sparkles
  setTimeout(() => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createSparkle(), i * 500);
    }
  }, 1000);
});

// Enhanced reveal button functionality
document.addEventListener('DOMContentLoaded', () => {
  const revealBtn = document.getElementById('revealBtn');
  const surpriseSection = document.querySelector('.surprise');
  
  if (revealBtn && surpriseSection) {
    revealBtn.addEventListener('click', () => {
      // Create magical effect
      for (let i = 0; i < 8; i++) {
        setTimeout(() => createSparkle(), i * 100);
      }
      
      // Create floating hearts
      for (let i = 0; i < 6; i++) {
        setTimeout(() => createFloatingHeart(), i * 150);
      }
      
      // Toggle surprise section with animation
      if (surpriseSection.classList.contains('hidden')) {
        surpriseSection.classList.remove('hidden');
        surpriseSection.style.animation = 'sectionReveal 0.8s ease-out';
        
        // Update button text and icon
        const revealText = revealBtn.querySelector('.reveal-text');
        const revealIcon = revealBtn.querySelector('.reveal-icon');
        if (revealText) revealText.textContent = 'Surprise revealed!';
        if (revealIcon) revealIcon.textContent = '🎉';
        
        // Update aria-expanded
        revealBtn.setAttribute('aria-expanded', 'true');
      } else {
        surpriseSection.classList.add('hidden');
        
        // Reset button
        const revealText = revealBtn.querySelector('.reveal-text');
        const revealIcon = revealBtn.querySelector('.reveal-icon');
        if (revealText) revealText.textContent = 'I want a surprise!';
        if (revealIcon) revealIcon.textContent = '👀';
        
        // Update aria-expanded
        revealBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
});

// Show changelog modal
function showWhatsNew() {
  console.log('🔍 showWhatsNew() called');
  try {
    const modal = document.getElementById('changelogModal');
    console.log('🔍 Modal element:', modal);
    if (modal) {
      // Remove hidden class and set display to flex
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      console.log('✅ Changelog modal opened successfully');
      
      // Play sound if available
        const clickSound = document.getElementById('clickSound');
      if (clickSound) {
          clickSound.currentTime = 0;
        clickSound.volume = 0.3;
          clickSound.play().catch(() => {});
        }
    } else {
      console.error('❌ Changelog modal not found');
    }
  } catch (error) {
    console.error('❌ Error showing changelog:', error);
  }
}

// Hide changelog modal
function hideWhatsNew() {
  console.log('🔍 hideWhatsNew() called');
  try {
    const modal = document.getElementById('changelogModal');
    if (modal) {
      // Add hidden class and set display to none
      modal.classList.add('hidden');
      modal.style.display = 'none';
      document.body.style.overflow = '';
      console.log('✅ Changelog modal closed successfully');
      
      // Play sound if available
      const clickSound = document.getElementById('clickSound');
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = 0.3;
        clickSound.play().catch(() => {});
      }
    }
  } catch (error) {
    console.error('❌ Error hiding changelog:', error);
  }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const changelogModal = document.getElementById('changelogModal');
  if (e.target === changelogModal) {
    hideWhatsNew();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideWhatsNew();
  }
});

// Settings manager fallback
function openSettings() {
  console.log('🔍 openSettings() called');
  console.log('🔍 Current time:', new Date().toISOString());
  
  try {
    // Check if settings manager exists immediately
    console.log('🔍 Immediate check - window.settingsManager:', window.settingsManager);
    console.log('🔍 Immediate check - typeof window.settingsManager:', typeof window.settingsManager);
    
    if (window.settingsManager) {
      console.log('🔍 Settings manager properties:', Object.keys(window.settingsManager));
      console.log('🔍 openModal function exists:', typeof window.settingsManager.openModal);
    }
    
    // Try to initialize settings manager if it doesn't exist
    if (!window.settingsManager) {
      console.log('🔍 Settings manager not found, trying to initialize...');
      if (typeof initializeSettings === 'function') {
        window.settingsManager = initializeSettings();
        console.log('🔍 Settings manager initialized:', window.settingsManager);
      } else {
        console.error('❌ initializeSettings function not found');
      }
    }
    
    // Wait a bit for the settings manager to initialize
      setTimeout(() => {
      console.log('🔍 Delayed check - window.settingsManager:', window.settingsManager);
      console.log('🔍 Delayed check - typeof window.settingsManager?.openModal:', typeof window.settingsManager?.openModal);
      
      if (window.settingsManager && typeof window.settingsManager.openModal === 'function') {
        console.log('✅ Settings manager found, calling openModal...');
        try {
          window.settingsManager.openModal();
          console.log('✅ openModal() called successfully');
        } catch (modalError) {
          console.error('❌ Error calling openModal:', modalError);
        }
      } else {
        console.error('❌ Settings manager not available');
        console.log('🔍 Available window properties:', Object.keys(window).filter(key => key.includes('settings')));
        
        // Try to manually create settings manager
        console.log('🔍 Attempting to create settings manager manually...');
        try {
          if (typeof SimpleSettingsManager !== 'undefined') {
            window.settingsManager = new SimpleSettingsManager();
            console.log('✅ Created settings manager manually');
            window.settingsManager.openModal();
          } else {
            console.error('❌ SimpleSettingsManager not defined');
          }
        } catch (createError) {
          console.error('❌ Error creating settings manager:', createError);
        }
        
        // Show a simple alert as fallback
        alert('Settings feature is currently unavailable. Please try refreshing the page.');
      }
    }, 100);
  } catch (error) {
    console.error('❌ Error in openSettings:', error);
    alert('Settings feature is currently unavailable. Please try refreshing the page.');
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

  // === Background Music Management ===
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

  // Apply settings immediately when script loads
  loadAndApplyGlobalSettings();
  manageBackgroundMusic();

  // === Settings Change Broadcaster ===
  // This function broadcasts settings changes to all pages
  function broadcastSettingsChange() {
    try {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        const settings = JSON.parse(saved);
        
        // Dispatch custom event for other pages to listen to
        window.dispatchEvent(new CustomEvent('settingsChanged', {
          detail: settings
        }));
        
        // Also trigger storage event for cross-tab communication
        localStorage.setItem('settingsLastUpdated', Date.now().toString());
        
        console.log('📡 Settings change broadcasted to all pages');
      }
    } catch (error) {
      console.error('Error broadcasting settings change:', error);
    }
  }

  // Listen for settings changes from settings modal
  window.addEventListener('settingsUpdated', () => {
    loadAndApplyGlobalSettings();
    broadcastSettingsChange();
  });

  // Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize existing functionality
  createFloatingHearts();
  checkForNewMessages();
  
  // Check for new messages every 30 seconds
  setInterval(checkForNewMessages, 30000);
  
  // Initialize PWA functionality
  registerServiceWorker();
  setupInstallPrompt();
  checkPWAStatus();
});

// === PWA Service Worker Registration ===
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    console.log('🔄 Registering Service Worker...');
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New version available!');
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  } else {
    console.log('⚠️ Service Worker not supported');
  }
}

// Show update notification
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <div class="update-content">
      <span class="update-icon">🔄</span>
      <span class="update-text">New version available! Refresh to update.</span>
      <button class="update-btn" onclick="location.reload()">Update</button>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .update-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff69b4, #ff8fab);
      color: white;
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
      z-index: 10000;
      animation: slideInRight 0.5s ease-out;
    }
    
    .update-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .update-icon {
      font-size: 1.2rem;
    }
    
    .update-text {
      font-weight: 500;
    }
    
    .update-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .update-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

// === PWA Install Prompt ===
let deferredPrompt;

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 Install prompt triggered');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button if not already installed
    if (!window.matchMedia('(display-mode: standalone)').matches) {
      showInstallButton();
    }
  });
  
  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    console.log('📱 App installed successfully');
    hideInstallButton();
    deferredPrompt = null;
  });
  
  // Check if app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    console.log('📱 App is already installed');
    hideInstallButton();
  } else {
    // Show install button if service worker is registered
    setTimeout(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            console.log('📱 Service Worker registered, showing install button');
            showInstallButton();
          }
        });
      }
    }, 2000);
  }
}

function showInstallButton() {
  // Create install button if it doesn't exist
  if (!document.getElementById('installBtn')) {
    const installBtn = document.createElement('button');
    installBtn.id = 'installBtn';
    installBtn.className = 'install-btn';
    installBtn.innerHTML = '📱 Install App';
    installBtn.onclick = installApp;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .install-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff69b4, #ff8fab);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
        z-index: 1000;
        animation: bounce 2s infinite;
        font-size: 14px;
        min-width: 120px;
        transition: all 0.3s ease;
      }
      
      .install-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
        background: linear-gradient(135deg, #ff8fab, #ff69b4);
      }
      
      .install-btn:active {
        transform: translateY(0);
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-5px); }
        60% { transform: translateY(-3px); }
      }
      
      /* Mobile responsive */
      @media (max-width: 768px) {
        .install-btn {
          bottom: 15px;
          right: 15px;
          padding: 0.6rem 1.2rem;
          font-size: 13px;
          min-width: 100px;
        }
      }
      
      @media (max-width: 480px) {
        .install-btn {
          bottom: 10px;
          right: 10px;
          padding: 0.5rem 1rem;
          font-size: 12px;
          min-width: 90px;
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(installBtn);
    console.log('📱 Install button created');
  }
  
  // Also show bottom banner
  showBottomInstallBanner();
}

function showBottomInstallBanner() {
  // Create bottom banner if it doesn't exist
  if (!document.getElementById('installBanner')) {
    const banner = document.createElement('div');
    banner.id = 'installBanner';
    banner.className = 'install-banner';
    banner.innerHTML = `
      <div class="banner-content">
        <div class="banner-text">
          <span class="banner-icon">📱</span>
          <span>Install Baby Love App</span>
        </div>
        <div class="banner-actions">
          <button class="banner-install-btn" onclick="installApp()">Install</button>
          <button class="banner-close-btn" onclick="hideBottomInstallBanner()">✕</button>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .install-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #ff69b4, #ff8fab);
        color: white;
        padding: 1rem;
        z-index: 999;
        animation: slideUp 0.5s ease-out;
        box-shadow: 0 -2px 10px rgba(255, 105, 180, 0.3);
      }
      
      .banner-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .banner-text {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        font-size: 16px;
      }
      
      .banner-icon {
        font-size: 1.2em;
      }
      
      .banner-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      
      .banner-install-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
      }
      
      .banner-install-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
      }
      
      .banner-close-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }
      
      .banner-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
      
      /* Mobile responsive */
      @media (max-width: 768px) {
        .banner-content {
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
        }
        
        .banner-text {
          font-size: 14px;
        }
        
        .banner-install-btn {
          font-size: 13px;
          padding: 0.4rem 0.8rem;
        }
      }
      
      @media (max-width: 480px) {
        .install-banner {
          padding: 0.8rem;
        }
        
        .banner-text {
          font-size: 13px;
        }
        
        .banner-install-btn {
          font-size: 12px;
          padding: 0.3rem 0.7rem;
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(banner);
    console.log('📱 Install banner created');
  }
}

function hideBottomInstallBanner() {
  const banner = document.getElementById('installBanner');
  if (banner) {
    banner.remove();
    console.log('📱 Install banner hidden');
  }
}

function hideInstallButton() {
  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.remove();
    console.log('📱 Install button hidden');
  }
  
  // Also hide bottom banner
  hideBottomInstallBanner();
}

function installApp() {
  console.log('📱 Install button clicked');
  
  if (deferredPrompt) {
    console.log('📱 Using deferred prompt');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('📱 User accepted install prompt');
        hideInstallButton();
      } else {
        console.log('📱 User dismissed install prompt');
      }
      deferredPrompt = null;
    });
  } else {
    console.log('📱 No deferred prompt, showing manual install instructions');
    showManualInstallInstructions();
  }
}

function showManualInstallInstructions() {
  const instructions = document.createElement('div');
  instructions.id = 'installInstructions';
  instructions.className = 'install-instructions';
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  let instructionText = '';
  if (isIOS) {
    instructionText = `
      <div class="instruction-content">
        <h3>📱 Install on iOS</h3>
        <ol>
          <li>Tap the <strong>Share</strong> button <span style="font-size: 1.2em;">📤</span></li>
          <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
          <li>Tap <strong>"Add"</strong> to install</li>
        </ol>
        <button onclick="closeInstallInstructions()" class="close-btn">Got it!</button>
      </div>
    `;
  } else if (isAndroid) {
    instructionText = `
      <div class="instruction-content">
        <h3>📱 Install on Android</h3>
        <ol>
          <li>Tap the <strong>Menu</strong> button <span style="font-size: 1.2em;">⋮</span></li>
          <li>Tap <strong>"Add to Home screen"</strong></li>
          <li>Tap <strong>"Add"</strong> to install</li>
        </ol>
        <button onclick="closeInstallInstructions()" class="close-btn">Got it!</button>
      </div>
    `;
  } else {
    instructionText = `
      <div class="instruction-content">
        <h3>📱 Install App</h3>
        <p>Look for the install icon in your browser's address bar or menu:</p>
        <ul>
          <li><strong>Chrome:</strong> Look for the install icon ⚙️ in the address bar</li>
          <li><strong>Edge:</strong> Look for the install icon 📱 in the address bar</li>
          <li><strong>Firefox:</strong> Look for the install icon in the menu</li>
        </ul>
        <button onclick="closeInstallInstructions()" class="close-btn">Got it!</button>
      </div>
    `;
  }
  
  instructions.innerHTML = instructionText;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .install-instructions {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    }
    
    .instruction-content {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      max-width: 400px;
      margin: 1rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      text-align: left;
    }
    
    .instruction-content h3 {
      color: #ff69b4;
      margin-bottom: 1rem;
      text-align: center;
    }
    
    .instruction-content ol {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }
    
    .instruction-content li {
      margin: 0.5rem 0;
      line-height: 1.5;
    }
    
    .instruction-content ul {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }
    
    .close-btn {
      background: linear-gradient(135deg, #ff69b4, #ff8fab);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      margin-top: 1rem;
      width: 100%;
    }
    
    .close-btn:hover {
      background: linear-gradient(135deg, #ff8fab, #ff69b4);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .instruction-content {
        background: #2a2a2a;
        color: white;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(instructions);
}

function closeInstallInstructions() {
  const instructions = document.getElementById('installInstructions');
  if (instructions) {
    instructions.remove();
  }
}

// Make function globally available
window.closeInstallInstructions = closeInstallInstructions;
window.hideBottomInstallBanner = hideBottomInstallBanner;

// === PWA Status Check ===
function checkPWAStatus() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInstalled = window.navigator.standalone || isStandalone;
  
  console.log('📱 PWA Status:', {
    isStandalone,
    isInstalled,
    userAgent: navigator.userAgent
  });
  
  if (isInstalled) {
    console.log('📱 App is running in standalone mode');
    // Add standalone-specific features here
  }
}

