document.getElementById("quizForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const answers = {
    q1: "c",  // Noodle
    q2: "b",  // July 28
    q3: "b"   // Losing you
  };

  let score = 0;
  const form = e.target;

  Object.keys(answers).forEach(key => {
    const selected = form.elements[key].value;
    if (selected === answers[key]) {
      score++;
    }
  });

  const resultBox = document.getElementById("resultBox");
  resultBox.classList.remove("hidden");

  if (score === 3) {
    resultBox.textContent = `💯 Wow! You're a pro at this! You know me so well! 💕`;
  } else if (score === 2) {
    resultBox.textContent = `🥰 Not bad! You know me pretty well, cutie!`;
  } else {
    resultBox.textContent = `😅 Aww... we need a movie night to fix this!`;
  }
});
