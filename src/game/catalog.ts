export type ItemType = 'card_back' | 'character' | 'outfit';

export interface CardBack {
  id: string;
  name: string;
  description: string;
  priceCoins: number;
  priceTokens: number;
  gradient: string;
  pattern: 'diamond' | 'crown' | 'wave' | 'star' | 'classic' | 'flame' | 'geometric';
  accent: string;
  owned?: boolean;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  priceCoins: number;
  priceTokens: number;
  emoji: string;
  color: string;
  owned?: boolean;
}

export interface Outfit {
  id: string;
  name: string;
  description: string;
  priceCoins: number;
  priceTokens: number;
  characterId: string;
  emoji: string;
  color: string;
  owned?: boolean;
}

export const CARD_BACKS: CardBack[] = [
  { id: 'classic', name: 'Classic Green', description: 'The traditional felt look', priceCoins: 0, priceTokens: 0, gradient: 'from-emerald-800 to-emerald-950', pattern: 'classic', accent: '#10b981' },
  { id: 'royal', name: 'Royal Blue', description: 'Deep navy with gold trim', priceCoins: 150, priceTokens: 50, gradient: 'from-blue-800 to-blue-950', pattern: 'crown', accent: '#fbbf24' },
  { id: 'crimson', name: 'C Crimson', description: 'Bold red with diamond pattern', priceCoins: 150, priceTokens: 50, gradient: 'from-rose-700 to-rose-950', pattern: 'diamond', accent: '#fb7185' },
  { id: 'midnight', name: 'Midnight', description: 'Dark with starry pattern', priceCoins: 200, priceTokens: 70, gradient: 'from-slate-700 to-slate-950', pattern: 'star', accent: '#a78bfa' },
  { id: 'ocean', name: 'Ocean Wave', description: 'Teal with flowing waves', priceCoins: 200, priceTokens: 70, gradient: 'from-teal-600 to-cyan-950', pattern: 'wave', accent: '#22d3ee' },
  { id: 'inferno', name: 'Inferno', description: 'Fiery orange with flame pattern', priceCoins: 300, priceTokens: 100, gradient: 'from-orange-600 to-red-950', pattern: 'flame', accent: '#f97316' },
  { id: 'geometric', name: 'Geometric', description: 'Modern geometric design', priceCoins: 300, priceTokens: 100, gradient: 'from-indigo-700 to-indigo-950', pattern: 'geometric', accent: '#818cf8' },
];

export const CHARACTERS: Character[] = [
  { id: 'alex', name: 'Alex', title: 'The Rookie', description: 'A beginner with natural talent', priceCoins: 0, priceTokens: 0, emoji: '\uD83E\uDDD1', color: '#10b981' },
  { id: 'mia', name: 'Mia', title: 'The Shark', description: 'A seasoned card shark', priceCoins: 300, priceTokens: 100, emoji: '\uD83D\uDC69', color: '#f43f5e' },
  { id: 'jax', name: 'Jax', title: 'The Hustler', description: 'Street-smart and cunning', priceCoins: 300, priceTokens: 100, emoji: '\uD83D\uDC68', color: '#f59e0b' },
  { id: 'luna', name: 'Luna', title: 'The Mystic', description: 'Mysterious and intuitive', priceCoins: 400, priceTokens: 150, emoji: '\uD83E\uDDD9\u200D\u2640\uFE0F', color: '#8b5cf6' },
  { id: 'rex', name: 'Rex', title: 'The Legend', description: 'A master of the game', priceCoins: 500, priceTokens: 180, emoji: '\uD83E\uDDCD', color: '#06b6d4' },
  { id: 'ninja', name: 'Ninja', title: 'The Shadow', description: 'Silent and deadly precise', priceCoins: 500, priceTokens: 180, emoji: '\uD83E\uDD77', color: '#1e293b' },
];

export const OUTFITS: Outfit[] = [
  { id: 'default', name: 'Default', description: 'The standard look', priceCoins: 0, priceTokens: 0, characterId: '*', emoji: '\uD83D\uDC54', color: '#64748b' },
  { id: 'gold_suit', name: 'Gold Suit', description: 'Dazzle your opponents', priceCoins: 250, priceTokens: 90, characterId: '*', emoji: '\uD83E\uDD35', color: '#fbbf24' },
  { id: 'crown', name: 'Royal Crown', description: 'For true royalty', priceCoins: 400, priceTokens: 150, characterId: '*', emoji: '\uD83D\uDC51', color: '#f59e0b' },
  { id: 'shades', name: 'Cool Shades', description: 'Stay cool under pressure', priceCoins: 200, priceTokens: 70, characterId: '*', emoji: '\uD83D\uDC5E', color: '#1e293b' },
  { id: 'cape', name: 'Hero Cape', description: 'Save the day in style', priceCoins: 350, priceTokens: 120, characterId: '*', emoji: '\uD83E\uDE84', color: '#dc2626' },
  { id: 'tuxedo', name: 'Tuxedo', description: 'Black tie formal', priceCoins: 300, priceTokens: 100, characterId: '*', emoji: '\uD83E\uDD35\u200D\u2642\uFE0F', color: '#0f172a' },
];

export const CASHBACK_RATE = 0.20;

export function getCardBack(id: string): CardBack {
  return CARD_BACKS.find((cb) => cb.id === id) ?? CARD_BACKS[0];
}

export function getCharacter(id: string): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

export function getOutfit(id: string): Outfit {
  return OUTFITS.find((o) => o.id === id) ?? OUTFITS[0];
}

export const DEFAULT_INVENTORY = [
  { item_type: 'card_back' as ItemType, item_id: 'classic' },
  { item_type: 'character' as ItemType, item_id: 'alex' },
  { item_type: 'outfit' as ItemType, item_id: 'default' },
];
