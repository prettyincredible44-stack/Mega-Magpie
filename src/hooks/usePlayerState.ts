import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { PlayerState, Transaction, InventoryItem } from '@/game/types';
import { getLevelFromXp } from '@/game/levels';
import { generatePlayerName } from '@/lib/names';

const DEFAULT_STATE: Omit<PlayerState, 'user_id'> = {
  coins: 500,
  tokens: 0,
  games_played: 0,
  games_won: 0,
  best_time_seconds: null,
  best_moves: null,
  xp: 0,
  level: 1,
  max_level_reached: 1,
  winnings_pence: 0,
  lifetime_won_pence: 0,
  total_deposited_pence: 0,
  wins_since_milestone: 0,
  milestones_claimed: 0,
  pending_milestone_pence: 0,
  active_card_back: 'classic',
  active_character: 'alex',
  active_outfit: 'default',
  current_wager: 0,
  age_verified: false,
  session_spent_coins: 0,
  lifetime_spent_coins: 0,
  speed_points: 0,
  player_name: generatePlayerName(),
  current_streak: 0,
  best_streak: 0,
  daily_streak: 0,
  best_daily_streak: 0,
  last_login_date: null,
  daily_reward_claimed: false,
  streak_freezes: 1,
  last_freeze_date: null,
  ads_watched_today: 0,
  ads_reset_date: null,
  updated_at: new Date().toISOString(),
};

export function usePlayerState(userId: string | undefined) {
  const [state, setState] = useState<PlayerState | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchState = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from('player_state').select('*').eq('user_id', userId).maybeSingle();
    if (data) {
      setState(data as PlayerState);
    } else {
      const newState = { ...DEFAULT_STATE, user_id: userId };
      const { data: inserted } = await supabase.from('player_state').insert(newState).select().maybeSingle();
      if (inserted) setState(inserted as PlayerState);
    }
    setLoading(false);
  }, [userId]);

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setTransactions(data as Transaction[]);
  }, [userId]);

  const fetchInventory = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('player_inventory')
      .select('*')
      .eq('user_id', userId)
      .order('acquired_at', { ascending: false });
    if (data) setInventory(data as InventoryItem[]);
  }, [userId]);

  useEffect(() => {
    fetchState();
    fetchTransactions();
    fetchInventory();
  }, [fetchState, fetchTransactions, fetchInventory]);

  const updateState = useCallback(
    async (updates: Partial<PlayerState>) => {
      if (!userId || !state) return;
      const computed: Partial<PlayerState> = { ...updates };
      if (updates.xp !== undefined) {
        computed.level = getLevelFromXp(updates.xp);
      }
      const { data } = await supabase
        .from('player_state')
        .update({ ...computed, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .maybeSingle();
      if (data) setState(data as PlayerState);
    },
    [userId, state]
  );

  const addToInventory = useCallback(
    async (itemType: string, itemId: string) => {
      if (!userId) return;
      const { data } = await supabase
        .from('player_inventory')
        .insert({ item_type: itemType, item_id: itemId, user_id: userId })
        .select()
        .maybeSingle();
      if (data) setInventory((prev) => [data as InventoryItem, ...prev]);
    },
    [userId]
  );

  const ownsItem = useCallback(
    (itemType: string, itemId: string) => {
      return inventory.some((i) => i.item_type === itemType && i.item_id === itemId);
    },
    [inventory]
  );

  return {
    state,
    transactions,
    inventory,
    loading,
    updateState,
    addToInventory,
    ownsItem,
    refresh: () => {
      fetchState();
      fetchTransactions();
      fetchInventory();
    },
  };
}
