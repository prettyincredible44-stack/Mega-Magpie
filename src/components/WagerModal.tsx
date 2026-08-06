import { useState } from 'react';
import { X, Coins, Zap, TrendingUp, Check } from 'lucide-react';
import { WAGER_TIERS } from '@/game/levels';
import { CASHBACK_RATE } from '@/game/catalog';

interface WagerModalProps {
  open: boolean;
  coins: number;
  currentWager: number;
  onClose: () => void;
  onSetWager: (coins: number) => void;
}

export function WagerModal({ open, coins, currentWager, onClose, onSetWager }: WagerModalProps) {
  const [selected, setSelected] = useState<number>(currentWager);
  if (!open) return null;

  const selectedTier = WAGER_TIERS.find((t) => t.coins === selected) ?? WAGER_TIERS[0];
  const cashback = selected > 0 ? Math.ceil(selected * CASHBACK_RATE) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl animate-win-pop overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-coral-300 via-coral-500 to-coral-300" style={{ background: 'linear-gradient(90deg, #ff7eb6, #ff5a7e, #ff7eb6)' }} />
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-cyan-300/80 hover:text-cyan-200 hover:bg-cyan-800/40 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #ff7eb6, #ff5a7e)' }}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-50">Stake Your Coins</h2>
              <p className="text-sm text-cyan-300/80">Stake coins for bigger rewards</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-400/20 w-fit">
            <Coins className="w-4 h-4 text-amber-300" />
            <span className="text-xs text-amber-200/80">Balance</span>
            <span className="font-bold text-amber-200 tabular-nums">{coins.toLocaleString()}</span>
          </div>

          <div className="space-y-2 mb-4">
            {WAGER_TIERS.map((tier) => {
              const canAfford = tier.coins === 0 || coins >= tier.coins;
              const isSelected = selected === tier.coins;
              return (
                <button
                  key={tier.coins}
                  onClick={() => canAfford && setSelected(tier.coins)}
                  disabled={!canAfford}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400/60 ring-1 ring-cyan-400/40'
                      : canAfford
                        ? 'bg-teal-800/40 border-teal-700/40 hover:bg-teal-800/60'
                        : 'bg-teal-950/40 border-teal-800/40 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-teal-600'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-teal-950" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-teal-50 text-sm">{tier.label}</div>
                    <div className="text-xs text-cyan-300/70">
                      {tier.coins === 0 ? 'No stake, standard reward' : `Stake ${tier.coins} coins`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-cyan-200 tabular-nums">{tier.multiplier}x</div>
                    <div className="text-[10px] text-teal-400/60">reward</div>
                  </div>
                </button>
              );
            })}
          </div>

          {selected > 0 && (
            <div className="p-3 rounded-xl bg-teal-800/30 border border-teal-700/40 mb-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-teal-300/80">Stake</span>
                <span className="font-bold text-amber-300 tabular-nums">{selected} coins</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-teal-300/80">Reward multiplier</span>
                <span className="font-bold text-cyan-200">{selectedTier.multiplier}x</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-teal-300/80">Win payout</span>
                <span className="font-bold text-teal-300 tabular-nums">+{selected * selectedTier.multiplier} coins</span>
              </div>
              {cashback > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-300/80">Token cashback</span>
                  <span className="flex items-center gap-0.5 font-bold text-cyan-300">
                    <Zap className="w-3 h-3" />+{cashback}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-teal-700/30">
                <span className="text-rose-300/80">If you lose</span>
                <span className="font-bold text-rose-400 tabular-nums">-{selected} coins</span>
              </div>
            </div>
          )}

          <button
            onClick={() => { onSetWager(selected); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-teal-950 font-bold transition-all shadow-lg"
          >
            <Check className="w-5 h-5" />
            {selected === 0 ? 'Play Safe' : `Stake ${selected} Coins`}
          </button>
          <p className="mt-3 text-center text-[10px] text-teal-400/50">
            Stake is deducted when you start a new game. Win to earn {selectedTier.multiplier}x your stake back.
          </p>
        </div>
      </div>
    </div>
  );
}
