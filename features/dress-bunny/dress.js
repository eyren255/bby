const bunnyImage = document.getElementById("bunnyImage");
const dressSound = document.getElementById("dressSound");

document.querySelectorAll(".clothing-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const outfit = button.dataset.outfit;
    bunnyImage.src = `../../assets/images/bunny-${outfit}.png`;

    // Play sound effect
    if (dressSound) {
      dressSound.currentTime = 0;
      dressSound.play().catch(() => {});
    }
  });
});