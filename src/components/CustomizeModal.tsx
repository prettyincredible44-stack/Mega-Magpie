import { X } from 'lucide-react';
import { CARD_BACKS, CHARACTERS, getOutfitsForCharacter } from '@/game/catalog';
import type { PlayerState } from '@/game/types';
import { sounds } from '@/lib/sounds';

interface CustomizeModalProps {
  state: PlayerState;
  ownedItems: Set<string>;
  onClose: () => void;
  onSelect: (type: 'card_back' | 'character' | 'outfit', id: string) => void;
  onBuy?: (type: 'card_back' | 'character' | 'outfit', id: string, cost: number) => void;
}

export default function CustomizeModal({ state, ownedItems, onClose, onSelect, onBuy }: CustomizeModalProps) {
  const outfits = getOutfitsForCharacter(state.active_character);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4 animate-fade-in" onClick={onClose}>
      <div className="glass w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-brand-800/60 p-4 sticky top-0 glass rounded-t-2xl">
          <h2 className="text-lg font-bold text-white">Customize</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-felt-600 transition">
            <X className="h-5 w-5 text-white/50" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Characters */}
          <div>
            <h3 className="mb-2.5 text-sm font-semibold uppercase tracking-wider text-brand-400/80">Characters</h3>
            <div className="grid grid-cols-3 gap-2">
              {CHARACTERS.map((char) => {
                const owned = char.price === 0 || ownedItems.has(`character:${char.id}`);
                const active = state.active_character === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => {
                      if (owned) { sounds.click(); onSelect('character', char.id); }
                      else if (onBuy) onBuy('character', char.id, char.price);
                    }}
                    className={`rounded-xl border p-3 flex flex-col items-center gap-1 transition active:scale-95 ${
                      active ? 'border-brand-500 bg-brand-600/20' : owned ? 'border-brand-800/50 bg-felt-700/50 hover:border-brand-600' : 'border-felt-600/30 bg-felt-800/50 opacity-55'
                    }`}
                  >
                    <span className="text-2xl">{char.emoji}</span>
                    <span className="text-xs font-medium text-white">{char.name}</span>
                    {!owned && <span className="text-xs text-cozy-400">{char.price}pts</span>}
                    {active && <span className="text-[10px] text-brand-400 font-semibold">ACTIVE</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outfits */}
          <div>
            <h3 className="mb-2.5 text-sm font-semibold uppercase tracking-wider text-brand-400/80">Outfits</h3>
            <div className="grid grid-cols-3 gap-2">
              {outfits.map((outfit) => {
                const owned = outfit.price === 0 || ownedItems.has(`outfit:${outfit.id}`);
                const active = state.active_outfit === outfit.id;
                return (
                  <button
                    key={`${outfit.characterId}-${outfit.id}`}
                    onClick={() => {
                      if (owned) { sounds.click(); onSelect('outfit', outfit.id); }
                      else if (onBuy) onBuy('outfit', outfit.id, outfit.price);
                    }}
                    className={`rounded-xl border p-3 flex flex-col items-center gap-1 transition active:scale-95 ${
                      active ? 'border-brand-500 bg-brand-600/20' : owned ? 'border-brand-800/50 bg-felt-700/50 hover:border-brand-600' : 'border-felt-600/30 bg-felt-800/50 opacity-55'
                    }`}
                  >
                    <span className="text-2xl">{outfit.emoji}</span>
                    <span className="text-xs font-medium text-white">{outfit.name}</span>
                    {!owned && <span className="text-xs text-cozy-400">{outfit.price}pts</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card backs */}
          <div>
            <h3 className="mb-2.5 text-sm font-semibold uppercase tracking-wider text-brand-400/80">Card Backs</h3>
            <div className="grid grid-cols-4 gap-2">
              {CARD_BACKS.map((back) => {
                const owned = back.price === 0 || ownedItems.has(`card_back:${back.id}`);
                const active = state.active_card_back === back.id;
                return (
                  <button
                    key={back.id}
                    onClick={() => {
                      if (owned) { sounds.click(); onSelect('card_back', back.id); }
                      else if (onBuy) onBuy('card_back', back.id, back.price);
                    }}
                    className={`rounded-xl border p-2 flex flex-col items-center gap-1 transition active:scale-95 ${
                      active ? 'border-brand-500 bg-brand-600/20' : owned ? 'border-brand-800/50 bg-felt-700/50 hover:border-brand-600' : 'border-felt-600/30 bg-felt-800/50 opacity-55'
                    }`}
                  >
                    <div className={`h-12 w-8 rounded-lg bg-gradient-to-br ${back.gradient} flex items-center justify-center`}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{back.emoji}</span>
                    </div>
                    <span className="text-[10px] text-white/80">{back.name}</span>
                    {!owned && <span className="text-[10px] text-cozy-400">{back.price}p</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
