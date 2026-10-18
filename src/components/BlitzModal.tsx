import { useEffect, useState } from 'react';
import { Zap, Play, Clock, Trophy, Coins, Sparkles, RotateCcw, X } from 'lucide-react';
import { sounds } from '@/lib/sounds';

type BlitzPhase = 'intro' | 'results';

interface BlitzResult {
  gamesCleared: number;
  totalMoves: number;
  timeUsed: number;
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  xpEarned: number;
}

interface BlitzModalProps {
  phase: BlitzPhase;
  result?: BlitzResult | null;
  bestBlitz?: number;
  onClose: () => void;
  onStart: () => void;
  onPlayAgain: () => void;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex justify-center gap-1.5">
      {[1, 2, 3].map((n) => (
        <Sparkles
          key={n}
          className={`h-6 w-6 transition-all ${
            n <= count ? 'text-gold-400 scale-110' : 'text-white/15 scale-90'
          }`}
        />
      ))}
    </div>
  );
}

function getResultStars(gamesCleared: number): number {
  if (gamesCleared >= 3) return 3;
  if (gamesCleared >= 2) return 2;
  if (gamesCleared >= 1) return 1;
  return 0;
}

export default function BlitzModal({ phase, result, bestBlitz = 0, onClose, onStart, onPlayAgain }: BlitzModalProps) {
  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-fade-in">
        <div className="w-full max-w-sm rounded-2xl border border-brand-700/40 bg-felt-800 shadow-2xl animate-slide-up">
          <div className="relative p-6 text-center">
            <button
              onClick={() => { sounds.click(); onClose(); }}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-magical-600 shadow-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-white">5 Minute Blitz</h2>
            <p className="mt-1.5 text-sm text-white/50">Race against the clock — clear as many solitaire games as you can!</p>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-3 rounded-xl border border-brand-800/50 bg-felt-700/60 px-4 py-3 text-left">
                <Clock className="h-5 w-5 shrink-0 text-brand-400" />
                <div>
                  <p className="text-sm font-semibold text-white">5 minute timer</p>
                  <p className="text-xs text-white/40">Beat the clock to clear games fast</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-brand-800/50 bg-felt-700/60 px-4 py-3 text-left">
                <Trophy className="h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Bonus points</p>
                  <p className="text-xs text-white/40">100 points per clear + speed bonuses</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-brand-800/50 bg-felt-700/60 px-4 py-3 text-left">
                <Sparkles className="h-5 w-5 shrink-0 text-magical-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Double XP</p>
                  <p className="text-xs text-white/40">All XP earned during Blitz is doubled</p>
                </div>
              </div>
            </div>

            {bestBlitz > 0 && (
              <p className="mt-4 text-xs text-white/40">
                Best run: <span className="font-bold text-gold-400">{bestBlitz} cleared</span>
              </p>
            )}

            <button
              onClick={() => { sounds.click(); onStart(); }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-magical-600 py-3 text-base font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95"
            >
              <Play className="h-5 w-5" />
              Start Blitz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results phase
  const r = result;
  if (!r) return null;

  const stars = getResultStars(r.gamesCleared);
  const m = Math.floor(r.timeUsed / 60);
  const s = r.timeUsed % 60;
  const timeStr = `${m}:${s.toString().padStart(2, '0')}`;
  const isRecord = r.gamesCleared > bestBlitz;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl border border-brand-700/40 bg-felt-800 shadow-2xl animate-slide-up">
        <div className="p-6 text-center">
          <div className="mb-3">
            <Stars count={stars} />
          </div>

          <h2 className="text-2xl font-bold text-white">
            {isRecord ? 'New Record!' : 'Blitz Complete!'}
          </h2>
          <p className="mt-1 text-sm text-white/50">
            {r.gamesCleared === 0 ? 'No games cleared — try again!' : `${r.gamesCleared} game${r.gamesCleared !== 1 ? 's' : ''} cleared`}
          </p>

          {isRecord && r.gamesCleared > 0 && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1">
              <Trophy className="h-3.5 w-3.5 text-gold-400" />
              <span className="text-xs font-bold text-gold-300">Personal Best</span>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-brand-800/50 bg-felt-700/60 p-3">
              <Clock className="mx-auto mb-1 h-4 w-4 text-brand-400" />
              <p className="text-[10px] text-white/40">Time</p>
              <p className="text-sm font-bold text-white">{timeStr}</p>
            </div>
            <div className="rounded-xl border border-brand-800/50 bg-felt-700/60 p-3">
              <Trophy className="mx-auto mb-1 h-4 w-4 text-gold-400" />
              <p className="text-[10px] text-white/40">Cleared</p>
              <p className="text-sm font-bold text-gold-400">{r.gamesCleared}</p>
            </div>
            <div className="rounded-xl border border-brand-800/50 bg-felt-700/60 p-3">
              <Coins className="mx-auto mb-1 h-4 w-4 text-cozy-400" />
              <p className="text-[10px] text-white/40">Base</p>
              <p className="text-sm font-bold text-cozy-400">+{r.basePoints}</p>
            </div>
            <div className="rounded-xl border border-brand-800/50 bg-felt-700/60 p-3">
              <Zap className="mx-auto mb-1 h-4 w-4 text-magical-400" />
              <p className="text-[10px] text-white/40">Speed Bonus</p>
              <p className="text-sm font-bold text-magical-400">+{r.bonusPoints}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gold-700/30 bg-gold-500/10 px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <Coins className="h-5 w-5 text-gold-400" />
              <span className="text-xl font-bold text-gold-300">+{r.totalPoints} points</span>
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" />
              <span className="text-sm font-semibold text-brand-300">+{r.xpEarned} XP</span>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => { sounds.click(); onClose(); }}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10"
            >
              Done
            </button>
            <button
              onClick={() => { sounds.click(); onPlayAgain(); }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-magical-600 py-2.5 text-sm font-bold text-white transition hover:brightness-110 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
