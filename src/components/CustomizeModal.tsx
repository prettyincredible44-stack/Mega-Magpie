import { X } from 'lucide-react';
import { CARD_BACKS, CHARACTERS, getOutfitsForCharacter } from '@/game/catalog';
import type { PlayerState } from '@/game/types';
import { sounds } from '@/lib/sounds';

interface CustomizeModalProps {
  state: PlayerState;
  ownedItems: Set<string>;
  onClose: () => void;
  onSelect: (type: 'card_back' | 'character' | 'outfit', id: string) => void;
}

export default function CustomizeModal({ state, ownedItems, onClose, onSelect }: CustomizeModalProps) {
  const outfits = getOutfitsForCharacter(state.active_character);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Customize</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold mb-3">Characters</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {CHARACTERS.map((char) => {
              const owned = ownedItems.has(`character:${char.id}`);
              const active = state.active_character === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    if (owned) {
                      sounds.click();
                      onSelect('character', char.id);
                    }
                  }}
                  className={`p-3 rounded-xl border transition flex flex-col items-center gap-1 ${
                    active ? 'border-cozy-500 bg-cozy-500/10' : owned ? 'border-slate-600 bg-slate-700/50 hover:border-slate-500' : 'border-slate-700 bg-slate-800/50 opacity-50'
                  }`}
                >
                  <span className="text-2xl">{char.emoji}</span>
                  <span className="text-white text-xs font-medium">{char.name}</span>
                  {!owned && <span className="text-cozy-400 text-xs">{char.price}c</span>}
                  {active && <span className="text-cozy-400 text-xs">Active</span>}
                </button>
              );
            })}
          </div>

          <h3 className="text-white font-semibold mb-3">Outfits</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {outfits.map((outfit) => {
              const owned = ownedItems.has(`outfit:${outfit.id}`) || outfit.price === 0;
              const active = state.active_outfit === outfit.id;
              return (
                <button
                  key={`${outfit.characterId}-${outfit.id}`}
                  onClick={() => {
                    if (owned) {
                      sounds.click();
                      onSelect('outfit', outfit.id);
                    }
                  }}
                  className={`p-3 rounded-xl border transition flex flex-col items-center gap-1 ${
                    active ? 'border-cozy-500 bg-cozy-500/10' : owned ? 'border-slate-600 bg-slate-700/50 hover:border-slate-500' : 'border-slate-700 bg-slate-800/50 opacity-50'
                  }`}
                >
                  <span className="text-2xl">{outfit.emoji}</span>
                  <span className="text-white text-xs font-medium">{outfit.name}</span>
                  {!owned && <span className="text-cozy-400 text-xs">{outfit.price}c</span>}
                </button>
              );
            })}
          </div>

          <h3 className="text-white font-semibold mb-3">Card Backs</h3>
          <div className="grid grid-cols-4 gap-2">
            {CARD_BACKS.map((back) => {
              const owned = ownedItems.has(`card_back:${back.id}`) || back.price === 0;
              const active = state.active_card_back === back.id;
              return (
                <button
                  key={back.id}
                  onClick={() => {
                    if (owned) {
                      sounds.click();
                      onSelect('card_back', back.id);
                    }
                  }}
                  className={`p-2 rounded-xl border transition flex flex-col items-center gap-1 ${
                    active ? 'border-cozy-500 bg-cozy-500/10' : owned ? 'border-slate-600 bg-slate-700/50 hover:border-slate-500' : 'border-slate-700 bg-slate-800/50 opacity-50'
                  }`}
                >
                  <div className={`w-10 h-14 rounded-lg bg-gradient-to-br ${back.gradient} flex items-center justify-center`}>
                    <span className="text-white/50 text-lg">{back.emoji}</span>
                  </div>
                  <span className="text-white text-xs">{back.name}</span>
                  {!owned && <span className="text-cozy-400 text-xs">{back.price}c</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
