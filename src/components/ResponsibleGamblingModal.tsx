import { X, AlertTriangle, ShieldCheck, Heart, Phone, ExternalLink, TrendingDown } from 'lucide-react';

interface ResponsibleGamblingModalProps {
  open: boolean;
  sessionSpent: number;
  lifetimeSpent: number;
  onClose: () => void;
  onResetSession: () => void;
}

const SPEND_THRESHOLDS = [
  { coins: 500, level: 'info', title: 'Heads up!', message: 'You\'ve spent 500 coins this session. Remember to take breaks and play for fun.' },
  { coins: 1000, level: 'warning', title: 'Slow down', message: 'You\'ve spent 1,000 coins this session. Consider taking a break. Only spend what you can afford to lose.' },
  { coins: 2000, level: 'danger', title: 'Please play safe', message: 'You\'ve spent 2,000+ coins this session. We strongly recommend stopping and reviewing your spending.' },
];

export function ResponsibleGamblingModal({ open, sessionSpent, lifetimeSpent, onClose, onResetSession }: ResponsibleGamblingModalProps) {
  if (!open) return null;

  const currentThreshold = [...SPEND_THRESHOLDS].reverse().find((t) => sessionSpent >= t.coins) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl animate-win-pop overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1.5" style={{ background: 'linear-gradient(90deg, #ff7eb6, #ff5a7e, #ff7eb6)' }} />
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-cyan-300/80 hover:text-cyan-200 hover:bg-teal-800/50 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-7 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-teal-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-50">Play Safe</h2>
              <p className="text-sm text-cyan-300/80">Play safely and responsibly</p>
            </div>
          </div>

          {/* Current spending */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-teal-800/40 border border-teal-700/40">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-amber-300" />
                <span className="text-sm text-teal-200">This Session</span>
              </div>
              <span className="font-bold text-amber-200 tabular-nums">{sessionSpent.toLocaleString()} coins</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-teal-800/40 border border-teal-700/40">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-300" />
                <span className="text-sm text-teal-200">Lifetime Spending</span>
              </div>
              <span className="font-bold text-rose-300 tabular-nums">{lifetimeSpent.toLocaleString()} coins</span>
            </div>
          </div>

          {/* Active warning */}
          {currentThreshold && (
            <div className={`p-4 rounded-xl border mb-4 ${
              currentThreshold.level === 'danger'
                ? 'bg-rose-500/15 border-rose-400/40'
                : currentThreshold.level === 'warning'
                  ? 'bg-amber-500/15 border-amber-400/40'
                  : 'bg-cyan-500/10 border-cyan-400/30'
            }`}>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  currentThreshold.level === 'danger' ? 'text-rose-400' : currentThreshold.level === 'warning' ? 'text-amber-400' : 'text-cyan-300'
                }`} />
                <div>
                  <div className={`font-semibold text-sm ${
                    currentThreshold.level === 'danger' ? 'text-rose-300' : currentThreshold.level === 'warning' ? 'text-amber-200' : 'text-cyan-200'
                  }`}>{currentThreshold.title}</div>
                  <p className="text-xs text-teal-300/80 mt-1">{currentThreshold.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="p-3 rounded-xl bg-teal-800/30 border border-teal-700/40 mb-4">
            <h3 className="text-sm font-semibold text-teal-100 mb-2">Tips for Safe Play</h3>
            <ul className="space-y-1.5 text-xs text-teal-300/70">
              <li>Set a spending limit before you start playing</li>
              <li>Take regular breaks — at least 5 minutes every hour</li>
              <li>Never chase losses — the game is for fun and entertainment</li>
              <li>Only spend what you can afford to lose</li>
              <li>Don't play when stressed, upset, or under the influence</li>
            </ul>
          </div>

          {/* Self-exclusion */}
          <button
            onClick={onResetSession}
            className="w-full py-2.5 rounded-xl bg-teal-800/50 hover:bg-teal-800/70 text-teal-200 font-medium text-sm transition-colors border border-teal-700/40 mb-4"
          >
            Reset Session Spending Counter
          </button>

          {/* Resources */}
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/20">
            <h3 className="text-sm font-semibold text-rose-200 mb-2 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              Need Help?
            </h3>
            <div className="space-y-2 text-xs">
              <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200">
                <ExternalLink className="w-3.5 h-3.5" />
                BeGambleAware.org
              </a>
              <div className="flex items-center gap-1.5 text-teal-300/80">
                <Phone className="w-3.5 h-3.5" />
                National Helpline: 1-800-522-4700 (US)
              </div>
              <div className="flex items-center gap-1.5 text-teal-300/80">
                <Phone className="w-3.5 h-3.5" />
                GamCare: 0808 8020 133 (UK)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
