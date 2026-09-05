import { X, Play } from 'lucide-react';
import { useState } from 'react';
import { sounds } from '@/lib/sounds';

interface WinModalProps {
  moves: number;
  timeSeconds: number;
  coinsWon: number;
  onClose: () => void;
  onNewGame: () => void;
}

export default function WinModal({ moves, timeSeconds, coinsWon, onClose, onNewGame }: WinModalProps) {
  const m = Math.floor(timeSeconds / 60);
  const s = timeSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl w-full max-w-sm border border-cozy-500/30 shadow-2xl">
        <div className="p-6 text-center">
          <img src="/cute-trophy.webp" alt="Trophy" className="w-20 h-20 mx-auto mb-4 animate-bounce-cozy" />
          <h2 className="text-2xl font-bold text-white mb-2">You Win!</h2>
          <p className="text-slate-300 mb-4">Great solitaire skills!</p>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-700">
              <p className="text-slate-400 text-xs">Time</p>
              <p className="text-white font-bold">{m}:{s.toString().padStart(2, '0')}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-700">
              <p className="text-slate-400 text-xs">Moves</p>
              <p className="text-white font-bold">{moves}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-700">
              <p className="text-slate-400 text-xs">Coins</p>
              <p className="text-cozy-400 font-bold">+{coinsWon}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                sounds.click();
                onNewGame();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-cozy-500 hover:bg-cozy-600 text-white rounded-lg font-bold transition"
            >
              <Play className="w-4 h-4" />
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
