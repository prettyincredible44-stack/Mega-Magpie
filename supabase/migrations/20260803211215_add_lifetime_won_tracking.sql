/*
# Add lifetime cash won tracking

1. Modified Tables
- `player_state`
  - `lifetime_won_pence` (integer, not null, default 0) — total cash ever won (for profit/loss display)

2. Security
- `player_state` already has RLS; new column inherits existing policies
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'lifetime_won_pence') THEN
    ALTER TABLE player_state ADD COLUMN lifetime_won_pence integer NOT NULL DEFAULT 0;
  END IF;
END $$;
