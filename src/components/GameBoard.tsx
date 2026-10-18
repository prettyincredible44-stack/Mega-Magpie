import { useState, useRef, useEffect } from 'react';
import type { GameState } from '@/game/types';
import Pile from './Piles';
import BoostBar from './BoostBar';
import { formatTime } from '@/game/engine';
import { canPlaceOnFoundation, canPlaceOnTableau } from '@/game/engine';
import { Timer, Hash } from 'lucide-react';

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
}: GameBoardProps) {
  const [selected, setSelected] = useState<{ pile: string; cardIndex: number } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameState.isPlaying) {
      const id = window.setInterval(
        () => setElapsed(Math.floor((Date.now() - gameState.startTime) / 1000)),
        500
      );
      timerRef.current = id;
      return () => clearInterval(id);
    }
  }, [gameState.isPlaying, gameState.startTime]);

  // When a new game starts, reset selection and timer
  useEffect(() => {
    setSelected(null);
    setElapsed(0);
  }, [gameState.startTime]);

  function tryAutoSendToFoundation(pileId: string, cardIndex: number): boolean {
    const getCard = () => {
      if (pileId === 'waste') return gameState.waste[gameState.waste.length - 1];
      if (pileId.startsWith('tableau-')) {
        const col = parseInt(pileId.split('-')[1], 10);
        const pile = gameState.tableau[col];
        if (pile[cardIndex]?.faceUp) return pile[cardIndex];
        return undefined;
      }
      return undefined;
    };
    const card = getCard();
    if (!card) return false;
    // Only auto-send top card of waste or top card of tableau column
    const isTopCard =
      pileId === 'waste'
        ? cardIndex === gameState.waste.length - 1
        : cardIndex === gameState.tableau[parseInt(pileId.split('-')[1], 10)].length - 1;
    if (!isTopCard) return false;

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

    // If something is already selected, try to move it here
    if (selected) {
      if (selected.pile === pileId) {
        // Same pile — deselect
        setSelected(null);
        return;
      }
      onMove(selected.pile, pileId, selected.cardIndex);
      setSelected(null);
      return;
    }

    // Nothing selected — try auto-send to foundation first (double-click feel via single click when only one valid dest)
    if (tryAutoSendToFoundation(pileId, cardIndex)) return;

    // Otherwise select
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

  const handleFoundationClick = (foundationId: string) => {
    if (!selected) return;
    onMove(selected.pile, foundationId, selected.cardIndex);
    setSelected(null);
  };

  const colWidths = 'grid-cols-7';

  return (
    <div className="flex flex-col gap-2 px-1 pt-2 pb-4 max-w-6xl mx-auto w-full">
      {/* Stats bar */}
      <div className="flex items-center gap-2 px-1">
        <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
          <Timer className="w-3.5 h-3.5 text-magical-400" />
          <span className="text-white text-xs font-mono">{formatTime(elapsed)}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
          <Hash className="w-3.5 h-3.5 text-cozy-400" />
          <span className="text-white text-xs font-mono">{gameState.moves}</span>
        </div>
        {selected && (
          <span className="text-cozy-400 text-xs animate-pulse ml-1">Card selected — tap destination</span>
        )}
      </div>

      {/* Top row: stock / waste / gap / foundations */}
      <div className={`grid ${colWidths} gap-1.5 px-1`}>
        {/* Stock */}
        <div>
          <Pile cards={gameState.stock} pileId="stock" type="stock" onCardClick={handlePileClick} cardBackId={cardBackId} />
        </div>
        {/* Waste */}
        <div>
          <Pile
            cards={gameState.waste}
            pileId="waste"
            type="waste"
            onCardClick={handlePileClick}
            cardBackId={cardBackId}
            highlightTo={hintTarget?.from === 'waste' ? 'waste' : undefined}
            selectedPile={selected?.pile}
            selectedCardIndex={selected?.cardIndex}
          />
        </div>
        {/* Spacer */}
        <div />
        {/* 4 Foundations */}
        {gameState.foundations.map((f, i) => (
          <div key={i} onClick={() => handleFoundationClick(`foundation-${i}`)}>
            <Pile
              cards={f}
              pileId={`foundation-${i}`}
              type="foundation"
              onCardClick={handlePileClick}
              cardBackId={cardBackId}
              highlightTo={hintTarget?.to === `foundation-${i}` ? `foundation-${i}` : undefined}
            />
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className={`grid ${colWidths} gap-1.5 px-1 mt-1`}>
        {gameState.tableau.map((pile, col) => (
          <Pile
            key={col}
            cards={pile}
            pileId={`tableau-${col}`}
            type="tableau"
            onCardClick={handlePileClick}
            cardBackId={cardBackId}
            highlightTo={
              hintTarget?.from === `tableau-${col}` || hintTarget?.to === `tableau-${col}`
                ? `tableau-${col}`
                : undefined
            }
            selectedPile={selected?.pile}
            selectedCardIndex={selected?.cardIndex}
          />
        ))}
      </div>

      {/* Boost bar */}
      <div className="px-1">
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
  );
}
