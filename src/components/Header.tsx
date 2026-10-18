import { Coins, Sparkles, User, Trophy, Settings, RefreshCw, Gift } from 'lucide-react';
import type { PlayerState } from '@/game/types';
import { getLevelInfo } from '@/game/levels';

interface HeaderProps {
  state: PlayerState;
  onProfile: () => void;
  onCustomize: () => void;
  onNewGame: () => void;
  onDailyReward?: () => void;
  dailyAvailable?: boolean;
}

export default function Header({ state, onProfile, onCustomize, onNewGame, onDailyReward, dailyAvailable }: HeaderProps) {
  const levelInfo = getLevelInfo(state.level);

  return (
    <header className="sticky top-0 z-30 border-b border-brand-800/60 bg-felt-900/95 backdrop-blur-md px-3 py-2">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">

        {/* Logo + name */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <img src="/magpie-logo.webp" alt="Logo" className="h-9 w-9 rounded-xl shadow-md" />
            {dailyAvailable && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gold-400 border-2 border-felt-900 animate-pulse" />
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-white leading-tight">Mega Magpie</p>
            <p className="text-[10px] uppercase tracking-widest text-brand-400/80">Solitaire</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-1.5">
          {/* Coins */}
          <div className="flex items-center gap-1 rounded-lg border border-brand-800 bg-felt-700/70 px-2.5 py-1.5">
            <Coins className="h-3.5 w-3.5 text-cozy-400" />
            <span className="text-sm font-semibold text-white tabular-nums">{state.coins.toLocaleString()}</span>
          </div>
          {/* Tokens */}
          <div className="hidden sm:flex items-center gap-1 rounded-lg border border-brand-800 bg-felt-700/70 px-2.5 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span className="text-sm font-semibold text-white tabular-nums">{state.tokens}</span>
          </div>
          {/* Level */}
          <div
            className="flex items-center gap-1 rounded-lg border bg-felt-700/70 px-2.5 py-1.5"
            style={{ borderColor: `${levelInfo.color}40` }}
          >
            <Trophy className="h-3.5 w-3.5" style={{ color: levelInfo.color }} />
            <span className="text-sm font-semibold text-white">Lv{state.level}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          {onDailyReward && (
            <button
              onClick={onDailyReward}
              className={`relative rounded-lg p-2 transition hover:bg-felt-600 ${dailyAvailable ? 'text-gold-400' : 'text-white/50'}`}
              title="Daily reward"
            >
              <Gift className="h-4 w-4" />
            </button>
          )}
          <button onClick={onCustomize} className="rounded-lg p-2 text-white/60 transition hover:bg-felt-600 hover:text-white" title="Customize">
            <Settings className="h-4 w-4" />
          </button>
          <button onClick={onProfile} className="rounded-lg p-2 text-white/60 transition hover:bg-felt-600 hover:text-white" title="Profile">
            <User className="h-4 w-4" />
          </button>
          <button onClick={onNewGame} className="rounded-lg p-2 text-white/60 transition hover:bg-felt-600 hover:text-white" title="New game">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
