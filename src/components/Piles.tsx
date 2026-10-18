import type { Card } from '@/game/types';
import PlayingCard from './PlayingCard';

// Card dimensions — driven by viewport width so the board always fits
// 7 columns + 6 gaps. Each card width = (100vw - padding - gaps) / 7
// We use CSS custom properties and a wrapper to make cards responsive.

const CARD_ASPECT = 72 / 52; // h/w — standard playing card ratio

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

// Vertical offsets: face-down cards peek less, face-up cards peek more
const DOWN_PEEK = 10; // px per face-down card below another face-down
const UP_PEEK   = 26; // px per face-up card

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
    // Calculate total height needed for the pile
    let totalOffset = 0;
    const offsets: number[] = [];
    for (let i = 0; i < cards.length; i++) {
      offsets.push(totalOffset);
      if (i < cards.length - 1) {
        totalOffset += cards[i].faceUp ? UP_PEEK : DOWN_PEEK;
      }
    }
    // Container height = last card top offset + one full card height
    // We use a padding-bottom trick: container height = totalOffset + card-height
    // card-height is expressed as a % of card width using aspect ratio
    const containerPaddingBottom = `calc(${totalOffset}px + 100% * ${CARD_ASPECT})`;

    return (
      <div className="relative w-full" style={{ paddingBottom: containerPaddingBottom }}>
        {cards.length === 0 && (
          <div
            className="absolute inset-0 pile-slot"
            onClick={() => onCardClick(pileId, -1)}
            style={{ height: `calc(100% * ${CARD_ASPECT / (1 + totalOffset)})` }}
          />
        )}
        {cards.map((card, i) => {
          const isSelected =
            selectedPile === pileId &&
            selectedCardIndex != null &&
            i >= selectedCardIndex;
          const highlight = isSelected || highlightTo === pileId;
          // Card container positioned absolutely, full width, aspect-ratio height
          return (
            <div
              key={card.id}
              className="absolute left-0 w-full"
              style={{
                top: offsets[i],
                height: `calc((100vw - var(--board-pad, 16px)) / 7 * ${CARD_ASPECT} - 0px)`,
                zIndex: i + 1,
              }}
            >
              <PlayingCard
                card={card}
                isTop={i === cards.length - 1}
                onClick={() => onCardClick(pileId, i)}
                highlight={highlight}
                cardBackId={cardBackId}
                dimmed={selectedPile != null && selectedPile !== pileId && !isSelected}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // Stock / waste / foundation — single card, fixed aspect ratio
  const isEmpty = cards.length === 0;
  const highlight = highlightTo === pileId;

  return (
    <div
      className="relative w-full"
      style={{ paddingBottom: `${CARD_ASPECT * 100}%` }}
    >
      <div className="absolute inset-0">
        {isEmpty ? (
          <div
            className="pile-slot w-full h-full flex items-center justify-center"
            onClick={() => onCardClick(pileId, -1)}
          >
            {type === 'foundation' && (
              <span style={{ color: 'rgba(45,212,191,0.35)', fontSize: 'clamp(13px,3vw,18px)', fontWeight: 700 }}>A</span>
            )}
            {type === 'stock' && (
              <span style={{ color: 'rgba(45,212,191,0.35)', fontSize: 'clamp(16px,3.5vw,22px)' }}>↻</span>
            )}
          </div>
        ) : (
          <PlayingCard
            card={cards[cards.length - 1]}
            isTop
            onClick={() => onCardClick(pileId, cards.length - 1)}
            highlight={highlight}
            cardBackId={cardBackId}
          />
        )}
      </div>
    </div>
  );
}
