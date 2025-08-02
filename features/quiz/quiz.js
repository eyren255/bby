// 🧠 Enhanced Quiz JavaScript

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
    console.error('Error loading settings in quiz:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Load settings first
  loadAndApplySettings();
  
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
  
  // DOM Elements
  const startScreen = document.getElementById('startScreen');
  const startBtn = document.getElementById('startQuiz');
  const quizContainer = document.getElementById('quizContainer');
  const questionDisplay = document.getElementById('questionDisplay');
  const questionText = document.getElementById('questionText');
  const questionHint = document.getElementById('questionHint');
  const optionsContainer = document.getElementById('optionsContainer');
  const hintBtn = document.getElementById('hintBtn');
  const nextBtn = document.getElementById('nextBtn');
  const resultScreen = document.getElementById('resultScreen');
  const progressFill = document.getElementById('progressFill');
  const currentQuestion = document.getElementById('currentQuestion');
  const totalQuestions = document.getElementById('totalQuestions');
  const currentScore = document.getElementById('currentScore');
  const finalScore = document.getElementById('finalScore');
  const finalPercentage = document.getElementById('finalPercentage');
  const timeTaken = document.getElementById('timeTaken');
  const resultIcon = document.getElementById('resultIcon');
  const resultTitle = document.getElementById('resultTitle');
  const resultMessage = document.getElementById('resultMessage');
  const retryBtn = document.getElementById('retryBtn');
  const shareBtn = document.getElementById('shareBtn');
  const quizzesTaken = document.getElementById('quizzesTaken');
  const bestScore = document.getElementById('bestScore');
  const perfectScores = document.getElementById('perfectScores');

  // Audio elements
  const clickSound = document.getElementById('clickSound');
  const correctSound = document.getElementById('correctSound');
  const wrongSound = document.getElementById('wrongSound');
  const achievementSound = document.getElementById('achievementSound');

  // Quiz data with categories
  const quizData = {
    basic: {
      name: 'Basic Questions',
      questions: [
        {
          question: "What's my favorite snack?",
          options: ["🍟 Chips", "🍦 Ice cream", "🍜 Noodle", "🍕 Pizza"],
          correct: 2,
          hint: "Think about what I always crave when we're together!",
          explanation: "I love noodles! They're my comfort food."
        },
        {
          question: "What's my favorite color?",
          options: ["💙 Blue", "💖 Pink", "💜 Purple", "💚 Green"],
          correct: 1,
          hint: "It's a very romantic color!",
          explanation: "Pink is my favorite color - it's so pretty and romantic!"
        },
        {
          question: "What's my biggest fear?",
          options: ["🕷️ Spiders", "💔 Losing you", "🏔️ Heights", "🌩️ Thunder"],
          correct: 1,
          hint: "It's something that would break my heart...",
          explanation: "My biggest fear is losing you - you mean everything to me!"
        },
        {
          question: "What do I love most about you?",
          options: ["😊 Your smile", "💝 Your kindness", "🎵 Your voice", "🤗 Your hugs"],
          correct: 0,
          hint: "It's the first thing I notice about you!",
          explanation: "Your smile lights up my world! It's the most beautiful thing ever!"
        },
        {
          question: "When is our anniversary?",
          options: ["💝 February 14", "🌞 July 28", "❄️ December 1", "🌸 March 15"],
          correct: 1,
          hint: "It's in the middle of the year!",
          explanation: "July 28th is our special day - the day we became official!"
        }
      ]
    },
    personal: {
      name: 'Personal Questions',
      questions: [
        {
          question: "What's my dream job?",
          options: ["👩‍⚕️ Doctor", "👩‍🏫 Teacher", "👩‍🎨 Artist", "👩‍💼 Business"],
          correct: 2,
          hint: "I love creating beautiful things!",
          explanation: "I want to be an artist - I love expressing myself through art!"
        },
        {
          question: "What's my favorite season?",
          options: ["🌸 Spring", "☀️ Summer", "🍂 Fall", "❄️ Winter"],
          correct: 0,
          hint: "When flowers bloom and everything is beautiful!",
          explanation: "Spring is my favorite - everything is so fresh and beautiful!"
        },
        {
          question: "What's my favorite movie genre?",
          options: ["💕 Romance", "😂 Comedy", "🎭 Drama", "🚀 Action"],
          correct: 0,
          hint: "I love love stories!",
          explanation: "Romance movies are my favorite - they make me feel all warm inside!"
        },
        {
          question: "What's my ideal date night?",
          options: ["🍽️ Fancy dinner", "🎬 Movie night", "🎨 Art gallery", "🌳 Nature walk"],
          correct: 1,
          hint: "I love cuddling and watching stories together!",
          explanation: "Movie nights are perfect - we can cuddle and share the experience!"
        },
        {
          question: "What's my biggest pet peeve?",
          options: ["😤 Being late", "📱 Phone addiction", "🗣️ Loud people", "🧹 Messiness"],
          correct: 1,
          hint: "It's something that distracts from our time together!",
          explanation: "I hate when people are always on their phones instead of being present!"
        }
      ]
    },
    relationship: {
      name: 'Relationship Questions',
      questions: [
        {
          question: "What's my favorite way to show love?",
          options: ["💝 Gifts", "🤗 Physical touch", "💌 Words", "⏰ Quality time"],
          correct: 1,
          hint: "I love being close to you!",
          explanation: "Physical touch is my love language - hugs and cuddles mean everything!"
        },
        {
          question: "What's my biggest relationship goal?",
          options: ["💍 Marriage", "🏠 Living together", "👶 Having kids", "💕 Growing together"],
          correct: 3,
          hint: "It's about our journey together!",
          explanation: "I want us to grow together and become better people as a couple!"
        },
        {
          question: "What's my favorite memory with you?",
          options: ["💕 Our first date", "🎉 Our anniversary", "🏖️ Our vacation", "🏠 Moving in"],
          correct: 0,
          hint: "It was the beginning of our love story!",
          explanation: "Our first date was magical - I knew you were the one!"
        },
        {
          question: "What's my biggest relationship fear?",
          options: ["💔 Being cheated on", "😴 Growing apart", "💰 Money problems", "👨‍👩‍👧‍👦 Family issues"],
          correct: 1,
          hint: "I'm afraid we might change and drift apart...",
          explanation: "I'm scared we might grow apart and lose our connection!"
        },
        {
          question: "What's my favorite thing about our relationship?",
          options: ["😊 How you make me laugh", "💝 How you care for me", "🎵 How we communicate", "🤗 How safe I feel"],
          correct: 1,
          hint: "You always put my needs first!",
          explanation: "I love how you always care for me and put my happiness first!"
        }
      ]
    },
    random: {
      name: 'Random Questions',
      questions: [
        {
          question: "What's my favorite animal?",
          options: ["🐱 Cat", "🐶 Dog", "🐰 Rabbit", "🐼 Panda"],
          correct: 2,
          hint: "It's small and fluffy!",
          explanation: "Rabbits are my favorite - they're so cute and gentle!"
        },
        {
          question: "What's my favorite dessert?",
          options: ["🍰 Cake", "🍦 Ice cream", "🍪 Cookies", "🍮 Pudding"],
          correct: 1,
          hint: "It's cold and sweet!",
          explanation: "Ice cream is my favorite dessert - especially chocolate!"
        },
        {
          question: "What's my favorite hobby?",
          options: ["📖 Reading", "🎨 Drawing", "🎵 Music", "🏃‍♀️ Exercise"],
          correct: 1,
          hint: "I love creating things!",
          explanation: "Drawing is my favorite hobby - I can express myself through art!"
        },
        {
          question: "What's my biggest strength?",
          options: ["💪 Physical strength", "🧠 Intelligence", "💝 Empathy", "🎯 Determination"],
          correct: 2,
          hint: "I can feel what others feel!",
          explanation: "My empathy is my biggest strength - I can understand others' feelings!"
        },
        {
          question: "What's my biggest weakness?",
          options: ["😰 Anxiety", "😤 Stubbornness", "😴 Laziness", "😡 Anger"],
          correct: 0,
          hint: "I worry about things a lot!",
          explanation: "I struggle with anxiety - I worry about everything!"
        }
      ]
    }
  };

  // State variables
  let currentCategory = 'basic';
  let currentQuestionIndex = 0;
  let score = 0;
  let startTime = 0;
  let quizStats = {
    quizzesTaken: 0,
    bestScore: 0,
    perfectScores: 0
  };

  // Initialize quiz
  function initQuiz() {
    loadStats();
    setupEventListeners();
    updateStatsDisplay();
    
    // Start background music
    startBackgroundMusic();
    
    // Stop background music when leaving page
    window.addEventListener('beforeunload', stopBackgroundMusic);
  }

  // === Audio Functions ===
  function playSound(audioId) {
    try {
      const audio = document.getElementById(audioId);
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Ignore autoplay restrictions
        });
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('clickSound');
        selectCategory(btn.dataset.category);
      });
    });

    // Start button
    startBtn.addEventListener('click', startQuiz);

    // Quiz buttons
    hintBtn.addEventListener('click', showHint);
    nextBtn.addEventListener('click', nextQuestion);
    retryBtn.addEventListener('click', resetQuiz);
    shareBtn.addEventListener('click', shareResult);
  }

  // Select category
  function selectCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-category="${category}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  // Start quiz
  function startQuiz() {
    playSound('clickSound');
    
    // Play game sound when starting quiz
    playSound('gameSound');
    
    startTime = Date.now();
    currentQuestionIndex = 0;
    score = 0;
    
    startScreen.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    
    loadQuestion();
  }

  // Load question
  function loadQuestion() {
    const questions = quizData[currentCategory].questions;
    const question = questions[currentQuestionIndex];
    
    // Update progress
    currentQuestion.textContent = currentQuestionIndex + 1;
    totalQuestions.textContent = questions.length;
    currentScore.textContent = score;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Display question
    questionText.textContent = question.question;
    questionHint.textContent = '';
    questionHint.classList.add('hidden');
    
    // Display options
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
      const optionBtn = document.createElement('button');
      optionBtn.className = 'option-btn';
      optionBtn.innerHTML = option;
      optionBtn.addEventListener('click', () => selectOption(index));
      optionsContainer.appendChild(optionBtn);
    });
    
    // Reset buttons
    hintBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
  }

  // Select option
  function selectOption(selectedIndex) {
    const questions = quizData[currentCategory].questions;
    const question = questions[currentQuestionIndex];
    
    // Disable all options
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.disabled = true;
    });
    
    // Check answer
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
      score++;
      playSound('correctSound');
    } else {
      playSound('wrongSound');
    }
    
    // Update UI
    document.querySelectorAll('.option-btn').forEach((btn, index) => {
      if (index === question.correct) {
        btn.classList.add('correct');
      } else if (index === selectedIndex && !isCorrect) {
        btn.classList.add('incorrect');
      }
    });
    
    // Show explanation
    questionHint.textContent = question.explanation;
    questionHint.classList.remove('hidden');
    
    // Show next button
    hintBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    
    // Update score
    currentScore.textContent = score;
  }

  // Show hint
  function showHint() {
    const questions = quizData[currentCategory].questions;
    const question = questions[currentQuestionIndex];
    
    questionHint.textContent = question.hint;
    questionHint.classList.remove('hidden');
    hintBtn.classList.add('hidden');
  }

  // Next question
  function nextQuestion() {
    const questions = quizData[currentCategory].questions;
    
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      showResults();
    }
  }

  // Show results
  function showResults() {
    const questions = quizData[currentCategory].questions;
    const percentage = (score / questions.length) * 100;
    const timeElapsed = Math.round((Date.now() - startTime) / 1000);
    
    // Update stats
    quizStats.quizzesTaken++;
    if (percentage > quizStats.bestScore) {
      quizStats.bestScore = percentage;
    }
    if (percentage === 100) {
      quizStats.perfectScores++;
    }
    saveStats();
    
    // Set result content
    finalScore.textContent = `${score}/${questions.length}`;
    finalPercentage.textContent = `${percentage}%`;
    timeTaken.textContent = `${timeElapsed}s`;
    
    // Set result message
    if (percentage === 100) {
      resultIcon.textContent = '🏆';
      resultTitle.textContent = 'Perfect Score!';
      resultMessage.textContent = 'You know me so well, my love! You\'re absolutely amazing! 💕';
      
      // Play achievement sound for perfect score
      playSound('achievementSound');
    } else if (percentage >= 80) {
      resultIcon.textContent = '💖';
      resultTitle.textContent = 'Excellent!';
      resultMessage.textContent = `You know me pretty well, cutie! ${score}/5 correct!`;
    } else if (percentage >= 60) {
      resultIcon.textContent = '💝';
      resultTitle.textContent = 'Good Job!';
      resultMessage.textContent = `You know me quite well! ${score}/5 correct!`;
    } else if (percentage >= 40) {
      resultIcon.textContent = '💕';
      resultTitle.textContent = 'Not Bad!';
      resultMessage.textContent = `We need more time together! ${score}/5 correct!`;
    } else {
      resultIcon.textContent = '🎬';
      resultTitle.textContent = 'Aww...';
      resultMessage.textContent = `We need a movie night to fix this! ${score}/5 correct!`;
    }
    
    // Show result screen
    quizContainer.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    // Update stats display
    updateStatsDisplay();
    
    // Create celebration
    createCelebration();
  }

  // Create celebration effects
  function createCelebration() {
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
    playSound('clickSound');
    
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  }

  // Share result
  function shareResult() {
    const percentage = finalPercentage.textContent;
    const message = `I just scored ${percentage} on the Know Me Quiz! How well do you know your partner? 💕`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Know Me Quiz Result',
        text: message,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message).then(() => {
        showMessage('Result copied to clipboard! 📋');
      });
    }
  }

  // Load stats
  function loadStats() {
    const saved = localStorage.getItem('quizStats');
    if (saved) {
      try {
        quizStats = JSON.parse(saved);
      } catch (error) {
        console.error('Error loading quiz stats:', error);
      }
    }
  }

  // Save stats
  function saveStats() {
    localStorage.setItem('quizStats', JSON.stringify(quizStats));
  }

  // Update stats display
  function updateStatsDisplay() {
    if (quizzesTaken) quizzesTaken.textContent = quizStats.quizzesTaken;
    if (bestScore) bestScore.textContent = `${quizStats.bestScore}%`;
    if (perfectScores) perfectScores.textContent = quizStats.perfectScores;
  }

  // Show message
  function showMessage(message) {
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.remove();
    }, 3000);
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

  // Background music management
  function startBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
      // Stop all other background music first
      const allAudio = document.querySelectorAll('audio[id="bgMusic"]');
      allAudio.forEach(audio => {
        if (audio !== bgMusic) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      
      // Start current background music
      bgMusic.play().catch(() => {
        console.log('Background music autoplay blocked');
      });
    }
  }

  // Stop background music when leaving page
  function stopBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
  }

  // Initialize the quiz
  initQuiz();
});
