-- Greedy Pig database tables.
-- Safe to run more than once: "IF NOT EXISTS" skips tables that already exist.

-- One row per game.
CREATE TABLE IF NOT EXISTS games (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode            TEXT NOT NULL DEFAULT 'friends',   -- 'friends' or 'computer'
  difficulty      TEXT,                              -- 'easy', 'medium', 'hard' (computer games only)
  target_score    INTEGER NOT NULL DEFAULT 100,
  status          TEXT NOT NULL DEFAULT 'playing',   -- 'playing' or 'finished'
  current_seat    INTEGER NOT NULL DEFAULT 0,        -- whose turn it is (0 = first player)
  turn_total      INTEGER NOT NULL DEFAULT 0,        -- points at risk this turn
  winner_seat     INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per player in a game.
CREATE TABLE IF NOT EXISTS players (
  id        SERIAL PRIMARY KEY,
  game_id   UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  seat      INTEGER NOT NULL,                        -- turn order: 0, 1, 2...
  name      TEXT NOT NULL,
  avatar    TEXT,
  is_bot    BOOLEAN NOT NULL DEFAULT FALSE,
  score     INTEGER NOT NULL DEFAULT 0,
  UNIQUE (game_id, seat)
);

-- Every action taken, so we have a full history of each game.
CREATE TABLE IF NOT EXISTS moves (
  id          SERIAL PRIMARY KEY,
  game_id     UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  seat        INTEGER NOT NULL,
  action      TEXT NOT NULL,                         -- 'roll' or 'hold'
  dice_value  INTEGER,                               -- only for rolls
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
