export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  color: 'red' | 'black';
  value: number;
}

export interface Pile {
  id: string;
  cards: Card[];
  type: 'tableau' | 'foundation' | 'stock' | 'waste';
}

export interface GameState {
  tableau: Card[][];
  foundations: Card[][];
  stock: Card[];
  waste: Card[];
  moves: number;
  startTime: number;
  elapsed: number;
  isWon: boolean;
  isPlaying: boolean;
  history: HistoryEntry[];
  hintsUsed: number;
  undosUsed: number;
}

export interface HistoryEntry {
  tableau: Card[][];
  foundations: Card[][];
  stock: Card[];
  waste: Card[];
  moves: number;
}

export interface PlayerState {
  user_id: string;
  coins: number;
  tokens: number;
  games_played: number;
  games_won: number;
  best_time_seconds: number | null;
  best_moves: number | null;
  xp: number;
  level: number;
  max_level_reached: number;
  winnings_pence: number;
  lifetime_won_pence: number;
  total_deposited_pence: number;
  wins_since_milestone: number;
  milestones_claimed: number;
  pending_milestone_pence: number;
  active_card_back: string;
  active_character: string;
  active_outfit: string;
  current_wager: number;
  age_verified: boolean;
  session_spent_coins: number;
  lifetime_spent_coins: number;
  speed_points: number;
  player_name: string;
  current_streak: number;
  best_streak: number;
  daily_streak: number;
  best_daily_streak: number;
  last_login_date: string | null;
  daily_reward_claimed: boolean;
  streak_freezes: number;
  last_freeze_date: string | null;
  ads_watched_today: number;
  ads_reset_date: string | null;
  updated_at: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'award';
  amount_pence: number;
  description: string | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface InventoryItem {
  id: string;
  item_type: 'card_back' | 'character' | 'outfit';
  item_id: string;
  acquired_at: string;
}

export interface SpeedMatch {
  id: string;
  player_name: string;
  score: number;
  moves: number;
  time_seconds: number;
  won: boolean;
  wagered: number;
  created_at: string;
}

export type WagerLevel = 0 | 50 | 100 | 200 | 500;

export interface WagerOption {
  value: WagerLevel;
  label: string;
  multiplier: number;
  color: string;
}

export const WAGER_OPTIONS: WagerOption[] = [
  { value: 0, label: 'Play Safe', multiplier: 0, color: '#10b981' },
  { value: 50, label: 'Casual', multiplier: 2, color: '#3b82f6' },
  { value: 100, label: 'Serious', multiplier: 3, color: '#f59e0b' },
  { value: 200, label: 'High Roller', multiplier: 5, color: '#ef4444' },
  { value: 500, label: 'Whale', multiplier: 10, color: '#a855f7' },
];
