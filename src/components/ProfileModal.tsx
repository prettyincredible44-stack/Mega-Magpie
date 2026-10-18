import { X, Clock, Target, Flame, Calendar, Coins, Trophy } from 'lucide-react';
import type { PlayerState } from '@/game/types';
import { getLevelInfo, getLevelProgress } from '@/game/levels';
import { getCharacter } from '@/game/catalog';

interface ProfileModalProps {
  state: PlayerState;
  onClose: () => void;
  onSignOut: () => void;
  onPrivacy?: () => void;
}

export default function ProfileModal({ state, onClose, onSignOut, onPrivacy }: ProfileModalProps) {
  const levelInfo = getLevelInfo(state.level);
  const progress = getLevelProgress(state.xp);
  const character = getCharacter(state.active_character);

  const stats = [
    { icon: Trophy,   label: 'Won',          value: state.games_won,    color: 'text-gold-400' },
    { icon: Target,   label: 'Played',       value: state.games_played, color: 'text-brand-400' },
    { icon: Clock,    label: 'Best Time',    value: state.best_time_seconds
        ? `${Math.floor(state.best_time_seconds / 60)}:${(state.best_time_seconds % 60).toString().padStart(2, '0')}`
        : '—', color: 'text-brand-300' },
    { icon: Flame,    label: 'Win Streak',   value: state.current_streak, color: 'text-cozy-400' },
    { icon: Calendar, label: 'Daily Streak', value: state.daily_streak,   color: 'text-green-400' },
    { icon: Coins,    label: 'Points',       value: state.coins.toLocaleString(), color: 'text-cozy-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4 animate-fade-in" onClick={onClose}>
      <div className="glass w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-brand-800/60 p-4">
          <h2 className="text-lg font-bold text-white">Profile</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-felt-600">
            <X className="h-5 w-5 text-white/50" />
          </button>
        </div>

        <div className="p-4">
          {/* Character + level */}
          <div className="mb-5 flex items-center gap-4">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-3xl"
              style={{ background: (character?.color ?? '#14b8a6') + '28' }}
            >
              {character?.emoji ?? '🦊'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-white">{state.player_name}</p>
              <p className="text-sm font-medium" style={{ color: levelInfo.color }}>
                {levelInfo.name} — Level {state.level}
              </p>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-felt-600">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress.percent}%`, background: levelInfo.color }}
                />
              </div>
              <p className="mt-0.5 text-xs text-white/40">{progress.current} / {progress.needed} XP to next level</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mb-5 grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-brand-800/40 bg-felt-700/50 p-3">
                <s.icon className={`mb-1 h-4 w-4 ${s.color}`} />
                <p className="text-xs text-white/40">{s.label}</p>
                <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Next achievement */}
          <div className="mb-4 rounded-xl border border-brand-800/40 bg-felt-700/50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-gold-400" />
                <span className="text-sm text-white/70">Wins to next award</span>
              </div>
              <span className="font-bold text-gold-400">{10 - state.wins_since_milestone} left</span>
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={onSignOut}
            className="mb-2 w-full rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
          >
            Sign Out
          </button>

          {/* Privacy link — required by Apple */}
          {onPrivacy && (
            <button
              onClick={onPrivacy}
              className="w-full rounded-xl py-2 text-xs text-white/30 transition hover:text-white/50"
            >
              Privacy Policy &amp; Terms
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
