import type { Card, Suit, Rank, GameState } from './types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function rankValue(rank: Rank): number {
  if (rank === 'A') return 1;
  if (rank === 'J') return 11;
  if (rank === 'Q') return 12;
  if (rank === 'K') return 13;
  return parseInt(rank, 10);
}

function suitColor(suit: Suit): 'red' | 'black' {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
}

function makeDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${rank}-${suit}`,
        suit,
        rank,
        faceUp: false,
        color: suitColor(suit),
        value: rankValue(rank),
      });
    }
  }
  return deck;
}

function shuffle(deck: Card[]): Card[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createNewGame(): GameState {
  const deck = shuffle(makeDeck());
  const tableau: Card[][] = [[], [], [], [], [], [], []];
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[idx++];
      tableau[col].push({ ...card, faceUp: row === col });
    }
  }
  const stock = deck.slice(idx).map((c) => ({ ...c, faceUp: false }));
  return {
    tableau,
    foundations: [[], [], [], []],
    stock,
    waste: [],
    moves: 0,
    startTime: Date.now(),
    elapsed: 0,
    isWon: false,
    isPlaying: true,
    history: [],
    hintsUsed: 0,
    undosUsed: 0,
  };
}

export function canPlaceOnFoundation(card: Card, foundation: Card[]): boolean {
  if (foundation.length === 0) return card.rank === 'A';
  const top = foundation[foundation.length - 1];
  return top.suit === card.suit && card.value === top.value + 1;
}

export function canPlaceOnTableau(card: Card, target: Card[]): boolean {
  if (target.length === 0) return card.rank === 'K';
  const top = target[target.length - 1];
  if (!top.faceUp) return false;
  return top.color !== card.color && top.value === card.value + 1;
}

export function checkWin(state: GameState): boolean {
  return state.foundations.every((f) => f.length === 13);
}

export function drawFromStock(state: GameState): GameState {
  if (state.stock.length === 0) {
    if (state.waste.length === 0) return state;
    return {
      ...state,
      stock: state.waste.slice().reverse().map((c) => ({ ...c, faceUp: false })),
      waste: [],
      moves: state.moves + 1,
      history: [...state.history, snapshot(state)],
    };
  }
  const card = state.stock[state.stock.length - 1];
  return {
    ...state,
    stock: state.stock.slice(0, -1),
    waste: [...state.waste, { ...card, faceUp: true }],
    moves: state.moves + 1,
    history: [...state.history, snapshot(state)],
  };
}

function snapshot(state: GameState) {
  return {
    tableau: state.tableau.map((p) => p.map((c) => ({ ...c }))),
    foundations: state.foundations.map((p) => p.map((c) => ({ ...c }))),
    stock: state.stock.map((c) => ({ ...c })),
    waste: state.waste.map((c) => ({ ...c })),
    moves: state.moves,
  };
}

export function undo(state: GameState): GameState {
  if (state.history.length === 0) return state;
  const last = state.history[state.history.length - 1];
  return {
    ...state,
    tableau: last.tableau,
    foundations: last.foundations,
    stock: last.stock,
    waste: last.waste,
    moves: last.moves,
    history: state.history.slice(0, -1),
    undosUsed: state.undosUsed + 1,
  };
}

export function findHint(state: GameState): { from: string; to: string; cardIndex?: number } | null {
  for (let col = 0; col < 7; col++) {
    const pile = state.tableau[col];
    for (let i = pile.length - 1; i >= 0; i--) {
      const card = pile[i];
      if (!card.faceUp) continue;
      for (let f = 0; f < 4; f++) {
        if (canPlaceOnFoundation(card, state.foundations[f])) {
          return { from: `tableau-${col}`, to: `foundation-${f}`, cardIndex: i };
        }
      }
    }
  }
  if (state.waste.length > 0) {
    const card = state.waste[state.waste.length - 1];
    for (let f = 0; f < 4; f++) {
      if (canPlaceOnFoundation(card, state.foundations[f])) {
        return { from: 'waste', to: `foundation-${f}` };
      }
    }
    for (let col = 0; col < 7; col++) {
      if (canPlaceOnTableau(card, state.tableau[col])) {
        return { from: 'waste', to: `tableau-${col}` };
      }
    }
  }
  for (let col = 0; col < 7; col++) {
    const pile = state.tableau[col];
    for (let i = pile.length - 1; i >= 0; i--) {
      const card = pile[i];
      if (!card.faceUp) continue;
      for (let col2 = 0; col2 < 7; col2++) {
        if (col === col2) continue;
        if (canPlaceOnTableau(card, state.tableau[col2])) {
          return { from: `tableau-${col}`, to: `tableau-${col2}`, cardIndex: i };
        }
      }
    }
  }
  return null;
}

export function autoFinish(state: GameState): GameState {
  let s = { ...state, history: [...state.history, snapshot(state)] };
  let changed = true;
  while (changed) {
    changed = false;
    if (s.waste.length > 0) {
      const card = s.waste[s.waste.length - 1];
      for (let f = 0; f < 4; f++) {
        if (canPlaceOnFoundation(card, s.foundations[f])) {
          s.foundations[f] = [...s.foundations[f], card];
          s.waste = s.waste.slice(0, -1);
          s.moves++;
          changed = true;
          break;
        }
      }
    }
    if (changed) continue;
    for (let col = 0; col < 7; col++) {
      const pile = s.tableau[col];
      if (pile.length === 0) continue;
      const card = pile[pile.length - 1];
      if (!card.faceUp) continue;
      for (let f = 0; f < 4; f++) {
        if (canPlaceOnFoundation(card, s.foundations[f])) {
          s.foundations[f] = [...s.foundations[f], card];
          s.tableau[col] = pile.slice(0, -1);
          if (s.tableau[col].length > 0) {
            s.tableau[col][s.tableau[col].length - 1] = {
              ...s.tableau[col][s.tableau[col].length - 1],
              faceUp: true,
            };
          }
          s.moves++;
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }
  s.isWon = checkWin(s);
  if (s.isWon) s.isPlaying = false;
  return s;
}

export function moveCard(
  state: GameState,
  from: string,
  to: string,
  cardIndex?: number
): GameState {
  const snap = snapshot(state);
  let card: Card | undefined;
  let cardsToMove: Card[] = [];
  let newTableau = state.tableau.map((p) => [...p]);
  let newFoundations = state.foundations.map((p) => [...p]);
  let newWaste = [...state.waste];
  let newStock = [...state.stock];

  if (from === 'waste') {
    card = newWaste[newWaste.length - 1];
    cardsToMove = [card];
    newWaste = newWaste.slice(0, -1);
  } else if (from.startsWith('tableau-')) {
    const col = parseInt(from.split('-')[1], 10);
    const idx = cardIndex !== undefined ? cardIndex : newTableau[col].length - 1;
    cardsToMove = newTableau[col].slice(idx);
    card = cardsToMove[0];
    newTableau[col] = newTableau[col].slice(0, idx);
    if (newTableau[col].length > 0 && !newTableau[col][newTableau[col].length - 1].faceUp) {
      newTableau[col][newTableau[col].length - 1] = {
        ...newTableau[col][newTableau[col].length - 1],
        faceUp: true,
      };
    }
  } else if (from.startsWith('foundation-')) {
    const f = parseInt(from.split('-')[1], 10);
    card = newFoundations[f][newFoundations[f].length - 1];
    cardsToMove = [card];
    newFoundations[f] = newFoundations[f].slice(0, -1);
  }

  if (!card) return state;

  if (to.startsWith('foundation-')) {
    const f = parseInt(to.split('-')[1], 10);
    if (!canPlaceOnFoundation(card, newFoundations[f])) return state;
    newFoundations[f] = [...newFoundations[f], ...cardsToMove];
  } else if (to.startsWith('tableau-')) {
    const col = parseInt(to.split('-')[1], 10);
    if (!canPlaceOnTableau(card, newTableau[col])) return state;
    newTableau[col] = [...newTableau[col], ...cardsToMove];
  } else {
    return state;
  }

  const newState: GameState = {
    ...state,
    tableau: newTableau,
    foundations: newFoundations,
    waste: newWaste,
    stock: newStock,
    moves: state.moves + 1,
    history: [...state.history, snap],
  };

  newState.isWon = checkWin(newState);
  if (newState.isWon) newState.isPlaying = false;

  return newState;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
