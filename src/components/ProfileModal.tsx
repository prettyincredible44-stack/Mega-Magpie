import { X, Trophy, Coins, Clock, Target, Flame, Calendar } from 'lucide-react';
import type { PlayerState } from '@/game/types';
import { getLevelInfo, getLevelProgress } from '@/game/levels';
import { getCharacter } from '@/game/catalog';

interface ProfileModalProps {
  state: PlayerState;
  onClose: () => void;
  onSignOut: () => void;
}

export default function ProfileModal({ state, onClose, onSignOut }: ProfileModalProps) {
  const levelInfo = getLevelInfo(state.level);
  const progress = getLevelProgress(state.xp);
  const character = getCharacter(state.active_character);

  const stats = [
    { icon: Trophy, label: 'Games Won', value: state.games_won, color: 'text-amber-400' },
    { icon: Target, label: 'Games Played', value: state.games_played, color: 'text-blue-400' },
    { icon: Clock, label: 'Best Time', value: state.best_time_seconds ? `${Math.floor(state.best_time_seconds / 60)}:${(state.best_time_seconds % 60).toString().padStart(2, '0')}` : '—', color: 'text-magical-400' },
    { icon: Flame, label: 'Win Streak', value: state.current_streak, color: 'text-orange-400' },
    { icon: Calendar, label: 'Daily Streak', value: state.daily_streak, color: 'text-emerald-400' },
    { icon: Coins, label: 'Lifetime Coins', value: state.lifetime_spent_coins.toLocaleString(), color: 'text-cozy-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: character?.color + '30' }}>
              {character?.emoji || '🦊'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{state.player_name}</h3>
              <p className="text-sm" style={{ color: levelInfo.color }}>{levelInfo.name} - Level {state.level}</p>
              <div className="mt-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${progress.percent}%`, background: levelInfo.color }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">{progress.current} / {progress.needed} XP</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-slate-700/50 rounded-xl p-3 border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-slate-400 text-xs">{stat.label}</span>
                </div>
                <p className="text-white font-bold text-lg">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-700 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm">Milestones Claimed</span>
              <span className="text-amber-400 font-bold">{state.milestones_claimed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Wins to Next Milestone</span>
              <span className="text-white font-bold">{10 - state.wins_since_milestone}</span>
            </div>
          </div>

          <button
            onClick={onSignOut}
            className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition border border-red-500/30"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
