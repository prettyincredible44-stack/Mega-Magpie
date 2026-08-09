import { Card as CardType, isRed } from '@/game/types';
import { CardBack as CardBackDesign } from '@/game/catalog';

interface PlayingCardProps {
  card: CardType;
  selected?: boolean;
  dimmed?: boolean;
  hinted?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  onDoubleClick?: () => void;
  cardBack?: CardBackDesign;
}

const SUIT_GLYPH: Record<string, string> = {
  hearts: '\u2665',
  diamonds: '\u2666',
  clubs: '\u2663',
  spades: '\u2660',
};

export function PlayingCard({ card, selected, dimmed, hinted, style, onClick, onDoubleClick, cardBack }: PlayingCardProps) {
  if (!card.faceUp) {
    return <CardBackFace cardBack={cardBack} selected={selected} hinted={hinted} style={style} onClick={onClick} />;
  }
  const red = isRed(card.suit);
  const glyph = SUIT_GLYPH[card.suit];
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={style}
      className={`relative w-[var(--card-w)] h-[var(--card-h)] rounded-lg bg-gradient-to-br from-white to-slate-100 border border-slate-300 card-shadow cursor-pointer transition-transform ${selected ? 'ring-2 ring-amber-400 -translate-y-1' : ''} ${dimmed ? 'opacity-50' : ''} ${hinted ? 'animate-hint-pulse' : ''} hover:-translate-y-0.5`}
    >
      <div className={`absolute top-0.5 left-1.5 leading-none font-bold ${red ? 'text-rose-600' : 'text-slate-900'}`}>
        <div className="text-[11px]">{card.rank}</div>
        <div className="text-[10px] -mt-0.5">{glyph}</div>
      </div>
      <div className={`absolute bottom-0.5 right-1.5 leading-none font-bold rotate-180 ${red ? 'text-rose-600' : 'text-slate-900'}`}>
        <div className="text-[11px]">{card.rank}</div>
        <div className="text-[10px] -mt-0.5">{glyph}</div>
      </div>
      <div className={`absolute inset-0 flex items-center justify-center text-2xl ${red ? 'text-rose-500/80' : 'text-slate-700/80'}`}>
        {glyph}
      </div>
    </div>
  );
}

function CardBackFace({ cardBack, selected, hinted, style, onClick }: {
  cardBack?: CardBackDesign; selected?: boolean; hinted?: boolean; style?: React.CSSProperties; onClick?: () => void;
}) {
  const cb = cardBack ?? { gradient: 'from-teal-800 to-teal-950', pattern: 'classic' as const, accent: '#10b981' };
  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative w-[var(--card-w)] h-[var(--card-h)] rounded-lg bg-gradient-to-br ${cb.gradient} border border-white/10 card-shadow cursor-pointer transition-transform ${selected ? 'ring-2 ring-amber-300' : ''} ${hinted ? 'animate-hint-pulse' : ''}`}
    >
      <div className="absolute inset-1 rounded-md border" style={{ borderColor: `${cb.accent}40` }} />
      <CardPattern pattern={cb.pattern} accent={cb.accent} />
    </div>
  );
}

function CardPattern({ pattern, accent }: { pattern: CardBackDesign['pattern']; accent: string }) {
  switch (pattern) {
    case 'crown':
      return (
        <div className="absolute inset-0 flex items-center justify-center text-lg" style={{ color: accent, opacity: 0.7 }}>
          {'\u2654'}
        </div>
      );
    case 'diamond':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rotate-45 border-2 rounded-sm" style={{ borderColor: accent, opacity: 0.5 }} />
          <div className="absolute w-3 h-3 rotate-45 border rounded-sm" style={{ borderColor: accent, opacity: 0.3 }} />
        </div>
      );
    case 'star':
      return (
        <div className="absolute inset-0 flex items-center justify-center text-base" style={{ color: accent, opacity: 0.6 }}>
          {'\u2605'}
        </div>
      );
    case 'wave':
      return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="w-full h-3 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`, opacity: 0.5 }} />
          <div className="absolute w-full h-2 rounded-full mt-4" style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`, opacity: 0.4 }} />
        </div>
      );
    case 'flame':
      return (
        <div className="absolute inset-0 flex items-center justify-center text-base" style={{ color: accent, opacity: 0.7 }}>
          {'\uD83D\uDD25'}
        </div>
      );
    case 'geometric':
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-sm border-2" style={{ borderColor: accent, opacity: 0.5, transform: 'rotate(45deg)' }} />
          <div className="absolute w-5 h-5 rounded-sm border-2" style={{ borderColor: accent, opacity: 0.3 }} />
        </div>
      );
    default:
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: `${accent}50`, background: `${accent}15` }}>
            <div className="w-3 h-3 rounded-full" style={{ background: `${accent}30` }} />
          </div>
        </div>
      );
  }
}

export function EmptySlot({ label, hinted, onClick }: { label?: string; hinted?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`w-[var(--card-w)] h-[var(--card-h)] rounded-lg border-2 border-dashed border-teal-600/40 flex items-center justify-center text-teal-500/40 text-xs font-medium ${hinted ? 'animate-hint-pulse border-amber-400/60' : ''} ${onClick ? 'cursor-pointer hover:border-cyan-400/60' : ''}`}
    >
      {label}
    </div>
  );
}
