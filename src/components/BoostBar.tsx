import { Lightbulb, Undo2, Zap, RefreshCw } from 'lucide-react';
import type { GameState } from '@/game/types';

interface BoostBarProps {
  onHint: () => void;
  onUndo: () => void;
  onAutoFinish: () => void;
  onNewGame: () => void;
  gameState: GameState;
  hintCost: number;
  undoCost: number;
}

export default function BoostBar({ onHint, onUndo, onAutoFinish, onNewGame, gameState, hintCost, undoCost }: BoostBarProps) {
  const btn = 'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition active:scale-95';

  return (
    <div className="flex gap-2 rounded-2xl border border-brand-700/30 bg-felt-700/50 p-2 backdrop-blur-sm">
      <button
        onClick={onHint}
        className={`${btn} border border-gold-500/30 bg-gold-500/10 text-gold-300 hover:bg-gold-500/20`}
      >
        <Lightbulb className="w-4 h-4" />
        <span>Hint</span>
        <span className="text-gold-500/70 text-xs">·{hintCost}</span>
      </button>

      <button
        onClick={onUndo}
        disabled={gameState.history.length === 0}
        className={`${btn} border border-brand-600/30 bg-brand-600/10 text-brand-300 hover:bg-brand-600/20 disabled:opacity-35`}
      >
        <Undo2 className="w-4 h-4" />
        <span>Undo</span>
        <span className="text-brand-500/70 text-xs">·{undoCost}</span>
      </button>

      <button
        onClick={onAutoFinish}
        className={`${btn} border border-magical-600/30 bg-magical-600/10 text-magical-300 hover:bg-magical-600/20`}
      >
        <Zap className="w-4 h-4" />
        <span>Auto</span>
      </button>

      <button
        onClick={onNewGame}
        className={`${btn} border border-white/10 bg-white/5 text-white/70 hover:bg-white/10`}
      >
        <RefreshCw className="w-4 h-4" />
        <span>New</span>
      </button>
    </div>
  );
}
