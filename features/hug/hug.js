const btn = document.getElementById("hugBtn");
const video = document.getElementById("hugVideo");
const sound = document.getElementById("hugSound");

btn.addEventListener("click", () => {
  video.style.display = "block";
  video.currentTime = 0;
  video.play();

  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  btn.style.display = "none";
});
