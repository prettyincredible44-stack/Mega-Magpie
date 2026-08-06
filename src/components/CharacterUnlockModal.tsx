import { useEffect, useState } from 'react';
import { Sparkles, Star, X } from 'lucide-react';
import { Character } from '@/game/catalog';

interface CharacterUnlockModalProps {
  character: Character | null;
  onClose: () => void;
}

export function CharacterUnlockModal({ character, onClose }: CharacterUnlockModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (character) {
      setVisible(true);
    }
  }, [character]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!character) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      } bg-black/80 backdrop-blur-md`}
    >
      {/* Sparkle burst background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-300 animate-sparkle-float"
            style={{
              left: `${(i * 6.25) % 100}%`,
              top: `${(i * 11) % 100}%`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${1.5 + (i % 3) * 0.5}s`,
            }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
        ))}
      </div>

      <div
        className={`relative w-full max-w-xs rounded-3xl bg-gradient-to-b from-teal-900 to-teal-950 border border-amber-400/50 shadow-2xl overflow-hidden transition-transform duration-300 ${
          visible ? 'scale-100' : 'scale-90'
        }`}
      >
        {/* Gold top bar */}
        <div className="h-2 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 shimmer-bg" />

        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-teal-800/60 text-teal-300 hover:text-teal-100 hover:bg-teal-700/60 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 text-center">
          {/* Unlock badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 mb-4">
            <Star className="w-3.5 h-3.5 text-amber-300 animate-streak-flame" />
            <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">New Character</span>
            <Star className="w-3.5 h-3.5 text-amber-300 animate-streak-flame" style={{ animationDelay: '0.4s' }} />
          </div>

          {/* Character avatar with glow */}
          <div className="relative mx-auto w-28 h-28 mb-4">
            <div
              className="absolute inset-0 rounded-full opacity-30 animate-glow-amber"
              style={{ background: `radial-gradient(circle, ${character.color}, transparent 70%)`, filter: 'blur(20px)' }}
            />
            <div
              className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-xl animate-float-magical border-2"
              style={{
                background: `linear-gradient(135deg, ${character.color}, ${character.color}88)`,
                borderColor: `${character.color}55`,
              }}
            >
              <span className="text-5xl">{character.emoji}</span>
            </div>
            {/* Sparkles */}
            <Sparkles className="absolute -top-2 -right-1 w-5 h-5 text-amber-300 animate-sparkle" />
            <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 text-amber-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
          </div>

          <h2 className="text-2xl font-bold gold-text mb-1">{character.name}</h2>
          <p className="text-xs uppercase tracking-widest text-teal-300/70 mb-3">{character.title}</p>
          <p className="text-sm text-teal-100/80 leading-relaxed mb-6">{character.description}</p>

          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-teal-950 font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
}
