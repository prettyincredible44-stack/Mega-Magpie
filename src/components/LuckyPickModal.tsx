import { useState } from 'react';
import { X, Sparkles, Gift } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface BonusChestModalProps {
  onClose: () => void;
  onWin: (coins: number, tokens: number) => void;
  cost: number;
  canAfford: boolean;
}

// Fixed bonus awards — not gambling. Player spends earned points for a guaranteed bonus.
const PRIZES = [
  { coins: 50,  tokens: 0, weight: 40, label: 'Small Bonus' },
  { coins: 100, tokens: 0, weight: 25, label: 'Medium Bonus' },
  { coins: 200, tokens: 1, weight: 15, label: 'Good Bonus' },
  { coins: 500, tokens: 2, weight: 10, label: 'Great Bonus' },
  { coins: 1000,tokens: 5, weight: 7,  label: 'Super Bonus' },
  { coins: 0,   tokens: 10,weight: 3,  label: 'Token Bonus' },
];

function pickPrize() {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of PRIZES) { r -= p.weight; if (r <= 0) return p; }
  return PRIZES[0];
}

export default function BonusChestModal({ onClose, onWin, cost, canAfford }: BonusChestModalProps) {
  const [result, setResult] = useState<typeof PRIZES[0] | null>(null);
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (!canAfford || opening) return;
    setOpening(true);
    sounds.coin();
    setTimeout(() => {
      const prize = pickPrize();
      setResult(prize);
      setOpening(false);
      sounds.reward();
      onWin(prize.coins, prize.tokens);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4 animate-fade-in" onClick={onClose}>
      <div className="glass w-full max-w-sm rounded-2xl shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-brand-800/60 p-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-gold-400" />
            <h2 className="text-lg font-bold text-white">Bonus Chest</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-felt-600">
            <X className="h-5 w-5 text-white/50" />
          </button>
        </div>

        <div className="p-6 text-center">
          {result ? (
            <>
              <div className="mb-3 text-5xl animate-bounce-cozy">🎁</div>
              <p className="mb-1 text-lg font-bold text-white">{result.label}!</p>
              {result.coins > 0 && (
                <p className="text-cozy-400 font-bold text-xl">+{result.coins} points</p>
              )}
              {result.tokens > 0 && (
                <p className="text-brand-400 font-bold text-xl">+{result.tokens} tokens</p>
              )}
              <button
                onClick={onClose}
                className="mt-5 w-full rounded-xl bg-brand-600 py-3 font-bold text-white transition hover:bg-brand-500 active:scale-95"
              >
                Collect
              </button>
            </>
          ) : (
            <>
              <img
                src="/cute-gift.webp"
                alt="Bonus Chest"
                className={`mx-auto mb-4 h-24 w-24 ${opening ? 'animate-wiggle' : 'animate-float-magical'}`}
              />
              <p className="mb-1 text-sm text-white/60">Open a bonus chest for a guaranteed point reward!</p>
              <p className="mb-5 text-xs text-white/35">Costs {cost} earned points to open</p>
              <button
                onClick={handleOpen}
                disabled={!canAfford || opening}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-bold text-white transition hover:bg-brand-500 active:scale-95 disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" />
                {opening ? 'Opening…' : 'Open Chest'}
              </button>
              {!canAfford && (
                <p className="mt-2 text-xs text-white/30">Keep playing to earn more points!</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
