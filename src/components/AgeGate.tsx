import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Coins, Trophy, TrendingUp, Wallet, Sparkles, Heart } from 'lucide-react';

interface AgeGateProps {
  onVerify: () => void;
}

export function AgeGate({ onVerify }: AgeGateProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-teal-950 overflow-y-auto">
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-300/20 animate-sparkle-float"
            style={{
              left: `${(i * 12.5) % 100}%`,
              top: `${(i * 17) % 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl overflow-hidden my-auto animate-scale-in">
        <div className="absolute top-0 inset-x-0 h-1.5 shimmer-bg" />

        <div className="p-6 pt-8 text-center">
          <div className="relative mx-auto w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-glow-amber" style={{ filter: 'blur(16px)' }} />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg overflow-hidden animate-float-magical">
              <img src="/mascot-magpie.webp" alt="Mega Magpie" className="w-full h-full object-cover" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-sparkle" />
          </div>

          <h1 className="text-2xl font-bold gold-text mb-1">Mega Magpie</h1>
          <p className="text-sm text-cyan-300/80 mb-4">Solitaire where you can win real cash</p>

          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-400/40">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Coins className="w-5 h-5 text-amber-300 animate-coin-shine" />
              <span className="text-sm font-bold text-amber-200">Win Real Cash</span>
              <Coins className="w-5 h-5 text-amber-300 animate-coin-shine" style={{ animationDelay: '1s' }} />
            </div>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-xs text-teal-200">
                <Trophy className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>Win 10 games to earn cash milestone rewards</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-teal-200">
                <TrendingUp className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                <span>Stake coins for bigger rewards</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-teal-200">
                <Wallet className="w-4 h-4 text-teal-300 flex-shrink-0" />
                <span>Withdraw your winnings straight to your bank</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 mb-4 text-left">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-200">Age Restriction: 18+</div>
                <p className="text-xs text-amber-300/70 mt-1">
                  This game involves virtual currency and real-money rewards. You must be 18 years or older to play.
                </p>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer mb-5 text-left">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-5 h-5 rounded accent-amber-400"
            />
            <span className="text-sm text-teal-200">
              I confirm I am 18 years or older and I understand this game involves spending and winning real money through skill-based play.
            </span>
          </label>

          <button
            onClick={onVerify}
            disabled={!confirmed}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-teal-950 font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" fill="currentColor" />
            Enter Game
          </button>

          <p className="mt-4 text-[10px] text-teal-500/50 leading-relaxed">
            Play responsibly. Only spend what you can afford to lose. If play is affecting your life, seek help at BeGambleAware.org or call 1-800-522-4700.
          </p>
        </div>
      </div>
    </div>
  );
}
