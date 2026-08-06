export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7'
  | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export type PileId =
  | 'stock'
  | 'waste'
  | 'foundation-0' | 'foundation-1' | 'foundation-2' | 'foundation-3'
  | 'tableau-0' | 'tableau-1' | 'tableau-2' | 'tableau-3'
  | 'tableau-4' | 'tableau-5' | 'tableau-6';

export interface GameState {
  piles: Record<PileId, Card[]>;
  moves: number;
  startedAt: number;
  drawCount: 1 | 3;
  won: boolean;
  seed: number;
}

export interface Move {
  from: PileId;
  to: PileId;
  cards: Card[];
}

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const RANK_VALUE: Record<Rank, number> = {
  A: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, '10': 10, J: 11, Q: 12, K: 13,
};

export const isRed = (suit: Suit) => suit === 'hearts' || suit === 'diamonds';

export const isOppositeColor = (a: Suit, b: Suit) => isRed(a) !== isRed(b);

export const cardLabel = (card: Card) => `${card.rank}${card.suit[0].toUpperCase()}`;
