/*
# Add milestone tracking to player_state

1. Modified Tables
- `player_state`
  - Add `wins_since_milestone` (int, default 0): counts wins since the last cash milestone payout.
  - Add `milestones_claimed` (int, default 0): total number of milestone payouts the player has received.
  - Add `pending_milestone_pence` (int, default 0): accumulates milestone cash awards that haven't been added to winnings_pence yet (for display purposes).

2. Security
- No changes to RLS policies. Existing policies remain in effect.

3. Important Notes
- These columns support the milestone-based cash reward system where players earn cash every 10 wins.
- The tier of the milestone (and thus the cash amount) depends on the player's current level.
- All columns have safe defaults so existing rows are unaffected.
*/

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS wins_since_milestone int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS milestones_claimed int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pending_milestone_pence int NOT NULL DEFAULT 0;