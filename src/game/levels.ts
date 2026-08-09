export interface LevelInfo {
  level: number;
  name: string;
  xpRequired: number;
  awardPence: number;
}

export const MAX_LEVEL = 10;

export const AWARD_ON_MAX_LEVEL_PENCE = 2500;

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Rookie', xpRequired: 0, awardPence: 0 },
  { level: 2, name: 'Apprentice', xpRequired: 100, awardPence: 0 },
  { level: 3, name: 'Skilled', xpRequired: 300, awardPence: 0 },
  { level: 4, name: 'Expert', xpRequired: 600, awardPence: 0 },
  { level: 5, name: 'Master', xpRequired: 1000, awardPence: 0 },
  { level: 6, name: 'Grandmaster', xpRequired: 1500, awardPence: 0 },
  { level: 7, name: 'Champion', xpRequired: 2200, awardPence: 0 },
  { level: 8, name: 'Legend', xpRequired: 3000, awardPence: 0 },
  { level: 9, name: 'Mythic', xpRequired: 4000, awardPence: 0 },
  { level: 10, name: 'Magpie King', xpRequired: 5500, awardPence: AWARD_ON_MAX_LEVEL_PENCE },
];

export function getLevelForXp(xp: number): LevelInfo {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
  }
  return current;
}

export function getNextLevel(level: number): LevelInfo | null {
  return LEVELS.find((l) => l.level === level + 1) ?? null;
}

export function getLevelProgress(xp: number): {
  current: LevelInfo;
  next: LevelInfo | null;
  pct: number;
  xpIntoLevel: number;
  xpForNext: number;
} {
  const current = getLevelForXp(xp);
  const next = getNextLevel(current.level);
  if (!next) {
    return { current, next: null, pct: 100, xpIntoLevel: xp - current.xpRequired, xpForNext: 0 };
  }
  const xpIntoLevel = xp - current.xpRequired;
  const xpForNext = next.xpRequired - current.xpRequired;
  const pct = Math.min(100, Math.round((xpIntoLevel / xpForNext) * 100));
  return { current, next, pct, xpIntoLevel, xpForNext };
}

export const XP_PER_WIN = 50;
export const COIN_REWARD_PER_WIN = 100;

export const MILESTONE_WINS = 10;

export interface MilestoneTier {
  minLevel: number;
  maxLevel: number;
  awardPence: number;
  name: string;
}

export const MILESTONE_TIERS: MilestoneTier[] = [
  { minLevel: 1, maxLevel: 3, awardPence: 50, name: 'Rookie' },
  { minLevel: 4, maxLevel: 6, awardPence: 150, name: 'Expert' },
  { minLevel: 7, maxLevel: 9, awardPence: 300, name: 'Champion' },
];

export function getMilestoneTier(level: number): MilestoneTier | null {
  return MILESTONE_TIERS.find((t) => level >= t.minLevel && level <= t.maxLevel) ?? null;
}

export const MIN_WITHDRAWAL_PENCE = 500;
export const WITHDRAWAL_THRESHOLD_PENCE = 1000;
export const HOUSE_FEE_PCT = 10;

export interface DepositPackage {
  pence: number;
  coins: number;
  bonusPct: number;
  label: string;
  popular?: boolean;
}

export const DEPOSIT_PACKAGES: DepositPackage[] = [
  { pence: 500, coins: 500, bonusPct: 0, label: 'Starter' },
  { pence: 1000, coins: 1100, bonusPct: 10, label: 'Standard', popular: true },
  { pence: 2000, coins: 2400, bonusPct: 20, label: 'Pro' },
  { pence: 5000, coins: 6500, bonusPct: 30, label: 'Whale' },
];

export const TOKENS_PER_AD = 25;
export const DAILY_AD_CAP = 10;

export const WAGER_TIERS = [
  { coins: 0, multiplier: 1, label: 'No Wager' },
  { coins: 50, multiplier: 2, label: 'Casual' },
  { coins: 100, multiplier: 3, label: 'Bold' },
  { coins: 200, multiplier: 5, label: 'High Roller' },
  { coins: 500, multiplier: 10, label: 'Whale' },
] as const;

export interface CashWagerTier {
  pence: number;
  multiplier: number;
  label: string;
}

export const CASH_WAGER_TIERS: CashWagerTier[] = [
  { pence: 25, multiplier: 2, label: 'Pocket Money' },
  { pence: 50, multiplier: 2, label: 'Casual' },
  { pence: 100, multiplier: 2, label: 'Bold' },
  { pence: 200, multiplier: 2, label: 'High Roller' },
];
