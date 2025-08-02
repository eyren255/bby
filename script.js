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

