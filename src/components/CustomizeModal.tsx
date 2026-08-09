import { useState } from 'react';
import { X, Check, Lock, Coins, Sparkles, User, Shirt, Layers, Zap } from 'lucide-react';
import { CARD_BACKS, CHARACTERS, OUTFITS, CardBack, Character, Outfit } from '@/game/catalog';

export type Currency = 'coins' | 'tokens';

interface CustomizeModalProps {
  open: boolean;
  coins: number;
  tokens: number;
  ownedCardBacks: Set<string>;
  ownedCharacters: Set<string>;
  ownedOutfits: Set<string>;
  activeCardBack: string;
  activeCharacter: string;
  activeOutfit: string;
  onClose: () => void;
  onBuyCardBack: (cb: CardBack, currency: Currency) => void;
  onBuyCharacter: (c: Character, currency: Currency) => void;
  onBuyOutfit: (o: Outfit, currency: Currency) => void;
  onSelectCardBack: (id: string) => void;
  onSelectCharacter: (id: string) => void;
  onSelectOutfit: (id: string) => void;
}

type Tab = 'card_backs' | 'characters' | 'outfits';

export function CustomizeModal(props: CustomizeModalProps) {
  const [tab, setTab] = useState<Tab>('card_backs');
  const [currency, setCurrency] = useState<Currency>('coins');
  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={props.onClose}>
      <div
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl animate-win-pop overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
        <button onClick={props.onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-teal-400 hover:text-teal-200 hover:bg-teal-800/50 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 pt-6 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-teal-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-50">Customize</h2>
              <p className="text-sm text-teal-400/80">Card backs, characters, and outfits</p>
            </div>
            <div className="ml-auto flex flex-col gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30">
                <Coins className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-amber-200 tabular-nums text-sm">{props.coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30">
                <Zap className="w-4 h-4 text-cyan-300" />
                <span className="font-bold text-cyan-200 tabular-nums text-sm">{props.tokens.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-teal-950/50 mb-3">
            <TabButton active={tab === 'card_backs'} onClick={() => setTab('card_backs')} icon={<Layers className="w-4 h-4" />} label="Card Backs" />
            <TabButton active={tab === 'characters'} onClick={() => setTab('characters')} icon={<User className="w-4 h-4" />} label="Characters" />
            <TabButton active={tab === 'outfits'} onClick={() => setTab('outfits')} icon={<Shirt className="w-4 h-4" />} label="Outfits" />
          </div>

          {/* Currency toggle */}
          <div className="flex gap-1 p-1 rounded-xl bg-teal-950/50 mb-4">
            <CurrencyButton active={currency === 'coins'} onClick={() => setCurrency('coins')} icon={<Coins className="w-3.5 h-3.5" />} label="Pay with Coins" />
            <CurrencyButton active={currency === 'tokens'} onClick={() => setCurrency('tokens')} icon={<Zap className="w-3.5 h-3.5" />} label="Pay with Tokens" />
          </div>

          {tab === 'card_backs' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CARD_BACKS.map((cb) => (
                <CardBackCard
                  key={cb.id}
                  cb={cb}
                  owned={props.ownedCardBacks.has(cb.id)}
                  active={props.activeCardBack === cb.id}
                  currency={currency}
                  balance={currency === 'coins' ? props.coins : props.tokens}
                  onBuy={() => props.onBuyCardBack(cb, currency)}
                  onSelect={() => props.onSelectCardBack(cb.id)}
                />
              ))}
            </div>
          )}

          {tab === 'characters' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CHARACTERS.map((c) => (
                <CharacterCard
                  key={c.id}
                  c={c}
                  owned={props.ownedCharacters.has(c.id)}
                  active={props.activeCharacter === c.id}
                  currency={currency}
                  balance={currency === 'coins' ? props.coins : props.tokens}
                  onBuy={() => props.onBuyCharacter(c, currency)}
                  onSelect={() => props.onSelectCharacter(c.id)}
                />
              ))}
            </div>
          )}

          {tab === 'outfits' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {OUTFITS.map((o) => (
                <OutfitCard
                  key={o.id}
                  o={o}
                  owned={props.ownedOutfits.has(o.id)}
                  active={props.activeOutfit === o.id}
                  currency={currency}
                  balance={currency === 'coins' ? props.coins : props.tokens}
                  onBuy={() => props.onBuyOutfit(o, currency)}
                  onSelect={() => props.onSelectOutfit(o.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
        active ? 'bg-teal-600 text-teal-50' : 'text-teal-400/70 hover:text-teal-200'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function CurrencyButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
        active ? 'bg-teal-600 text-teal-50' : 'text-teal-400/70 hover:text-teal-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ItemCard({ owned, active, canAfford, price, currency, onBuy, onSelect, children }: {
  owned: boolean; active: boolean; canAfford: boolean; price: number; currency: Currency; onBuy: () => void; onSelect: () => void; children: React.ReactNode;
}) {
  return (
    <div className={`relative rounded-xl border p-3 transition-all ${
      active ? 'bg-amber-500/15 border-amber-400/50 ring-1 ring-amber-400/30' : 'bg-teal-800/30 border-teal-700/40'
    }`}>
      {active && (
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
          <Check className="w-3 h-3 text-teal-950" strokeWidth={3} />
        </div>
      )}
      {children}
      <div className="mt-2">
        {owned ? (
          <button
            onClick={onSelect}
            disabled={active}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
              active ? 'bg-amber-500/20 text-amber-300 cursor-default' : 'bg-teal-600 hover:bg-teal-500 text-teal-50'
            }`}
          >
            {active ? 'Equipped' : 'Equip'}
          </button>
        ) : price === 0 ? (
          <button
            onClick={onBuy}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-teal-50 text-sm font-semibold transition-colors"
          >
            Free
          </button>
        ) : (
          <button
            onClick={onBuy}
            disabled={!canAfford}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-sm font-semibold border border-amber-400/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {canAfford ? (
              currency === 'coins' ? <Coins className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            {price}
          </button>
        )}
      </div>
    </div>
  );
}

function CardBackCard({ cb, owned, active, currency, balance, onBuy, onSelect }: {
  cb: CardBack; owned: boolean; active: boolean; currency: Currency; balance: number; onBuy: () => void; onSelect: () => void;
}) {
  const price = currency === 'coins' ? cb.priceCoins : cb.priceTokens;
  return (
    <ItemCard owned={owned} active={active} canAfford={balance >= price} price={price} currency={currency} onBuy={onBuy} onSelect={onSelect}>
      <div className="flex flex-col items-center">
        <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${cb.gradient} border border-white/10 flex items-center justify-center mb-2`}>
          <div className="w-6 h-6 rounded-full border" style={{ borderColor: `${cb.accent}60`, background: `${cb.accent}20` }}>
            <div className="w-full h-full flex items-center justify-center" style={{ color: cb.accent, opacity: 0.7, fontSize: '10px' }}>
              {cb.pattern === 'crown' ? '\u2654' : cb.pattern === 'star' ? '\u2605' : cb.pattern === 'flame' ? '\uD83D\uDD25' : ''}
            </div>
          </div>
        </div>
        <div className="text-sm font-semibold text-teal-50 text-center">{cb.name}</div>
        <div className="text-[10px] text-teal-400/60 text-center leading-tight">{cb.description}</div>
      </div>
    </ItemCard>
  );
}

function CharacterCard({ c, owned, active, currency, balance, onBuy, onSelect }: {
  c: Character; owned: boolean; active: boolean; currency: Currency; balance: number; onBuy: () => void; onSelect: () => void;
}) {
  const price = currency === 'coins' ? c.priceCoins : c.priceTokens;
  return (
    <ItemCard owned={owned} active={active} canAfford={balance >= price} price={price} currency={currency} onBuy={onBuy} onSelect={onSelect}>
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-1.5" style={{ background: `${c.color}30`, border: `2px solid ${c.color}60` }}>
          {c.emoji}
        </div>
        <div className="text-sm font-semibold text-teal-50">{c.name}</div>
        <div className="text-[10px] text-teal-400/70">{c.title}</div>
        <div className="text-[10px] text-teal-500/50 text-center leading-tight mt-0.5">{c.description}</div>
      </div>
    </ItemCard>
  );
}

function OutfitCard({ o, owned, active, currency, balance, onBuy, onSelect }: {
  o: Outfit; owned: boolean; active: boolean; currency: Currency; balance: number; onBuy: () => void; onSelect: () => void;
}) {
  const price = currency === 'coins' ? o.priceCoins : o.priceTokens;
  return (
    <ItemCard owned={owned} active={active} canAfford={balance >= price} price={price} currency={currency} onBuy={onBuy} onSelect={onSelect}>
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-1.5" style={{ background: `${o.color}30`, border: `2px solid ${o.color}60` }}>
          {o.emoji}
        </div>
        <div className="text-sm font-semibold text-teal-50">{o.name}</div>
        <div className="text-[10px] text-teal-500/50 text-center leading-tight">{o.description}</div>
      </div>
    </ItemCard>
  );
}
