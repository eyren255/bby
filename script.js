// 🌸 Floating hearts
for (let i = 0; i < 30; i++) {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDelay = Math.random() * 5 + "s";
  document.body.appendChild(heart);
}

// 🎵 Tap-to-start screen: fades out and starts music
window.addEventListener('click', () => {
  const music = document.getElementById('bgMusic');
  const tapScreen = document.getElementById('tapToStart');

  if (tapScreen) {
    tapScreen.style.opacity = '0';
    setTimeout(() => tapScreen.remove(), 1000); // fade-out duration
  }

  if (music && music.paused) {
    music.muted = false;
    music.play().catch((e) => console.log("Audio play error:", e));
  }
}, { once: true });

// 👀 Reveal surprise section + start background music (safeguard)
document.getElementById("revealBtn")?.addEventListener("click", () => {
  const surprise = document.querySelector(".surprise");
  surprise.classList.remove("hidden");
  document.getElementById("revealBtn").style.display = "none";

  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic && bgMusic.paused) {
    bgMusic.muted = false;
    bgMusic.play().catch((e) => console.log("Autoplay still blocked:", e));
  }
});

// 🎧 Reliable global click sound with delayed navigation for <a> buttons
document.addEventListener('click', function (e) {
  const clickSound = document.getElementById('clickSound');
  const link = e.target.closest('a.menu-button');
  const button = e.target.closest('button.reveal-button');

  if (link) {
    e.preventDefault(); // Stop instant navigation

    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }

    // Navigate after short delay
    const href = link.getAttribute('href');
    setTimeout(() => {
      window.location.href = href;
    }, 200);
  }

  if (button) {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  }
});

