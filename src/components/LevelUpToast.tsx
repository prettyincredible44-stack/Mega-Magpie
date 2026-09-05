import { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { getLevelInfo } from '@/game/levels';
import { sounds } from '@/lib/sounds';

interface LevelUpToastProps {
  level: number;
  onDismiss: () => void;
}

export default function LevelUpToast({ level, onDismiss }: LevelUpToastProps) {
  const levelInfo = getLevelInfo(level);

  useEffect(() => {
    sounds.levelUp();
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-sparkle-burst">
      <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-500/90 to-orange-500/90 rounded-xl shadow-2xl border border-amber-300/50 backdrop-blur-sm">
        <Trophy className="w-6 h-6 text-white animate-bounce-cozy" />
        <div>
          <p className="text-white font-bold text-sm">Level Up!</p>
          <p className="text-amber-100 text-xs">Now Level {level} - {levelInfo.name}</p>
        </div>
      </div>
    </div>
  );
}
