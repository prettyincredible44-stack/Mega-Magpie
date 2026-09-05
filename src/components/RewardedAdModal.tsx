import { X, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { sounds } from '@/lib/sounds';

interface RewardedAdModalProps {
  onClose: () => void;
  onReward: () => void;
  adsWatchedToday: number;
}

export default function RewardedAdModal({ onClose, onReward, adsWatchedToday }: RewardedAdModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setDone(true);
      sounds.coin();
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl">
        <div className="p-6 text-center">
          {!done ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-xl flex items-center justify-center">
                <Play className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-white font-bold text-lg mb-2">Ad playing...</p>
              <p className="text-slate-400 text-sm">Reward in {countdown}s</p>
              <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-cozy-500 transition-all" style={{ width: `${((5 - countdown) / 5) * 100}%` }} />
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4 animate-sparkle-burst">🪙</div>
              <p className="text-white font-bold text-lg mb-2">Reward earned!</p>
              <p className="text-cozy-400 font-bold text-xl mb-4">+50 coins</p>
              <p className="text-slate-400 text-xs mb-4">{adsWatchedToday}/10 ads watched today</p>
              <button
                onClick={() => {
                  onReward();
                  onClose();
                }}
                className="w-full py-3 bg-cozy-500 hover:bg-cozy-600 text-white rounded-lg font-bold transition"
              >
                Collect
              </button>
            </>
          )}
          {countdown > 0 && (
            <button onClick={onClose} className="mt-3 text-slate-400 text-sm hover:text-slate-300 transition">
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
