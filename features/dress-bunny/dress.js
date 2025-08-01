// Outfit configuration
const outfitItems = {
  hat: {
    crown: '👑',
    party: '🎉',
    flower: '🌸',
    winter: '❄️'
  },
  bow: {
    pink: '🎀',
    blue: '💙',
    rainbow: '🌈',
    star: '⭐'
  },
  glasses: {
    sunny: '😎',
    reading: '📚',
    cool: '🕶️',
    cute: '🥺'
  },
  scarf: {
    red: '❤️',
    blue: '💙',
    striped: '🌈',
    warm: '🧶'
  },
  necklace: {
    heart: '💖',
    star: '⭐',
    flower: '🌸',
    pearl: '💎'
  }
};

// DOM elements
const bunnyImage = document.getElementById('bunnyImage');
const hatDisplay = document.getElementById('hatDisplay');
const bowDisplay = document.getElementById('bowDisplay');
const glassesDisplay = document.getElementById('glassesDisplay');
const scarfDisplay = document.getElementById('scarfDisplay');
const necklaceDisplay = document.getElementById('necklaceDisplay');
const resetBunnyBtn = document.getElementById('resetBunny');
const randomOutfitBtn = document.getElementById('randomOutfit');
const saveOutfitBtn = document.getElementById('saveOutfit');
const dressSound = document.getElementById('dressSound');
const saveSound = document.getElementById('saveSound');

// State variables
let currentOutfit = {
  hat: null,
  bow: null,
  glasses: null,
  scarf: null,
  necklace: null
};

// Initialize dress bunny
function initDressBunny() {
  // Add event listeners for clothing buttons
  document.querySelectorAll('.clothing-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const outfit = btn.dataset.outfit;
      const item = btn.dataset.item;
      dressBunny(outfit, item);
    });
  });
  
  // Add control button listeners
  resetBunnyBtn.addEventListener('click', resetBunny);
  randomOutfitBtn.addEventListener('click', randomOutfit);
  saveOutfitBtn.addEventListener('click', saveOutfit);
  
  // Load saved outfit if exists
  loadSavedOutfit();
}

// Dress the bunny with an item
function dressBunny(outfit, item) {
  // Play sound
  playSound(dressSound);
  
  // Update current outfit
  currentOutfit[outfit] = item;
  
  // Update display
  updateOutfitDisplay();
  
  // Update button states
  updateButtonStates(outfit, item);
  
  // Save outfit
  saveOutfitToStorage();
}

// Update outfit display
function updateOutfitDisplay() {
  // Clear all displays
  hatDisplay.innerHTML = '';
  bowDisplay.innerHTML = '';
  glassesDisplay.innerHTML = '';
  scarfDisplay.innerHTML = '';
  necklaceDisplay.innerHTML = '';
  
  // Add items to displays
  if (currentOutfit.hat) {
    hatDisplay.innerHTML = outfitItems.hat[currentOutfit.hat];
  }
  if (currentOutfit.bow) {
    bowDisplay.innerHTML = outfitItems.bow[currentOutfit.bow];
  }
  if (currentOutfit.glasses) {
    glassesDisplay.innerHTML = outfitItems.glasses[currentOutfit.glasses];
  }
  if (currentOutfit.scarf) {
    scarfDisplay.innerHTML = outfitItems.scarf[currentOutfit.scarf];
  }
  if (currentOutfit.necklace) {
    necklaceDisplay.innerHTML = outfitItems.necklace[currentOutfit.necklace];
  }
}

// Update button states
function updateButtonStates(outfit, selectedItem) {
  // Remove selected class from all buttons in this category
  document.querySelectorAll(`[data-outfit="${outfit}"]`).forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // Add selected class to the clicked button
  const selectedBtn = document.querySelector(`[data-outfit="${outfit}"][data-item="${selectedItem}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('selected');
  }
}

// Reset bunny
function resetBunny() {
  playSound(dressSound);
  
  // Clear current outfit
  currentOutfit = {
    hat: null,
    bow: null,
    glasses: null,
    scarf: null,
    necklace: null
  };
  
  // Update display
  updateOutfitDisplay();
  
  // Clear button states
  document.querySelectorAll('.clothing-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // Clear storage
  localStorage.removeItem('bunnyOutfit');
  
  // Show reset message
  showMessage('🔄 Bunny reset! Ready for a new outfit! 💕');
}

// Random outfit
function randomOutfit() {
  playSound(dressSound);
  
  // Generate random outfit
  const outfits = Object.keys(outfitItems);
  const newOutfit = {};
  
  outfits.forEach(outfit => {
    const items = Object.keys(outfitItems[outfit]);
    // 50% chance to add each item
    if (Math.random() > 0.5) {
      newOutfit[outfit] = items[Math.floor(Math.random() * items.length)];
    }
  });
  
  currentOutfit = newOutfit;
  
  // Update display
  updateOutfitDisplay();
  
  // Update button states
  updateButtonStatesForOutfit();
  
  // Save outfit
  saveOutfitToStorage();
  
  showMessage('🎲 Random outfit applied! Looking cute! 💖');
}

// Update button states for current outfit
function updateButtonStatesForOutfit() {
  // Clear all selected states
  document.querySelectorAll('.clothing-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // Set selected states for current outfit
  Object.keys(currentOutfit).forEach(outfit => {
    if (currentOutfit[outfit]) {
      const btn = document.querySelector(`[data-outfit="${outfit}"][data-item="${currentOutfit[outfit]}"]`);
      if (btn) {
        btn.classList.add('selected');
      }
    }
  });
}

// Save outfit
function saveOutfit() {
  playSound(saveSound);
  
  // Check if bunny has any items
  const hasItems = Object.values(currentOutfit).some(item => item !== null);
  
  if (!hasItems) {
    showMessage('💕 Please dress the bunny first! 🐰');
    return;
  }
  
  // Save to storage
  saveOutfitToStorage();
  
  showMessage('💾 Outfit saved! Your bunny looks adorable! 🐰💕');
}

// Save outfit to storage
function saveOutfitToStorage() {
  localStorage.setItem('bunnyOutfit', JSON.stringify(currentOutfit));
}

// Load saved outfit
function loadSavedOutfit() {
  const saved = localStorage.getItem('bunnyOutfit');
  if (saved) {
    try {
      currentOutfit = JSON.parse(saved);
      updateOutfitDisplay();
      updateButtonStatesForOutfit();
    } catch (e) {
      console.log('Error loading saved outfit:', e);
    }
  }
}

// Show message
function showMessage(message) {
  // Create temporary message element
  const messageEl = document.createElement('div');
  messageEl.textContent = message;
  messageEl.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 182, 193, 0.95);
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: bold;
    z-index: 1000;
    animation: messagePop 0.5s ease;
  `;
  
  document.body.appendChild(messageEl);
  
  // Remove after 3 seconds
  setTimeout(() => {
    messageEl.remove();
  }, 3000);
}

// Play sound effect
function playSound(audioElement) {
  if (audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(() => {
      // Ignore autoplay restrictions
    });
  }
}

// Add message animation
const style = document.createElement('style');
style.textContent = `
  @keyframes messagePop {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initDressBunny);