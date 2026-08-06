/*
  # Restrict cosmetics inventory writes

  player_inventory records unlocked card backs, characters and outfits, which
  are priced in coins. It has no ownership column, and UPDATE/DELETE were
  granted unconditionally, so any caller could rewrite an existing unlock or
  remove one. Duplicate inserts of the same item were also possible.

  The app only ever inserts a new unlock (usePlayerState.addToInventory) and
  reads the list, so UPDATE and DELETE are unused by the application.

  1. Policies
     - Drop anon_update_inventory; keep select and insert
  2. Privileges
     - Revoke UPDATE and DELETE from anon and authenticated
  3. Integrity
     - Unique index on (item_type, item_id) so an item cannot be granted twice
     - Length bound on item_id to stop unbounded values being stored

  Existing rows are three distinct defaults (classic / alex / default), so the
  unique index applies cleanly. No data is modified.
*/

DROP POLICY IF EXISTS anon_update_inventory ON public.player_inventory;

REVOKE UPDATE ON public.player_inventory FROM anon, authenticated;
REVOKE DELETE ON public.player_inventory FROM anon, authenticated;

CREATE UNIQUE INDEX IF NOT EXISTS player_inventory_unique_item
  ON public.player_inventory (item_type, item_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'player_inventory_item_id_len'
  ) THEN
    ALTER TABLE public.player_inventory
      ADD CONSTRAINT player_inventory_item_id_len
      CHECK (char_length(item_id) BETWEEN 1 AND 64);
  END IF;
END $$;
