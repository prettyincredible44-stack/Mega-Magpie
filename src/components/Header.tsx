import { Coins, Sparkles, User, Wallet, Trophy, Settings, RefreshCw } from 'lucide-react';
import type { PlayerState } from '@/game/types';
import { getLevelInfo } from '@/game/levels';

interface HeaderProps {
  state: PlayerState;
  onProfile: () => void;
  onWallet: () => void;
  onLevels: () => void;
  onShop: () => void;
  onCustomize: () => void;
  onNewGame: () => void;
}

export default function Header({ state, onProfile, onWallet, onLevels, onShop, onCustomize, onNewGame }: HeaderProps) {
  const levelInfo = getLevelInfo(state.level);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 px-3 py-2">
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/magpie-logo.webp" alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="text-white font-bold text-sm hidden sm:block">Mega Magpie</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Coins className="w-4 h-4 text-cozy-400" />
            <span className="text-white text-sm font-semibold">{state.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Sparkles className="w-4 h-4 text-magical-400" />
            <span className="text-white text-sm font-semibold">{state.tokens}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700" style={{ borderColor: levelInfo.color + '40' }}>
            <Trophy className="w-4 h-4" style={{ color: levelInfo.color }} />
            <span className="text-white text-sm font-semibold">Lv{state.level}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={onCustomize} className="p-2 rounded-lg hover:bg-slate-800 transition" title="Customize">
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
          <button onClick={onShop} className="p-2 rounded-lg hover:bg-slate-800 transition" title="Shop">
            <Wallet className="w-4 h-4 text-slate-300" />
          </button>
          <button onClick={onWallet} className="p-2 rounded-lg hover:bg-slate-800 transition" title="Wallet">
            <Wallet className="w-4 h-4 text-slate-300" />
          </button>
          <button onClick={onProfile} className="p-2 rounded-lg hover:bg-slate-800 transition" title="Profile">
            <User className="w-4 h-4 text-slate-300" />
          </button>
          <button onClick={onNewGame} className="p-2 rounded-lg hover:bg-slate-800 transition" title="New Game">
            <RefreshCw className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
