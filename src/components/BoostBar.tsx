import { Lightbulb, Undo, Zap, RotateCcw } from 'lucide-react';
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
  return (
    <div className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-800/50 rounded-xl border border-slate-700">
      <button
        onClick={onHint}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 transition group"
      >
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <span className="text-amber-200 text-sm font-semibold">Hint</span>
        <span className="text-amber-400/60 text-xs">{hintCost}c</span>
      </button>
      <button
        onClick={onUndo}
        disabled={gameState.history.length === 0}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 transition disabled:opacity-40"
      >
        <Undo className="w-4 h-4 text-blue-400" />
        <span className="text-blue-200 text-sm font-semibold">Undo</span>
        <span className="text-blue-400/60 text-xs">{undoCost}c</span>
      </button>
      <button
        onClick={onAutoFinish}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-magical-500/20 hover:bg-magical-500/30 border border-magical-500/40 transition"
      >
        <Zap className="w-4 h-4 text-magical-400" />
        <span className="text-magical-200 text-sm font-semibold">Auto</span>
      </button>
      <button
        onClick={onNewGame}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 transition"
      >
        <RotateCcw className="w-4 h-4 text-slate-300" />
        <span className="text-slate-200 text-sm font-semibold">New</span>
      </button>
    </div>
  );
}
