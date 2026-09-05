import { useState, useCallback, useRef } from 'react';
import type { GameState } from '@/game/types';
import { createNewGame, drawFromStock, moveCard, undo, findHint, autoFinish, checkWin } from '@/game/engine';
import { supabase } from '@/lib/supabase';
import { sounds } from '@/lib/sounds';

export function useGame(userId: string | undefined, onWin?: (seconds: number, moves: number) => void) {
  const [gameState, setGameState] = useState<GameState>(() => createNewGame());
  const [hintTarget, setHintTarget] = useState<{ from: string; to: string; cardIndex?: number } | null>(null);
  const winHandled = useRef(false);

  const newGame = useCallback(() => {
    setGameState(createNewGame());
    setHintTarget(null);
    winHandled.current = false;
  }, []);

  const handleDraw = useCallback(() => {
    setGameState((prev) => {
      const next = drawFromStock(prev);
      if (next !== prev) sounds.cardFlip();
      return next;
    });
  }, []);

  const handleMove = useCallback((from: string, to: string, cardIndex?: number) => {
    setGameState((prev) => {
      const next = moveCard(prev, from, to, cardIndex);
      if (next !== prev) sounds.cardPlace();
      return next;
    });
    setHintTarget(null);
  }, []);

  const handleUndo = useCallback(() => {
    setGameState((prev) => undo(prev));
    setHintTarget(null);
  }, []);

  const handleHint = useCallback(() => {
    const hint = findHint(gameState);
    if (hint) {
      setHintTarget(hint);
      setGameState((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
      setTimeout(() => setHintTarget(null), 3000);
    } else {
      sounds.error();
    }
  }, [gameState]);

  const handleAutoFinish = useCallback(() => {
    setGameState((prev) => {
      const next = autoFinish(prev);
      if (next.isWon) sounds.win();
      return next;
    });
  }, []);

  const recordWin = useCallback(
    async (seconds: number, moves: number) => {
      if (!userId) return;
      const { data } = await supabase.rpc('record_win', {
        p_seconds: seconds,
        p_moves: moves,
      });
      if (data) {
        if (onWin) onWin(seconds, moves);
      }
    },
    [userId, onWin]
  );

  // Check win
  if (gameState.isWon && !winHandled.current) {
    winHandled.current = true;
    const seconds = Math.floor((Date.now() - gameState.startTime) / 1000);
    sounds.win();
    if (userId) recordWin(seconds, gameState.moves);
  }

  return {
    gameState,
    hintTarget,
    newGame,
    handleDraw,
    handleMove,
    handleUndo,
    handleHint,
    handleAutoFinish,
  };
}
