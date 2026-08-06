export interface DailyReward {
  day: number;
  coins: number;
  tokens: number;
  label: string;
  highlight?: boolean;
}

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, coins: 50, tokens: 0, label: 'Day 1' },
  { day: 2, coins: 75, tokens: 5, label: 'Day 2' },
  { day: 3, coins: 100, tokens: 10, label: 'Day 3' },
  { day: 4, coins: 150, tokens: 15, label: 'Day 4' },
  { day: 5, coins: 200, tokens: 20, label: 'Day 5' },
  { day: 6, coins: 300, tokens: 30, label: 'Day 6' },
  { day: 7, coins: 500, tokens: 50, label: 'Day 7', highlight: true },
];

export const STREAK_RESET_DAYS = 2;
export const FREEZE_AWARD_INTERVAL = 7;

export function getRewardForDay(day: number): DailyReward {
  const idx = ((day - 1) % DAILY_REWARDS.length);
  return DAILY_REWARDS[idx];
}

export function getNextFreezeAwardDay(currentBest: number): number {
  const nextMultiple = Math.ceil((currentBest + 1) / FREEZE_AWARD_INTERVAL) * FREEZE_AWARD_INTERVAL;
  return nextMultiple;
}
