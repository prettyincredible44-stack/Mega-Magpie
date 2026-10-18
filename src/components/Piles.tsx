import type { Card } from '@/game/types';
import PlayingCard from './PlayingCard';

interface PileProps {
  cards: Card[];
  pileId: string;
  onCardClick: (pileId: string, cardIndex: number) => void;
  highlightTo?: string;
  cardBackId?: string;
  type: 'tableau' | 'foundation' | 'stock' | 'waste';
  selectedPile?: string | null;
  selectedCardIndex?: number | null;
}

const FACE_DOWN_OFFSET = 8;
const FACE_UP_OFFSET = 22;

export default function Pile({
  cards,
  pileId,
  onCardClick,
  highlightTo,
  cardBackId,
  type,
  selectedPile,
  selectedCardIndex,
}: PileProps) {
  if (type === 'tableau') {
    const stackHeight = cards.reduce(
      (h, c, i) => h + (i < cards.length - 1 ? (c.faceUp ? FACE_UP_OFFSET : FACE_DOWN_OFFSET) : 0),
      0
    );

    return (
      <div
        className="relative w-full"
        style={{ minHeight: 80, height: stackHeight + 72 }}
      >
        {cards.length === 0 && (
          <div
            className="absolute left-0 top-0 h-[72px] w-full rounded-xl border-2 border-dashed border-slate-600/40"
            onClick={() => onCardClick(pileId, -1)}
          />
        )}
        {cards.map((card, i) => {
          const offset = cards.slice(0, i).reduce(
            (h, c, j) => h + (j < i ? (c.faceUp ? FACE_UP_OFFSET : FACE_DOWN_OFFSET) : 0),
            0
          );
          const isSelected =
            selectedPile === pileId && selectedCardIndex !== undefined && selectedCardIndex !== null && i >= selectedCardIndex;
          const isHintSource = highlightTo === pileId;
          return (
            <div
              key={card.id}
              className="absolute left-0 w-full"
              style={{ top: offset, zIndex: i + 1 }}
            >
              <PlayingCard
                card={card}
                isTop={i === cards.length - 1}
                onClick={() => onCardClick(pileId, i)}
                highlight={isSelected || isHintSource}
                cardBackId={cardBackId}
              />
            </div>
          );
        })}
      </div>
    );
  }

  const isEmpty = cards.length === 0;
  return (
    <div className="relative">
      {isEmpty && (
        <div
          className="flex h-[72px] w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-600/40"
          onClick={() => onCardClick(pileId, -1)}
        >
          {type === 'foundation' && <span className="text-lg font-bold text-slate-600">A</span>}
          {type === 'stock' && <span className="text-lg text-slate-600">↻</span>}
        </div>
      )}
      {!isEmpty && (
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
