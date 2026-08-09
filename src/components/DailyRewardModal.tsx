import { useState } from 'react';
import { X, Coins, Zap, Check, Lock, Flame, Snowflake, Gift } from 'lucide-react';
import { DAILY_REWARDS, STREAK_RESET_DAYS } from '@/game/dailyRewards';

interface DailyRewardModalProps {
  open: boolean;
  dailyStreak: number;
  bestDailyStreak: number;
  streakFreezes: number;
  claimed: boolean;
  onClaim: () => void;
  onClose: () => void;
}

export function DailyRewardModal({ open, dailyStreak, bestDailyStreak, streakFreezes, claimed, onClaim, onClose }: DailyRewardModalProps) {
  const [claiming, setClaiming] = useState(false);
  if (!open) return null;

  const currentDayIndex = ((dailyStreak) % DAILY_REWARDS.length);
  const todayReward = DAILY_REWARDS[Math.min(currentDayIndex, DAILY_REWARDS.length - 1)];

  const handleClaim = () => {
    if (claimed) { onClose(); return; }
    setClaiming(true);
    setTimeout(() => {
      onClaim();
      setClaiming(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={claimed ? onClose : undefined}>
      <div
        className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-amber-400/40 shadow-2xl animate-win-pop overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-teal-400 hover:text-teal-200 hover:bg-teal-800/50 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 pt-6 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-lg animate-pulse-glow">
              <Gift className="w-6 h-6 text-teal-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-50">Daily Reward</h2>
              <p className="text-sm text-amber-300/80">Log in every day for bigger rewards</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/30">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="font-bold text-orange-200 text-sm">{dailyStreak} day streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30">
              <Snowflake className="w-4 h-4 text-cyan-300" />
              <span className="font-bold text-cyan-200 text-sm">{streakFreezes} freeze{streakFreezes === 1 ? '' : 's'}</span>
            </div>
            {bestDailyStreak > 0 && (
              <div className="text-xs text-teal-400/60 ml-auto">Best: {bestDailyStreak} days</div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {DAILY_REWARDS.map((reward, i) => {
              const isPast = i < currentDayIndex;
              const isToday = i === currentDayIndex;
              const isFuture = i > currentDayIndex;
              return (
                <div
                  key={reward.day}
                  className={`relative rounded-xl border p-2.5 text-center transition-all ${
                    isToday && !claimed
                      ? 'bg-amber-500/20 border-amber-400/60 ring-2 ring-amber-400/40 scale-105'
                      : isToday && claimed
                        ? 'bg-emerald-500/15 border-emerald-400/40'
                        : isPast
                          ? 'bg-teal-800/20 border-teal-700/30 opacity-50'
                          : 'bg-teal-950/40 border-teal-800/40'
                  }`}
                >
                  {reward.highlight && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-amber-400 text-teal-950 text-[8px] font-bold uppercase tracking-wide whitespace-nowrap">
                      Jackpot
                    </div>
                  )}
                  <div className="text-[10px] font-semibold text-teal-300/70 mb-1">{reward.label}</div>
                  <div className="flex flex-col items-center gap-0.5">
                    {reward.coins > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Coins className="w-3 h-3 text-amber-300" />
                        <span className="text-xs font-bold text-amber-200 tabular-nums">{reward.coins}</span>
                      </div>
                    )}
                    {reward.tokens > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Zap className="w-3 h-3 text-cyan-300" />
                        <span className="text-xs font-bold text-cyan-200 tabular-nums">{reward.tokens}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-1.5">
                    {isPast || (isToday && claimed) ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" strokeWidth={3} />
                    ) : isFuture ? (
                      <Lock className="w-3.5 h-3.5 text-teal-600 mx-auto" />
                    ) : (
                      <div className="w-3.5 h-3.5 mx-auto rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {claimed ? (
            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Check className="w-6 h-6 text-emerald-400" strokeWidth={3} />
                <span className="text-lg font-bold text-emerald-300">Reward Claimed!</span>
              </div>
              <p className="text-sm text-teal-400/70">Come back tomorrow to continue your streak.</p>
              <button onClick={onClose} className="mt-4 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-teal-50 font-semibold text-sm transition-colors">
                Continue Playing
              </button>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 mb-3">
                <div className="text-xs text-amber-300/80 mb-1">Today's Reward</div>
                <div className="flex items-center justify-center gap-3">
                  {todayReward.coins > 0 && (
                    <div className="flex items-center gap-1">
                      <Coins className="w-5 h-5 text-amber-300" />
                      <span className="text-lg font-bold text-amber-200 tabular-nums">+{todayReward.coins}</span>
                    </div>
                  )}
                  {todayReward.tokens > 0 && (
                    <div className="flex items-center gap-1">
                      <Zap className="w-5 h-5 text-cyan-300" />
                      <span className="text-lg font-bold text-cyan-200 tabular-nums">+{todayReward.tokens}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-teal-950 font-bold transition-all shadow-lg shadow-amber-500/30 disabled:opacity-60"
              >
                {claiming ? (
                  <span className="animate-pulse">Claiming...</span>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    Claim Reward
                  </>
                )}
              </button>
            </>
          )}

          <div className="mt-4 p-3 rounded-xl bg-teal-800/20 border border-teal-700/30">
            <div className="flex items-start gap-2">
              <Snowflake className="w-4 h-4 text-cyan-300 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-teal-400/70 leading-relaxed">
                Miss a day? A <span className="text-cyan-300 font-semibold">streak freeze</span> automatically protects your streak. You start with 1 freeze and earn another every {STREAK_RESET_DAYS * 7} days of play. Streaks reset if you miss more than one consecutive day without a freeze.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
