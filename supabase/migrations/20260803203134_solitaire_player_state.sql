/*
# Solitaire player state (single-tenant, no auth)

1. New Tables
- `player_state`
  - `id` (int, primary key, fixed = 1) — singleton row for the single player.
  - `coins` (int, not null, default 500) — virtual currency earned by playing and spent on boosts.
  - `games_played` (int, not null, default 0) — total games started.
  - `games_won` (int, not null, default 0) — total games won.
  - `best_time_seconds` (int, nullable) — fastest win time in seconds, null if never won.
  - `best_moves` (int, nullable) — fewest moves to win, null if never won.
  - `updated_at` (timestamptz, default now()) — last modification time.
2. Security
- Enable RLS on `player_state`.
- Allow anon + authenticated full CRUD because this is a single-tenant app with no sign-in (intentionally shared/public data).
3. Notes
- The app seeds one singleton row (id = 1) on first load if it does not exist.
- Coins are earned by winning games and spent on boosts (hint, undo, extra draw).
- Real-money coin purchases will be added via Stripe once configured.
*/

CREATE TABLE IF NOT EXISTS player_state (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  coins int NOT NULL DEFAULT 500,
  games_played int NOT NULL DEFAULT 0,
  games_won int NOT NULL DEFAULT 0,
  best_time_seconds int,
  best_moves int,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE player_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_player_state" ON player_state;
CREATE POLICY "anon_select_player_state" ON player_state FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_player_state" ON player_state;
CREATE POLICY "anon_insert_player_state" ON player_state FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_player_state" ON player_state;
CREATE POLICY "anon_update_player_state" ON player_state FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_player_state" ON player_state;
CREATE POLICY "anon_delete_player_state" ON player_state FOR DELETE
  TO anon, authenticated USING (true);