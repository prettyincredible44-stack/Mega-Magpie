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
      <div className="glass w-full max-w-sm rounded-2xl shadow-2xl">
        <div className="p-6 text-center">
          {!done ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-felt-700 rounded-xl flex items-center justify-center">
                <Play className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white font-bold text-lg mb-2">Ad playing...</p>
              <p className="text-white/40 text-sm">Reward in {countdown}s</p>
              <div className="mt-4 h-2 bg-felt-700 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 transition-all" style={{ width: `${((5 - countdown) / 5) * 100}%` }} />
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">🪙</div>
              <p className="text-white font-bold text-lg mb-2">Reward earned!</p>
              <p className="text-cozy-400 font-bold text-xl mb-4">+50 points</p>
              <p className="text-white/40 text-xs mb-4">{adsWatchedToday}/10 ads watched today</p>
              <button
                onClick={() => {
                  onReward();
                  onClose();
                }}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold transition active:scale-95"
              >
                Collect
              </button>
            </>
          )}
          {countdown > 0 && (
            <button onClick={onClose} className="mt-3 text-white/40 text-sm hover:text-white/60 transition">
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
