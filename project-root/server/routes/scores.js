// Scores routes: submit score, list top, latest, leaderboard alias, sync queue
import { Router } from 'express';
import { validateScorePayload } from '../lib/validators.js';
import { insertScore, topScores, latestScores } from '../lib/db.js';

export default function createScoresRouter(db, io){
  const router = Router();

  router.post('/scores', (req, res) => {
    const { ok, errors, value } = validateScorePayload(req.body);
    if (!ok) return res.status(400).json({ ok: false, errors });
    try {
      const saved = insertScore(db, value);
      io.emit('leaderboard:update', { game: value.game, top: topScores(db, value.game, 10) });
      res.json({ ok: true, scoreId: saved.id, saved });
    } catch (e) {
      res.status(500).json({ ok: false, error: 'DB error' });
    }
  });

  router.get('/scores', (req, res) => {
    const game = String(req.query.game||'');
    const limit = Number(req.query.limit||10);
    if (!game) return res.status(400).json({ ok: false, error: 'game required' });
    return res.json(topScores(db, game, limit));
  });

  router.get('/scores/latest', (req, res) => {
    const game = String(req.query.game||'');
    const limit = Number(req.query.limit||10);
    if (!game) return res.status(400).json({ ok: false, error: 'game required' });
    return res.json(latestScores(db, game, limit));
  });

  router.get('/leaderboard', (req, res) => {
    const game = String(req.query.game||'');
    const limit = Number(req.query.limit||10);
    if (!game) return res.status(400).json({ ok: false, error: 'game required' });
    return res.json(topScores(db, game, limit));
  });

  router.post('/sync', (req, res) => {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    let saved = 0;
    for (const it of items) {
      const { ok, value } = validateScorePayload(it);
      if (!ok) continue;
      try { insertScore(db, value); saved++; } catch {}
    }
    if (saved > 0 && items[0]?.game) {
      io.emit('leaderboard:update', { game: items[0].game, top: topScores(db, items[0].game, 10) });
    }
    res.json({ ok: true, saved });
  });

  return router;
}