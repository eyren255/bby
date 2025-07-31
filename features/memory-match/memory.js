const emojis = ['🐰', '💌', '🌸', '🧸', '💖', '⭐️'];
let cards = [...emojis, ...emojis];
let flipped = [];
let matched = 0;

const board = document.getElementById('gameBoard');
const matchText = document.getElementById('matchMessage');
const winMessage = document.getElementById('winMessage');
const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  cards = shuffle(cards);
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.textContent = '❓';
    board.appendChild(card);

    card.addEventListener('click', () => flipCard(card));
  });
}

function flipCard(card) {
  if (card.classList.contains('flipped') || flipped.length === 2) return;

  card.textContent = card.dataset.emoji;
  card.classList.add('flipped');
  flipped.push(card);

  // 🔊 Play flip sound
  if (flipSound) {
    flipSound.currentTime = 0;
    flipSound.play().catch(() => {});
  }

  if (flipped.length === 2) {
    setTimeout(checkMatch, 600);
  }
}

function checkMatch() {
  const [a, b] = flipped;
  if (a.dataset.emoji === b.dataset.emoji) {
    a.classList.add('matched');
    b.classList.add('matched');
    matched += 1;

    // 🎵 Play match sound
    if (matchSound) {
      matchSound.currentTime = 0;
      matchSound.play().catch(() => {});
    }

    // 💬 Show match message
    if (matchText) {
      matchText.textContent = `You matched the ${a.dataset.emoji} pair! 💖`;
      matchText.classList.remove('hidden');
      matchText.classList.add('show');
      setTimeout(() => {
        matchText.classList.remove('show');
        matchText.classList.add('hidden');
      }, 1500);
    }

    if (matched === emojis.length) {
      winMessage.classList.remove('hidden');
	  
	  const winSound = document.getElementById('winSound');
  if (winSound) {
    winSound.currentTime = 0;
    winSound.play().catch(() => {});
  }
	  
      spawnHearts();
    }
	
  } else {
    a.textContent = '❓';
    b.textContent = '❓';
    a.classList.remove('flipped');
    b.classList.remove('flipped');
  }
  flipped = [];
  
}


function spawnHearts() {
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }
}

createBoard();


