/*
  # Make the payout ledger read-only to the browser

  The transactions table is the audit trail for cash awards and payouts. With
  unconditional INSERT and UPDATE policies any caller could fabricate a
  completed deposit, rewrite an amount, or alter a payout record. An audit
  ledger its own subjects can rewrite has no evidentiary value.

  From here the ledger is written ONLY by the SECURITY DEFINER function
  public.record_win (added in a later migration), which derives amounts from
  server-side constants.

  1. Policies
     - Drop anon_insert_transactions and anon_update_transactions
     - Keep anon_select_transactions so the wallet history screen still renders
  2. Privileges
     - Revoke INSERT and UPDATE from anon and authenticated
     - SELECT is deliberately left in place; narrowing it would break the
       history list the app already reads with select('*')

  No rows are modified or removed.
*/

DROP POLICY IF EXISTS anon_insert_transactions ON public.transactions;
DROP POLICY IF EXISTS anon_update_transactions ON public.transactions;

REVOKE INSERT, UPDATE ON public.transactions FROM anon, authenticated;
