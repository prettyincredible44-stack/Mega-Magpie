import { GameState, PileId } from '@/game/types';
import { TableauPile, FlatPile, StockPile } from './Piles';
import { CardBack as CardBackDesign } from '@/game/catalog';

interface GameBoardProps {
  state: GameState;
  selected: { pile: PileId; index: number } | null;
  hint: { from: PileId; to: PileId } | null;
  onPileClick: (pileId: PileId, index: number) => void;
  onPileDoubleClick: (pileId: PileId, index: number) => void;
  cardBack?: CardBackDesign;
}

export function GameBoard({ state, selected, hint, onPileClick, onPileDoubleClick, cardBack }: GameBoardProps) {
  const foundations: PileId[] = ['foundation-0', 'foundation-1', 'foundation-2', 'foundation-3'];
  const tableaus: PileId[] = ['tableau-0', 'tableau-1', 'tableau-2', 'tableau-3', 'tableau-4', 'tableau-5', 'tableau-6'];

  return (
    <div className="flex-1 overflow-auto no-scrollbar px-3 py-4 sm:px-6 felt-texture">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-5">
          <div className="flex gap-2 sm:gap-3">
            <StockPile pileId="stock" cards={state.piles.stock} onClick={onPileClick} cardBack={cardBack} />
            <FlatPile
              pileId="waste"
              cards={state.piles.waste}
              selected={selected}
              hint={hint}
              onClick={onPileClick}
              onDoubleClick={onPileDoubleClick}
              cardBack={cardBack}
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            {foundations.map((f) => (
              <FlatPile
                key={f}
                pileId={f}
                cards={state.piles[f]}
                selected={selected}
                hint={hint}
                onClick={onPileClick}
                onDoubleClick={onPileDoubleClick}
                emptyLabel="A"
                cardBack={cardBack}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-2 sm:gap-3" style={{ minHeight: 'calc(var(--card-h) + 6 * 22px)' }}>
          {tableaus.map((t) => (
            <TableauPile
              key={t}
              pileId={t}
              cards={state.piles[t]}
              selected={selected}
              hint={hint}
              onClick={onPileClick}
              onDoubleClick={onPileDoubleClick}
              cardBack={cardBack}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
