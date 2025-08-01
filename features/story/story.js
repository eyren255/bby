// Story coming soon page
document.addEventListener('DOMContentLoaded', function() {
  // Add some interactive effects to the coming soon page
  const previewItems = document.querySelectorAll('.preview-item');
  
  previewItems.forEach((item, index) => {
    // Add staggered animation delay
    item.style.animationDelay = `${index * 0.1}s`;
    
    // Add click effect
    item.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
  
  // Add floating effect to the book icon
  const bookIcon = document.querySelector('.coming-soon-icon');
  if (bookIcon) {
    bookIcon.addEventListener('mouseenter', function() {
      this.style.animation = 'bookFloat 1s ease-in-out infinite';
    });
    
    bookIcon.addEventListener('mouseleave', function() {
      this.style.animation = 'bookFloat 3s ease-in-out infinite';
    });
  }
}); 