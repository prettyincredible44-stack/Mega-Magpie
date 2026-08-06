import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anonKey);

export interface PlayerState {
  user_id: string;
  player_name: string;
  coins: number;
  games_played: number;
  games_won: number;
  best_time_seconds: number | null;
  best_moves: number | null;
  updated_at: string;
  xp: number;
  level: number;
  winnings_pence: number;
  total_deposited_pence: number;
  max_level_reached: number;
  tokens: number;
  active_card_back: string;
  active_character: string;
  active_outfit: string;
  wins_since_milestone: number;
  milestones_claimed: number;
  pending_milestone_pence: number;
  ads_watched_today: number;
  ads_reset_date: string | null;
  current_wager: number;
  age_verified: boolean;
  session_spent_coins: number;
  lifetime_spent_coins: number;
  speed_points: number;
  lifetime_won_pence: number;
  current_streak: number;
  best_streak: number;
  daily_streak: number;
  best_daily_streak: number;
  last_login_date: string | null;
  daily_reward_claimed: boolean;
  streak_freezes: number;
  last_freeze_date: string | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdraw' | 'award';
  amount_pence: number;
  description: string | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  item_type: 'card_back' | 'character' | 'outfit';
  item_id: string;
  acquired_at: string;
}

export const penceToPounds = (pence: number) => `£${(pence / 100).toFixed(2)}`;
