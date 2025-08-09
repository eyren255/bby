# API Docs (v1)

Base URL: `http://localhost:4000`

## Health
- GET `/api/v1/health`

## Scores
- POST `/api/v1/scores`
  - Body: `{ "playerName": "Shin", "score": 123, "game": "catch-the-hearts", "meta": { ... } }`
- GET `/api/v1/scores?game=catch-the-hearts&limit=10`
- GET `/api/v1/scores/latest?game=catch-the-hearts&limit=10`
- GET `/api/v1/leaderboard?game=catch-the-hearts&limit=20` (alias)
- POST `/api/v1/sync`
  - Body: `{ "items": [ {score objects} ] }`

## Admin
- POST `/api/v1/admin/clear`
  - Header: `Authorization: Bearer <ADMIN_KEY>`

## WebSocket events
- client -> server: `score:submit` payload `{ playerName, score, game, meta }`
- server -> client: `score:ack` with saved score
- server -> all: `leaderboard:update` payload: `{ game, top: [ ... ] }`

## Smoke tests (curl)
```
# Health
curl -s http://localhost:4000/api/v1/health | jq

# Submit a score
curl -s -X POST http://localhost:4000/api/v1/scores \
  -H 'Content-Type: application/json' \
  -d '{"playerName":"Test","score":42,"game":"catch-the-hearts"}' | jq

# Get leaderboard
curl -s 'http://localhost:4000/api/v1/leaderboard?game=catch-the-hearts&limit=5' | jq

# Admin clear
curl -s -X POST http://localhost:4000/api/v1/admin/clear \
  -H 'Authorization: Bearer CHANGEME' | jq
```