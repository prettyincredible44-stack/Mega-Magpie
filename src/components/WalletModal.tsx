import { useState, useEffect, useCallback } from 'react';
import { X, Wallet, ArrowDownToLine, ArrowUpFromLine, Lock, Check, Trophy, History, Sparkles, ShieldCheck, Coins, TrendingUp, Target, Info } from 'lucide-react';
import { supabase, Transaction, penceToPounds } from '@/lib/supabase';
import {
  AWARD_ON_MAX_LEVEL_PENCE,
  MILESTONE_WINS,
  MILESTONE_TIERS,
  getMilestoneTier,
  MIN_WITHDRAWAL_PENCE,
  WITHDRAWAL_THRESHOLD_PENCE,
  DEPOSIT_PACKAGES,
  HOUSE_FEE_PCT,
} from '@/game/levels';

interface WalletModalProps {
  open: boolean;
  winningsPence: number;
  totalDepositedPence: number;
  lifetimeWonPence: number;
  maxLevelReached: number;
  level: number;
  winsSinceMilestone: number;
  milestonesClaimed: number;
  onClose: () => void;
  onDeposit: (amountPence: number) => Promise<void>;
  onWithdraw: (amountPence: number) => Promise<void>;
}

export function WalletModal({
  open, winningsPence, totalDepositedPence, lifetimeWonPence, maxLevelReached,
  level, winsSinceMilestone, milestonesClaimed,
  onClose, onDeposit, onWithdraw,
}: WalletModalProps) {
  const [mode, setMode] = useState<'overview' | 'deposit' | 'withdraw' | 'history' | 'earnings'>('overview');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState(DEPOSIT_PACKAGES[1].pence);
  const [withdrawAmount, setWithdrawAmount] = useState(MIN_WITHDRAWAL_PENCE);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const canWithdraw = totalDepositedPence >= WITHDRAWAL_THRESHOLD_PENCE && winningsPence >= MIN_WITHDRAWAL_PENCE;
  const hasAward = maxLevelReached >= 10;
  const tier = getMilestoneTier(level);
  const winsLeft = MILESTONE_WINS - winsSinceMilestone;

  useEffect(() => {
    if (!open) {
      setMode('overview');
      setDone(false);
      setError(null);
    }
  }, [open]);

  const loadHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setTransactions((data ?? []) as Transaction[]);
    } catch (err) {
      console.error('failed to load transactions', err);
    }
  }, []);

  useEffect(() => {
    if (open && mode === 'history') loadHistory();
  }, [open, mode, loadHistory]);

  if (!open) return null;

  const handleDeposit = async () => {
    setProcessing(true);
    setError(null);
    try {
      await onDeposit(selectedPackage);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    setProcessing(true);
    setError(null);
    try {
      await onWithdraw(withdrawAmount);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl animate-win-pop overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400" />
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-teal-400 hover:text-teal-200 hover:bg-teal-800/50 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-7 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-teal-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-50">Wallet</h2>
              <p className="text-sm text-teal-400/80">Track your winnings and cash milestones</p>
            </div>
          </div>

          {mode === 'overview' && (
            <div className="space-y-3">
              {/* Winnings balance */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30">
                <div className="text-xs uppercase tracking-wide text-amber-300/80 mb-1">Winnings Balance</div>
                <div className="text-3xl font-bold gold-text">{penceToPounds(winningsPence)}</div>
              </div>

              {/* Milestone progress */}
              {tier && (
                <div className="p-3 rounded-xl bg-teal-800/30 border border-teal-700/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span className="text-sm font-semibold text-teal-100">{tier.name} Tier Milestone</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-teal-400/70">{winsSinceMilestone} / {MILESTONE_WINS} wins</span>
                    <span className="text-xs font-bold text-amber-300">{penceToPounds(tier.awardPence)} per milestone</span>
                  </div>
                  <div className="h-2 rounded-full bg-teal-950/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-500"
                      style={{ width: `${(winsSinceMilestone / MILESTONE_WINS) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-teal-500/60 mt-1.5">
                    {winsLeft > 0 ? `${winsLeft} more win${winsLeft === 1 ? '' : 's'} to earn ${penceToPounds(tier.awardPence)}` : 'Milestone earned!'}
                  </div>
                </div>
              )}

              {/* Milestones claimed stat */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-800/20 border border-teal-700/30">
                <Trophy className="w-4 h-4 text-amber-300/80" />
                <span className="text-xs text-teal-400/70">{milestonesClaimed} milestone{milestonesClaimed === 1 ? '' : 's'} claimed</span>
              </div>

              {/* Award status */}
              <div className={`p-3 rounded-xl border flex items-center gap-3 ${hasAward ? 'bg-amber-500/10 border-amber-400/40' : 'bg-teal-800/30 border-teal-700/40'}`}>
                <Trophy className={`w-5 h-5 ${hasAward ? 'text-amber-300' : 'text-teal-500/50'}`} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-teal-100">Level 10 Award</div>
                  <div className="text-xs text-teal-400/70">
                    {hasAward ? `${penceToPounds(AWARD_ON_MAX_LEVEL_PENCE)} credited to your winnings` : `Reach Level 10 to unlock ${penceToPounds(AWARD_ON_MAX_LEVEL_PENCE)}`}
                  </div>
                </div>
                {hasAward && <Check className="w-4 h-4 text-amber-300" />}
              </div>

              {/* Deposit info */}
              <div className="p-3 rounded-xl bg-teal-800/30 border border-teal-700/40">
                <div className="text-sm font-semibold text-teal-100">Lifetime Deposits</div>
                <div className="text-lg font-bold text-teal-50">{penceToPounds(totalDepositedPence)}</div>
                <div className="text-xs text-teal-400/70 mt-1">
                  {totalDepositedPence >= WITHDRAWAL_THRESHOLD_PENCE
                    ? 'You can withdraw winnings'
                    : `Deposit ${penceToPounds(WITHDRAWAL_THRESHOLD_PENCE - totalDepositedPence)} more to unlock withdrawals`}
                </div>
              </div>

              {/* How to Earn Cash */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30">
                <div className="flex items-center gap-1.5 mb-2">
                  <Coins className="w-4 h-4 text-amber-300" />
                  <span className="text-sm font-semibold text-amber-200">How to Earn Cash</span>
                </div>
                <div className="space-y-1.5 text-xs text-teal-300/70">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-300/70 flex-shrink-0" />
                    <span>Win {MILESTONE_WINS} games = cash milestone reward</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-300/70 flex-shrink-0" />
                    <span>Stake coins for bigger rewards</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-teal-300/70 flex-shrink-0" />
                    <span>Reach Level 10 for a {penceToPounds(AWARD_ON_MAX_LEVEL_PENCE)} one-time award</span>
                  </div>
                </div>
              </div>

              {/* Fair Play transparency */}
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                <div className="flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm font-semibold text-cyan-200">Fair Play</span>
                </div>
                <div className="space-y-1 text-xs text-teal-300/70">
                  <p>Winnings are earned by winning solitaire games — no random chance involved.</p>
                  <p>Stake multipliers are fixed and shown before you stake coins.</p>
                  <p>Milestone cash rewards are paid at set intervals (every {MILESTONE_WINS} wins).</p>
                  <p>Card shuffling uses a standard 52-card deck with no house advantage.</p>
                  <p className="pt-1 text-teal-400/60">House fee: {HOUSE_FEE_PCT}% on deposits — keeps the app running. 90% goes to player winnings.</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => { setMode('deposit'); setDone(false); setError(null); }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-teal-50 font-semibold text-sm transition-colors"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  Deposit
                </button>
                {/* Stripe not yet connected — deposits disabled */}
                <button
                  onClick={() => { setMode('withdraw'); setDone(false); setError(null); setWithdrawAmount(Math.min(winningsPence, Math.max(MIN_WITHDRAWAL_PENCE, winningsPence))); }}
                  disabled={!canWithdraw}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-sm transition-colors border border-amber-400/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowUpFromLine className="w-4 h-4" />
                  Withdraw
                </button>
              </div>
              <button
                onClick={() => { setMode('earnings'); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-800/40 hover:bg-teal-800/60 text-teal-300 font-medium text-sm transition-colors border border-teal-700/40"
              >
                <Info className="w-4 h-4" />
                Payout Rates & Stats
              </button>
              <button
                onClick={() => { setMode('history'); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-800/40 hover:bg-teal-800/60 text-teal-300 font-medium text-sm transition-colors border border-teal-700/40"
              >
                <History className="w-4 h-4" />
                Transaction History
              </button>
            </div>
          )}

          {mode === 'deposit' && (
            <ComingSoonFlow
              title="Deposits Coming Soon"
              message="We're connecting a secure payment provider so you can fund your account. In the meantime, keep winning games to earn coins and cash milestones!"
              onBack={() => { setMode('overview'); setDone(false); setError(null); }}
            />
          )}

          {mode === 'withdraw' && (
            <ComingSoonFlow
              title="Withdrawals Coming Soon"
              message="We're connecting a secure payment provider so you can cash out your winnings. Your winnings balance is safe and will be available once payments are live!"
              onBack={() => { setMode('overview'); setDone(false); setError(null); }}
            />
          )}

          {mode === 'earnings' && (
            <EarningsView
              lifetimeWonPence={lifetimeWonPence}
              totalDepositedPence={totalDepositedPence}
              winningsPence={winningsPence}
              milestonesClaimed={milestonesClaimed}
              onBack={() => setMode('overview')}
            />
          )}

          {mode === 'history' && (
            <HistoryView transactions={transactions} onBack={() => setMode('overview')} />
          )}
        </div>
      </div>
    </div>
  );
}

function ComingSoonFlow({ title, message, onBack }: {
  title: string; message: string; onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center py-6">
        <div className="mx-auto w-14 h-14 rounded-full bg-cyan-500/15 flex items-center justify-center mb-3">
          <Lock className="w-7 h-7 text-cyan-300" />
        </div>
        <h3 className="text-lg font-bold text-teal-50 mb-2">{title}</h3>
        <p className="text-sm text-teal-400/80 max-w-xs mx-auto leading-relaxed">{message}</p>
      </div>
      <button onClick={onBack} className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-teal-50 font-semibold text-sm transition-colors">
        Back to Wallet
      </button>
    </div>
  );
}

function HistoryView({ transactions, onBack }: { transactions: Transaction[]; onBack: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-teal-100">Recent Transactions</h3>
        <button onClick={onBack} className="text-xs text-teal-400 hover:text-teal-200">Back</button>
      </div>
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-teal-500/50 text-sm">No transactions yet</div>
      ) : (
        <div className="space-y-1.5">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-teal-800/30 border border-teal-700/40">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  tx.type === 'deposit' ? 'bg-teal-600/40' : tx.type === 'withdraw' ? 'bg-amber-500/20' : 'bg-amber-400/20'
                }`}>
                  {tx.type === 'deposit' ? <ArrowDownToLine className="w-4 h-4 text-teal-300" /> : tx.type === 'withdraw' ? <ArrowUpFromLine className="w-4 h-4 text-amber-300" /> : <Trophy className="w-4 h-4 text-amber-300" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-teal-100 capitalize">{tx.type}</div>
                  <div className="text-[10px] text-teal-500/60">{new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>
              <div className={`text-sm font-bold tabular-nums ${tx.amount_pence >= 0 ? 'text-teal-300' : 'text-rose-300'}`}>
                {tx.amount_pence >= 0 ? '+' : ''}{penceToPounds(tx.amount_pence)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EarningsView({
  lifetimeWonPence, totalDepositedPence, winningsPence, milestonesClaimed, onBack,
}: {
  lifetimeWonPence: number;
  totalDepositedPence: number;
  winningsPence: number;
  milestonesClaimed: number;
  onBack: () => void;
}) {
  const netProfit = lifetimeWonPence - totalDepositedPence;
  const profitColor = netProfit >= 0 ? 'text-emerald-300' : 'text-rose-300';
  const profitLabel = netProfit >= 0 ? 'Net Profit' : 'Net Loss';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-teal-100">Payout Rates & Stats</h3>
        <button onClick={onBack} className="text-xs text-teal-400 hover:text-teal-200">Back</button>
      </div>

      {/* Lifetime stats */}
      <div className="p-3 rounded-xl bg-teal-800/30 border border-teal-700/40 space-y-2">
        <div className="text-xs font-semibold text-cyan-200 mb-1">Lifetime Summary</div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-teal-300/80">Total Cash Won</span>
          <span className="font-bold text-emerald-300 tabular-nums">{penceToPounds(lifetimeWonPence)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-teal-300/80">Total Deposited</span>
          <span className="font-bold text-teal-200 tabular-nums">{penceToPounds(totalDepositedPence)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-teal-300/80">Current Balance</span>
          <span className="font-bold text-amber-300 tabular-nums">{penceToPounds(winningsPence)}</span>
        </div>
        <div className="flex items-center justify-between text-xs pt-2 border-t border-teal-700/30">
          <span className="text-teal-300/80">{profitLabel}</span>
          <span className={`font-bold tabular-nums ${profitColor}`}>
            {netProfit >= 0 ? '+' : ''}{penceToPounds(netProfit)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-teal-300/80">Milestones Claimed</span>
          <span className="font-bold text-teal-200 tabular-nums">{milestonesClaimed}</span>
        </div>
      </div>

      {/* Payout rates */}
      <div className="p-3 rounded-xl bg-teal-800/30 border border-teal-700/40">
        <div className="text-xs font-semibold text-cyan-200 mb-2">Cash Milestone Payouts</div>
        <p className="text-[10px] text-teal-400/70 mb-2">Win {MILESTONE_WINS} games to earn cash at your current level tier:</p>
        <div className="space-y-1.5">
          {MILESTONE_TIERS.map((t) => (
            <div key={t.minLevel} className="flex items-center justify-between text-xs">
              <span className="text-teal-300/80">Levels {t.minLevel}-{t.maxLevel} ({t.name})</span>
              <span className="font-bold text-amber-300">{penceToPounds(t.awardPence)} per {MILESTONE_WINS} wins</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-teal-700/30 mt-1.5">
            <span className="text-teal-300/80">Level 10 (Magpie King)</span>
            <span className="font-bold text-amber-300">{penceToPounds(AWARD_ON_MAX_LEVEL_PENCE)} one-time</span>
          </div>
        </div>
      </div>

      {/* How payouts work */}
      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
        <div className="flex items-center gap-1.5 mb-2">
          <Info className="w-4 h-4 text-cyan-300" />
          <span className="text-xs font-semibold text-cyan-200">How Payouts Work</span>
        </div>
        <div className="space-y-1.5 text-[11px] text-teal-300/70">
          <p><Trophy className="w-3 h-3 inline mr-1 text-amber-300/70" />Win solitaire games to earn coins and XP. Every {MILESTONE_WINS} wins at your level tier pays cash.</p>
          <p><TrendingUp className="w-3 h-3 inline mr-1 text-cyan-300/70" />Stake coins before a game to multiply your reward. Win the game to receive the multiplied payout.</p>
          <p><Target className="w-3 h-3 inline mr-1 text-teal-300/70" />Reach Level 10 to claim a {penceToPounds(AWARD_ON_MAX_LEVEL_PENCE)} one-time cash award.</p>
          <p><ShieldCheck className="w-3 h-3 inline mr-1 text-cyan-300/70" />House fee is {HOUSE_FEE_PCT}% on deposits. 90% of every deposit goes toward player winnings.</p>
        </div>
      </div>
    </div>
  );
}
