import type { Card as CardType } from '@/game/types';

interface PlayingCardProps {
  card: CardType;
  onClick?: () => void;
  isTop?: boolean;
  draggable?: boolean;
  highlight?: boolean;
  cardBackId?: string;
}

const SUIT_SYMBOLS: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export default function PlayingCard({ card, onClick, isTop, highlight, cardBackId = 'classic' }: PlayingCardProps) {
  if (!card.faceUp) {
    const gradients: Record<string, string> = {
      classic: 'from-slate-700 to-slate-900',
      ruby: 'from-red-600 to-red-900',
      sapphire: 'from-blue-600 to-blue-900',
      emerald: 'from-emerald-500 to-emerald-800',
      gold: 'from-amber-400 to-amber-700',
      cosmic: 'from-indigo-500 to-purple-800',
      rose: 'from-rose-400 to-rose-700',
      ocean: 'from-cyan-400 to-teal-700',
    };
    return (
      <div
        onClick={onClick}
        className={`w-12 h-16 sm:w-14 sm:h-20 rounded-lg bg-gradient-to-br ${gradients[cardBackId] || gradients.classic} border-2 border-slate-500/50 shadow-md cursor-pointer flex items-center justify-center`}
      >
        <div className="w-8 h-12 sm:w-10 sm:h-14 border border-white/20 rounded-md flex items-center justify-center">
          <span className="text-white/30 text-lg">✦</span>
        </div>
      </div>
    );
  }

  const isRed = card.color === 'red';
  const symbol = SUIT_SYMBOLS[card.suit];

  return (
    <div
      onClick={onClick}
      className={`w-12 h-16 sm:w-14 sm:h-20 rounded-lg bg-white shadow-md cursor-pointer flex flex-col justify-between p-1 transition-all ${
        highlight ? 'ring-2 ring-cozy-400 scale-105' : ''
      } ${isTop ? 'shadow-lg' : ''}`}
    >
      <div className={`text-xs sm:text-sm font-bold ${isRed ? 'text-red-500' : 'text-slate-900'} leading-none`}>
        <span>{card.rank}</span>
        <span className="ml-0.5">{symbol}</span>
      </div>
      <div className={`text-lg sm:text-2xl ${isRed ? 'text-red-500' : 'text-slate-900'} text-center leading-none`}>
        {symbol}
      </div>
      <div className={`text-xs sm:text-sm font-bold ${isRed ? 'text-red-500' : 'text-slate-900'} leading-none text-right rotate-180`}>
        <span>{card.rank}</span>
        <span className="ml-0.5">{symbol}</span>
      </div>
    </div>
  );
}
