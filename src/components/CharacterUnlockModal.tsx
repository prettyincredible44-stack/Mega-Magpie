import { X, Sparkles } from 'lucide-react';
import type { Character } from '@/game/catalog';
import { sounds } from '@/lib/sounds';

interface CharacterUnlockModalProps {
  character: Character;
  onClose: () => void;
}

export default function CharacterUnlockModal({ character, onClose }: CharacterUnlockModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl w-full max-w-sm border border-cozy-500/30 shadow-2xl">
        <div className="p-6 text-center">
          <div className="flex items-center justify-between mb-4">
            <span className="text-cozy-400 font-bold text-sm flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              NEW UNLOCK
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div
            className="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center text-5xl animate-bounce-cozy"
            style={{ background: character.color + '30' }}
          >
            {character.emoji}
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">{character.name}</h2>
          <p className="text-slate-300 text-sm mb-6">New character unlocked!</p>

          <button
            onClick={() => {
              sounds.click();
              onClose();
            }}
            className="w-full py-3 bg-cozy-500 hover:bg-cozy-600 text-white rounded-lg font-bold transition"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
