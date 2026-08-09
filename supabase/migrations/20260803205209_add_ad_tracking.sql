/*
# Add rewarded-ad tracking to player_state

1. Modified Tables
- `player_state`
  - Add `ads_watched_today` (int, default 0): count of ads watched in the current day.
  - Add `ads_reset_date` (date, nullable): the calendar date the ad counter resets on.

2. Security
- No changes to RLS policies. Existing policies remain in effect.

3. Important Notes
- These columns support the rewarded-ad system where players watch ads to earn tokens.
- A daily cap (enforced in app code) limits how many ads can be watched per day.
- The reset date allows the app to detect a new day and zero the counter.
*/

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS ads_watched_today int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ads_reset_date date;