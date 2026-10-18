import { Coins, Sparkles, User, Trophy, Settings, RefreshCw } from 'lucide-react';
import type { PlayerState } from '@/game/types';
import { getLevelInfo } from '@/game/levels';

interface HeaderProps {
  state: PlayerState;
  onProfile: () => void;
  onCustomize: () => void;
  onNewGame: () => void;
}

export default function Header({ state, onProfile, onCustomize, onNewGame }: HeaderProps) {
  const levelInfo = getLevelInfo(state.level);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-700/80 bg-slate-950/90 px-3 py-2 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <img src="/magpie-logo.webp" alt="Mega Magpie logo" className="h-9 w-9 rounded-xl" />
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-bold text-white">Mega Magpie</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Free solitaire</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5" title="Free points">
            <Coins className="h-4 w-4 text-cozy-400" />
            <span className="text-sm font-semibold text-white">{state.coins.toLocaleString()}</span>
          </div>
          <div className="hidden items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 sm:flex" title="Free tokens">
            <Sparkles className="h-4 w-4 text-magical-400" />
            <span className="text-sm font-semibold text-white">{state.tokens}</span>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5" style={{ borderColor: `${levelInfo.color}40` }}>
            <Trophy className="h-4 w-4" style={{ color: levelInfo.color }} />
            <span className="text-sm font-semibold text-white">Lv{state.level}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={onCustomize} className="rounded-lg p-2 transition hover:bg-slate-800" title="Customize">
            <Settings className="h-4 w-4 text-slate-300" />
          </button>
          <button onClick={onProfile} className="rounded-lg p-2 transition hover:bg-slate-800" title="Profile">
            <User className="h-4 w-4 text-slate-300" />
          </button>
          <button onClick={onNewGame} className="rounded-lg p-2 transition hover:bg-slate-800" title="New game">
            <RefreshCw className="h-4 w-4 text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
