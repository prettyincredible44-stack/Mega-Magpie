/*
# Add daily login reward streak tracking

1. Modified Tables
- `player_state`
  - `daily_streak` (integer, not null, default 0) — current consecutive day login streak
  - `best_daily_streak` (integer, not null, default 0) — best daily streak ever achieved
  - `last_login_date` (date, nullable) — the date of the player's last login (YYYY-MM-DD)
  - `daily_reward_claimed` (boolean, not null, default false) — whether today's reward has been claimed
  - `streak_freezes` (integer, not null, default 1) — number of streak freeze protections available
  - `last_freeze_date` (date, nullable) — date a streak freeze was last used

2. Security
- `player_state` already has RLS; new columns inherit existing policies
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'daily_streak') THEN
    ALTER TABLE player_state ADD COLUMN daily_streak integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'best_daily_streak') THEN
    ALTER TABLE player_state ADD COLUMN best_daily_streak integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'last_login_date') THEN
    ALTER TABLE player_state ADD COLUMN last_login_date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'daily_reward_claimed') THEN
    ALTER TABLE player_state ADD COLUMN daily_reward_claimed boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'streak_freezes') THEN
    ALTER TABLE player_state ADD COLUMN streak_freezes integer NOT NULL DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'player_state' AND column_name = 'last_freeze_date') THEN
    ALTER TABLE player_state ADD COLUMN last_freeze_date date;
  END IF;
END $$;