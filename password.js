// password.js
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("passwordModal");
  const input = document.getElementById("passwordInput");
  const btn = document.getElementById("submitPassword");
  const menu = document.querySelector(".menu");
  const tapToStart = document.getElementById("tapToStart");

  const correctPassword = "iloveyouhoneybun";

  // ✅ Immediately unlock if already authenticated
  if (localStorage.getItem("unlocked") === "true") {
    if (modal) modal.style.display = "none";
    if (menu) menu.style.display = "block";
    if (tapToStart) tapToStart.style.display = "none";
    return;
  }

  // Show password modal by default if not authenticated
  if (modal) {
    modal.style.display = "flex";
  }
  
  // Hide menu and tap-to-start until password is entered
  if (menu) {
    menu.style.display = "none";
  }
  
  if (tapToStart) {
    tapToStart.style.display = "none";
  }

  // Handle password submission
  btn?.addEventListener("click", () => {
    handlePasswordSubmit();
  });

  // Handle Enter key press
  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handlePasswordSubmit();
    }
  });

  // Focus on input when modal loads
  if (input) {
    input.focus();
  }

  function handlePasswordSubmit() {
    if (!input || !modal || !menu) return;

    if (input.value === correctPassword) {
      // Success animation
      btn.style.background = "linear-gradient(145deg, #4CAF50, #45a049)";
      btn.textContent = "Welcome! 💖";
      
      setTimeout(() => {
        modal.style.display = "none";
        menu.style.display = "block";
        localStorage.setItem("unlocked", "true");
        
        // Show success message
        showSuccessMessage();
      }, 1000);
    } else {
      // Error animation
      input.style.borderColor = "#ff4444";
      input.style.boxShadow = "0 0 0 3px rgba(255, 68, 68, 0.1)";
      
      setTimeout(() => {
        input.style.borderColor = "#ffb6c1";
        input.style.boxShadow = "";
        input.value = "";
        input.focus();
      }, 1000);
    }
  }

  function showSuccessMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(145deg, #ff69b4, #ff8fab);
      color: white;
      padding: 20px 30px;
      border-radius: 15px;
      font-size: 1.2rem;
      font-weight: bold;
      box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
      z-index: 10002;
      animation: fadeInScale 0.5s ease;
    `;
    message.textContent = 'Welcome, Honey Bun 💖';
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.animation = 'fadeOutScale 0.5s ease';
      setTimeout(() => message.remove(), 500);
    }, 2000);
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInScale {
      from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes fadeOutScale {
      from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;
  document.head.appendChild(style);
});
