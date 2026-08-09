/*
  # Restrict which player_state columns the browser may write

  player_state is a single shared row that the browser updates directly. A
  row-level policy is not column-level: "update your own row" allowed every
  column to be set, including the ones that carry real cash value.

  Privileged columns withheld from the client after this migration:
    - winnings_pence, lifetime_won_pence  (withdrawable sterling balance)
    - total_deposited_pence               (gates withdrawal eligibility)
    - milestones_claimed, wins_since_milestone (drive cash milestone awards)
    - xp, level, max_level_reached         (level selects the milestone tier
                                            and gates the one-time L10 award)
    - games_won, best_streak               (progress the awards are keyed on)
    - age_verified                         (the 18+ control)
    - id                                   (singleton key)

  These are now written only by public.record_win (next migration).

  1. Privileges
     - Revoke blanket UPDATE on player_state from anon and authenticated
     - Re-grant UPDATE on only the columns the app legitimately writes from the
       browser: currency, cosmetics, session/daily bookkeeping and timers
  2. Notes
     - SELECT is untouched: the app reads the row with select('*') and every
       screen depends on it. Nothing is hidden, only made unwritable.
     - The UPDATE policy anon_update_player_state stays; the grant is what
       narrows the reachable columns.
*/

REVOKE UPDATE ON public.player_state FROM anon, authenticated;

GRANT UPDATE (
  coins,
  tokens,
  games_played,
  best_time_seconds,
  best_moves,
  active_card_back,
  active_character,
  active_outfit,
  ads_watched_today,
  ads_reset_date,
  current_wager,
  session_spent_coins,
  lifetime_spent_coins,
  speed_points,
  player_name,
  current_streak,
  daily_streak,
  best_daily_streak,
  last_login_date,
  daily_reward_claimed,
  streak_freezes,
  last_freeze_date,
  updated_at
) ON public.player_state TO anon, authenticated;
