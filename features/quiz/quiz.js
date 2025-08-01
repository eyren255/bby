// Quiz configuration
const quizConfig = {
  answers: {
    q1: "c",  // Noodle
    q2: "b",  // July 28
    q3: "b",  // Losing you
    q4: "a",  // blue
    q5: "a"   // Your smile
  },
  totalQuestions: 5
};

// DOM elements
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startQuiz');
const quizForm = document.getElementById('quizForm');
const progressFill = document.getElementById('progressFill');
const resultBox = document.getElementById('resultBox');
const resultContent = document.getElementById('resultContent');
const retryBtn = document.getElementById('retryBtn');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');

// State variables
let currentQuestion = 0;
let score = 0;
let answeredQuestions = new Set();

// Initialize quiz
function initQuiz() {
  // Add event listeners
  startBtn.addEventListener('click', startQuiz);
  quizForm.addEventListener('submit', handleSubmit);
  retryBtn.addEventListener('click', resetQuiz);
  
  // Add progress tracking for radio buttons
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', updateProgress);
  });
}

// Start the quiz
function startQuiz() {
  playSound(clickSound);
  startScreen.classList.add('hidden');
  quizForm.classList.remove('hidden');
  updateProgress();
}

// Update progress bar
function updateProgress() {
  const answeredCount = document.querySelectorAll('input[type="radio"]:checked').length;
  const progress = (answeredCount / quizConfig.totalQuestions) * 100;
  progressFill.style.width = `${progress}%`;
}

// Handle form submission
function handleSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(quizForm);
  const answers = {};
  
  // Collect all answers
  for (let i = 1; i <= quizConfig.totalQuestions; i++) {
    const answer = formData.get(`q${i}`);
    if (answer) {
      answers[`q${i}`] = answer;
    }
  }
  
  // Check if all questions are answered
  if (Object.keys(answers).length < quizConfig.totalQuestions) {
    alert('Please answer all questions before submitting! 💕');
    return;
  }
  
  // Calculate score
  score = 0;
  Object.keys(answers).forEach(question => {
    if (answers[question] === quizConfig.answers[question]) {
      score++;
    }
  });
  
  // Show results
  showResults();
}

// Show quiz results
function showResults() {
  playSound(winSound);
  
  const percentage = (score / quizConfig.totalQuestions) * 100;
  let message = '';
  let emoji = '';
  
  if (percentage === 100) {
    message = `💯 Perfect Score! You know me so well, my love! You're absolutely amazing! 💕`;
    emoji = '🏆';
  } else if (percentage >= 80) {
    message = `🥰 Excellent! You know me pretty well, cutie! ${score}/5 correct!`;
    emoji = '💖';
  } else if (percentage >= 60) {
    message = `😊 Good job! You know me quite well! ${score}/5 correct!`;
    emoji = '💝';
  } else if (percentage >= 40) {
    message = `😅 Not bad! We need more time together! ${score}/5 correct!`;
    emoji = '💕';
  } else {
    message = `😅 Aww... we need a movie night to fix this! ${score}/5 correct!`;
    emoji = '🎬';
  }
  
  resultContent.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 15px;">${emoji}</div>
    <div>${message}</div>
    <div style="margin-top: 15px; font-size: 1.1rem; color: #666;">
      Score: ${score}/${quizConfig.totalQuestions} (${percentage}%)
    </div>
  `;
  
  quizForm.classList.add('hidden');
  resultBox.classList.remove('hidden');
  
  // Add celebration animation
  createCelebration();
}

// Create celebration effects
function createCelebration() {
  // Create floating hearts
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createHeart();
    }, i * 100);
  }
}

// Create floating heart
function createHeart() {
  const heart = document.createElement('div');
  heart.innerHTML = '💖';
  heart.style.position = 'fixed';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.top = '100vh';
  heart.style.fontSize = '2rem';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '9999';
  heart.style.animation = 'floatUp 3s ease-out forwards';
  
  document.body.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, 3000);
}

// Reset quiz
function resetQuiz() {
  playSound(clickSound);
  
  // Reset form
  quizForm.reset();
  
  // Reset state
  score = 0;
  currentQuestion = 0;
  answeredQuestions.clear();
  
  // Reset progress
  progressFill.style.width = '0%';
  
  // Show start screen
  resultBox.classList.add('hidden');
  startScreen.classList.remove('hidden');
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

// Add floating hearts animation
const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) scale(1.5);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initQuiz);
