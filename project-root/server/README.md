# Honeybun Server

Small, secure sync API and realtime socket layer for leaderboards.

## Tech
- Node.js 16/18+
- Express, better-sqlite3, socket.io
- helmet, cors, express-rate-limit, dotenv

## Run locally
```
cd server
npm install
cp .env.example .env
npm run start
```
Default: `http://localhost:4000`

Environment:
- `PORT=4000`
- `DATABASE_PATH=./db/database.sqlite`
- `ADMIN_KEY=CHANGE_ME`
- `CORS_ORIGIN=http://localhost:5500`

## Database
- Schema: `db/schema.sql`
- Seed (optional): `db/seed.sql` (run manually with sqlite3 or import with DB tool)

## API
See `../docs/api.md` for details and curl examples.

## Realtime
- Socket.io namespace default. Emits `leaderboard:update` on new saves.

## Deploy
- Provision Node app and persistent disk for sqlite file.
- Set env vars (above) and ensure `DATABASE_PATH` points to a writable path.
- Recommended platforms: Render, Railway, Fly.io, or Docker.

### Render (example)
- Create a new Web Service
- Build command: `npm install`
- Start command: `node server.js`
- Add Disk: `db` mount to `/server/db`
- Set env: `PORT`, `DATABASE_PATH=/server/db/database.sqlite`, `ADMIN_KEY`

### Railway/Heroku
- Similar steps; ensure persistent volume for sqlite or migrate to Postgres.
- For Postgres, adjust `lib/db.js` accordingly (not included here).

## Admin page (optional)
- Not included by default; use `/api/v1/leaderboard` and export as CSV from your client.

## Security notes
- Basic validation is implemented.
- Rate limiting on score endpoints (30/min/IP). Adjust as needed.
- If deploying publicly, consider stronger auth and moderation.