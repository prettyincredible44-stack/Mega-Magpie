import { X, Star, Trophy, Crown, Check, Lock, Target } from 'lucide-react';
import { LEVELS, MAX_LEVEL, getLevelProgress, MILESTONE_TIERS, MILESTONE_WINS } from '@/game/levels';
import { penceToPounds } from '@/lib/supabase';

interface LevelModalProps {
  open: boolean;
  xp: number;
  level: number;
  maxLevelReached: number;
  onClose: () => void;
}

export function LevelModal({ open, xp, level, maxLevelReached, onClose }: LevelModalProps) {
  if (!open) return null;
  const progress = getLevelProgress(xp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl animate-win-pop overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-teal-400 hover:text-teal-200 hover:bg-teal-800/50 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-7 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-teal-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-50">Levels &amp; Awards</h2>
              <p className="text-sm text-teal-400/80">Win games to earn XP and level up</p>
            </div>
          </div>

          {/* Current progress bar */}
          <div className="mt-4 mb-5 p-3 rounded-xl bg-teal-800/40 border border-teal-700/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-teal-100">
                Level {progress.current.level} — {progress.current.name}
              </span>
              {progress.next ? (
                <span className="text-xs text-teal-400/80">
                  {progress.xpIntoLevel} / {progress.xpForNext} XP
                </span>
              ) : (
                <span className="text-xs text-amber-300 font-semibold">MAX LEVEL</span>
              )}
            </div>
            <div className="h-2.5 rounded-full bg-teal-950/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                style={{ width: `${progress.pct}%` }}
              />
            </div>
          </div>

          {/* Level list */}
          <div className="space-y-2">
            {LEVELS.map((lvl) => {
              const reached = maxLevelReached >= lvl.level;
              const isCurrent = lvl.level === level;
              const isMax = lvl.level === MAX_LEVEL;
              return (
                <div
                  key={lvl.level}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-500/15 border-amber-400/50 ring-1 ring-amber-400/30'
                      : reached
                        ? 'bg-teal-800/30 border-teal-700/40'
                        : 'bg-teal-950/40 border-teal-800/40 opacity-60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isMax && reached
                      ? 'bg-gradient-to-br from-amber-300 to-amber-600'
                      : reached
                        ? 'bg-teal-600/60'
                        : 'bg-teal-900/60'
                  }`}>
                    {isMax ? (
                      <Crown className="w-5 h-5 text-teal-950" />
                    ) : reached ? (
                      <Check className="w-5 h-5 text-teal-100" />
                    ) : (
                      <Lock className="w-4 h-4 text-teal-500/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-teal-50 text-sm">Lv {lvl.level}</span>
                      <span className="text-teal-400/70 text-sm">{lvl.name}</span>
                      {isCurrent && <span className="text-[10px] text-amber-300 font-bold uppercase">Current</span>}
                    </div>
                    <div className="text-xs text-teal-500/70">
                      {lvl.xpRequired} XP{isMax ? ` · Award: ${penceToPounds(lvl.awardPence)}` : ''}
                    </div>
                  </div>
                  {isMax && (
                    <div className={`text-xs font-bold ${reached ? 'text-amber-300' : 'text-teal-500/50'}`}>
                      {reached ? <Trophy className="w-4 h-4" /> : penceToPounds(lvl.awardPence)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Milestone tier legend */}
          <div className="mt-4 p-3 rounded-xl bg-teal-800/30 border border-teal-700/40">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-cyan-300" />
              <span className="text-sm font-semibold text-teal-100">Cash Milestones</span>
            </div>
            <p className="text-xs text-teal-400/70 mb-2">Win {MILESTONE_WINS} games to earn cash at your current tier:</p>
            <div className="space-y-1.5">
              {MILESTONE_TIERS.map((t) => (
                <div key={t.minLevel} className="flex items-center justify-between text-xs">
                  <span className="text-teal-300/80">Levels {t.minLevel}-{t.maxLevel} ({t.name})</span>
                  <span className="font-bold text-amber-300">{penceToPounds(t.awardPence)} per {MILESTONE_WINS} wins</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-teal-700/30 mt-1.5">
                <span className="text-teal-300/80">Level {MAX_LEVEL} (Magpie King)</span>
                <span className="font-bold text-amber-300">{penceToPounds(LEVELS[MAX_LEVEL - 1].awardPence)} one-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
