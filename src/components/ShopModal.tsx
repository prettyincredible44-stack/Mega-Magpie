import { X, Coins, Sparkles } from 'lucide-react';
import { COIN_PACKS, TOKEN_PACKS } from '@/game/catalog';
import type { PlayerState } from '@/game/types';
import { sounds } from '@/lib/sounds';

interface ShopModalProps {
  state: PlayerState;
  onClose: () => void;
  onBuyCoins: (packId: string) => void;
  onBuyTokens: (packId: string) => void;
}

export default function ShopModal({ state, onClose, onBuyCoins, onBuyTokens }: ShopModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Shop</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-700">
              <Coins className="w-5 h-5 text-cozy-400" />
              <span className="text-white font-bold">{state.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-700">
              <Sparkles className="w-5 h-5 text-magical-400" />
              <span className="text-white font-bold">{state.tokens}</span>
            </div>
          </div>

          <h3 className="text-white font-semibold mb-3">Coin Packs</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {COIN_PACKS.map((pack) => (
              <button
                key={pack.id}
                onClick={() => {
                  sounds.coin();
                  onBuyCoins(pack.id);
                }}
                className="p-4 rounded-xl border border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700 transition flex flex-col items-center gap-2"
              >
                <Coins className="w-8 h-8" style={{ color: pack.color }} />
                <span className="text-white font-bold">{pack.coins.toLocaleString()}</span>
                <span className="text-slate-300 text-sm">{pack.name}</span>
                <span className="text-cozy-400 font-semibold text-sm">{pack.price}</span>
              </button>
            ))}
          </div>

          <h3 className="text-white font-semibold mb-3">Token Packs</h3>
          <div className="grid grid-cols-3 gap-3">
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
                  className="p-3 rounded-xl border border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700 transition flex flex-col items-center gap-1 disabled:opacity-40"
                >
                  <Sparkles className="w-6 h-6" style={{ color: pack.color }} />
                  <span className="text-white font-bold">{pack.tokens}</span>
                  <span className="text-slate-300 text-xs">{pack.name}</span>
                  <span className="text-cozy-400 text-xs">{pack.price}c</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
