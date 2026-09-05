import { X, Coins } from 'lucide-react';
import { WAGER_OPTIONS } from '@/game/types';
import type { PlayerState } from '@/game/types';
import { sounds } from '@/lib/sounds';

interface WagerModalProps {
  state: PlayerState;
  onClose: () => void;
  onSetWager: (wager: number) => void;
}

export default function WagerModal({ state, onClose, onSetWager }: WagerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Choose Your Stake</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-cozy-400" />
            <span className="text-white font-bold">{state.coins.toLocaleString()} coins</span>
          </div>

          <div className="space-y-2">
            {WAGER_OPTIONS.map((opt) => {
              const canAfford = state.coins >= opt.value;
              const isActive = state.current_wager === opt.value;
              return (
                <button
                  key={opt.value}
                  disabled={!canAfford && opt.value > 0}
                  onClick={() => {
                    sounds.click();
                    onSetWager(opt.value);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                    isActive
                      ? 'border-cozy-500 bg-cozy-500/10'
                      : canAfford || opt.value === 0
                      ? 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      : 'border-slate-700 bg-slate-800/50 opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: opt.color + '30' }}>
                      <span className="font-bold text-sm" style={{ color: opt.color }}>{opt.multiplier > 0 ? `${opt.multiplier}x` : '0'}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">{opt.label}</p>
                      <p className="text-slate-400 text-xs">{opt.value > 0 ? `${opt.value} coins stake` : 'No stake, no risk'}</p>
                    </div>
                  </div>
                  {isActive && <span className="text-cozy-400 text-xs font-bold">ACTIVE</span>}
                </button>
              );
            })}
          </div>

          <p className="text-slate-400 text-xs text-center mt-4">
            Win the game to collect your multiplied reward. Lose and forfeit your stake.
          </p>
        </div>
      </div>
    </div>
  );
}
