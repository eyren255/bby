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
});

