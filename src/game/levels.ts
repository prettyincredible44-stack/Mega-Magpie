export interface LevelInfo {
  level: number;
  name: string;
  xpRequired: number;
  color: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Rookie', xpRequired: 0, color: '#94a3b8' },
  { level: 2, name: 'Rookie', xpRequired: 100, color: '#94a3b8' },
  { level: 3, name: 'Rookie', xpRequired: 300, color: '#94a3b8' },
  { level: 4, name: 'Expert', xpRequired: 600, color: '#3b82f6' },
  { level: 5, name: 'Expert', xpRequired: 1000, color: '#3b82f6' },
  { level: 6, name: 'Expert', xpRequired: 1500, color: '#3b82f6' },
  { level: 7, name: 'Champion', xpRequired: 2200, color: '#f59e0b' },
  { level: 8, name: 'Champion', xpRequired: 3000, color: '#f59e0b' },
  { level: 9, name: 'Champion', xpRequired: 4000, color: '#f59e0b' },
  { level: 10, name: 'Legend', xpRequired: 5500, color: '#fcd34d' },
];

export function getLevelFromXp(xp: number): number {
  let level = 1;
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) level = l.level;
  }
  return level;
}

export function getLevelInfo(level: number): LevelInfo {
  return LEVELS.find((l) => l.level === level) || LEVELS[0];
}

export function getLevelProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = getLevelFromXp(xp);
  if (level >= 10) return { current: xp - 5500, needed: 0, percent: 100 };
  const currentLevelInfo = LEVELS[level - 1];
  const nextLevelInfo = LEVELS[level];
  const current = xp - currentLevelInfo.xpRequired;
  const needed = nextLevelInfo.xpRequired - currentLevelInfo.xpRequired;
  return { current, needed, percent: Math.min(100, (current / needed) * 100) };
}

export function getMilestonePence(level: number): number {
  if (level >= 1 && level <= 3) return 50;
  if (level >= 4 && level <= 6) return 150;
  if (level >= 7 && level <= 9) return 300;
  return 0;
}

export function getTierName(level: number): string {
  if (level >= 1 && level <= 3) return 'Rookie';
  if (level >= 4 && level <= 6) return 'Expert';
  if (level >= 7 && level <= 9) return 'Champion';
  return 'Legend';
}
