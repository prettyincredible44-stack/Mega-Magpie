import { X, Gift, Coins, Sparkles } from 'lucide-react';
import { DAILY_REWARDS } from '@/game/dailyRewards';
import type { PlayerState } from '@/game/types';
import { sounds } from '@/lib/sounds';

interface DailyRewardModalProps {
  state: PlayerState;
  onClose: () => void;
  onClaim: () => void;
}

export default function DailyRewardModal({ state, onClose, onClaim }: DailyRewardModalProps) {
  const currentDay = state.daily_streak % 7;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4 animate-fade-in" onClick={onClose}>
      <div className="glass w-full max-w-sm rounded-2xl shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-brand-800/60 p-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-gold-400" />
            <h2 className="text-lg font-bold text-white">Daily Reward</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-felt-600 transition">
            <X className="h-5 w-5 text-white/50" />
          </button>
        </div>

        <div className="p-4">
          <p className="mb-4 text-center text-sm text-white/60">
            {state.daily_streak > 0 ? `${state.daily_streak}-day streak!` : 'Start your streak today!'} Log in every day for bigger rewards.
          </p>

          <div className="mb-4 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {DAILY_REWARDS.map((reward) => {
              const dayIdx = reward.day - 1;
              const isClaimed = dayIdx < currentDay;
              const isCurrent = dayIdx === currentDay;
              return (
                <div
                  key={reward.day}
                  className={`rounded-xl border p-2 text-center transition ${
                    isCurrent
                      ? 'border-brand-500 bg-brand-600/20 animate-glow-pulse'
                      : isClaimed
                      ? 'border-brand-800 bg-felt-700/30 opacity-60'
                      : 'border-brand-900/50 bg-felt-800/50'
                  }`}
                >
                  <p className="text-[9px] text-white/40 mb-0.5">Day {reward.day}</p>
                  <p className="text-brand-300 font-bold text-xs">{reward.coins}c</p>
                  {reward.tokens > 0 && (
                    <p className="text-brand-400 text-[10px]">{reward.tokens}t</p>
                  )}
                  {isClaimed && <span className="text-green-400 text-[10px]">✓</span>}
                </div>
              );
            })}
          </div>

          {/* Today's reward summary */}
          {!state.daily_reward_claimed && (
            <div className="mb-4 flex items-center justify-center gap-4 rounded-xl border border-gold-500/20 bg-gold-500/5 py-3">
              <div className="flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-cozy-400" />
                <span className="font-bold text-white">{DAILY_REWARDS[currentDay]?.coins ?? 0} points</span>
              </div>
              {(DAILY_REWARDS[currentDay]?.tokens ?? 0) > 0 && (
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-brand-400" />
                  <span className="font-bold text-white">{DAILY_REWARDS[currentDay]?.tokens} tokens</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => { sounds.reward(); onClaim(); }}
            disabled={state.daily_reward_claimed}
            className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white transition hover:bg-brand-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {state.daily_reward_claimed ? 'Already Claimed Today' : 'Claim Reward'}
          </button>
        </div>
      </div>
    </div>
  );
}
