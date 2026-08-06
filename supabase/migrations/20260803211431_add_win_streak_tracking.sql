/*
# Add win streak tracking

1. Modified Tables
- `player_state`
  - `current_streak` (integer, not null, default 0) — current consecutive wins
  - `best_streak` (integer, not null, default 0) — best win streak ever

2. Security
- `player_state` already has RLS; new columns inherit existing policies
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'current_streak') THEN
    ALTER TABLE player_state ADD COLUMN current_streak integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'best_streak') THEN
    ALTER TABLE player_state ADD COLUMN best_streak integer NOT NULL DEFAULT 0;
  END IF;
END $$;
