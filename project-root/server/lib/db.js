// Database helper using better-sqlite3. Responsible for connecting, migrating, and simple query helpers.
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export function createDb(dbPath){
  const absolute = path.isAbsolute(dbPath) ? dbPath : path.join(__dirname, '..', dbPath);
  const db = new Database(absolute);
  db.pragma('journal_mode = WAL');
  // Run schema
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(sql);
  return db;
}

export function insertScore(db, { playerName, score, game, meta }){
  const stmt = db.prepare('INSERT INTO scores (player_name, score, game, meta) VALUES (?, ?, ?, ?)');
  const info = stmt.run(playerName, score, game, meta ? JSON.stringify(meta) : null);
  const row = db.prepare('SELECT id, player_name, score, game, meta, created_at FROM scores WHERE id = ?').get(info.lastInsertRowid);
  return row;
}

export function topScores(db, game, limit){
  const stmt = db.prepare('SELECT id, player_name, score, game, created_at FROM scores WHERE game = ? ORDER BY score DESC, created_at ASC LIMIT ?');
  return stmt.all(game, limit || 10);
}

export function latestScores(db, game, limit){
  const stmt = db.prepare('SELECT id, player_name, score, game, created_at FROM scores WHERE game = ? ORDER BY created_at DESC LIMIT ?');
  return stmt.all(game, limit || 10);
}

export function clearScores(db){
  db.exec('DELETE FROM scores');
}