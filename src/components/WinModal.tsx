import { Play, Clock, Hash, Coins, Sparkles } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface WinModalProps {
  moves: number;
  timeSeconds: number;
  coinsWon: number;
  xpWon: number;
  onClose: () => void;
  onNewGame: () => void;
}

export default function WinModal({ moves, timeSeconds, coinsWon, xpWon, onClose, onNewGame }: WinModalProps) {
  const m = Math.floor(timeSeconds / 60);
  const s = timeSeconds % 60;
  const time = `${m}:${s.toString().padStart(2, '0')}`;

  const stats = [
    { icon: Clock, label: 'Time', value: time, color: 'text-brand-400' },
    { icon: Hash, label: 'Moves', value: moves, color: 'text-white' },
    { icon: Coins, label: 'Points', value: `+${coinsWon}`, color: 'text-cozy-400' },
    { icon: Sparkles, label: 'XP', value: `+${xpWon}`, color: 'text-brand-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-fade-in">
      <div className="w-full max-w-xs rounded-2xl border border-brand-700/40 bg-felt-800 shadow-2xl animate-slide-up">
        <div className="p-6 text-center">
          <img src="/cute-trophy.webp" alt="Trophy" className="mx-auto mb-3 h-20 w-20 animate-bounce-cozy" />
          <h2 className="text-2xl font-bold text-white">You Win!</h2>
          <p className="mt-1 mb-5 text-sm text-white/50">Great solitaire skills!</p>

          <div className="mb-5 grid grid-cols-4 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-brand-800/50 bg-felt-700/60 p-2.5">
                <s.icon className={`mx-auto mb-1 h-4 w-4 ${s.color}`} />
                <p className="text-[10px] text-white/40">{s.label}</p>
                <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10"
            >
              Close
            </button>
            <button
              onClick={() => { sounds.click(); onNewGame(); }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-sm font-bold text-white transition hover:bg-brand-500 active:scale-95"
            >
              <Play className="h-4 w-4" />
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
