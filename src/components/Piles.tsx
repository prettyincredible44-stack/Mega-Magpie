import { Card, PileId } from '@/game/types';
import { PlayingCard, EmptySlot } from './PlayingCard';
import { CardBack as CardBackDesign } from '@/game/catalog';

interface PileProps {
  pileId: PileId;
  cards: Card[];
  selected: { pile: PileId; index: number } | null;
  hint: { from: PileId; to: PileId } | null;
  onClick: (pileId: PileId, index: number) => void;
  onDoubleClick: (pileId: PileId, index: number) => void;
  emptyLabel?: string;
  cardBack?: CardBackDesign;
}

export function TableauPile({ pileId, cards, selected, hint, onClick, onDoubleClick, cardBack }: PileProps) {
  const isHintTarget = hint?.to === pileId;
  const isHintSource = hint?.from === pileId;
  return (
    <div className="relative" style={{ minHeight: 'var(--card-h)' }}>
      {cards.length === 0 && (
        <EmptySlot label="K" hinted={isHintTarget} onClick={() => onClick(pileId, 0)} />
      )}
      <div className="absolute inset-0">
        {cards.map((card, i) => {
          const offset = i * 22;
          const isSelected = selected?.pile === pileId && selected.index <= i;
          const isHintCard = isHintSource && i >= (selected?.pile === pileId ? selected.index : 0);
          const dimmed = selected !== null && selected.pile !== pileId && !isHintTarget;
          return (
            <div
              key={card.id}
              className="absolute animate-deal-in"
              style={{ top: offset, left: 0, animationDelay: `${i * 0.025}s` }}
            >
              <PlayingCard
                card={card}
                selected={isSelected}
                dimmed={dimmed}
                hinted={isHintCard}
                cardBack={cardBack}
                onClick={() => onClick(pileId, i)}
                onDoubleClick={() => onDoubleClick(pileId, i)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FlatPile({ pileId, cards, selected, hint, onClick, onDoubleClick, emptyLabel, cardBack }: PileProps) {
  const isHintTarget = hint?.to === pileId;
  const isHintSource = hint?.from === pileId;
  const top = cards.length > 0 ? cards[cards.length - 1] : null;
  return (
    <div className="relative" style={{ width: 'var(--card-w)', height: 'var(--card-h)' }}>
      {cards.length === 0 ? (
        <EmptySlot label={emptyLabel} hinted={isHintTarget} onClick={() => onClick(pileId, 0)} />
      ) : (
        <PlayingCard
          card={top!}
          selected={selected?.pile === pileId}
          hinted={isHintSource || isHintTarget}
          cardBack={cardBack}
          onClick={() => onClick(pileId, cards.length - 1)}
          onDoubleClick={() => onDoubleClick(pileId, cards.length - 1)}
        />
      )}
    </div>
  );
}

export function StockPile({ pileId, cards, onClick, cardBack }: { pileId: PileId; cards: Card[]; onClick: (pileId: PileId, i: number) => void; cardBack?: CardBackDesign }) {
  return (
    <div className="relative" style={{ width: 'var(--card-w)', height: 'var(--card-h)' }}>
      {cards.length === 0 ? (
        <EmptySlot label="↻" onClick={() => onClick(pileId, 0)} />
      ) : (
        <PlayingCard
          card={cards[cards.length - 1]}
          cardBack={cardBack}
          onClick={() => onClick(pileId, cards.length - 1)}
        />
      )}
      {cards.length > 1 && (
        <div className="absolute -top-1 -left-1 w-[var(--card-w)] h-[var(--card-h)] rounded-lg bg-teal-900/80 border border-cyan-400/30 -z-10" />
      )}
    </div>
  );
}
