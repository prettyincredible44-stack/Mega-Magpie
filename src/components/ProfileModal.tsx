import { X, Star, Coins, Zap, Trophy, Clock, RotateCcw, Calendar, Sparkles, Target, Shuffle, LogOut } from 'lucide-react';
import { getCharacter, getOutfit } from '@/game/catalog';
import { getLevelProgress, getMilestoneTier, MILESTONE_WINS } from '@/game/levels';
import { penceToPounds } from '@/lib/supabase';
import { PlayerState } from '@/lib/supabase';

interface ProfileModalProps {
  open: boolean;
  player: PlayerState | null;
  onClose: () => void;
  onOpenCustomize: () => void;
  onRegenerateName: () => void;
  onSignOut: () => void;
}

export function ProfileModal({ open, player, onClose, onOpenCustomize, onRegenerateName, onSignOut }: ProfileModalProps) {
  if (!open || !player) return null;
  const character = getCharacter(player.active_character);
  const outfit = getOutfit(player.active_outfit);
  const progress = getLevelProgress(player.xp);
  const timeStr = player.best_time_seconds != null
    ? `${Math.floor(player.best_time_seconds / 60)}:${String(player.best_time_seconds % 60).padStart(2, '0')}`
    : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl animate-win-pop overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-teal-400 hover:text-teal-200 hover:bg-teal-800/50 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-7 overflow-y-auto no-scrollbar">
          {/* Character avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-xl" style={{ background: `${character.color}30`, border: `3px solid ${character.color}80` }}>
                {character.emoji}
              </div>
              {player.active_outfit !== 'default' && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xl shadow-lg" style={{ background: `${outfit.color}40`, border: `2px solid ${outfit.color}80` }}>
                  {outfit.emoji}
                </div>
              )}
            </div>
            <h2 className="mt-2 text-lg font-bold text-teal-50">{player.player_name}</h2>
            <p className="text-xs text-teal-400/80">Playing as {character.name}</p>
          </div>

          {/* Level progress */}
          <div className="p-3 rounded-xl bg-teal-800/40 border border-teal-700/40 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-semibold text-teal-100">Level {progress.current.level} — {progress.current.name}</span>
              </div>
              {progress.next ? (
                <span className="text-xs text-teal-400/80">{progress.xpIntoLevel}/{progress.xpForNext} XP</span>
              ) : (
                <span className="text-xs text-amber-300 font-semibold">MAX</span>
              )}
            </div>
            <div className="h-2 rounded-full bg-teal-950/60 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500" style={{ width: `${progress.pct}%` }} />
            </div>
          </div>

          {/* Currency balances */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <BalanceCard icon={<Coins className="w-4 h-4" />} value={player.coins.toLocaleString()} label="Coins" color="text-amber-300" />
            <BalanceCard icon={<Zap className="w-4 h-4" />} value={player.tokens.toLocaleString()} label="Tokens" color="text-cyan-300" />
            <BalanceCard icon={<Trophy className="w-4 h-4" />} value={penceToPounds(player.winnings_pence)} label="Winnings" color="text-teal-300" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatRow icon={<Trophy className="w-3.5 h-3.5" />} label="Games Won" value={String(player.games_won)} />
            <StatRow icon={<RotateCcw className="w-3.5 h-3.5" />} label="Games Played" value={String(player.games_played)} />
            <StatRow icon={<Clock className="w-3.5 h-3.5" />} label="Best Time" value={timeStr} />
            <StatRow icon={<Calendar className="w-3.5 h-3.5" />} label="Best Moves" value={player.best_moves != null ? String(player.best_moves) : '—'} />
            <StatRow icon={<Zap className="w-3.5 h-3.5" />} label="Speed Points" value={player.speed_points.toLocaleString()} />
            <StatRow icon={<Coins className="w-3.5 h-3.5" />} label="Lifetime Spent" value={player.lifetime_spent_coins.toLocaleString()} />
          </div>

          {/* Cash summary */}
          <div className="p-3 rounded-xl bg-teal-800/30 border border-teal-700/40 mb-3 space-y-1.5">
            <div className="text-xs font-semibold text-cyan-200 mb-1">Cash Summary</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-teal-300/80">Total Cash Won</span>
              <span className="font-bold text-emerald-300 tabular-nums">{penceToPounds(player.lifetime_won_pence)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-teal-300/80">Total Deposited</span>
              <span className="font-bold text-teal-200 tabular-nums">{penceToPounds(player.total_deposited_pence)}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-teal-700/30">
              <span className="text-teal-300/80">{player.lifetime_won_pence - player.total_deposited_pence >= 0 ? 'Net Profit' : 'Net Loss'}</span>
              <span className={`font-bold tabular-nums ${player.lifetime_won_pence - player.total_deposited_pence >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                {player.lifetime_won_pence - player.total_deposited_pence >= 0 ? '+' : ''}{penceToPounds(player.lifetime_won_pence - player.total_deposited_pence)}
              </span>
            </div>
          </div>

          {/* Milestone progress */}
          {(() => {
            const tier = getMilestoneTier(player.level);
            if (!tier) return null;
            const winsLeft = MILESTONE_WINS - player.wins_since_milestone;
            return (
              <div className="p-3 rounded-xl bg-teal-800/30 border border-teal-700/40 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm font-semibold text-teal-100">{tier.name} Tier — Cash Milestone</span>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-teal-400/70">{player.wins_since_milestone} / {MILESTONE_WINS} wins</span>
                  <span className="text-xs font-bold text-amber-300">{penceToPounds(tier.awardPence)} per payout</span>
                </div>
                <div className="h-2 rounded-full bg-teal-950/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-500"
                    style={{ width: `${(player.wins_since_milestone / MILESTONE_WINS) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-teal-500/60 mt-1.5">
                  {winsLeft > 0 ? `${winsLeft} more win${winsLeft === 1 ? '' : 's'} to earn ${penceToPounds(tier.awardPence)}` : 'Milestone earned! Claim in Wallet.'}
                </div>
                <div className="text-[10px] text-teal-500/50 mt-0.5">
                  {player.milestones_claimed} milestone{player.milestones_claimed === 1 ? '' : 's'} claimed total
                </div>
              </div>
            );
          })()}

          <button
            onClick={onOpenCustomize}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-teal-950 font-bold transition-all shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            Customize Look
          </button>
          <button
            onClick={onRegenerateName}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-800/50 hover:bg-teal-800/70 text-teal-200 font-medium text-sm transition-colors border border-teal-700/40"
          >
            <Shuffle className="w-4 h-4" />
            Get New Name
          </button>
        </div>
      </div>

      <button
        onClick={onSignOut}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-800/40 border border-teal-700/40 text-teal-300 hover:text-rose-300 hover:bg-rose-950/30 hover:border-rose-700/40 transition-all text-sm font-semibold"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}

function BalanceCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center p-2.5 rounded-xl bg-teal-800/40 border border-teal-700/40">
      <span className={color}>{icon}</span>
      <span className="text-sm font-bold text-teal-50 tabular-nums mt-1">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-teal-500/70">{label}</span>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-800/30 border border-teal-700/40">
      <span className="text-teal-400/70">{icon}</span>
      <span className="text-xs text-teal-400/70">{label}</span>
      <span className="text-sm font-semibold text-teal-100 ml-auto tabular-nums">{value}</span>
    </div>
  );
}
