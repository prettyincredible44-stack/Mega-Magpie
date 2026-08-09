import { useState } from 'react';
import { X, Coins, Check, Sparkles, Lock, Zap, Undo2, Lightbulb, Gift } from 'lucide-react';

export interface CoinPack {
  id: string;
  coins: number;
  price: number;
  bonus: string;
  popular?: boolean;
}

const COIN_PACKS: CoinPack[] = [
  { id: 'starter', coins: 500, price: 0.99, bonus: '' },
  { id: 'popular', coins: 1200, price: 1.99, bonus: '+20%', popular: true },
  { id: 'best', coins: 3000, price: 3.99, bonus: '+50%' },
];

const SMALL_PURCHASES = [
  { id: 'undo_pack', icon: Undo2, label: '+5 Undos', cost: 25, desc: 'Get 5 extra undos', color: 'text-teal-300' },
  { id: 'hint_pack', icon: Lightbulb, label: '+5 Hints', cost: 25, desc: 'Get 5 extra hints', color: 'text-cyan-300' },
  { id: 'token_small', icon: Zap, label: '50 Tokens', cost: 40, desc: 'Boost your token balance', color: 'text-cyan-300' },
  { id: 'token_large', icon: Zap, label: '150 Tokens', cost: 100, desc: 'Best value for tokens', color: 'text-cyan-300' },
  { id: 'lucky_bundle', icon: Gift, label: '5 Lucky Picks', cost: 100, desc: '5 plays of Lucky Pick (100 coins value)', color: 'text-pink-300' },
];

interface ShopModalProps {
  open: boolean;
  coins: number;
  onClose: () => void;
  onBuySmall?: (id: string, cost: number) => void;
}

export function ShopModal({ open, coins, onClose, onBuySmall }: ShopModalProps) {
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [bought, setBought] = useState<string | null>(null);
  if (!open) return null;

  const handleBuy = (pack: CoinPack) => {
    setPurchasing(pack.id);
    setTimeout(() => setPurchasing(null), 1200);
  };

  const handleSmallBuy = (id: string, cost: number) => {
    if (coins < cost) return;
    setPurchasing(id);
    setTimeout(() => {
      setPurchasing(null);
      setBought(id);
      onBuySmall?.(id, cost);
      setTimeout(() => setBought(null), 1500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl animate-win-pop overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-cyan-300/80 hover:text-cyan-200 hover:bg-teal-800/50 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-7 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-lg">
              <Coins className="w-6 h-6 text-teal-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-50">Shop</h2>
              <p className="text-sm text-cyan-300/80">Boosts, tokens, and coin packs</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 mb-5 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-400/20 w-fit">
            <span className="text-xs text-amber-300/80">Your balance</span>
            <span className="font-bold text-amber-200 tabular-nums">{coins.toLocaleString()}</span>
            <Coins className="w-3.5 h-3.5 text-amber-300" />
          </div>

          {/* Small purchases with coins */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-cyan-200 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              Buy with Coins
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {SMALL_PURCHASES.map((item) => {
                const Icon = item.icon;
                const canAfford = coins >= item.cost;
                const isPurchasing = purchasing === item.id;
                const isBought = bought === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSmallBuy(item.id, item.cost)}
                    disabled={!canAfford || isPurchasing}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      isBought
                        ? 'bg-emerald-500/20 border-emerald-400/50'
                        : canAfford
                          ? 'bg-teal-800/40 border-teal-700/40 hover:bg-teal-800/60'
                          : 'bg-teal-950/40 border-teal-800/40 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-teal-900/60 flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-teal-50 text-sm">{item.label}</div>
                      <div className="text-xs text-teal-400/70">{item.desc}</div>
                    </div>
                    {isBought ? (
                      <Check className="w-5 h-5 text-emerald-300" />
                    ) : (
                      <div className="flex items-center gap-1 text-amber-300 font-bold text-sm">
                        {item.cost}
                        <Coins className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-money coin packs */}
          <div>
            <h3 className="text-sm font-semibold text-amber-200 mb-2 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-300" />
              Coin Packs
            </h3>
            <div className="space-y-2">
              {COIN_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${
                    pack.popular
                      ? 'bg-amber-500/10 border-amber-400/50 ring-1 ring-amber-400/30'
                      : 'bg-teal-800/30 border-teal-700/40'
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-amber-400 text-teal-950 text-[10px] font-bold uppercase tracking-wide">
                      Best Value
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-teal-950" />
                    </div>
                    <div>
                      <div className="font-bold text-teal-50">{pack.coins.toLocaleString()} coins</div>
                      {pack.bonus && <div className="text-xs text-amber-300">{pack.bonus} bonus</div>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(pack)}
                    disabled={purchasing === pack.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-teal-50 font-semibold text-sm transition-colors disabled:opacity-60"
                  >
                    {purchasing === pack.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        ${pack.price.toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-teal-500/60">
            Real-money purchases require connecting a payment account. Coins are also earned by winning games and playing Lucky Pick.
          </p>
        </div>
      </div>
    </div>
  );
}
