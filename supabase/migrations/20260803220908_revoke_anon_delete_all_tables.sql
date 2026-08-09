/*
  # Remove anonymous DELETE capability from every table

  The application never deletes rows: usePlayerState.ts and App.tsx only
  select, insert and update. The unconditional DELETE policies were therefore
  pure attack surface — any caller with the public anon key could wipe the
  player wallet, the payout ledger, the cosmetics inventory or the leaderboard.

  1. Policies
     - Drop anon_delete_player_state, anon_delete_transactions,
       anon_delete_inventory, anon_delete_speed_matches
  2. Privileges
     - Revoke the DELETE privilege from anon and authenticated on all four
       tables so the capability is gone at the grant level too

  No data is removed and no application code path relied on deleting rows.
*/

DROP POLICY IF EXISTS anon_delete_player_state ON public.player_state;
DROP POLICY IF EXISTS anon_delete_transactions ON public.transactions;
DROP POLICY IF EXISTS anon_delete_inventory ON public.player_inventory;
DROP POLICY IF EXISTS anon_delete_speed_matches ON public.speed_matches;

REVOKE DELETE ON public.player_state FROM anon, authenticated;
REVOKE DELETE ON public.transactions FROM anon, authenticated;
REVOKE DELETE ON public.player_inventory FROM anon, authenticated;
REVOKE DELETE ON public.speed_matches FROM anon, authenticated;
