import { Trophy, Coins, Clock, RotateCcw, TrendingUp, Sparkles, Star, Heart } from 'lucide-react';

interface WinModalProps {
  open: boolean;
  moves: number;
  seconds: number;
  coinsEarned: number;
  wagerPayout: number;
  wagerStake: number;
  cashWonPence: number;
  onNewGame: () => void;
}

export function WinModal({ open, moves, seconds, coinsEarned, wagerPayout, wagerStake, cashWonPence, onNewGame }: WinModalProps) {
  if (!open) return null;
  const timeStr = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const hasCashWin = cashWonPence > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Sparkle + confetti shower */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${(i * 3.33) % 100}%`,
              animationDelay: `${(i % 10) * 0.12}s`,
              animationDuration: `${2 + (i % 5) * 0.4}s`,
              fontSize: `${10 + (i % 4) * 4}px`,
            }}
          >
            {i % 4 === 0 ? (
              <Coins className="w-4 h-4 text-amber-300 animate-coin-shine" />
            ) : i % 4 === 1 ? (
              <Sparkles className="w-4 h-4 text-amber-300 animate-sparkle" />
            ) : i % 4 === 2 ? (
              <Star className="w-4 h-4 text-amber-200" />
            ) : (
              <Heart className="w-4 h-4 text-rose-300" fill="currentColor" />
            )}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/40 shadow-2xl animate-win-pop overflow-hidden">
        <div className={`absolute top-0 inset-x-0 h-2 ${hasCashWin ? 'bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 shimmer-bg' : 'bg-gradient-to-r from-cyan-400 to-teal-500'}`} />

        <div className="p-6 text-center">
          {/* Mascot with sparkles */}
          <div className="relative mx-auto w-24 h-24 mb-3">
            <div
              className={`absolute inset-0 rounded-full opacity-30 animate-glow-amber`}
              style={{ filter: 'blur(20px)' }}
            />
            <div className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl overflow-hidden animate-float-magical ${hasCashWin ? 'bg-gradient-to-br from-amber-300 to-amber-600' : 'bg-gradient-to-br from-cyan-400 to-teal-600'}`}>
              <img src="/cute-trophy.webp" alt="Trophy" className="w-full h-full object-cover" />
            </div>
            <Sparkles className="absolute -top-2 -right-1 w-5 h-5 text-amber-300 animate-sparkle" />
            <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 text-amber-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
          </div>

          <h2 className="text-2xl font-bold gold-text mb-1">You Win!</h2>
          <p className="text-sm text-cyan-300/80 mb-4 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            All cards moved to the foundations.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <Stat icon={<Clock className="w-4 h-4" />} value={timeStr} label="Time" />
            <Stat icon={<RotateCcw className="w-4 h-4" />} value={String(moves)} label="Moves" />
            <Stat icon={<Coins className="w-4 h-4" />} value={`+${coinsEarned}`} label="Coins" accent />
          </div>

          {hasCashWin && (
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-400/50 animate-glow-amber">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Trophy className="w-5 h-5 text-amber-300 animate-streak-flame" />
                <span className="text-sm font-bold text-amber-200">Cash Won!</span>
                <Trophy className="w-5 h-5 text-amber-300 animate-streak-flame" style={{ animationDelay: '0.4s' }} />
              </div>
              <div className="text-2xl font-bold gold-text tabular-nums">
                +£{(cashWonPence / 100).toFixed(2)}
              </div>
              <div className="text-[10px] text-amber-300/70 mt-0.5">Added to your wallet — withdraw anytime</div>
            </div>
          )}

          {wagerStake > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <TrendingUp className="w-4 h-4 text-cyan-300" />
                <span className="text-sm font-semibold text-cyan-200">Stake Won!</span>
              </div>
              <div className="text-xs text-teal-300/70">
                Staked {wagerStake} coins → won <span className="font-bold text-teal-300">+{wagerPayout}</span> coins back
              </div>
            </div>
          )}

          <button
            onClick={onNewGame}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-teal-950 font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label, accent }: { icon: React.ReactNode; value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5 p-2 rounded-lg bg-teal-800/40 border border-teal-700/40">
      <span className={accent ? 'text-amber-300' : 'text-cyan-300'}>{icon}</span>
      <span className="text-sm font-bold text-teal-50 tabular-nums">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-teal-400/70">{label}</span>
    </div>
  );
}
