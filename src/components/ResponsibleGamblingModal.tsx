import { X, Shield, ExternalLink } from 'lucide-react';
import type { PlayerState } from '@/game/types';

interface ResponsibleGamblingModalProps {
  state: PlayerState;
  onClose: () => void;
  onTakeBreak: () => void;
}

export default function ResponsibleGamblingModal({ state, onClose, onTakeBreak }: ResponsibleGamblingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Play Safe
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-700">
              <p className="text-slate-400 text-xs">Session Spent</p>
              <p className="text-white font-bold">{state.session_spent_coins.toLocaleString()}c</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-700">
              <p className="text-slate-400 text-xs">Lifetime Spent</p>
              <p className="text-white font-bold">{state.lifetime_spent_coins.toLocaleString()}c</p>
            </div>
          </div>

          <div className="bg-emerald-500/10 rounded-lg p-3 mb-4 border border-emerald-500/20">
            <h3 className="text-emerald-300 font-semibold text-sm mb-2">Tips for Safe Play</h3>
            <ul className="text-slate-300 text-sm space-y-1.5">
              <li>• Set a budget before you play</li>
              <li>• Take regular breaks</li>
              <li>• Never chase losses</li>
              <li>• Play for fun, not to make money</li>
              <li>• Only spend what you can afford</li>
            </ul>
          </div>

          <a
            href="https://www.begambleaware.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition mb-3"
          >
            Visit BeGambleAware.org
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onTakeBreak}
            className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-semibold transition border border-amber-500/30"
          >
            Take a Break
          </button>
        </div>
      </div>
    </div>
  );
}
