import { useEffect, useState } from 'react';
import { Star, X, Sparkles } from 'lucide-react';
import { LevelInfo } from '@/game/levels';

interface LevelUpToastProps {
  level: LevelInfo | null;
  onDismiss: () => void;
}

export function LevelUpToast({ level, onDismiss }: LevelUpToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (level) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [level, onDismiss]);

  if (!level) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="relative">
        {/* Sparkles around toast */}
        <Sparkles className="absolute -top-2 -left-2 w-4 h-4 text-amber-300 animate-sparkle" />
        <Sparkles className="absolute -top-1 -right-2 w-3 h-3 text-amber-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute -bottom-1 -left-1 w-3 h-3 text-amber-200 animate-sparkle" style={{ animationDelay: '1s' }} />

        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-900 to-teal-950 border border-amber-400/50 shadow-2xl shadow-amber-900/30 animate-glow-amber">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center animate-float-magical">
            <Star className="w-5 h-5 text-teal-950" fill="currentColor" />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-amber-300/80 uppercase tracking-wide font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Level Up!
            </div>
            <div className="text-base font-bold gold-text">
              Level {level.level} — {level.name}
            </div>
          </div>
          <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }} className="ml-2 p-1 text-teal-400/60 hover:text-teal-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
