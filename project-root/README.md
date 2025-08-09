# Honeybun Anniversary Microsite

For Thazin Nwe — Honeybun 💕 — 13 days (Jul 28, 2025)

A cute, animated, and fully self-contained microsite with mini games, love notes, and optional server sync for global leaderboards.

## Quick start (client-only, offline)
- Download/clone, then open `index.html` in a modern browser.
- Go to `Settings` to set your display name and toggle animations.
- The site works fully offline. Scores are stored locally.

## Optional: Start the server for syncing
```
cd server
npm install
cp .env.example .env
npm run start
```
Open Settings and set `Server URL` to `http://localhost:4000`, then enable "Sync scores to server".

## Project layout
See top-level structure in the request. Each feature is self-contained with `index.html`, `style.css`, `script.js`, `data.json`, and `README.md`.

## Libraries
- Google Fonts: Poppins (CDN)
- GSAP (CDN with graceful fallback)
- Socket.io client (CDN; optional)

## Assets
- Replace `/public/images/honeybun-placeholder.jpg` with your own photo.
- Favicon at `/public/images/favicon-heart.svg`.

## Server
Node/Express + sqlite + socket.io with security middleware. Docs in `server/README.md` and `docs/api.md`.

## Privacy
This is a toy app. If deployed publicly, consider privacy, moderation, and stronger auth.