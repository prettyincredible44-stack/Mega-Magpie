/*
  # Protect leaderboard entries and bound submitted scores

  speed_matches is a shared leaderboard. UPDATE and DELETE were granted
  unconditionally, so any caller could edit or erase other players' entries.
  The score columns were unbounded plain integers, so a submission could claim
  an arbitrarily large score and hold first place permanently.

  The app only inserts its own result (App.tsx handleSpeedMatchComplete) and
  reads the top ten, so UPDATE and DELETE are unused by the application.
  INSERT stays open because submissions are anonymous by design.

  1. Policies
     - Drop anon_update_speed_matches; keep select and insert
  2. Privileges
     - Revoke UPDATE and DELETE from anon and authenticated
  3. Integrity bounds (match the client scoring in SpeedMatchModal.tsx:
     BASE_SCORE 500 + timeLeft*3 - moves*2, MATCH_DURATION 180s)
     - score, moves, wagered: 0..100000
     - time_seconds: 0..86400
     - player_name: 1..32 characters

  No rows are modified or removed.
*/

DROP POLICY IF EXISTS anon_update_speed_matches ON public.speed_matches;

REVOKE UPDATE ON public.speed_matches FROM anon, authenticated;
REVOKE DELETE ON public.speed_matches FROM anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speed_matches_score_range') THEN
    ALTER TABLE public.speed_matches
      ADD CONSTRAINT speed_matches_score_range CHECK (score >= 0 AND score <= 100000);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speed_matches_moves_range') THEN
    ALTER TABLE public.speed_matches
      ADD CONSTRAINT speed_matches_moves_range CHECK (moves >= 0 AND moves <= 100000);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speed_matches_time_range') THEN
    ALTER TABLE public.speed_matches
      ADD CONSTRAINT speed_matches_time_range CHECK (time_seconds >= 0 AND time_seconds <= 86400);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speed_matches_wagered_range') THEN
    ALTER TABLE public.speed_matches
      ADD CONSTRAINT speed_matches_wagered_range CHECK (wagered >= 0 AND wagered <= 100000);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'speed_matches_name_len') THEN
    ALTER TABLE public.speed_matches
      ADD CONSTRAINT speed_matches_name_len CHECK (char_length(player_name) BETWEEN 1 AND 32);
  END IF;
END $$;
