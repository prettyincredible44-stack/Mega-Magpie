/*
# Add player_name column

1. Modified Tables
- `player_state`
  - `player_name` (text, not null, default 'Player') — auto-generated display name shown in header, profile, and speed match leaderboard

2. Security
- `player_state` already has RLS; new column inherits existing policies
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'player_name') THEN
    ALTER TABLE player_state ADD COLUMN player_name text NOT NULL DEFAULT 'Player';
  END IF;
END $$;
