import { useState } from 'react';
import { X, Sparkles, Play } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface LuckyPickModalProps {
  onClose: () => void;
  onWin: (coins: number, tokens: number) => void;
  cost: number;
  canAfford: boolean;
}

const PRIZES = [
  { coins: 50, tokens: 0, weight: 40 },
  { coins: 100, tokens: 0, weight: 25 },
  { coins: 200, tokens: 1, weight: 15 },
  { coins: 500, tokens: 2, weight: 10 },
  { coins: 1000, tokens: 5, weight: 7 },
  { coins: 0, tokens: 10, weight: 3 },
];

function pickPrize() {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of PRIZES) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return PRIZES[0];
}

export default function LuckyPickModal({ onClose, onWin, cost, canAfford }: LuckyPickModalProps) {
  const [result, setResult] = useState<typeof PRIZES[0] | null>(null);
  const [rolling, setRolling] = useState(false);

  const handlePick = () => {
    if (!canAfford || rolling) return;
    setRolling(true);
    sounds.coin();
    setTimeout(() => {
      const prize = pickPrize();
      setResult(prize);
      setRolling(false);
      sounds.reward();
      onWin(prize.coins, prize.tokens);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-magical-400" />
            Lucky Pick
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 text-center">
          {result ? (
            <>
              <div className="text-5xl mb-4 animate-sparkle-burst">🎉</div>
              <p className="text-white text-lg font-bold mb-2">You won!</p>
              {result.coins > 0 && <p className="text-cozy-400 font-bold text-xl">{result.coins} coins</p>}
              {result.tokens > 0 && <p className="text-magical-400 font-bold text-xl">{result.tokens} tokens</p>}
              <button onClick={onClose} className="mt-6 w-full py-3 bg-cozy-500 hover:bg-cozy-600 text-white rounded-lg font-bold transition">
                Collect
              </button>
            </>
          ) : (
            <>
              <img src="/cute-gift.webp" alt="Gift" className={`w-24 h-24 mx-auto mb-4 ${rolling ? 'animate-wiggle' : 'animate-float-magical'}`} />
              <p className="text-slate-300 text-sm mb-2">Pick a lucky gift for a chance to win coins and tokens!</p>
              <p className="text-cozy-400 text-sm mb-4">Cost: {cost} coins</p>
              <button
                onClick={handlePick}
                disabled={!canAfford || rolling}
                className="w-full flex items-center justify-center gap-2 py-3 bg-magical-500 hover:bg-magical-600 text-white rounded-lg font-bold transition disabled:opacity-40"
              >
                <Play className="w-4 h-4" />
                {rolling ? 'Picking...' : 'Pick!'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
