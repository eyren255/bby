const video = document.getElementById('hugVideo');
const overlay = document.getElementById('tapOverlay');

// Set video source based on device size
function setVideoSource() {
  const isMobile = window.innerWidth <= 768;
  video.src = isMobile ? "../../assets/video/hug.mp4" : "../../assets/video/hug.mp4";
}

// Initialize video
setVideoSource();
window.addEventListener('resize', setVideoSource);

// Handle both touch and click events
function startHug() {
  overlay.style.display = 'none';
  video.style.display = 'block';
  video.currentTime = 0;
  video.play().catch(err => console.error("Video play failed:", err));
  
  // Remove event listeners after first interaction
  overlay.removeEventListener('click', startHug);
  overlay.removeEventListener('touchstart', startHug);
}

// Add both touch and click event listeners
overlay.addEventListener('click', startHug);
overlay.addEventListener('touchstart', startHug);

// Show tap overlay when video ends
video.addEventListener('ended', () => {
  video.style.display = 'none';
  overlay.style.display = 'flex';
  
  // Re-add event listeners for another hug
  overlay.addEventListener('click', startHug);
  overlay.addEventListener('touchstart', startHug);
});