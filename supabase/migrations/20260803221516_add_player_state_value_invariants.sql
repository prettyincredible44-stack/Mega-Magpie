/*
  # Bound the values the browser may still write to player_state

  The columns the client legitimately writes (coins, tokens, spend counters,
  streaks, stake) were plain integers with no bounds, so a caller could set a
  balance to any value, or drive the responsible-play spend counters negative
  to suppress the spending warning that fires at 500 / 1000 / 2000 coins.

  These constraints also cover the server-owned columns, so record_win cannot
  drift out of range either.

  1. Currency and spend
     - coins, tokens: 0 .. 100,000,000
     - session_spent_coins, lifetime_spent_coins, speed_points: >= 0
  2. Cash (server-owned, defence in depth)
     - winnings_pence, lifetime_won_pence, total_deposited_pence: >= 0
  3. Stake
     - current_wager restricted to the five published tiers from
       src/game/levels.ts WAGER_TIERS: 0, 50, 100, 200, 500
  4. Progress
     - xp >= 0; level and max_level_reached: 1 .. 10 (MAX_LEVEL)
     - games_played, games_won, milestones_claimed: >= 0
     - wins_since_milestone: 0 .. 10 (MILESTONE_WINS)
     - streak columns: >= 0; streak_freezes: 0 .. 10
     - ads_watched_today: 0 .. 10 (DAILY_AD_CAP)
  5. Identity
     - player_name: 1 .. 32 characters (F12); generated names are ~20 chars

  All constraints are satisfied by the current row, so nothing is rejected and
  no data changes.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_coins_range') THEN
    ALTER TABLE public.player_state
      ADD CONSTRAINT player_state_coins_range CHECK (coins >= 0 AND coins <= 100000000);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_tokens_range') THEN
    ALTER TABLE public.player_state
      ADD CONSTRAINT player_state_tokens_range CHECK (tokens >= 0 AND tokens <= 100000000);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_cash_nonneg') THEN
    ALTER TABLE public.player_state
      ADD CONSTRAINT player_state_cash_nonneg CHECK (
        winnings_pence >= 0
        AND lifetime_won_pence >= 0
        AND total_deposited_pence >= 0
        AND pending_milestone_pence >= 0
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_spend_nonneg') THEN
    ALTER TABLE public.player_state
      ADD CONSTRAINT player_state_spend_nonneg CHECK (
        session_spent_coins >= 0
        AND lifetime_spent_coins >= 0
        AND speed_points >= 0
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_wager_tier') THEN
    ALTER TABLE public.player_state
      ADD CONSTRAINT player_state_wager_tier CHECK (current_wager IN (0, 50, 100, 200, 500));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_progress_range') THEN
    ALTER TABLE public.player_state
      ADD CONSTRAINT player_state_progress_range CHECK (
        xp >= 0
        AND level BETWEEN 1 AND 10
        AND max_level_reached BETWEEN 1 AND 10
        AND games_played >= 0
        AND games_won >= 0
        AND milestones_claimed >= 0
        AND wins_since_milestone BETWEEN 0 AND 10
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_streak_range') THEN
    ALTER TABLE public.player_state
      ADD CONSTRAINT player_state_streak_range CHECK (
        current_streak >= 0
        AND best_streak >= 0
        AND daily_streak >= 0
        AND best_daily_streak >= 0
        AND streak_freezes BETWEEN 0 AND 10
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_ads_range') THEN
    ALTER TABLE public.player_state
      ADD CONSTRAINT player_state_ads_range CHECK (ads_watched_today BETWEEN 0 AND 10);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'player_state_name_len') THEN
    ALTER TABLE public.player_state
      ADD CONSTRAINT player_state_name_len CHECK (char_length(player_name) BETWEEN 1 AND 32);
  END IF;
END $$;
