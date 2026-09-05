import { useState, useRef, useEffect } from 'react';
import type { GameState } from '@/game/types';
import { drawFromStock } from '@/game/engine';
import Pile from './Piles';
import BoostBar from './BoostBar';
import { formatTime } from '@/game/engine';
import { Timer, Move } from 'lucide-react';

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
      timerRef.current = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - gameState.startTime) / 1000));
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameState.isPlaying, gameState.startTime]);

  const handlePileClick = (pileId: string, cardIndex: number) => {
    if (pileId === 'stock') {
      onDraw();
      return;
    }

    if (selected) {
      if (selected.pile === pileId) {
        setSelected(null);
        return;
      }
      onMove(selected.pile, pileId, selected.cardIndex);
      setSelected(null);
    } else {
      setSelected({ pile: pileId, cardIndex });
    }
  };

  const handleFoundationClick = (foundationId: string) => {
    if (selected) {
      onMove(selected.pile, foundationId, selected.cardIndex);
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 max-w-5xl mx-auto">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Timer className="w-4 h-4 text-magical-400" />
            <span className="text-white text-sm font-mono">{formatTime(elapsed)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Move className="w-4 h-4 text-cozy-400" />
            <span className="text-white text-sm font-mono">{gameState.moves}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-between">
        <Pile
          cards={gameState.stock}
          pileId="stock"
          type="stock"
          onCardClick={handlePileClick}
          cardBackId={cardBackId}
        />
        <Pile
          cards={gameState.waste}
          pileId="waste"
          type="waste"
          onCardClick={handlePileClick}
          cardBackId={cardBackId}
          highlightTo={hintTarget?.from === 'waste' ? 'waste' : undefined}
        />
        <div className="flex-1" />
        <div className="flex gap-2">
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
      </div>

      <div className="flex gap-2 sm:gap-3 justify-between pt-2">
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
                : selected?.pile === `tableau-${col}`
                ? `tableau-${col}`
                : undefined
            }
          />
        ))}
      </div>

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
  );
}
