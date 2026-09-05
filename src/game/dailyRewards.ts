export interface DailyReward {
  day: number;
  coins: number;
  tokens: number;
  label: string;
}

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, coins: 100, tokens: 0, label: 'Day 1' },
  { day: 2, coins: 150, tokens: 1, label: 'Day 2' },
  { day: 3, coins: 200, tokens: 2, label: 'Day 3' },
  { day: 4, coins: 300, tokens: 3, label: 'Day 4' },
  { day: 5, coins: 500, tokens: 5, label: 'Day 5' },
  { day: 6, coins: 750, tokens: 8, label: 'Day 6' },
  { day: 7, coins: 1000, tokens: 15, label: 'Day 7 - JACKPOT!' },
];

export function getTodayReward(dailyStreak: number): DailyReward {
  const dayIndex = (dailyStreak % 7);
  return DAILY_REWARDS[dayIndex] || DAILY_REWARDS[0];
}

export function canClaimDailyReward(lastLoginDate: string | null, dailyRewardClaimed: boolean): boolean {
  if (!lastLoginDate) return true;
  const today = new Date().toISOString().split('T')[0];
  return lastLoginDate !== today || !dailyRewardClaimed;
}

export function shouldResetStreak(lastLoginDate: string | null): boolean {
  if (!lastLoginDate) return false;
  const today = new Date();
  const last = new Date(lastLoginDate);
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 1;
}
