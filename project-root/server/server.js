// Main server entry: Express + socket.io + sqlite (better-sqlite3)
import express from 'express';
import http from 'http';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import url from 'url';

import { createDb, topScores, insertScore } from './lib/db.js';
import createScoresRouter from './routes/scores.js';
import createAdminRouter from './routes/admin.js';
import healthRouter from './routes/health.js';

dotenv.config();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5500','http://localhost:5173'], credentials: true } });

// Security & middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '200kb' }));
app.use(morgan('dev'));
app.use(cors({ origin: (origin, cb) => cb(null, true) })); // allow all by default; restrict via CORS_ORIGIN in production

const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
app.use('/api/v1/scores', limiter);
app.use('/api/v1/sync', limiter);

// Database
const dbPath = process.env.DATABASE_PATH || './db/database.sqlite';
const db = createDb(dbPath);

// Routes
app.use('/api/v1', healthRouter);
app.use('/api/v1', createScoresRouter(db, io));
app.use('/api/v1', createAdminRouter(db));

// Optional static hosting of client public assets
app.use('/public', express.static(path.join(__dirname, 'public')));

// Socket events
io.on('connection', (socket) => {
  socket.on('score:submit', (payload) => {
    try {
      const saved = insertScore(db, payload);
      socket.emit('score:ack', saved);
      io.emit('leaderboard:update', { game: payload.game, top: topScores(db, payload.game, 10) });
    } catch {}
  });
});

const port = Number(process.env.PORT || 4000);
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});