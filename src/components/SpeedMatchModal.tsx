import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Zap, Trophy, Clock, Play, Users, Medal, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SpeedMatchModalProps {
  open: boolean;
  playerName: string;
  speedPoints: number;
  coins: number;
  onClose: () => void;
  onComplete: (result: { score: number; moves: number; timeSeconds: number; won: boolean; wagered: number }) => void;
}

interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  moves: number;
  time_seconds: number;
  won: boolean;
  created_at: string;
}

const ENTRY_FEE = 10;
const MATCH_DURATION = 180; // 3 minutes
const BASE_SCORE = 500;
const TIME_BONUS_PER_SEC = 3;
const MOVE_PENALTY = 2;

export function SpeedMatchModal({ open, playerName, speedPoints, coins, onClose, onComplete }: SpeedMatchModalProps) {
  const [phase, setPhase] = useState<'lobby' | 'countdown' | 'playing' | 'finished'>('lobby');
  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [matchResult, setMatchResult] = useState<{ score: number; moves: number; timeSeconds: number; won: boolean } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadLeaderboard = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('speed_matches')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
      setLeaderboard((data ?? []) as LeaderboardEntry[]);
    } catch (err) {
      console.error('failed to load leaderboard', err);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadLeaderboard();
      setPhase('lobby');
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [open, loadLeaderboard]);

  const startMatch = useCallback(() => {
    if (coins < ENTRY_FEE) return;
    setPhase('countdown');
    setCountdown(3);
    setMoves(0);
    setScore(BASE_SCORE);
    setTimeLeft(MATCH_DURATION);

    const cd = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(cd);
          setPhase('playing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [coins]);

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          finishMatch(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const finishMatch = useCallback((won: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const timeUsed = MATCH_DURATION - timeLeft;
    const timeBonus = won ? timeLeft * TIME_BONUS_PER_SEC : 0;
    const movePenalty = moves * MOVE_PENALTY;
    const finalScore = Math.max(0, BASE_SCORE + timeBonus - movePenalty);
    const result = { score: finalScore, moves, timeSeconds: timeUsed, won };
    setMatchResult(result);
    setScore(finalScore);
    setPhase('finished');
    onComplete({ ...result, wagered: ENTRY_FEE });
  }, [timeLeft, moves, onComplete]);

  const handleWin = () => finishMatch(true);
  const handleMove = () => setMoves((m) => m + 1);

  if (!open) return null;

  const timeStr = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;
  const canPlay = coins >= ENTRY_FEE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl animate-win-pop overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5" style={{ background: 'linear-gradient(90deg, #ff7eb6, #ff5a7e, #ff7eb6)' }} />
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-cyan-300/80 hover:text-cyan-200 hover:bg-teal-800/50 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-7 overflow-y-auto no-scrollbar">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #ff7eb6, #ff5a7e)' }}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-teal-50">Speed Match</h2>
              <p className="text-sm text-cyan-300/80">Race the clock, earn points, climb the board</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30">
              <Trophy className="w-4 h-4 text-cyan-300" />
              <span className="text-sm font-bold text-cyan-200 tabular-nums">{speedPoints.toLocaleString()}</span>
            </div>
          </div>

          {/* Lobby */}
          {phase === 'lobby' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-teal-800/30 border border-teal-700/40">
                <h3 className="text-sm font-semibold text-teal-100 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-300" />
                  How It Works
                </h3>
                <ul className="space-y-1.5 text-xs text-teal-300/70">
                  <li>Pay {ENTRY_FEE} coins to enter a speed match</li>
                  <li>You have {MATCH_DURATION / 60} minutes to complete a game of solitaire</li>
                  <li>Win fast for maximum time bonus ({TIME_BONUS_PER_SEC} pts per second remaining)</li>
                  <li>Fewer moves = higher score ({MOVE_PENALTY} pt penalty per move)</li>
                  <li>Earn speed points to climb the global leaderboard</li>
                </ul>
              </div>

              <button
                onClick={startMatch}
                disabled={!canPlay}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-teal-950 font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                {canPlay ? `Enter Match (${ENTRY_FEE} coins)` : 'Not enough coins'}
              </button>

              {/* Leaderboard */}
              <div>
                <h3 className="text-sm font-semibold text-teal-100 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-300" />
                  Leaderboard — Top 10
                </h3>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-6 text-teal-500/50 text-sm">No matches yet. Be the first!</div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                    {leaderboard.map((entry, i) => (
                      <div key={entry.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${
                        i === 0 ? 'bg-amber-500/10 border-amber-400/30' : 'bg-teal-800/30 border-teal-700/30'
                      }`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-amber-400 text-teal-950' : i === 1 ? 'bg-teal-300 text-teal-950' : i === 2 ? 'bg-orange-400 text-teal-950' : 'bg-teal-700 text-teal-200'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-teal-100 truncate">{entry.player_name}</div>
                          <div className="text-[10px] text-teal-400/60">
                            {entry.won ? 'Won' : 'Lost'} · {entry.moves} moves · {Math.floor(entry.time_seconds / 60)}:{String(entry.time_seconds % 60).padStart(2, '0')}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-cyan-200 tabular-nums">{entry.score.toLocaleString()}</div>
                        {i === 0 && <Medal className="w-4 h-4 text-amber-300" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Countdown */}
          {phase === 'countdown' && (
            <div className="text-center py-12">
              <p className="text-sm text-cyan-300/70 mb-4">Starting in...</p>
              <div className="text-7xl font-bold text-cyan-200 animate-win-pop" key={countdown}>{countdown}</div>
              <p className="text-sm text-teal-400/60 mt-4">Get ready to play fast!</p>
            </div>
          )}

          {/* Playing */}
          {phase === 'playing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-3 rounded-xl bg-teal-800/40 border border-teal-700/40">
                  <Clock className="w-5 h-5 text-cyan-300 mb-1" />
                  <span className="text-xl font-bold text-teal-50 tabular-nums">{timeStr}</span>
                  <span className="text-[10px] uppercase text-teal-400/60">Time Left</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-teal-800/40 border border-teal-700/40">
                  <RotateCcw className="w-5 h-5 text-amber-300 mb-1" />
                  <span className="text-xl font-bold text-teal-50 tabular-nums">{moves}</span>
                  <span className="text-[10px] uppercase text-teal-400/60">Moves</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-teal-800/40 border border-teal-700/40">
                  <Trophy className="w-5 h-5 text-cyan-300 mb-1" />
                  <span className="text-xl font-bold text-teal-50 tabular-nums">{score}</span>
                  <span className="text-[10px] uppercase text-teal-400/60">Score</span>
                </div>
              </div>

              <p className="text-center text-sm text-cyan-300/70">
                Go back to your game and play solitaire! Tap "I Won!" when you complete the game, or wait for the timer to end.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleMove}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-800/50 hover:bg-teal-800/70 text-teal-200 font-semibold text-sm transition-colors border border-teal-700/40"
                >
                  <RotateCcw className="w-4 h-4" />
                  Log a Move
                </button>
                <button
                  onClick={handleWin}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-teal-950 font-bold transition-all shadow-lg"
                >
                  <Trophy className="w-4 h-4" />
                  I Won!
                </button>
              </div>
            </div>
          )}

          {/* Finished */}
          {phase === 'finished' && matchResult && (
            <div className="text-center py-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-xl mb-3 ${
                matchResult.won ? 'bg-gradient-to-br from-amber-300 to-amber-600' : 'bg-teal-800/60'
              }`}>
                {matchResult.won ? <Trophy className="w-9 h-9 text-teal-950" /> : <Clock className="w-9 h-9 text-teal-300" />}
              </div>

              <h3 className="text-xl font-bold text-teal-50 mb-1">
                {matchResult.won ? 'Match Won!' : 'Time\'s Up!'}
              </h3>
              <p className="text-sm text-cyan-300/80 mb-4">
                {matchResult.won ? 'You completed the game in time!' : 'The timer ran out. Try again!'}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col items-center p-2.5 rounded-lg bg-teal-800/40 border border-teal-700/40">
                  <Trophy className="w-4 h-4 text-cyan-300 mb-0.5" />
                  <span className="text-lg font-bold text-teal-50 tabular-nums">{matchResult.score}</span>
                  <span className="text-[10px] uppercase text-teal-400/60">Score</span>
                </div>
                <div className="flex flex-col items-center p-2.5 rounded-lg bg-teal-800/40 border border-teal-700/40">
                  <RotateCcw className="w-4 h-4 text-amber-300 mb-0.5" />
                  <span className="text-lg font-bold text-teal-50 tabular-nums">{matchResult.moves}</span>
                  <span className="text-[10px] uppercase text-teal-400/60">Moves</span>
                </div>
                <div className="flex flex-col items-center p-2.5 rounded-lg bg-teal-800/40 border border-teal-700/40">
                  <Clock className="w-4 h-4 text-cyan-300 mb-0.5" />
                  <span className="text-lg font-bold text-teal-50 tabular-nums">{Math.floor(matchResult.timeSeconds / 60)}:{String(matchResult.timeSeconds % 60).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase text-teal-400/60">Time</span>
                </div>
              </div>

              <p className="text-sm text-cyan-300 mb-4">
                +{matchResult.score} speed points earned!
              </p>

              <button
                onClick={() => { setPhase('lobby'); setMatchResult(null); }}
                className="px-6 py-2.5 rounded-xl bg-teal-800/50 hover:bg-teal-800/70 text-teal-200 font-semibold text-sm transition-colors border border-teal-700/40"
              >
                Back to Lobby
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
