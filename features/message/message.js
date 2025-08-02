// Message configuration

// === Settings Loading ===
function loadAndApplySettings() {
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
    console.error('Error loading settings in message:', error);
  }
}

// Load settings when page loads
document.addEventListener('DOMContentLoaded', loadAndApplySettings);

// === Settings Change Listener ===
// Listen for settings changes from main menu
window.addEventListener('settingsChanged', (e) => {
  const settings = e.detail;
  
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
});

// Also listen for storage events (cross-tab communication)
window.addEventListener('storage', (e) => {
  if (e.key === 'userSettings' || e.key === 'settingsLastUpdated') {
    loadAndApplySettings();
  }
});

// Message configuration
const messageStyles = {
  romantic: {
    background: 'linear-gradient(135deg, #ffe6f0, #ffd6e0)',
    borderColor: '#ff69b4',
    emoji: '💕'
  },
  cute: {
    background: 'linear-gradient(135deg, #fff0f5, #ffe6f0)',
    borderColor: '#ffb6c1',
    emoji: '🌸'
  },
  sweet: {
    background: 'linear-gradient(135deg, #fff8dc, #fffacd)',
    borderColor: '#ffd700',
    emoji: '🍯'
  },
  passionate: {
    background: 'linear-gradient(135deg, #ffe4e1, #ffb6c1)',
    borderColor: '#ff6347',
    emoji: '🔥'
  }
};

// DOM elements
const messageForm = document.getElementById('messageForm');
const messageTitle = document.getElementById('messageTitle');
const messageContent = document.getElementById('messageContent');
const charCount = document.getElementById('charCount');
const previewBtn = document.getElementById('previewBtn');
const messagePreview = document.getElementById('messagePreview');
const previewContent = document.getElementById('previewContent');
const closePreview = document.getElementById('closePreview');
const editMessage = document.getElementById('editMessage');
const confirmSend = document.getElementById('confirmSend');
const messageList = document.getElementById('messageList');
const typeSound = document.getElementById('typeSound');
const sendSound = document.getElementById('sendSound');

// State variables
let currentStyle = 'romantic';
let selectedEffects = [];
let messages = JSON.parse(localStorage.getItem('loveMessages') || '[]');

// Initialize message feature
function initMessage() {
  // Add event listeners
  messageForm.addEventListener('submit', handleSubmit);
  previewBtn.addEventListener('click', showPreview);
  closePreview.addEventListener('click', hidePreview);
  editMessage.addEventListener('click', hidePreview);
  confirmSend.addEventListener('click', sendMessage);
  
  // Character counting
  messageContent.addEventListener('input', updateCharCount);
  messageTitle.addEventListener('input', updateCharCount);
  
  // Style buttons
  document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', () => selectStyle(btn.dataset.style));
  });
  
  // Effect buttons
  document.querySelectorAll('.effect-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleEffect(btn.dataset.effect));
  });
  
  // Load existing messages
  loadMessages();
  
  // Initial character count
  updateCharCount();
}



// Update character count
function updateCharCount() {
  const titleLength = messageTitle.value.length;
  const contentLength = messageContent.value.length;
  const totalLength = titleLength + contentLength;
  
  charCount.textContent = totalLength;
  
  // Change color based on length
  if (totalLength > 450) {
    charCount.style.color = '#ff6347';
  } else if (totalLength > 400) {
    charCount.style.color = '#ffa500';
  } else {
    charCount.style.color = '#666';
  }
  
  // Play typing sound
  playSound(typeSound);
}

// Select message style
function selectStyle(style) {
  currentStyle = style;
  
  // Update active button
  document.querySelectorAll('.style-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-style="${style}"]`).classList.add('active');
}

// Toggle effect
function toggleEffect(effect) {
  const btn = document.querySelector(`[data-effect="${effect}"]`);
  
  if (selectedEffects.includes(effect)) {
    selectedEffects = selectedEffects.filter(e => e !== effect);
    btn.style.background = '#f8f9fa';
  } else {
    selectedEffects.push(effect);
    btn.style.background = '#9370db';
    btn.style.color = 'white';
  }
}

// Show preview
function showPreview() {
  if (!messageTitle.value.trim() || !messageContent.value.trim()) {
    alert('Please fill in both title and message! 💕');
    return;
  }
  
  const style = messageStyles[currentStyle];
  const effects = selectedEffects.map(effect => {
    switch(effect) {
      case 'hearts': return '💖';
      case 'sparkles': return '✨';
      case 'flowers': return '🌹';
      case 'music': return '🎵';
      default: return '';
    }
  }).join(' ');
  
  previewContent.innerHTML = `
    <div style="background: ${style.background}; border-left: 4px solid ${style.borderColor}; padding: 20px; border-radius: 12px;">
      <h3 style="color: ${style.borderColor}; margin-bottom: 15px;">${style.emoji} ${messageTitle.value}</h3>
      <div style="white-space: pre-wrap; line-height: 1.6; color: #333;">
        ${messageContent.value}
      </div>
      ${effects ? `<div style="text-align: center; margin-top: 15px; font-size: 1.2rem;">${effects}</div>` : ''}
    </div>
  `;
  
  messagePreview.classList.remove('hidden');
  messageForm.classList.add('hidden');
}

// Hide preview
function hidePreview() {
  messagePreview.classList.add('hidden');
  messageForm.classList.remove('hidden');
}

// Handle form submission
function handleSubmit(e) {
  e.preventDefault();
  showPreview();
}

// Send message
async function sendMessage() {
  const message = {
    title: messageTitle.value,
    content: messageContent.value,
    style: currentStyle,
    effects: selectedEffects,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now()
  };
  
  // Validate message
  if (!message.title.trim() || !message.content.trim()) {
    alert('❌ Please fill in both title and message content! 💕');
    return;
  }
  
  try {
    // Show loading state
    const sendBtn = document.querySelector('.send-btn');
    const originalText = sendBtn.innerHTML;
    sendBtn.innerHTML = '💌 Sending...';
    sendBtn.disabled = true;
    
    console.log('Sending message:', message);
    
    // Save to Supabase
    const result = await MessageService.addMessage(message);
    console.log('Message sent successfully:', result);
    
    // Play send sound
    playSound(sendSound);
    
    // Show success message
    const successMessage = `
🎉 Message Sent Successfully! 💌

Your love message has been saved and will sync across all devices! 

I'll see your message on any device I use! 💕
    `;
    
    alert(successMessage);
    
    // Reset form
    messageForm.reset();
    updateCharCount();
    selectedEffects = [];
    currentStyle = 'romantic';
    
    // Reset buttons
    document.querySelectorAll('.style-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector('.style-btn').classList.add('active');
    
    document.querySelectorAll('.effect-btn').forEach(btn => {
      btn.style.background = '#f8f9fa';
      btn.style.color = '#333';
    });
    
    // Hide preview
    hidePreview();
    
    // Reload messages
    await loadMessages();
    
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Provide more specific error messages
    let errorMessage = '❌ Error sending message. Please try again! 💕';
    
    if (error.message) {
      if (error.message.includes('network')) {
        errorMessage = '❌ Network error. Please check your internet connection! 💕';
      } else if (error.message.includes('permission')) {
        errorMessage = '❌ Permission error. Message saved locally only! 💕';
      } else if (error.message.includes('database')) {
        errorMessage = '❌ Database error. Message saved locally only! 💕';
      }
    }
    
    alert(errorMessage);
  } finally {
    // Reset button
    const sendBtn = document.querySelector('.send-btn');
    sendBtn.innerHTML = '💌 Send Message';
    sendBtn.disabled = false;
  }
}

// Load messages
async function loadMessages() {
  messageList.innerHTML = '';
  
  try {
    // Show loading state
    messageList.innerHTML = `
      <div style="text-align: center; color: #666; font-style: italic; padding: 20px;">
        Loading messages... 💕
      </div>
    `;
    
    // Get all messages from Supabase
    const allMessages = await MessageService.getAllMessages();
    
    if (allMessages.length === 0) {
      messageList.innerHTML = `
        <div style="text-align: center; color: #666; font-style: italic; padding: 20px;">
          No messages yet. Write your first love message! 💕
        </div>
      `;
      return;
    }
    
    messageList.innerHTML = '';
    
    allMessages.forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.className = 'message-item';
      
      const effects = message.effects.map(effect => {
        switch(effect) {
          case 'hearts': return '💖';
          case 'sparkles': return '✨';
          case 'flowers': return '🌹';
          case 'music': return '🎵';
          default: return '';
        }
      }).join(' ');
      
      const messageDate = new Date(message.created_at).toLocaleDateString();
      
      messageElement.innerHTML = `
        <h4>${message.title}</h4>
        <p>${message.content}</p>
        ${effects ? `<div style="text-align: center; margin-top: 10px; font-size: 1.1rem;">${effects}</div>` : ''}
        <div class="date">${messageDate}</div>
      `;
      
      messageList.appendChild(messageElement);
    });
  } catch (error) {
    console.error('Error loading messages:', error);
    messageList.innerHTML = `
      <div style="text-align: center; color: #ff6347; font-style: italic; padding: 20px;">
        Error loading messages. Please try again! 💕
      </div>
    `;
  }
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMessage); 