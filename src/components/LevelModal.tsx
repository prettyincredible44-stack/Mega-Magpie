import { X } from 'lucide-react';
import { LEVELS } from '@/game/levels';
import type { PlayerState } from '@/game/types';

interface LevelModalProps {
  state: PlayerState;
  onClose: () => void;
}

export default function LevelModal({ state, onClose }: LevelModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={onClose}>
      <div className="glass w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 glass flex items-center justify-between p-4 border-b border-brand-800/60 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Levels</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-felt-600">
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {LEVELS.map((lvl) => {
            const isCurrent = lvl.level === state.level;
            const isPast = lvl.level < state.level;
            return (
              <div
                key={lvl.level}
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                  isCurrent
                    ? 'bg-felt-700/60 border-brand-500/50 ring-1 ring-brand-500/30'
                    : isPast
                    ? 'bg-felt-700/30 border-brand-800/40'
                    : 'bg-felt-800/50 border-felt-600/30 opacity-60'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                  style={{ background: isPast || isCurrent ? lvl.color : '#1e3a38' }}
                >
                  {lvl.level}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{lvl.name}</p>
                  <p className="text-white/40 text-xs">{lvl.xpRequired} XP required</p>
                </div>
                {isCurrent && <span className="text-brand-400 text-xs font-bold">CURRENT</span>}
                {isPast && <span className="text-green-400 text-xs">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
