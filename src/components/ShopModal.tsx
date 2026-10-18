import { X, Coins, Sparkles, Gift } from 'lucide-react';
import { TOKEN_PACKS } from '@/game/catalog';
import type { PlayerState } from '@/game/types';
import { sounds } from '@/lib/sounds';

interface ShopModalProps {
  state: PlayerState;
  onClose: () => void;
  onBuyTokens: (packId: string) => void;
}

// Points are earned by playing — no real money involved.
// This shop lets players exchange earned points for bonus tokens (hint/undo fuel).
export default function ShopModal({ state, onClose, onBuyTokens }: ShopModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4 animate-fade-in" onClick={onClose}>
      <div className="glass w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 glass flex items-center justify-between rounded-t-2xl border-b border-brand-800/60 p-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-gold-400" />
            <h2 className="text-lg font-bold text-white">Exchange Points</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-felt-600">
            <X className="h-5 w-5 text-white/50" />
          </button>
        </div>

        <div className="p-4">
          {/* Balances */}
          <div className="mb-5 flex gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-brand-800/50 bg-felt-700/60 px-3 py-2.5">
              <Coins className="h-5 w-5 text-cozy-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wide text-white/40">Points</p>
                <p className="font-bold text-white tabular-nums">{state.coins.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-brand-800/50 bg-felt-700/60 px-3 py-2.5">
              <Sparkles className="h-5 w-5 text-brand-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wide text-white/40">Tokens</p>
                <p className="font-bold text-white tabular-nums">{state.tokens}</p>
              </div>
            </div>
          </div>

          <p className="mb-4 text-sm text-white/50">
            Use points you've earned by playing to buy hint and undo tokens.
          </p>

          {/* Token exchange */}
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-400/80">Token Bundles</h3>
          <div className="space-y-2">
            {TOKEN_PACKS.map((pack) => {
              const canAfford = state.coins >= pack.price;
              return (
                <button
                  key={pack.id}
                  disabled={!canAfford}
                  onClick={() => {
                    sounds.coin();
                    onBuyTokens(pack.id);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-3.5 transition active:scale-95 ${
                    canAfford
                      ? 'border-brand-700/40 bg-felt-700/60 hover:border-brand-500/60'
                      : 'border-felt-600/30 bg-felt-800/50 opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/20">
                      <Sparkles className="h-5 w-5 text-brand-300" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-white">{pack.tokens} Tokens</p>
                      <p className="text-xs text-white/40">{pack.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-cozy-500/30 bg-cozy-500/10 px-3 py-1.5">
                    <Coins className="h-3.5 w-3.5 text-cozy-400" />
                    <span className="text-sm font-bold text-cozy-300">{pack.price.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs text-white/30">
            Earn more points by winning games and logging in daily.
          </p>
        </div>
      </div>
    </div>
  );
}
