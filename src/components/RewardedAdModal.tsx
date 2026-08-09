import { useState, useEffect, useCallback } from 'react';
import { X, Play, Zap, Gift, Check } from 'lucide-react';

interface RewardedAdModalProps {
  open: boolean;
  adsWatchedToday: number;
  dailyCap: number;
  tokensPerAd: number;
  onClose: () => void;
  onReward: () => Promise<void>;
}

type AdPhase = 'intro' | 'playing' | 'reward';

const AD_DURATION = 5;

export function RewardedAdModal({ open, adsWatchedToday, dailyCap, tokensPerAd, onClose, onReward }: RewardedAdModalProps) {
  const [phase, setPhase] = useState<AdPhase>('intro');
  const [countdown, setCountdown] = useState(AD_DURATION);
  const [claiming, setClaiming] = useState(false);

  const adsRemaining = Math.max(0, dailyCap - adsWatchedToday);

  useEffect(() => {
    if (!open) {
      setPhase('intro');
      setCountdown(AD_DURATION);
      setClaiming(false);
    }
  }, [open]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (countdown <= 0) {
      setPhase('reward');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  const startAd = useCallback(() => {
    setCountdown(AD_DURATION);
    setPhase('playing');
  }, []);

  const claimReward = useCallback(async () => {
    setClaiming(true);
    try {
      await onReward();
      setClaiming(false);
      onClose();
    } catch {
      setClaiming(false);
    }
  }, [onReward, onClose]);

  if (!open) return null;
  const canWatch = adsRemaining > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={phase === 'playing' ? undefined : onClose}>
      <div
        className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl animate-win-pop overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-300 via-cyan-500 to-cyan-300" />
        {(phase !== 'playing') && (
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-teal-400 hover:text-teal-200 hover:bg-teal-800/50 transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-6 pt-7">
          {phase === 'intro' && (
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg mb-3">
                <Play className="w-7 h-7 text-teal-950" fill="currentColor" />
              </div>
              <h2 className="text-xl font-bold text-teal-50 mb-1">Watch an Ad</h2>
              <p className="text-sm text-teal-400/80 mb-4">
                Watch a short ad to earn <span className="text-cyan-300 font-bold">{tokensPerAd} tokens</span> — completely free.
                Spend tokens on <span className="text-teal-200 font-semibold">characters</span>, card backs, outfits, and boosts.
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30">
                  <Zap className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm font-bold text-cyan-200">+{tokensPerAd} tokens</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-teal-400/70 mb-1.5">
                  <span>Today's ads</span>
                  <span>{adsWatchedToday} / {dailyCap} watched</span>
                </div>
                <div className="h-2 rounded-full bg-teal-950/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-500"
                    style={{ width: `${(adsWatchedToday / dailyCap) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-teal-500/60 mt-1">
                  {canWatch ? `${adsRemaining} ad${adsRemaining === 1 ? '' : 's'} remaining today` : 'Daily limit reached — come back tomorrow'}
                </div>
              </div>

              <button
                onClick={startAd}
                disabled={!canWatch}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-teal-950 font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                {canWatch ? 'Watch Ad' : 'Limit Reached'}
              </button>
              <p className="mt-3 text-[10px] text-teal-500/50">
                Ads are free to watch. No purchase necessary.
              </p>
            </div>
          )}

          {phase === 'playing' && (
            <div>
              <div className="text-center mb-3">
                <span className="text-[10px] uppercase tracking-widest text-cyan-400/70">Advertisement</span>
              </div>
              <div className="relative aspect-video rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-amber-900/20 animate-pulse" />
                <div className="text-center z-10 px-4">
                  <div className="text-2xl mb-2">🎮</div>
                  <div className="text-sm font-bold text-slate-200 mb-1">Play Mega Quest Today!</div>
                  <div className="text-xs text-slate-400">The #1 adventure game</div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-bold tabular-nums">
                  {countdown}s
                </div>
              </div>
              <div className="mt-3 h-1 rounded-full bg-teal-950/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${((AD_DURATION - countdown) / AD_DURATION) * 100}%` }}
                />
              </div>
              <p className="text-center text-[10px] text-teal-500/50 mt-2">
                Reward unlocks in {countdown} second{countdown === 1 ? '' : 's'}...
              </p>
            </div>
          )}

          {phase === 'reward' && (
            <div className="text-center py-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 flex items-center justify-center shadow-xl shadow-cyan-900/40 mb-3 animate-win-pop">
                <Gift className="w-8 h-8 text-teal-950" />
              </div>
              <h2 className="text-xl font-bold text-teal-50 mb-1">Ad Complete!</h2>
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <Zap className="w-5 h-5 text-cyan-300" />
                <span className="text-2xl font-bold text-cyan-200">+{tokensPerAd} tokens</span>
              </div>
              <button
                onClick={claimReward}
                disabled={claiming}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-teal-950 font-bold transition-all shadow-lg disabled:opacity-60"
              >
                {claiming ? 'Claiming...' : (<><Check className="w-5 h-5" /> Claim Reward</>)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
