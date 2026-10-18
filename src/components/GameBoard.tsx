import { useState, useRef, useEffect } from 'react';
import type { GameState } from '@/game/types';
import Pile from './Piles';
import BoostBar from './BoostBar';
import { formatTime, canPlaceOnFoundation } from '@/game/engine';
import { Timer, Hash, Zap, Trophy } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  onDraw: () => void;
  onMove: (from: string, to: string, cardIndex?: number) => void;
  onHint: () => void;
  onUndo: () => void;
  onAutoFinish: () => void;
  onNewGame: () => void;
  hintTarget: { from: string; to: string; cardIndex?: number } | null;
  cardBackId: string;
  hintCost: number;
  undoCost: number;
  blitzActive?: boolean;
  blitzTimeLeft?: number;
  blitzGamesCleared?: number;
}

export default function GameBoard({
  gameState,
  onDraw,
  onMove,
  onHint,
  onUndo,
  onAutoFinish,
  onNewGame,
  hintTarget,
  cardBackId,
  hintCost,
  undoCost,
  blitzActive = false,
  blitzTimeLeft = 0,
  blitzGamesCleared = 0,
}: GameBoardProps) {
  const [selected, setSelected] = useState<{ pile: string; cardIndex: number } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!gameState.isPlaying) return;
    const id = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - gameState.startTime) / 1000)),
      500,
    );
    timerRef.current = id;
    return () => clearInterval(id);
  }, [gameState.isPlaying, gameState.startTime]);

  useEffect(() => {
    setSelected(null);
    setElapsed(0);
  }, [gameState.startTime]);

  /** Try sending the top card of a pile directly to a foundation. Returns true on success. */
  function tryAutoFoundation(pileId: string, cardIndex: number): boolean {
    let card = undefined;
    if (pileId === 'waste') {
      card = gameState.waste[gameState.waste.length - 1];
      if (cardIndex !== gameState.waste.length - 1) return false;
    } else if (pileId.startsWith('tableau-')) {
      const col = parseInt(pileId.split('-')[1], 10);
      const pile = gameState.tableau[col];
      if (cardIndex !== pile.length - 1) return false;
      card = pile[cardIndex];
    }
    if (!card?.faceUp) return false;
    for (let f = 0; f < 4; f++) {
      if (canPlaceOnFoundation(card, gameState.foundations[f])) {
        onMove(pileId, `foundation-${f}`, cardIndex);
        return true;
      }
    }
    return false;
  }

  const handlePileClick = (pileId: string, cardIndex: number) => {
    if (pileId === 'stock') {
      onDraw();
      setSelected(null);
      return;
    }

    if (selected) {
      if (selected.pile === pileId) {
        setSelected(null);
        return;
      }
      onMove(selected.pile, pileId, selected.cardIndex);
      setSelected(null);
      return;
    }

    // Auto-send to foundation on single tap if that's the only valid move
    if (tryAutoFoundation(pileId, cardIndex)) return;

    // Select the card
    const card = (() => {
      if (pileId === 'waste') return gameState.waste[gameState.waste.length - 1];
      if (pileId.startsWith('tableau-')) {
        const col = parseInt(pileId.split('-')[1], 10);
        return gameState.tableau[col][cardIndex];
      }
      return undefined;
    })();
    if (!card?.faceUp) return;
    setSelected({ pile: pileId, cardIndex });
  };

  const handleFoundationClick = (fId: string) => {
    if (!selected) return;
    onMove(selected.pile, fId, selected.cardIndex);
    setSelected(null);
  };

  const hintFrom = hintTarget?.from;
  const hintTo   = hintTarget?.to;

  return (
    <div
      className="felt-surface min-h-screen w-full"
      style={{ '--board-pad': '12px' } as React.CSSProperties}
    >
      <div className="mx-auto max-w-3xl w-full px-[var(--board-pad,12px)] pt-3 pb-6 flex flex-col gap-2">

        {/* Blitz mode bar */}
        {blitzActive && (
          <div className="flex items-center justify-between rounded-xl border border-magical-600/50 bg-gradient-to-r from-magical-900/80 to-brand-900/80 px-4 py-2.5 animate-fade-in">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-magical-400 animate-pulse" />
              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-gold-400" />
                <span className="text-sm font-bold text-gold-300 tabular-nums">{blitzGamesCleared}</span>
                <span className="text-xs text-white/50">cleared</span>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 ${blitzTimeLeft <= 30 ? 'text-red-400' : 'text-white'}`}>
              <Timer className="h-5 w-5" />
              <span className="text-lg font-bold tabular-nums">{formatTime(blitzTimeLeft)}</span>
            </div>
          </div>
        )}

        {/* Stats bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-brand-700/50 bg-felt-700/60 px-2.5 py-1.5">
            <Timer className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-white/90 text-xs font-mono tabular-nums">{formatTime(elapsed)}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-brand-700/50 bg-felt-700/60 px-2.5 py-1.5">
            <Hash className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-white/90 text-xs font-mono tabular-nums">{gameState.moves}</span>
          </div>
          {selected && (
            <span className="text-brand-300 text-xs animate-pulse ml-auto pr-1">Tap destination ↓</span>
          )}
        </div>

        {/* Top row: stock | waste | spacer | foundation×4 */}
        <div className="grid grid-cols-7 gap-[var(--board-gap,6px)]" style={{ '--board-gap': '6px' } as React.CSSProperties}>
          <Pile cards={gameState.stock} pileId="stock" type="stock"
            onCardClick={handlePileClick} cardBackId={cardBackId} />

          <Pile cards={gameState.waste} pileId="waste" type="waste"
            onCardClick={handlePileClick} cardBackId={cardBackId}
            highlightTo={hintFrom === 'waste' ? 'waste' : undefined}
            selectedPile={selected?.pile}
            selectedCardIndex={selected?.cardIndex} />

          {/* Gap */}
          <div />

          {gameState.foundations.map((f, i) => (
            <div key={i} onClick={() => handleFoundationClick(`foundation-${i}`)}>
              <Pile cards={f} pileId={`foundation-${i}`} type="foundation"
                onCardClick={handlePileClick} cardBackId={cardBackId}
                highlightTo={hintTo === `foundation-${i}` ? `foundation-${i}` : undefined} />
            </div>
          ))}
        </div>

        {/* Tableau */}
        <div className="grid grid-cols-7 gap-[6px] mt-1">
          {gameState.tableau.map((pile, col) => {
            const pid = `tableau-${col}`;
            const hl = hintFrom === pid || hintTo === pid ? pid : undefined;
            return (
              <Pile
                key={col}
                cards={pile}
                pileId={pid}
                type="tableau"
                onCardClick={handlePileClick}
                cardBackId={cardBackId}
                highlightTo={hl}
                selectedPile={selected?.pile}
                selectedCardIndex={selected?.cardIndex}
              />
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-2">
          <BoostBar
            onHint={onHint}
            onUndo={onUndo}
            onAutoFinish={onAutoFinish}
            onNewGame={onNewGame}
            gameState={gameState}
            hintCost={hintCost}
            undoCost={undoCost}
          />
        </div>
      </div>
    </div>
  );
}
