import { useState, useEffect, useCallback } from 'react';
import { X, Coins, Zap, Gift, Sparkles, Check } from 'lucide-react';

interface LuckyPickModalProps {
  open: boolean;
  tokens: number;
  onClose: () => void;
  onWinTokens: (amount: number) => void;
  onSpendCoins: (amount: number) => void;
  coins: number;
}

const PLAY_COST = 20;
const PRIZES = [
  { tokens: 5, weight: 30, label: '5 tokens', icon: '🪙' },
  { tokens: 10, weight: 25, label: '10 tokens', icon: '🪙' },
  { tokens: 15, weight: 18, label: '15 tokens', icon: '✨' },
  { tokens: 25, weight: 12, label: '25 tokens', icon: '⚡' },
  { tokens: 50, weight: 8, label: '50 tokens', icon: '🎁' },
  { tokens: 100, weight: 4, label: '100 tokens!', icon: '💎' },
  { tokens: 0, weight: 3, label: 'Nothing!', icon: '💨' },
];

const CARD_COUNT = 6;

interface CardState {
  revealed: boolean;
  prize: typeof PRIZES[0] | null;
  isWinner: boolean;
}

function pickPrize() {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of PRIZES) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return PRIZES[0];
}

export function LuckyPickModal({ open, tokens, onClose, onWinTokens, onSpendCoins, coins }: LuckyPickModalProps) {
  const [cards, setCards] = useState<CardState[]>([]);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'revealed'>('idle');
  const [result, setResult] = useState<{ tokens: number; label: string; icon: string } | null>(null);
  const [spinning, setSpinning] = useState(false);

  const startRound = useCallback(() => {
    if (coins < PLAY_COST) return;
    onSpendCoins(PLAY_COST);
    const winnerIdx = Math.floor(Math.random() * CARD_COUNT);
    const newCards: CardState[] = Array.from({ length: CARD_COUNT }, (_, i) => ({
      revealed: false,
      prize: i === winnerIdx ? pickPrize() : null,
      isWinner: i === winnerIdx,
    }));
    setCards(newCards);
    setPhase('playing');
    setResult(null);
  }, [coins, onSpendCoins]);

  const revealCard = (idx: number) => {
    if (phase !== 'playing' || cards[idx].revealed) return;
    const newCards = [...cards];
    newCards[idx] = { ...newCards[idx], revealed: true };
    setCards(newCards);

    if (newCards[idx].isWinner && newCards[idx].prize) {
      const prize = newCards[idx].prize;
      setPhase('revealed');
      setResult({ tokens: prize.tokens, label: prize.label, icon: prize.icon });
      if (prize.tokens > 0) {
        onWinTokens(prize.tokens);
      }
    } else {
      setSpinning(true);
      setTimeout(() => {
        setCards((prev) => prev.map((c, i) => i === idx ? { ...c, revealed: false } : c));
        setSpinning(false);
      }, 600);
    }
  };

  useEffect(() => {
    if (!open) {
      setPhase('idle');
      setCards([]);
      setResult(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl animate-win-pop overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5" style={{ background: 'linear-gradient(90deg, #ff7eb6, #ff5a7e, #ff7eb6)' }} />
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-cyan-300/80 hover:text-cyan-200 hover:bg-teal-800/50 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-7 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #ff7eb6, #ff5a7e)' }}>
              <img src="/cute-gift.webp" alt="Lucky Pick" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-50">Lucky Pick</h2>
              <p className="text-sm text-cyan-300/80">Pick cards to find the prize!</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-teal-800/30 border border-teal-700/40">
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-300" />
              <span className="text-xs text-teal-300/80">Cost</span>
              <span className="font-bold text-amber-200">{PLAY_COST} coins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-300" />
              <span className="text-xs text-teal-300/80">Tokens</span>
              <span className="font-bold text-cyan-200">{tokens.toLocaleString()}</span>
            </div>
          </div>

          {phase === 'idle' && (
            <div className="text-center py-6">
              <p className="text-sm text-teal-300/70 mb-4">
                Pay {PLAY_COST} coins to shuffle 6 cards. One hides a token prize — pick wisely!
              </p>
              <button
                onClick={startRound}
                disabled={coins < PLAY_COST}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-teal-950 font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {coins < PLAY_COST ? 'Not enough coins' : `Play for ${PLAY_COST} coins`}
              </button>
            </div>
          )}

          {phase !== 'idle' && (
            <>
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {cards.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => revealCard(i)}
                    disabled={card.revealed || spinning || phase === 'revealed'}
                    className={`relative aspect-[3/4] rounded-xl border-2 transition-all duration-300 ${
                      card.revealed
                        ? card.isWinner
                          ? 'bg-amber-500/20 border-amber-400/60 scale-105'
                          : 'bg-teal-800/40 border-teal-700/40'
                        : 'bg-gradient-to-br from-teal-700 to-teal-900 border-cyan-400/30 hover:border-cyan-300/60 hover:scale-105 cursor-pointer'
                    }`}
                  >
                    {card.revealed ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                        <span className="text-3xl">{card.isWinner && card.prize ? card.prize.icon : '❌'}</span>
                        {card.isWinner && card.prize && (
                          <span className="text-xs font-bold text-amber-200">{card.prize.label}</span>
                        )}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-cyan-300/40" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {phase === 'playing' && (
                <p className="text-center text-sm text-cyan-300/70">
                  {spinning ? 'Not this one! Try again...' : 'Tap a card to reveal it'}
                </p>
              )}

              {phase === 'revealed' && result && (
                <div className="text-center py-2">
                  {result.tokens > 0 ? (
                    <>
                      <div className="text-5xl mb-2 animate-win-pop">{result.icon}</div>
                      <h3 className="text-lg font-bold text-amber-200 mb-1">You won {result.tokens} tokens!</h3>
                      <button
                        onClick={startRound}
                        disabled={coins < PLAY_COST}
                        className="mt-3 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-teal-950 font-bold transition-all shadow-lg disabled:opacity-40"
                      >
                        Play Again ({PLAY_COST} coins)
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-2">💨</div>
                      <h3 className="text-lg font-bold text-teal-300 mb-1">No prize this time!</h3>
                      <button
                        onClick={startRound}
                        disabled={coins < PLAY_COST}
                        className="mt-3 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-teal-950 font-bold transition-all shadow-lg disabled:opacity-40"
                      >
                        Try Again ({PLAY_COST} coins)
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          <div className="mt-4 p-3 rounded-xl bg-teal-800/20 border border-teal-700/30">
            <p className="text-[10px] text-teal-400/60 text-center">
              Prizes range from 5 to 100 tokens. Most cards are empty — find the winner card to claim the prize!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
