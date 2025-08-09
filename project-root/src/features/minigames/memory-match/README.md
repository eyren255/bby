# Memory Match — Feature README

Files:
- `index.html`: Game page with grid.
- `style.css`: Grid layout and tile styling.
- `script.js`: Game logic. Fewest moves is better.
- `data.json`: Optional configuration for icons.

Scoreboard:
- Submits `{ playerName, score: moves, game: 'memory-match' }` via `HBApi`.
- Uses localStorage when offline or sync disabled.