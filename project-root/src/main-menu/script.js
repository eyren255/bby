(function(){
  // Simple hook to show days remaining to Jul 28, 2025 if an element exists
  const target = new Date('2025-07-28T00:00:00');
  const now = new Date();
  const days = Math.ceil((target - now) / (1000*60*60*24));
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    if (card.textContent.includes('Countdown')) {
      const p = card.querySelector('p') || document.createElement('p');
      p.textContent = `T-${days} days`;
      card.appendChild(p);
    }
  });
})();