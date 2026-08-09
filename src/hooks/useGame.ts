import { useCallback, useEffect, useMemo, useState } from 'react';
import { GameState, Move, PileId, Card } from '@/game/types';
import {
  newGame, cloneState, applyMove, drawFromStock, findHint,
  canPlaceOn, getMovableSequence, checkWin, autoFinish, elapsedSeconds,
} from '@/game/engine';

export interface BoostState {
  undosLeft: number;
  hintsLeft: number;
}

const FREE_UNDOS = 3;
const FREE_HINTS = 3;

export function useGame() {
  const [state, setState] = useState<GameState>(() => newGame());
  const [history, setHistory] = useState<GameState[]>([]);
  const [boosts, setBoosts] = useState<BoostState>({ undosLeft: FREE_UNDOS, hintsLeft: FREE_HINTS });
  const [selected, setSelected] = useState<{ pile: PileId; index: number } | null>(null);
  const [hint, setHint] = useState<Move | null>(null);
  const [counted, setCounted] = useState(false);

  const record = useCallback((prev: GameState) => {
    setHistory((h) => [...h.slice(-49), prev]);
  }, []);

  const reset = useCallback((next: GameState) => {
    setState(next);
    setHistory([]);
    setSelected(null);
    setHint(null);
    setBoosts({ undosLeft: FREE_UNDOS, hintsLeft: FREE_HINTS });
    setCounted(false);
  }, []);

  const startNewGame = useCallback(() => {
    reset(newGame());
  }, [reset]);

  const doMove = useCallback((move: Move) => {
    setState((prev) => {
      record(prev);
      return applyMove(prev, move);
    });
    setSelected(null);
    setHint(null);
  }, [record]);

  const draw = useCallback(() => {
    setState((prev) => {
      record(prev);
      return drawFromStock(prev);
    });
    setSelected(null);
    setHint(null);
  }, [record]);

  const undo = useCallback((): boolean => {
    if (history.length === 0) return false;
    const hasFree = boosts.undosLeft > 0;
    if (!hasFree) return false;
    setHistory((h) => {
      const last = h[h.length - 1];
      setState(last);
      return h.slice(0, -1);
    });
    setBoosts((b) => ({ ...b, undosLeft: b.undosLeft - 1 }));
    setSelected(null);
    setHint(null);
    return true;
  }, [history, boosts.undosLeft]);

  const requestHint = useCallback((): Move | null => {
    if (boosts.hintsLeft <= 0) return null;
    const move = findHint(state);
    if (!move) return null;
    setBoosts((b) => ({ ...b, hintsLeft: b.hintsLeft - 1 }));
    setHint(move);
    return move;
  }, [state, boosts.hintsLeft]);

  const finish = useCallback(() => {
    setState((prev) => {
      record(prev);
      return autoFinish(prev);
    });
  }, [record]);

  const tryAutoMoveToFoundation = useCallback((card: Card, from: PileId): Move | null => {
    const foundations: PileId[] = ['foundation-0', 'foundation-1', 'foundation-2', 'foundation-3'];
    for (const f of foundations) {
      if (canPlaceOn(card, f, state.piles[f])) {
        return { from, to: f, cards: [card] };
      }
    }
    return null;
  }, [state]);

  const handlePileClick = useCallback((pileId: PileId, cardIndex: number) => {
    setHint(null);
    const pile = state.piles[pileId];
    if (pileId === 'stock') {
      draw();
      return;
    }
    if (selected === null) {
      if (pile.length === 0) return;
      if (cardIndex < 0 || cardIndex >= pile.length) return;
      if (!pile[cardIndex].faceUp) return;
      const seq = getMovableSequence(pile, cardIndex);
      if (!seq) return;
      setSelected({ pile: pileId, index: cardIndex });
      return;
    }
    if (selected.pile === pileId) {
      setSelected(null);
      return;
    }
    const seq = getMovableSequence(state.piles[selected.pile], selected.index);
    if (!seq) {
      setSelected(null);
      return;
    }
    if (canPlaceOn(seq[0], pileId, pile)) {
      doMove({ from: selected.pile, to: pileId, cards: seq });
    } else {
      const auto = tryAutoMoveToFoundation(seq[0], selected.pile);
      if (auto) doMove(auto);
      else setSelected(null);
    }
  }, [state, selected, draw, doMove, tryAutoMoveToFoundation]);

  const handlePileDoubleClick = useCallback((pileId: PileId, cardIndex: number) => {
    const pile = state.piles[pileId];
    if (pile.length === 0 || cardIndex !== pile.length - 1) return;
    const card = pile[cardIndex];
    if (!card.faceUp) return;
    const auto = tryAutoMoveToFoundation(card, pileId);
    if (auto) doMove(auto);
  }, [state, doMove, tryAutoMoveToFoundation]);

  const won = useMemo(() => checkWin(state), [state]);
  const seconds = useMemo(() => elapsedSeconds(state), [state, won]);

  const addBoosts = useCallback((kind: 'undos' | 'hints', amount: number) => {
    setBoosts((b) =>
      kind === 'undos'
        ? { ...b, undosLeft: b.undosLeft + amount }
        : { ...b, hintsLeft: b.hintsLeft + amount }
    );
  }, []);

  return {
    state,
    boosts,
    selected,
    hint,
    won,
    seconds,
    counted,
    setCounted,
    startNewGame,
    draw,
    undo,
    requestHint,
    finish,
    addBoosts,
    handlePileClick,
    handlePileDoubleClick,
  };
}
