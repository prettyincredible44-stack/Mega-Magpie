import { X, Gift } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-cozy-400" />
            Daily Reward
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-slate-300 text-sm text-center mb-4">
            {state.daily_streak}-day streak! Log in every day for bigger rewards.
          </p>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {DAILY_REWARDS.map((reward) => {
              const isClaimed = reward.day - 1 < currentDay;
              const isCurrent = reward.day - 1 === currentDay;
              return (
                <div
                  key={reward.day}
                  className={`p-3 rounded-xl border text-center ${
                    isCurrent
                      ? 'border-cozy-500 bg-cozy-500/10 animate-glow-pulse'
                      : isClaimed
                      ? 'border-slate-700 bg-slate-700/30 opacity-60'
                      : 'border-slate-700 bg-slate-800/50'
                  }`}
                >
                  <p className="text-slate-400 text-xs mb-1">{reward.label}</p>
                  <p className="text-cozy-400 font-bold text-sm">{reward.coins}c</p>
                  {reward.tokens > 0 && <p className="text-magical-400 text-xs">{reward.tokens}t</p>}
                  {isClaimed && <span className="text-emerald-400 text-xs">✓</span>}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              sounds.reward();
              onClaim();
            }}
            disabled={state.daily_reward_claimed}
            className="w-full py-3 bg-cozy-500 hover:bg-cozy-600 text-white rounded-lg font-bold transition disabled:opacity-40"
          >
            {state.daily_reward_claimed ? 'Already Claimed' : 'Claim Reward'}
          </button>
        </div>
      </div>
    </div>
  );
}
