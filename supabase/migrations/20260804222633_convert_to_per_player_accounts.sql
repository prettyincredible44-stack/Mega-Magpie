/*
  # Convert shared singleton wallet to per-player accounts

  ## What changed and why

  The app previously stored all player data in a single shared row
  (player_state with id = 1). Every visitor shared the same coins, winnings,
  level, and progress. Apple's App Store Review Guidelines require each user
  to have their own private balance — a shared wallet looks like gambling,
  fraud risk, and broken user identity.

  This migration converts the schema from single-tenant (shared) to
  multi-tenant (per-user) with Supabase Auth:
  - Every table gets a user_id column keyed to auth.users
  - RLS policies rewritten to scope each user to their own rows
  - record_win updated to operate on the calling user's row
  - Anonymous (anon) access removed entirely; authenticated users only

  ## Tables modified

  ### player_state
  - Added user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE
  - Dropped CHECK (id = 1) constraint (no longer a singleton)
  - Dropped primary key on id; new primary key is user_id
  - Old shared row deleted (belonged to no one)

  ### player_inventory
  - Added user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE
  - Dropped unique index on (item_type, item_id); new unique on (user_id, item_type, item_id)
  - Old shared rows deleted

  ### speed_matches
  - Added user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE
  - Leaderboard stays visible to all authenticated users

  ### transactions
  - Added user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE
  - Old shared rows deleted

  ## Security changes
  - All policies rewritten: TO authenticated with auth.uid() = user_id ownership
  - anon role revoked on all tables
  - record_win: EXECUTE granted to authenticated only
  - Column-level UPDATE grant on player_state narrowed to authenticated only

  ## Important notes
  1. The old shared row in player_state is deleted — it was a single shared
     wallet with no owner, which is the exact problem being fixed.
  2. New player rows are created by the frontend on first sign-in.
  3. user_id columns default to auth.uid() so client inserts that omit
     user_id still satisfy the WITH CHECK policy.
*/

-- ╆╆ player_state ╆╆

-- Add user_id as nullable first (existing row has no user to assign)
ALTER TABLE public.player_state
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Remove the old shared singleton row (no owner = the shared wallet we're replacing)
DELETE FROM public.player_state WHERE id = 1;

-- Now safe to set NOT NULL and add default
ALTER TABLE public.player_state
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Drop the singleton CHECK and old PK, make user_id the new PK
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_id_check' AND conrelid = 'player_state'::regclass) THEN
    ALTER TABLE public.player_state DROP CONSTRAINT player_state_id_check;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_pkey' AND conrelid = 'player_state'::regclass) THEN
    ALTER TABLE public.player_state DROP CONSTRAINT player_state_pkey;
  END IF;
END $$;

ALTER TABLE public.player_state
  ADD CONSTRAINT player_state_pkey PRIMARY KEY (user_id);

-- Drop old anon policies, create authenticated-only ownership policies
DROP POLICY IF EXISTS "anon_select_player_state" ON public.player_state;
DROP POLICY IF EXISTS "anon_insert_player_state" ON public.player_state;
DROP POLICY IF EXISTS "anon_update_player_state" ON public.player_state;

CREATE POLICY "select_own_state" ON public.player_state FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_state" ON public.player_state FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_state" ON public.player_state FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Revoke anon, grant to authenticated only
REVOKE ALL ON public.player_state FROM anon;
GRANT SELECT, INSERT ON public.player_state TO authenticated;
-- UPDATE stays column-scoped (next section)

REVOKE UPDATE ON public.player_state FROM anon, authenticated;
GRANT UPDATE (
  coins, tokens, games_played, best_time_seconds, best_moves,
  active_card_back, active_character, active_outfit,
  ads_watched_today, ads_reset_date, current_wager,
  session_spent_coins, lifetime_spent_coins, speed_points,
  player_name, current_streak, daily_streak, best_daily_streak,
  last_login_date, daily_reward_claimed, streak_freezes, last_freeze_date,
  updated_at
) ON public.player_state TO authenticated;

-- ╆╆ player_inventory ╆╆

ALTER TABLE public.player_inventory
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Remove old shared rows
DELETE FROM public.player_inventory;

ALTER TABLE public.player_inventory
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Replace unique index: (item_type, item_id) → (user_id, item_type, item_id)
DROP INDEX IF EXISTS player_inventory_unique_item;
CREATE UNIQUE INDEX player_inventory_unique_item
  ON public.player_inventory (user_id, item_type, item_id);

-- Drop old policies, create authenticated-only ownership policies
DROP POLICY IF EXISTS "anon_select_inventory" ON public.player_inventory;
DROP POLICY IF EXISTS "anon_insert_inventory" ON public.player_inventory;

CREATE POLICY "select_own_inventory" ON public.player_inventory FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_inventory" ON public.player_inventory FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.player_inventory FROM anon;
GRANT SELECT, INSERT ON public.player_inventory TO authenticated;

-- ╆╆ speed_matches ╆╆

ALTER TABLE public.speed_matches
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DELETE FROM public.speed_matches;

ALTER TABLE public.speed_matches
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "anon_select_speed_matches" ON public.speed_matches;
DROP POLICY IF EXISTS "anon_insert_speed_matches" ON public.speed_matches;

-- Leaderboard visible to all authenticated users; inserts scoped to owner
CREATE POLICY "select_all_speed_matches" ON public.speed_matches FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "insert_own_speed_matches" ON public.speed_matches FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.speed_matches FROM anon;
GRANT SELECT, INSERT ON public.speed_matches TO authenticated;

-- ╆╆ transactions ╆╆

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DELETE FROM public.transactions;

ALTER TABLE public.transactions
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "anon_select_transactions" ON public.transactions;

CREATE POLICY "select_own_transactions" ON public.transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

REVOKE ALL ON public.transactions FROM anon;
GRANT SELECT ON public.transactions TO authenticated;

-- ╆╆ record_win function ╆╆
-- Update to operate on the calling user's row instead of the singleton

CREATE OR REPLACE FUNCTION public.record_win(p_seconds integer, p_moves integer)
RETURNS public.player_state
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  st                public.player_state;
  v_xp              integer;
  v_level           integer := 1;
  v_wager           integer;
  v_mult            integer;
  v_payout          integer := 0;
  v_wins_since      integer;
  v_tier_pence      integer;
  v_tier_name       text;
  v_milestone_pence integer := 0;
  v_maxlevel_pence  integer := 0;
BEGIN
  IF p_seconds IS NULL OR p_seconds < 0 OR p_seconds > 86400 THEN
    RAISE EXCEPTION 'invalid duration';
  END IF;
  IF p_moves IS NULL OR p_moves < 0 OR p_moves > 100000 THEN
    RAISE EXCEPTION 'invalid move count';
  END IF;

  SELECT * INTO st FROM public.player_state WHERE user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'player state not initialised';
  END IF;

  v_xp := st.xp + 50;

  IF    v_xp >= 5500 THEN v_level := 10;
  ELSIF v_xp >= 4000 THEN v_level := 9;
  ELSIF v_xp >= 3000 THEN v_level := 8;
  ELSIF v_xp >= 2200 THEN v_level := 7;
  ELSIF v_xp >= 1500 THEN v_level := 6;
  ELSIF v_xp >= 1000 THEN v_level := 5;
  ELSIF v_xp >=  600 THEN v_level := 4;
  ELSIF v_xp >=  300 THEN v_level := 3;
  ELSIF v_xp >=  100 THEN v_level := 2;
  END IF;

  v_wager := COALESCE(st.current_wager, 0);
  v_mult := CASE v_wager
              WHEN  50 THEN 2
              WHEN 100 THEN 3
              WHEN 200 THEN 5
              WHEN 500 THEN 10
              ELSE 0
            END;
  IF v_mult > 0 THEN
    v_payout := v_wager * v_mult;
  END IF;

  v_wins_since := st.wins_since_milestone + 1;
  IF v_wins_since >= 10 THEN
    IF    v_level BETWEEN 1 AND 3 THEN v_tier_pence :=  50; v_tier_name := 'Rookie';
    ELSIF v_level BETWEEN 4 AND 6 THEN v_tier_pence := 150; v_tier_name := 'Expert';
    ELSIF v_level BETWEEN 7 AND 9 THEN v_tier_pence := 300; v_tier_name := 'Champion';
    ELSE  v_tier_pence := NULL;
    END IF;

    IF v_tier_pence IS NOT NULL THEN
      v_milestone_pence := v_tier_pence;
      v_wins_since := 0;
    END IF;
  END IF;

  IF v_level >= 10 AND st.max_level_reached < 10 THEN
    v_maxlevel_pence := 2500;
  END IF;

  UPDATE public.player_state SET
    games_won            = games_won + 1,
    xp                   = v_xp,
    level                = v_level,
    max_level_reached    = GREATEST(max_level_reached, v_level),
    best_time_seconds    = LEAST(COALESCE(best_time_seconds, p_seconds), p_seconds),
    best_moves           = LEAST(COALESCE(best_moves, p_moves), p_moves),
    coins                = coins + 100 + v_payout,
    current_wager        = 0,
    current_streak       = current_streak + 1,
    best_streak          = GREATEST(best_streak, current_streak + 1),
    wins_since_milestone = v_wins_since,
    milestones_claimed   = milestones_claimed
                             + CASE WHEN v_milestone_pence > 0 THEN 1 ELSE 0 END,
    winnings_pence       = winnings_pence + v_milestone_pence + v_maxlevel_pence,
    lifetime_won_pence   = lifetime_won_pence + v_milestone_pence + v_maxlevel_pence,
    updated_at           = now()
  WHERE user_id = auth.uid()
  RETURNING * INTO st;

  IF v_milestone_pence > 0 THEN
    INSERT INTO public.transactions (type, amount_pence, description, status)
    VALUES ('award', v_milestone_pence,
            'Milestone reward — ' || v_tier_name || ' tier', 'completed');
  END IF;

  IF v_maxlevel_pence > 0 THEN
    INSERT INTO public.transactions (type, amount_pence, description, status)
    VALUES ('award', v_maxlevel_pence, 'Level 10 award', 'completed');
  END IF;

  RETURN st;
END;
$$;

-- record_win: authenticated only (not anon — app now requires sign-in)
REVOKE ALL ON FUNCTION public.record_win(integer, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.record_win(integer, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.record_win(integer, integer) TO authenticated;
