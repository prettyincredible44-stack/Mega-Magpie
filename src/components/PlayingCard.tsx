import type { Card as CardType } from '@/game/types';

interface PlayingCardProps {
  card: CardType;
  onClick?: () => void;
  isTop?: boolean;
  highlight?: boolean;
  cardBackId?: string;
  dimmed?: boolean;
}

const SUIT_SYMBOLS: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const BACK_STYLES: Record<string, { from: string; to: string; pattern: string }> = {
  classic:   { from: '#1e3a35', to: '#0d2420', pattern: '✦' },
  ruby:      { from: '#7f1d1d', to: '#450a0a', pattern: '♦' },
  sapphire:  { from: '#1e3a8a', to: '#172554', pattern: '♠' },
  emerald:   { from: '#14532d', to: '#052e16', pattern: '♣' },
  gold:      { from: '#92400e', to: '#451a03', pattern: '★' },
  cosmic:    { from: '#3b0764', to: '#1e1b4b', pattern: '✦' },
  rose:      { from: '#881337', to: '#4c0519', pattern: '♥' },
  ocean:     { from: '#155e75', to: '#083344', pattern: '≈' },
};

export default function PlayingCard({ card, onClick, isTop, highlight, cardBackId = 'classic', dimmed }: PlayingCardProps) {
  const backStyle = BACK_STYLES[cardBackId] ?? BACK_STYLES.classic;

  if (!card.faceUp) {
    return (
      <div
        onClick={onClick}
        className={`card-back w-full h-full cursor-pointer transition-transform active:scale-95 ${dimmed ? 'opacity-40' : ''}`}
        style={{ background: `linear-gradient(135deg, ${backStyle.from}, ${backStyle.to})` }}
      >
        <div
          className="w-full h-full rounded-lg flex items-center justify-center"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div
            className="rounded-md flex items-center justify-center"
            style={{ width: 'calc(100% - 8px)', height: 'calc(100% - 8px)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.9em' }}>{backStyle.pattern}</span>
          </div>
        </div>
      </div>
    );
  }

  const isRed = card.color === 'red';
  const sym = SUIT_SYMBOLS[card.suit];
  const textColor = isRed ? '#dc2626' : '#111827';

  return (
    <div
      onClick={onClick}
      className={`card-face w-full h-full cursor-pointer flex flex-col justify-between p-[3px] transition-all active:scale-95 ${
        highlight ? 'card-selected' : ''
      } ${isTop ? 'shadow-card-hover' : ''} ${dimmed ? 'opacity-50' : ''}`}
    >
      {/* Top rank+suit */}
      <div className="leading-none" style={{ color: textColor }}>
        <div style={{ fontSize: 'clamp(9px, 2.2vw, 13px)', fontWeight: 700, lineHeight: 1 }}>{card.rank}</div>
        <div style={{ fontSize: 'clamp(8px, 2vw, 11px)', lineHeight: 1 }}>{sym}</div>
      </div>
      {/* Center suit */}
      <div className="text-center leading-none" style={{ color: textColor, fontSize: 'clamp(14px, 3.5vw, 20px)' }}>
        {sym}
      </div>
      {/* Bottom rank+suit (rotated) */}
      <div className="leading-none rotate-180" style={{ color: textColor }}>
        <div style={{ fontSize: 'clamp(9px, 2.2vw, 13px)', fontWeight: 700, lineHeight: 1 }}>{card.rank}</div>
        <div style={{ fontSize: 'clamp(8px, 2vw, 11px)', lineHeight: 1 }}>{sym}</div>
      </div>
    </div>
  );
}
