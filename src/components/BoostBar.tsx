import { useState } from 'react';
import { Undo2, Lightbulb, RotateCcw, Sparkles, Zap, Coins } from 'lucide-react';
import { BoostState } from '@/hooks/useGame';
import { CASHBACK_RATE } from '@/game/catalog';

interface BoostBarProps {
  boosts: BoostState;
  coins: number;
  tokens: number;
  onUndo: () => void;
  onHint: () => void;
  onNewGame: () => void;
  onAutoFinish: () => void;
  canFinish: boolean;
  onBuyUndo: (currency: 'coins' | 'tokens') => void;
  onBuyHint: (currency: 'coins' | 'tokens') => void;
}

const UNDO_PACK_COST_COINS = 25;
const HINT_PACK_COST_COINS = 25;
const UNDO_PACK_COST_TOKENS = 15;
const HINT_PACK_COST_TOKENS = 15;

export function BoostBar({ boosts, coins, tokens, onUndo, onHint, onNewGame, onAutoFinish, canFinish, onBuyUndo, onBuyHint }: BoostBarProps) {
  const [currency, setCurrency] = useState<'coins' | 'tokens'>('coins');
  const undoCost = currency === 'coins' ? UNDO_PACK_COST_COINS : UNDO_PACK_COST_TOKENS;
  const hintCost = currency === 'coins' ? HINT_PACK_COST_COINS : HINT_PACK_COST_TOKENS;
  const balance = currency === 'coins' ? coins : tokens;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 py-2.5 bg-teal-950/40 border-b border-teal-800/40 flex-wrap">
      <BoostButton
        icon={<Undo2 className="w-4 h-4" />}
        label="Undo"
        sub={`${boosts.undosLeft} free`}
        onClick={onUndo}
        disabled={boosts.undosLeft === 0}
      />
      <BoostButton
        icon={<Lightbulb className="w-4 h-4" />}
        label="Hint"
        sub={`${boosts.hintsLeft} free`}
        onClick={onHint}
        disabled={boosts.hintsLeft === 0}
      />
      <BoostButton
        icon={<Sparkles className="w-4 h-4" />}
        label="Auto-Finish"
        sub="free"
        onClick={onAutoFinish}
        disabled={!canFinish}
        accent
      />
      <div className="w-px h-8 bg-teal-800/50 mx-0.5" />
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-300/80">
        <Zap className="w-3.5 h-3.5" />
        <span className="font-medium">{Math.round(CASHBACK_RATE * 100)}% back</span>
      </div>
      {/* Currency toggle for boost purchases */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-teal-950/60 border border-teal-800/40">
        <button
          onClick={() => setCurrency('coins')}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${currency === 'coins' ? 'bg-amber-500/30 text-amber-200' : 'text-teal-500/60 hover:text-teal-300'}`}
        >
          <Coins className="w-3 h-3" />
        </button>
        <button
          onClick={() => setCurrency('tokens')}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${currency === 'tokens' ? 'bg-cyan-500/30 text-cyan-200' : 'text-teal-500/60 hover:text-teal-300'}`}
        >
          <Zap className="w-3 h-3" />
        </button>
      </div>
      <CoinBoost
        icon={<Undo2 className="w-4 h-4" />}
        label="+5 Undos"
        cost={undoCost}
        balance={balance}
        currency={currency}
        onClick={() => onBuyUndo(currency)}
      />
      <CoinBoost
        icon={<Lightbulb className="w-4 h-4" />}
        label="+5 Hints"
        cost={hintCost}
        balance={balance}
        currency={currency}
        onClick={() => onBuyHint(currency)}
      />
      <div className="w-px h-8 bg-teal-800/50 mx-0.5" />
      <button
        onClick={onNewGame}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-sm font-semibold transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        New Game
      </button>
    </div>
  );
}

function BoostButton({ icon, label, sub, onClick, disabled, accent }: {
  icon: React.ReactNode; label: string; sub: string; onClick: () => void; disabled?: boolean; accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        accent
          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30'
          : 'bg-teal-800/50 hover:bg-teal-700/60 text-teal-100 border border-teal-700/40'
      }`}
    >
      {icon}
      <div className="flex flex-col items-start leading-tight">
        <span>{label}</span>
        <span className="text-[10px] opacity-70">{sub}</span>
      </div>
    </button>
  );
}

function CoinBoost({ icon, label, cost, balance, currency, onClick }: {
  icon: React.ReactNode; label: string; cost: number; balance: number; currency: 'coins' | 'tokens'; onClick: () => void;
}) {
  const afford = balance >= cost;
  const cashback = currency === 'coins' ? Math.ceil(cost * CASHBACK_RATE) : 0;
  return (
    <button
      onClick={onClick}
      disabled={!afford}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-100 text-sm font-semibold border border-amber-400/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {icon}
      <span>{label}</span>
      <span className={`flex items-center gap-0.5 text-xs ${currency === 'coins' ? 'text-amber-300' : 'text-cyan-300'}`}>
        {currency === 'coins' ? <Coins className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
        {cost}
      </span>
      {cashback > 0 && (
        <span className="flex items-center gap-0.5 text-cyan-300 text-[10px]">
          +{cashback}<Zap className="w-2.5 h-2.5" />
        </span>
      )}
    </button>
  );
}

export { UNDO_PACK_COST_COINS, HINT_PACK_COST_COINS, UNDO_PACK_COST_TOKENS, HINT_PACK_COST_TOKENS };
