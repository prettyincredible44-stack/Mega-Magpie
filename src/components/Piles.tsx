import type { Card } from '@/game/types';
import PlayingCard from './PlayingCard';

interface PileProps {
  cards: Card[];
  pileId: string;
  onCardClick: (pileId: string, cardIndex: number) => void;
  highlightTo?: string;
  cardBackId?: string;
  type: 'tableau' | 'foundation' | 'stock' | 'waste';
}

export default function Pile({ cards, pileId, onCardClick, highlightTo, cardBackId, type }: PileProps) {
  if (type === 'tableau') {
    return (
      <div className="relative min-h-[80px]">
        {cards.length === 0 && (
          <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg border-2 border-dashed border-slate-600/50" />
        )}
        {cards.map((card, i) => (
          <div
            key={card.id}
            className="absolute"
            style={{ top: `${i * 18}px`, zIndex: i }}
          >
            <PlayingCard
              card={card}
              isTop={i === cards.length - 1}
              onClick={() => onCardClick(pileId, i)}
              highlight={highlightTo === pileId}
              cardBackId={cardBackId}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {cards.length === 0 && (
        <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg border-2 border-dashed border-slate-600/50 flex items-center justify-center">
          {type === 'foundation' && <span className="text-slate-600 text-lg">A</span>}
          {type === 'stock' && <span className="text-slate-600 text-lg">↻</span>}
        </div>
      )}
      {cards.length > 0 && (
        <PlayingCard
          card={cards[cards.length - 1]}
          isTop
          onClick={() => onCardClick(pileId, cards.length - 1)}
          highlight={highlightTo === pileId}
          cardBackId={cardBackId}
        />
      )}
    </div>
  );
}
