import { useCallback, useEffect, useState } from 'react';
import { supabase, PlayerState, InventoryItem, Transaction } from '@/lib/supabase';
import { DEFAULT_INVENTORY } from '@/game/catalog';
import { generatePlayerName } from '@/lib/names';

const STARTING_COINS = 500;

type LoadingState = 'loading' | 'ready' | 'error';

export function usePlayerState(userId: string | null) {
  const [state, setState] = useState<PlayerState | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [status, setStatus] = useState<LoadingState>('loading');

  useEffect(() => {
    if (!userId) {
      setState(null);
      setInventory([]);
      setStatus('loading');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const [{ data: psData, error: psError }, { data: invData, error: invError }] = await Promise.all([
          supabase.from('player_state').select('*').eq('user_id', userId).maybeSingle(),
          supabase.from('player_inventory').select('*').order('acquired_at', { ascending: true }),
        ]);
        if (cancelled) return;
        if (psError) throw psError;
        if (invError) throw invError;

        if (psData) {
          setState(psData as PlayerState);
        } else {
          const { data: created, error: createErr } = await supabase
            .from('player_state')
            .insert({ coins: STARTING_COINS, player_name: generatePlayerName() })
            .select('*')
            .maybeSingle();
          if (cancelled) return;
          if (createErr) throw createErr;
          setState(created as PlayerState);
        }

        const inv = (invData ?? []) as InventoryItem[];
        if (inv.length === 0) {
          const { data: seeded } = await supabase
            .from('player_inventory')
            .insert(DEFAULT_INVENTORY.map((d) => ({ item_type: d.item_type, item_id: d.item_id })))
            .select('*');
          if (cancelled) return;
          setInventory((seeded ?? []) as InventoryItem[]);
        } else {
          setInventory(inv);
        }
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        console.error('player state load failed', err);
        setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const persist = useCallback(async (patch: Partial<PlayerState>) => {
    setState((prev) => (prev ? { ...prev, ...patch } : prev));
    try {
      await supabase
        .from('player_state')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('user_id', patch.user_id ?? state?.user_id ?? '');
    } catch (err) {
      console.error('player_state update failed', err);
    }
  }, [state?.user_id]);

  const addToInventory = useCallback(async (itemType: InventoryItem['item_type'], itemId: string) => {
    setInventory((prev) => {
      if (prev.some((i) => i.item_type === itemType && i.item_id === itemId)) return prev;
      return [...prev, { id: crypto.randomUUID(), user_id: state?.user_id ?? '', item_type: itemType, item_id: itemId, acquired_at: new Date().toISOString() }];
    });
    try {
      await supabase.from('player_inventory').insert({ item_type: itemType, item_id: itemId });
    } catch (err) {
      console.error('inventory insert failed', err);
    }
  }, [state?.user_id]);

  const ownsItem = useCallback((itemType: InventoryItem['item_type'], itemId: string) => {
    return inventory.some((i) => i.item_type === itemType && i.item_id === itemId);
  }, [inventory]);

  const applyServerState = useCallback((row: PlayerState) => {
    setState(row);
  }, []);

  return { state, inventory, status, persist, addToInventory, ownsItem, applyServerState };
}

export function useTransactions() {
  const loadTransactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as Transaction[];
    } catch (err) {
      console.error('failed to load transactions', err);
      return [];
    }
  }, []);

  const addTransaction = useCallback(async (_tx: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    // No-op: the ledger is server-owned (append-only via record_win)
    void _tx;
  }, []);

  return { loadTransactions, addTransaction };
}
