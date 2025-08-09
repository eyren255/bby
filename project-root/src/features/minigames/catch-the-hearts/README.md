# Catch the Hearts — Feature README

Files:
- `index.html`: The game page. Links global styles and local `style.css` and `script.js`.
- `style.css`: Adjust layout, sizes, and colors.
- `script.js`: Main game logic. Edit heart spawn rates, speeds, and scoring.
- `data.json`: Optional config for spawn rates or basket size.

How to edit:
- Change colors in `/styles/theme.css` or component-specific styles here.
- Update spawn rate in `data.json` (e.g., `spawnRate`).
- The game submits scores to the server if syncing is enabled (Settings). If offline or disabled, scores are queued in `localStorage`.

Scoreboard integration:
- Button "Submit to Leaderboard" calls `HBApi.submitScore()`.
- Global leaderboard is fetched with `HBApi.getLeaderboard('catch-the-hearts')`.
- Realtime updates are applied when socket.io is available.