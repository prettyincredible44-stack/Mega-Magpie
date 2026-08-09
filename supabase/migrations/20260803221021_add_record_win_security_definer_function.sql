/*
  # Server-authoritative win accounting

  Previously the browser computed the entire result of a win — XP, level, the
  coin reward, the stake multiplier, the 10-win cash milestone and the one-time
  Level 10 award — and wrote the numbers straight into player_state. A caller
  could name any amount, or pre-set wins_since_milestone to 9 so every hand
  paid a milestone, or set level to 10 to claim the top award immediately.

  record_win now applies all of that from constants held here, mirroring
  src/game/levels.ts exactly:
    XP_PER_WIN 50, COIN_REWARD_PER_WIN 100, MILESTONE_WINS 10
    level thresholds 0/100/300/600/1000/1500/2200/3000/4000/5500
    milestone tiers L1-3 = 50p, L4-6 = 150p, L7-9 = 300p
    stake tiers 50->x2, 100->x3, 200->x5, 500->x10
    AWARD_ON_MAX_LEVEL_PENCE 2500, paid once when level 10 is first reached

  The row is claimed with SELECT ... FOR UPDATE so two concurrent calls cannot
  both pass the milestone threshold, and the ledger rows are written here
  rather than by the client, which no longer holds INSERT on transactions.

  1. New function
     - public.record_win(p_seconds int, p_moves int) RETURNS public.player_state
     - SECURITY DEFINER with a pinned search_path; EXECUTE granted to
       anon and authenticated only (never PUBLIC)

  Note: this function is intentionally callable by the anon role, because the
  app has no sign-in. It is the mechanism that replaces arbitrary client writes
  with fixed, validated amounts. It cannot verify that a hand was genuinely
  won — that requires per-player accounts and server-side game state — so it
  bounds each call to one legitimate win rather than eliminating farming.
*/

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

  SELECT * INTO st FROM public.player_state WHERE id = 1 FOR UPDATE;
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
  WHERE id = 1
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

REVOKE ALL ON FUNCTION public.record_win(integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_win(integer, integer) TO anon, authenticated;
