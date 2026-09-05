export interface CardBack {
  id: string;
  name: string;
  emoji: string;
  price: number;
  gradient: string;
}

export interface Character {
  id: string;
  name: string;
  emoji: string;
  price: number;
  color: string;
}

export interface Outfit {
  id: string;
  name: string;
  characterId: string;
  emoji: string;
  price: number;
}

export const CARD_BACKS: CardBack[] = [
  { id: 'classic', name: 'Classic', emoji: '🂠', price: 0, gradient: 'from-slate-700 to-slate-900' },
  { id: 'ruby', name: 'Ruby', emoji: '♦', price: 500, gradient: 'from-red-600 to-red-900' },
  { id: 'sapphire', name: 'Sapphire', emoji: '♠', price: 500, gradient: 'from-blue-600 to-blue-900' },
  { id: 'emerald', name: 'Emerald', emoji: '♣', price: 800, gradient: 'from-emerald-500 to-emerald-800' },
  { id: 'gold', name: 'Gold', emoji: '★', price: 1500, gradient: 'from-amber-400 to-amber-700' },
  { id: 'cosmic', name: 'Cosmic', emoji: '✦', price: 2000, gradient: 'from-indigo-500 to-purple-800' },
  { id: 'rose', name: 'Rose', emoji: '❀', price: 1000, gradient: 'from-rose-400 to-rose-700' },
  { id: 'ocean', name: 'Ocean', emoji: '≈', price: 1200, gradient: 'from-cyan-400 to-teal-700' },
];

export const CHARACTERS: Character[] = [
  { id: 'alex', name: 'Alex', emoji: '🦊', price: 0, color: '#f97316' },
  { id: 'bella', name: 'Bella', emoji: '🐱', price: 800, color: '#3b82f6' },
  { id: 'rex', name: 'Rex', emoji: '🐶', price: 800, color: '#10b981' },
  { id: 'luna', name: 'Luna', emoji: '🦉', price: 1200, color: '#a855f7' },
  { id: 'pip', name: 'Pip', name2: '', emoji: '🐦', price: 1500, color: '#fcd34d' } as any,
  { id: 'zen', name: 'Zen', emoji: '🐼', price: 2000, color: '#64748b' },
];

export const OUTFITS: Outfit[] = [
  { id: 'default', name: 'Default', characterId: 'alex', emoji: '🦊', price: 0 },
  { id: 'cool', name: 'Cool Fox', characterId: 'alex', emoji: '😎', price: 300 },
  { id: 'party', name: 'Party Fox', characterId: 'alex', emoji: '🎉', price: 500 },
  { id: 'default', name: 'Default', characterId: 'bella', emoji: '🐱', price: 0 },
  { id: 'ninja', name: 'Ninja Cat', characterId: 'bella', emoji: '🥷', price: 400 },
  { id: 'default', name: 'Default', characterId: 'rex', emoji: '🐶', price: 0 },
  { id: 'super', name: 'Super Dog', characterId: 'rex', emoji: '🦸', price: 400 },
  { id: 'default', name: 'Default', characterId: 'luna', emoji: '🦉', price: 0 },
  { id: 'wizard', name: 'Wizard Owl', characterId: 'luna', emoji: '🧙', price: 600 },
  { id: 'default', name: 'Default', characterId: 'pip', emoji: '🐦', price: 0 },
  { id: 'star', name: 'Star Bird', characterId: 'pip', emoji: '⭐', price: 500 },
  { id: 'default', name: 'Default', characterId: 'zen', emoji: '🐼', price: 0 },
  { id: 'samurai', name: 'Samurai Panda', characterId: 'zen', emoji: '⚔️', price: 800 },
];

export const COIN_PACKS = [
  { id: 'small', name: 'Handful', coins: 500, price: '$0.99', color: '#10b981' },
  { id: 'medium', name: 'Pouch', coins: 1500, price: '$2.99', color: '#3b82f6' },
  { id: 'large', name: 'Chest', coins: 5000, price: '$4.99', color: '#f59e0b' },
  { id: 'mega', name: 'Treasure', coins: 15000, price: '$9.99', color: '#a855f7' },
];

export const TOKEN_PACKS = [
  { id: 't1', name: 'Token Pack', tokens: 10, price: 200, color: '#14b8a6' },
  { id: 't2', name: 'Token Bundle', tokens: 30, price: 500, color: '#0d9488' },
  { id: 't3', name: 'Token Hoard', tokens: 100, price: 1500, color: '#0f766e' },
];

export function getCardBack(id: string): CardBack | undefined {
  return CARD_BACKS.find((c) => c.id === id);
}

export function getCharacter(id: string): Character | undefined {
  return CHARACTERS.find((c) => c.id === id);
}

export function getOutfitsForCharacter(charId: string): Outfit[] {
  return OUTFITS.filter((o) => o.characterId === charId);
}
