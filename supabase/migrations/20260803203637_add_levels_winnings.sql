/*
# Add leveling, winnings, and transactions to solitaire

1. Modified Tables
- `player_state`
  - `xp` (int, not null, default 0) — experience points earned by winning games.
  - `level` (int, not null, default 1) — current player level (1-10).
  - `winnings_pence` (int, not null, default 0) — real-money winnings balance in pence (£1 = 100 pence).
  - `total_deposited_pence` (int, not null, default 0) — lifetime deposited amount in pence.
  - `max_level_reached` (int, not null, default 1) — highest level ever reached (for award eligibility).
2. New Tables
- `transactions`
  - `id` (uuid, primary key)
  - `type` (text: 'deposit' | 'withdraw' | 'award') — what kind of transaction.
  - `amount_pence` (int, not null) — amount in pence (positive for deposits/awards, negative for withdrawals).
  - `description` (text) — human-readable description.
  - `status` (text: 'pending' | 'completed' | 'failed') — transaction state.
  - `created_at` (timestamptz, default now())
3. Security
- Enable RLS on `transactions`.
- Allow anon + authenticated full CRUD (single-tenant, no auth).
4. Notes
- Players earn XP by winning games. Each level requires more XP.
- Reaching the maximum level (10) unlocks a £20 award added to winnings.
- Winnings can be withdrawn once the player has deposited at least £20 (2000 pence) lifetime.
- Deposits and withdrawals are recorded in the transactions table for audit.
*/

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS xp int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level int NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS winnings_pence int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_deposited_pence int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_level_reached int NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('deposit', 'withdraw', 'award')),
  amount_pence int NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_transactions" ON transactions;
CREATE POLICY "anon_select_transactions" ON transactions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_transactions" ON transactions;
CREATE POLICY "anon_insert_transactions" ON transactions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_transactions" ON transactions;
CREATE POLICY "anon_update_transactions" ON transactions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_transactions" ON transactions;
CREATE POLICY "anon_delete_transactions" ON transactions FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions (created_at DESC);