// === DOM Elements ===
// Button to trigger the spin
const spinBtn = document.getElementById('spinBtn');
// The spinning wheel element
const wheel = document.getElementById('wheel');
// Element to display the result
const result = document.getElementById('result');
// Audio elements for spin and win sounds
const spinSound = document.getElementById('spinSound');
const winSound = document.getElementById('winSound');

// === Rewards Configuration ===
// Reward messages, corresponding to the visual slices of the wheel
const rewards = [
  "💖 Give me a kiss!",
  "💌 Send me a love letter!",
  "🍓 Share your favorite memory!",
  "🧸 Let's watch something cute together!",
  "🎶 Send me a selfie!",
  "🌸 Tell me why you love me 💕"
];

// === State Variables ===
// Tracks the current rotation of the wheel
let currentRotation = 0;

// === Event Listeners ===
// Add click event listener to the spin button
spinBtn.addEventListener('click', () => {
  // === Spin Logic ===
  // Randomize the number of spins (5 to 8 full spins)
  const spins = Math.floor(Math.random() * 4) + 5;
  // Calculate the angle of each slice
  const sliceAngle = 360 / rewards.length;
  // Add a random offset to the final rotation
  const extraDegrees = Math.floor(Math.random() * 360);
  // Calculate the total rotation in degrees
  const totalDegrees = spins * 360 + extraDegrees;
  // Update the current rotation
  currentRotation += totalDegrees;

  // === Play Spin Sound ===
  spinSound.currentTime = 0; // Reset sound to the beginning
  spinSound.play();

  // === Rotate the Wheel ===
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  // === Determine the Result ===
  setTimeout(() => {
    // Normalize the rotation to a value between 0 and 360
    const normalizedRotation = currentRotation % 360;
    // Calculate the pointer angle (adjusted for slice alignment)
    const pointerAngle = (360 - normalizedRotation + sliceAngle / 2) % 360;
    // Determine the index of the reward based on the pointer angle
    const index = Math.floor(pointerAngle / sliceAngle);

    // Display the reward message
    result.textContent = `🎉 ${rewards[index]}`;
    result.classList.remove('hidden');

    // Play Win Sound
    winSound.currentTime = 0; // Reset sound to the beginning
    winSound.play();
  }, 5000); // Delay to match the spin animation duration
});
