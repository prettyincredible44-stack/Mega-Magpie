/*
# Add Speed Matches + Responsible Gambling Tracking

1. New Tables
- `speed_matches` — records multiplayer speed solitaire match results
  - `id` (uuid PK)
  - `player_name` (text, display name for the match)
  - `score` (int, points earned in the match)
  - `moves` (int, total moves used)
  - `time_seconds` (int, completion time)
  - `won` (boolean, whether the game was won)
  - `wagered` (int, coins wagered)
  - `created_at` (timestamptz)

2. Modified Tables
- `player_state`
  - `age_verified` (boolean, default false) — tracks 18+ confirmation
  - `session_spent_coins` (int, default 0) — coins spent in current session for responsible gambling warnings
  - `lifetime_spent_coins` (int, default 0) — total coins spent ever
  - `speed_points` (int, default 0) — accumulated points from speed matches

3. Security
- `speed_matches` uses anon+authenticated policies (single-tenant, no auth)
- `player_state` already has RLS; new columns inherit existing policies
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'age_verified') THEN
    ALTER TABLE player_state ADD COLUMN age_verified boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'session_spent_coins') THEN
    ALTER TABLE player_state ADD COLUMN session_spent_coins int NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'lifetime_spent_coins') THEN
    ALTER TABLE player_state ADD COLUMN lifetime_spent_coins int NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'speed_points') THEN
    ALTER TABLE player_state ADD COLUMN speed_points int NOT NULL DEFAULT 0;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS speed_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL DEFAULT 'Player',
  score int NOT NULL DEFAULT 0,
  moves int NOT NULL DEFAULT 0,
  time_seconds int NOT NULL DEFAULT 0,
  won boolean NOT NULL DEFAULT false,
  wagered int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE speed_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_speed_matches" ON speed_matches;
CREATE POLICY "anon_select_speed_matches" ON speed_matches FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_speed_matches" ON speed_matches;
CREATE POLICY "anon_insert_speed_matches" ON speed_matches FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_speed_matches" ON speed_matches;
CREATE POLICY "anon_update_speed_matches" ON speed_matches FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_speed_matches" ON speed_matches;
CREATE POLICY "anon_delete_speed_matches" ON speed_matches FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_speed_matches_score ON speed_matches (score DESC);
CREATE INDEX IF NOT EXISTS idx_speed_matches_created ON speed_matches (created_at DESC);
