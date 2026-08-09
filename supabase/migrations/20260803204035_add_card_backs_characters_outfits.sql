/*
# Add card backs, characters, outfits, and token cashback

1. Modified Tables
- `player_state`
  - `tokens` (int, not null, default 0) — secondary currency earned as 20% cashback on every coin spend. Tokens can be spent on side deals and items.
  - `active_card_back` (text, not null, default 'classic') — the player's currently selected card back design.
  - `active_character` (text, not null, default 'alex') — the player's currently selected character.
  - `active_outfit` (text, not null, default 'default') — the player's currently selected outfit for their character.
2. New Tables
- `player_inventory`
  - `id` (uuid, primary key)
  - `item_type` (text: 'card_back' | 'character' | 'outfit') — what kind of item.
  - `item_id` (text) — the catalog id of the item (e.g. 'royal', 'ninja', 'gold_suit').
  - `acquired_at` (timestamptz, default now()) — when the item was purchased or granted.
  - Unique constraint on (item_type, item_id) so a player can't own the same item twice.
3. Security
- Enable RLS on `player_inventory`.
- Allow anon + authenticated full CRUD (single-tenant, no auth).
4. Notes
- Players earn tokens as 20% cashback on every coin spend (boosts, card backs, outfits, etc.).
- Tokens can be spent on side deals (special items at a discount) and future features.
- Characters and outfits are cosmetic upgrades to the player's profile.
- The default card back ('classic'), character ('alex'), and outfit ('default') are owned from the start.
*/

ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS tokens int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS active_card_back text NOT NULL DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS active_character text NOT NULL DEFAULT 'alex',
  ADD COLUMN IF NOT EXISTS active_outfit text NOT NULL DEFAULT 'default';

CREATE TABLE IF NOT EXISTS player_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL CHECK (item_type IN ('card_back', 'character', 'outfit')),
  item_id text NOT NULL,
  acquired_at timestamptz DEFAULT now(),
  UNIQUE (item_type, item_id)
);

ALTER TABLE player_inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_inventory" ON player_inventory;
CREATE POLICY "anon_select_inventory" ON player_inventory FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_inventory" ON player_inventory;
CREATE POLICY "anon_insert_inventory" ON player_inventory FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_inventory" ON player_inventory;
CREATE POLICY "anon_update_inventory" ON player_inventory FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_inventory" ON player_inventory;
CREATE POLICY "anon_delete_inventory" ON player_inventory FOR DELETE
  TO anon, authenticated USING (true);