PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  game TEXT NOT NULL,
  meta TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scores_game_score ON scores (game, score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_game_created ON scores (game, created_at DESC);