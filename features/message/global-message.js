// 🌐 Global Messaging Component
// This can be included on any page to add messaging functionality

class GlobalMessageSystem {
  constructor() {
    this.init();
  }

  init() {
    this.createMessageButton();
    this.createNotificationSystem();
    this.startMessageChecking();
  }

  // Create floating message button
  createMessageButton() {
    const messageBtn = document.createElement('div');
    messageBtn.id = 'globalMessageBtn';
    messageBtn.className = 'global-message-btn';
    messageBtn.innerHTML = `
      <span class="message-icon">💌</span>
      <span class="message-tooltip">Send Love Message</span>
    `;
    
    messageBtn.addEventListener('click', () => {
      this.playClickSound();
      window.location.href = 'message/message.html';
    });
    
    document.body.appendChild(messageBtn);
  }

  // Create notification system
  createNotificationSystem() {
    const notification = document.createElement('div');
    notification.id = 'globalMessageNotification';
    notification.className = 'global-message-notification hidden';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">💌</span>
        <span class="notification-text">New love message!</span>
        <button class="notification-close">×</button>
      </div>
    `;
    
    notification.addEventListener('click', () => {
      window.location.href = 'message/message.html';
    });
    
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notification.classList.add('hidden');
      });
    }
    
    document.body.appendChild(notification);
  }

  // Start checking for new messages
  startMessageChecking() {
    // Check immediately
    this.checkForNewMessages();
    
    // Check every 30 seconds
    setInterval(() => {
      this.checkForNewMessages();
    }, 30000);
  }

  // Check for new messages
  async checkForNewMessages() {
    try {
      const lastVisit = localStorage.getItem('lastVisitTime') || '0';
      const currentTime = new Date().toISOString();
      
      // Check if there are new messages since last visit
      const newMessages = await MessageService.getNewMessages(lastVisit);
      
      if (newMessages.length > 0) {
        this.showNotification(newMessages.length);
      }
      
      // Update last visit time
      localStorage.setItem('lastVisitTime', currentTime);
    } catch (error) {
      console.error('Error checking for new messages:', error);
    }
  }

  // Show notification
  showNotification(count) {
    const notification = document.getElementById('globalMessageNotification');
    if (notification) {
      const notificationText = notification.querySelector('.notification-text');
      if (notificationText) {
        notificationText.textContent = `You have ${count} new love message${count > 1 ? 's' : ''}!`;
      }
      notification.classList.remove('hidden');
      
      // Auto-hide after 8 seconds
      setTimeout(() => {
        notification.classList.add('hidden');
      }, 8000);
    }
  }

  // Play click sound
  playClickSound() {
    const clickSound = document.getElementById('clickSound');
    if (clickSound) {
      clickSound.volume = 0.3;
      clickSound.play().catch(() => {});
    }
  }
}

// Initialize global messaging system
document.addEventListener('DOMContentLoaded', () => {
  new GlobalMessageSystem();
});

// Add CSS for global messaging components
const globalMessageStyle = document.createElement('style');
globalMessageStyle.textContent = `
  .global-message-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    background: linear-gradient(145deg, #ff69b4, #ff8fab);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
    transition: all 0.3s ease;
    z-index: 9999;
    animation: float 3s ease-in-out infinite;
  }

  .global-message-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.6);
  }

  .global-message-btn .message-icon {
    font-size: 1.5rem;
    color: white;
  }

  .global-message-btn .message-tooltip {
    position: absolute;
    right: 70px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .global-message-btn:hover .message-tooltip {
    opacity: 1;
  }

  .global-message-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(145deg, #ff69b4, #ff8fab);
    color: white;
    padding: 15px 20px;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
    z-index: 10000;
    animation: slideInRight 0.5s ease;
    max-width: 300px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .global-message-notification:hover {
    transform: translateX(-5px);
    box-shadow: 0 10px 30px rgba(255, 105, 180, 0.5);
  }

  .global-message-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .global-message-notification .notification-icon {
    font-size: 1.2rem;
    animation: pulse 2s infinite;
  }

  .global-message-notification .notification-text {
    font-weight: bold;
    font-size: 0.9rem;
  }

  .global-message-notification .notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: auto;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  .global-message-notification .notification-close:hover {
    opacity: 1;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .hidden {
    display: none !important;
  }

  @media (max-width: 768px) {
    .global-message-btn {
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
    }

    .global-message-btn .message-icon {
      font-size: 1.2rem;
    }

    .global-message-notification {
      right: 10px;
      left: 10px;
      max-width: none;
    }
  }
`;
document.head.appendChild(globalMessageStyle); 