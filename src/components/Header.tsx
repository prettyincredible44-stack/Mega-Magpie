import { Coins, Trophy, Clock, RotateCcw, Sparkles, Star, Wallet, Zap, Play, TrendingUp, Volume2, VolumeX, Music, Gift, Users, ShieldCheck, Flame } from 'lucide-react';
import { LevelInfo } from '@/game/levels';
import { penceToPounds } from '@/lib/supabase';

interface HeaderProps {
  coins: number;
  tokens: number;
  gamesWon: number;
  bestTime: number | null;
  moves: number;
  seconds: number;
  levelInfo: LevelInfo;
  winningsPence: number;
  characterEmoji: string;
  playerName: string;
  winStreak: number;
  adsWatchedToday: number;
  dailyAdCap: number;
  currentWager: number;
  onOpenShop: () => void;
  onOpenLevels: () => void;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  onOpenCustomize: () => void;
  onWatchAd: () => void;
  onOpenWager: () => void;
  onOpenLuckyPick: () => void;
  onOpenSpeedMatch: () => void;
  onOpenResponsibleGambling: () => void;
  speedPoints: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  dailyStreak: number;
  onOpenDailyReward: () => void;
  dailyRewardClaimed: boolean;
}

export function Header({ coins, tokens, gamesWon, bestTime, moves, seconds, levelInfo, winningsPence, characterEmoji, playerName, winStreak, adsWatchedToday, dailyAdCap, currentWager, onOpenShop, onOpenLevels, onOpenWallet, onOpenProfile, onOpenCustomize, onWatchAd, onOpenWager, onOpenLuckyPick, onOpenSpeedMatch, onOpenResponsibleGambling, speedPoints, musicEnabled, sfxEnabled, onToggleMusic, onToggleSfx, dailyStreak, onOpenDailyReward, dailyRewardClaimed }: HeaderProps) {
  const timeStr = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const bestStr = bestTime != null ? `${Math.floor(bestTime / 60)}:${String(bestTime % 60).padStart(2, '0')}` : '—';

  return (
    <header className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-teal-950/60 backdrop-blur border-b border-teal-800/50">
      <div className="flex items-center gap-2">
        <button onClick={onOpenProfile} className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-900/30 hover:scale-105 transition-transform overflow-hidden">
          <img src="/mascot-magpie.webp" alt="Mega Magpie" className="w-full h-full object-cover" />
          <div className="absolute inset-0 shimmer-bg opacity-30" />
        </button>
        <div className="leading-tight hidden sm:block">
          <div className="text-sm font-bold tracking-wide text-teal-50">{playerName}</div>
          <div className="text-[10px] text-cyan-300/80 uppercase tracking-widest">Mega Magpie Solitaire</div>
        </div>
        {winStreak >= 2 && (
          <div className="flex items-center gap-0.5 ml-1 px-1.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/40 animate-glow-amber" title={`Win streak: ${winStreak} in a row!`}>
            {Array.from({ length: Math.min(3, Math.floor(winStreak / 2)) }).map((_, i) => (
              <Flame key={i} className="w-3 h-3 text-orange-400 animate-streak-flame" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
            <span className="text-[10px] font-bold text-orange-300 ml-0.5">{winStreak}</span>
          </div>
        )}
        {dailyStreak > 0 && (
          <button
            onClick={onOpenDailyReward}
            className={`flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full border transition-all ${
              dailyRewardClaimed
                ? 'bg-teal-800/40 border-teal-700/40'
                : 'bg-amber-500/20 border-amber-400/50 animate-pulse-glow'
            }`}
            title={`Daily login streak: ${dailyStreak} days${!dailyRewardClaimed ? ' — tap to claim today\'s reward!' : ''}`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-bold text-amber-200">{dailyStreak}</span>
          </button>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-4 text-teal-100/90">
        <Stat icon={<Clock className="w-3.5 h-3.5" />} label="Time" value={timeStr} />
        <Stat icon={<RotateCcw className="w-3.5 h-3.5" />} label="Moves" value={String(moves)} />
        <Stat icon={<Trophy className="w-3.5 h-3.5" />} label="Wins" value={String(gamesWon)} />
        <Stat icon={<Clock className="w-3.5 h-3.5" />} label="Best" value={bestStr} />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onToggleMusic}
          className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${musicEnabled ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300' : 'bg-teal-800/50 border-teal-700/40 text-teal-500/50'}`}
          title={musicEnabled ? 'Music on — click to mute' : 'Music muted — click to enable'}
        >
          {musicEnabled ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <button
          onClick={onToggleSfx}
          className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${sfxEnabled ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300' : 'bg-teal-800/50 border-teal-700/40 text-teal-500/50'}`}
          title={sfxEnabled ? 'Sound effects on — click to mute' : 'Sound effects muted — click to enable'}
        >
          {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <button
          onClick={onOpenLuckyPick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-colors bg-teal-800/50 hover:bg-teal-700/60 border-teal-700/40"
          title="Lucky Pick — win tokens with a mini-game"
        >
          <Gift className="w-4 h-4" style={{ color: '#ff7eb6' }} />
          <span className="text-xs font-semibold text-teal-100 hidden md:inline">Lucky Pick</span>
        </button>
        <button
          onClick={onOpenSpeedMatch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-colors bg-teal-800/50 hover:bg-teal-700/60 border-teal-700/40"
          title="Speed Match — compete for points"
        >
          <Users className="w-4 h-4 text-cyan-300" />
          <span className="text-xs font-semibold text-teal-100 hidden md:inline">Speed Match</span>
          {speedPoints > 0 && <span className="text-[10px] font-bold text-cyan-200 tabular-nums hidden lg:inline">{speedPoints}</span>}
        </button>
        <button
          onClick={onOpenResponsibleGambling}
          className="flex items-center justify-center w-8 h-8 rounded-full border transition-colors bg-teal-800/50 hover:bg-teal-700/60 border-teal-700/40"
          title="Play Safe — responsible play info"
        >
          <ShieldCheck className="w-4 h-4 text-teal-300" />
        </button>
        <button
          onClick={onOpenLevels}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-teal-800/50 hover:bg-teal-700/60 border border-teal-700/40 transition-colors"
        >
          <Star className="w-4 h-4 text-amber-300" />
          <span className="text-sm font-semibold text-teal-100">Lv {levelInfo.level}</span>
        </button>
        <button
          onClick={onOpenCustomize}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-teal-800/50 hover:bg-teal-700/60 border border-teal-700/40 transition-colors"
          title="Customize"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
        </button>
        <button
          onClick={onOpenWager}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-colors ${currentWager > 0 ? 'bg-cyan-500/20 border-cyan-400/50' : 'bg-teal-800/50 hover:bg-teal-700/60 border-teal-700/40'}`}
          title={currentWager > 0 ? `Stake active: ${currentWager} coins staked` : 'Set a stake for bigger rewards'}
        >
          <TrendingUp className={`w-4 h-4 ${currentWager > 0 ? 'text-cyan-300' : 'text-teal-300'}`} />
          {currentWager > 0 && <span className="text-xs font-bold text-cyan-200 tabular-nums hidden sm:inline">{currentWager}</span>}
        </button>
        <button
          onClick={onOpenWallet}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-teal-800/50 hover:bg-teal-700/60 border border-teal-700/40 transition-colors"
        >
          <Wallet className="w-4 h-4 text-teal-300" />
          <span className="text-sm font-semibold text-teal-100 tabular-nums hidden sm:inline">{penceToPounds(winningsPence)}</span>
        </button>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30" title="Tokens — earned by watching ads and as cashback on coin spends">
          <Zap className="w-4 h-4 text-cyan-300" />
          <span className="font-bold text-cyan-200 tabular-nums text-sm">{tokens.toLocaleString()}</span>
        </div>
        <button
          onClick={onWatchAd}
          disabled={adsWatchedToday >= dailyAdCap}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
            adsWatchedToday >= dailyAdCap
              ? 'bg-cyan-800/60'
              : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 shadow-cyan-500/40 animate-pulse-glow'
          }`}
          title={adsWatchedToday >= dailyAdCap ? 'Daily ad limit reached — come back tomorrow' : `Watch a free ad for ${25} tokens (${adsWatchedToday}/${dailyAdCap} watched today)`}
        >
          <Play className="w-4 h-4" fill="currentColor" />
          <span className="font-bold">Free Tokens</span>
          {adsWatchedToday < dailyAdCap && (
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-white/25 text-[10px] font-extrabold tabular-nums">
              {dailyAdCap - adsWatchedToday}
            </span>
          )}
        </button>
        <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 overflow-hidden">
          <Coins className="w-4 h-4 text-amber-300 animate-coin-shine" />
          <span className="font-bold text-amber-200 tabular-nums text-sm">{coins.toLocaleString()}</span>
          <div className="absolute inset-0 shimmer-bg opacity-10 pointer-events-none" />
        </div>
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-full bg-teal-600 hover:bg-teal-500 text-teal-50 text-sm font-semibold transition-colors shadow-md"
        >
          <Coins className="w-4 h-4" />
          <span className="hidden sm:inline">Shop</span>
        </button>
      </div>
    </header>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-teal-400/70">{icon}</span>
      <span className="text-[10px] uppercase tracking-wider text-teal-400/70">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}
