import {
  Card, GameState, PileId, Move, Suit, Rank,
  SUITS, RANKS, RANK_VALUE, isOppositeColor,
} from './types';

let idCounter = 0;
const nextId = () => `c${idCounter++}`;

export function createDeck(seed: number): Card[] {
  const cards: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ id: nextId(), suit, rank, faceUp: false });
    }
  }
  return shuffle(cards, seed);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(cards: Card[], seed: number): Card[] {
  const rng = mulberry32(seed);
  const out = [...cards];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const TABLEAU_IDS: PileId[] = [
  'tableau-0', 'tableau-1', 'tableau-2', 'tableau-3',
  'tableau-4', 'tableau-5', 'tableau-6',
];
const FOUNDATION_IDS: PileId[] = [
  'foundation-0', 'foundation-1', 'foundation-2', 'foundation-3',
];
const ALL_PILES: PileId[] = ['stock', 'waste', ...FOUNDATION_IDS, ...TABLEAU_IDS];

export function emptyPiles(): Record<PileId, Card[]> {
  const piles = {} as Record<PileId, Card[]>;
  for (const id of ALL_PILES) piles[id] = [];
  return piles;
}

export function newGame(seed?: number): GameState {
  idCounter = 0;
  const s = seed ?? Math.floor(Math.random() * 1e9);
  const deck = createDeck(s);
  const piles = emptyPiles();
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[idx++];
      card.faceUp = row === col;
      piles[TABLEAU_IDS[col]].push(card);
    }
  }
  while (idx < deck.length) {
    piles.stock.push(deck[idx++]);
  }
  return {
    piles,
    moves: 0,
    startedAt: Date.now(),
    drawCount: 1,
    won: false,
    seed: s,
  };
}

export function cloneState(state: GameState): GameState {
  const piles = emptyPiles();
  for (const id of ALL_PILES) {
    piles[id] = state.piles[id].map((c) => ({ ...c }));
  }
  return { ...state, piles };
}

export function canPlaceOnTableau(card: Card, target: Card[]): boolean {
  if (target.length === 0) return card.rank === 'K';
  const top = target[target.length - 1];
  if (!top.faceUp) return false;
  return isOppositeColor(card.suit, top.suit) && RANK_VALUE[card.rank] === RANK_VALUE[top.rank] - 1;
}

export function canPlaceOnFoundation(card: Card, target: Card[]): boolean {
  if (target.length === 0) return card.rank === 'A';
  const top = target[target.length - 1];
  return card.suit === top.suit && RANK_VALUE[card.rank] === RANK_VALUE[top.rank] + 1;
}

export function canPlaceOn(card: Card, pileId: PileId, target: Card[]): boolean {
  if (pileId.startsWith('foundation')) return canPlaceOnFoundation(card, target);
  if (pileId.startsWith('tableau')) return canPlaceOnTableau(card, target);
  return false;
}

export function getMovableSequence(pile: Card[], fromIndex: number): Card[] | null {
  if (fromIndex < 0 || fromIndex >= pile.length) return null;
  if (!pile[fromIndex].faceUp) return null;
  const seq = pile.slice(fromIndex);
  for (let i = 1; i < seq.length; i++) {
    const prev = seq[i - 1];
    const cur = seq[i];
    if (!isOppositeColor(prev.suit, cur.suit)) return null;
    if (RANK_VALUE[prev.rank] !== RANK_VALUE[cur.rank] + 1) return null;
  }
  return seq;
}

export function drawFromStock(state: GameState): GameState {
  const next = cloneState(state);
  const stock = next.piles.stock;
  const waste = next.piles.waste;
  if (stock.length === 0) {
    if (waste.length === 0) return state;
    const recycled = waste.slice().reverse().map((c) => ({ ...c, faceUp: false }));
    next.piles.stock = recycled;
    next.piles.waste = [];
  } else {
    const count = next.drawCount;
    const drawn = stock.splice(stock.length - count, count).map((c) => ({ ...c, faceUp: true }));
    next.piles.waste.push(...drawn);
  }
  next.moves += 1;
  return next;
}

export function applyMove(state: GameState, move: Move): GameState {
  const next = cloneState(state);
  const fromPile = next.piles[move.from];
  const toPile = next.piles[move.to];
  const removed = fromPile.splice(fromPile.length - move.cards.length, move.cards.length);
  toPile.push(...removed);
  if (fromPile.length > 0 && !fromPile[fromPile.length - 1].faceUp) {
    fromPile[fromPile.length - 1].faceUp = true;
  }
  next.moves += 1;
  next.won = checkWin(next);
  return next;
}

export function checkWin(state: GameState): boolean {
  return FOUNDATION_IDS.every((id) => state.piles[id].length === 13);
}

export function findValidMoves(state: GameState): Move[] {
  const moves: Move[] = [];
  const allIds = Object.keys(state.piles) as PileId[];
  for (const from of allIds) {
    const pile = state.piles[from];
    if (pile.length === 0) continue;
    if (from === 'stock') continue;
    for (let i = 0; i < pile.length; i++) {
      if (!pile[i].faceUp) continue;
      const seq = getMovableSequence(pile, i);
      if (!seq) continue;
      for (const to of allIds) {
        if (to === from) continue;
        if (to === 'stock' || to === 'waste') continue;
        if (to.startsWith('foundation') && seq.length > 1) continue;
        if (canPlaceOn(seq[0], to, state.piles[to])) {
          moves.push({ from, to, cards: seq });
        }
      }
    }
  }
  return moves;
}

export function findHint(state: GameState): Move | null {
  const moves = findValidMoves(state);
  const priority = (m: Move) => {
    let score = 0;
    if (m.to.startsWith('foundation')) score += 10;
    if (m.from === 'waste') score += 5;
    if (m.from.startsWith('tableau') && m.cards.length > 1) score += 3;
    return -score;
  };
  moves.sort((a, b) => priority(a) - priority(b));
  return moves[0] ?? null;
}

export function autoFinish(state: GameState): GameState {
  let next = cloneState(state);
  let progressed = true;
  while (progressed && !next.won) {
    progressed = false;
    for (const from of ['waste', ...TABLEAU_IDS] as PileId[]) {
      const pile = next.piles[from];
      if (pile.length === 0) continue;
      const top = pile[pile.length - 1];
      if (!top.faceUp) continue;
      for (const f of FOUNDATION_IDS) {
        if (canPlaceOnFoundation(top, next.piles[f])) {
          next = applyMove(next, { from, to: f, cards: [top] });
          progressed = true;
          break;
        }
      }
      if (progressed) break;
    }
  }
  return next;
}

export function getTopCard(state: GameState, pileId: PileId): Card | null {
  const pile = state.piles[pileId];
  return pile.length > 0 ? pile[pile.length - 1] : null;
}

export function elapsedSeconds(state: GameState): number {
  return Math.floor((Date.now() - state.startedAt) / 1000);
}
