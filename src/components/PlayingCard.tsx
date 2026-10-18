import type { Card as CardType } from '@/game/types';

interface PlayingCardProps {
  card: CardType;
  onClick?: () => void;
  isTop?: boolean;
  highlight?: boolean;
  cardBackId?: string;
}

const SUIT_SYMBOLS: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const CARD_GRADIENTS: Record<string, string> = {
  classic: 'from-slate-600 to-slate-800',
  ruby: 'from-red-500 to-red-800',
  sapphire: 'from-blue-500 to-blue-800',
  emerald: 'from-emerald-500 to-emerald-800',
  gold: 'from-amber-400 to-amber-700',
  cosmic: 'from-indigo-500 to-purple-800',
  rose: 'from-rose-400 to-rose-700',
  ocean: 'from-cyan-400 to-teal-700',
};

export default function PlayingCard({ card, onClick, isTop, highlight, cardBackId = 'classic' }: PlayingCardProps) {
  const gradient = CARD_GRADIENTS[cardBackId] ?? CARD_GRADIENTS.classic;

  if (!card.faceUp) {
    return (
      <div
        onClick={onClick}
        className={`flex h-[72px] w-full cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br ${gradient} border-2 border-white/10 shadow ${highlight ? 'ring-2 ring-cozy-400' : ''}`}
      >
        <div className="flex h-[56px] w-[calc(100%-10px)] items-center justify-center rounded-lg border border-white/15">
          <span className="text-white/25 text-base">✦</span>
        </div>
      </div>
    );
  }

  const isRed = card.color === 'red';
  const symbol = SUIT_SYMBOLS[card.suit];

  return (
    <div
      onClick={onClick}
      className={`flex h-[72px] w-full cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-white p-1.5 shadow transition-transform active:scale-95 ${
        highlight ? 'ring-2 ring-cozy-400 ring-offset-1' : ''
      } ${isTop ? 'shadow-md' : ''}`}
    >
      <div className={`text-[11px] font-bold leading-none ${isRed ? 'text-red-500' : 'text-slate-900'}`}>
        {card.rank}
        <span className="ml-px">{symbol}</span>
      </div>
      <div className={`text-center text-[20px] leading-none ${isRed ? 'text-red-500' : 'text-slate-900'}`}>
        {symbol}
      </div>
      <div className={`text-right text-[11px] font-bold leading-none rotate-180 ${isRed ? 'text-red-500' : 'text-slate-900'}`}>
        {card.rank}
        <span className="ml-px">{symbol}</span>
      </div>
    </div>
  );
}
