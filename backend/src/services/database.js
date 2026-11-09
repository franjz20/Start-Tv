import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DATABASE_PATH
  ? process.env.DATABASE_PATH
  : join(__dirname, '..', '..', 'data', 'starttv.db');

mkdirSync(dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS watch_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_type TEXT NOT NULL,
    media_id INTEGER NOT NULL,
    user_id TEXT DEFAULT 'anonymous',
    progress INTEGER DEFAULT 0,
    season INTEGER,
    episode INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(media_type, media_id, user_id, season, episode)
  );

  CREATE INDEX IF NOT EXISTS idx_media ON watch_progress(media_type, media_id, user_id);
`);

export const dbService = {
  // Save or update watch progress
  saveProgress: ({ mediaType, mediaId, userId = 'anonymous', progress, season, episode }) => {
    const stmt = db.prepare(`
      INSERT INTO watch_progress (media_type, media_id, user_id, progress, season, episode, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(media_type, media_id, user_id, season, episode)
      DO UPDATE SET progress = excluded.progress, updated_at = CURRENT_TIMESTAMP
    `);
    
    return stmt.run(mediaType, mediaId, userId, progress, season || null, episode || null);
  },

  // Get watch progress
  getProgress: ({ mediaType, mediaId, userId = 'anonymous', season, episode }) => {
    const stmt = db.prepare(`
      SELECT * FROM watch_progress
      WHERE media_type = ? AND media_id = ? AND user_id = ?
        AND (season IS NULL OR season = ?)
        AND (episode IS NULL OR episode = ?)
      ORDER BY updated_at DESC
      LIMIT 1
    `);
    
    return stmt.get(mediaType, mediaId, userId, season || null, episode || null);
  },

  // Get all progress for a user
  getAllProgress: (userId = 'anonymous') => {
    const stmt = db.prepare(`
      SELECT * FROM watch_progress
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `);
    
    return stmt.all(userId);
  },

  // Delete progress
  deleteProgress: ({ mediaType, mediaId, userId = 'anonymous', season, episode }) => {
    const stmt = db.prepare(`
      DELETE FROM watch_progress
      WHERE media_type = ? AND media_id = ? AND user_id = ?
        AND (season IS NULL OR season = ?)
        AND (episode IS NULL OR episode = ?)
    `);
    
    return stmt.run(mediaType, mediaId, userId, season || null, episode || null);
  }
};
