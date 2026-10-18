import { Play } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface WinModalProps {
  moves: number;
  timeSeconds: number;
  coinsWon: number;
  xpWon: number;
  onClose: () => void;
  onNewGame: () => void;
}

export default function WinModal({ moves, timeSeconds, coinsWon, xpWon, onClose, onNewGame }: WinModalProps) {
  const m = Math.floor(timeSeconds / 60);
  const s = timeSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-cozy-500/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
        <div className="p-6 text-center">
          <img src="/cute-trophy.webp" alt="Trophy" className="mx-auto mb-4 h-20 w-20 animate-bounce-cozy" />
          <h2 className="mb-1 text-2xl font-bold text-white">You Win!</h2>
          <p className="mb-5 text-slate-400">Great solitaire skills!</p>

          <div className="mb-6 grid grid-cols-4 gap-2">
            <div className="rounded-xl border border-slate-700 bg-slate-700/50 p-2">
              <p className="text-[10px] text-slate-400">Time</p>
              <p className="font-bold text-white text-sm">{m}:{s.toString().padStart(2, '0')}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-700/50 p-2">
              <p className="text-[10px] text-slate-400">Moves</p>
              <p className="font-bold text-white text-sm">{moves}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-700/50 p-2">
              <p className="text-[10px] text-slate-400">Points</p>
              <p className="font-bold text-cozy-400 text-sm">+{coinsWon}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-700/50 p-2">
              <p className="text-[10px] text-slate-400">XP</p>
              <p className="font-bold text-magical-400 text-sm">+{xpWon}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-slate-700 py-3 font-semibold text-white transition hover:bg-slate-600"
            >
              Close
            </button>
            <button
              onClick={() => { sounds.click(); onNewGame(); }}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-cozy-500 py-3 font-bold text-white transition hover:bg-cozy-600"
            >
              <Play className="h-4 w-4" />
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
