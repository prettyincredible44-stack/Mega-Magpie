import { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Timer } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface SpeedMatchModalProps {
  onClose: () => void;
  onComplete: (score: number, won: boolean, wagered: number) => void;
  tokens: number;
}

const SEQUENCE_LENGTH = 5;
const TIME_LIMIT = 30;

export default function SpeedMatchModal({ onClose, onComplete, tokens }: SpeedMatchModalProps) {
  const [phase, setPhase] = useState<'menu' | 'playing' | 'done'>('menu');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [showing, setShowing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startRound = () => {
    const seq = Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * 4));
    setSequence(seq);
    setUserInput([]);
    setShowing(true);
    setRound((r) => r + 1);

    setTimeout(() => {
      setShowing(false);
      setPhase('playing');
      setTimeLeft(TIME_LIMIT);
    }, SEQUENCE_LENGTH * 600 + 500);
  };

  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (phase === 'playing' && timeLeft === 0) {
      setPhase('done');
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, timeLeft]);

  const handleClick = (idx: number) => {
    if (phase !== 'playing') return;
    sounds.click();
    const next = [...userInput, idx];
    setUserInput(next);

    if (next[next.length - 1] !== sequence[next.length - 1]) {
      setPhase('done');
      return;
    }

    if (next.length === sequence.length) {
      setScore((s) => s + round * 10 + timeLeft);
      sounds.win();
      setTimeout(startRound, 800);
    }
  };

  const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={phase === 'menu' || phase === 'done' ? onClose : undefined}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {phase === 'menu' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Speed Match</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-slate-300 text-sm mb-4">Watch the sequence, then repeat it before time runs out. Each round gets harder!</p>
            <button onClick={() => { sounds.click(); startRound(); }} className="w-full flex items-center justify-center gap-2 py-3 bg-cozy-500 hover:bg-cozy-600 text-white rounded-lg font-bold transition">
              <Play className="w-4 h-4" /> Start
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-semibold">Round {round}</span>
              <span className="text-white">Score: {score}</span>
              <div className="flex items-center gap-1">
                <Timer className="w-4 h-4 text-magical-400" />
                <span className="text-white font-mono">{timeLeft}s</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {COLORS.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleClick(idx)}
                  className="aspect-square rounded-xl border-2 border-slate-600 hover:scale-105 transition active:scale-95"
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        )}

        {showing && (
          <div className="p-6">
            <p className="text-white text-center mb-4">Watch the sequence...</p>
            <div className="grid grid-cols-2 gap-3">
              {COLORS.map((color, idx) => {
                const isLit = sequence[userInput.length] === idx;
                return (
                  <div
                    key={idx}
                    className="aspect-square rounded-xl border-2 border-slate-600 transition-all"
                    style={{ background: color, opacity: isLit ? 1 : 0.3, transform: isLit ? 'scale(1.05)' : 'scale(1)' }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Game Over</h2>
            <p className="text-slate-300 mb-1">Final Score: {score}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setScore(0); setRound(0); setPhase('menu'); }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">
                <RotateCcw className="w-4 h-4" /> Retry
              </button>
              <button onClick={() => { onComplete(score, score > 0, 0); onClose(); }} className="flex-1 py-3 bg-cozy-500 hover:bg-cozy-600 text-white rounded-lg font-bold transition">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
