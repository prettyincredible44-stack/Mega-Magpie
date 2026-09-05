import { X, ArrowDownToLine, ArrowUpFromLine, Award } from 'lucide-react';
import type { PlayerState, Transaction } from '@/game/types';

interface WalletModalProps {
  state: PlayerState;
  transactions: Transaction[];
  onClose: () => void;
}

function formatPence(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export default function WalletModal({ state, transactions, onClose }: WalletModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Wallet</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl p-4 border border-emerald-500/30">
              <p className="text-emerald-300 text-sm mb-1">Total Winnings</p>
              <p className="text-white font-bold text-2xl">{formatPence(state.winnings_pence)}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl p-4 border border-amber-500/30">
              <p className="text-amber-300 text-sm mb-1">Lifetime Won</p>
              <p className="text-white font-bold text-2xl">{formatPence(state.lifetime_won_pence)}</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl font-semibold transition border border-blue-500/30">
              <ArrowDownToLine className="w-4 h-4" />
              Deposit
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl font-semibold transition border border-emerald-500/30">
              <ArrowUpFromLine className="w-4 h-4" />
              Withdraw
            </button>
          </div>

          <div className="bg-amber-500/10 rounded-lg p-3 mb-4 border border-amber-500/20">
            <p className="text-amber-200 text-sm text-center">Payments coming soon — keep earning in the meantime!</p>
          </div>

          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Transaction History
          </h3>
          {transactions.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3 border border-slate-700">
                  <div>
                    <p className="text-white text-sm font-medium">{tx.description || tx.type}</p>
                    <p className="text-slate-400 text-xs">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-bold ${tx.type === 'award' ? 'text-emerald-400' : 'text-white'}`}>
                    {tx.type === 'award' ? '+' : ''}{formatPence(tx.amount_pence)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
