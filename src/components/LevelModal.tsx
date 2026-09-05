import { X } from 'lucide-react';
import { LEVELS } from '@/game/levels';
import type { PlayerState } from '@/game/types';

interface LevelModalProps {
  state: PlayerState;
  onClose: () => void;
}

export default function LevelModal({ state, onClose }: LevelModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Levels</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
            <X className="w-5 h-5 text-slate-400" />
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
                    ? 'bg-slate-700 border-cozy-500/50 ring-1 ring-cozy-500/30'
                    : isPast
                    ? 'bg-slate-700/30 border-slate-700'
                    : 'bg-slate-800/50 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                  style={{ background: isPast || isCurrent ? lvl.color : '#334155' }}
                >
                  {lvl.level}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{lvl.name}</p>
                  <p className="text-slate-400 text-xs">{lvl.xpRequired} XP required</p>
                </div>
                {isCurrent && <span className="text-cozy-400 text-xs font-bold">CURRENT</span>}
                {isPast && <span className="text-emerald-400 text-xs">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
