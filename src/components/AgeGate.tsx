import { useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface AgeGateProps {
  onVerify: () => void;
}

export default function AgeGate({ onVerify }: AgeGateProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-cozy-500/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cozy-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Age Verification</h2>
              <p className="text-slate-400 text-sm">18+ only</p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-6 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-200 text-sm">
              This game includes simulated gambling and cash milestone rewards. You must be 18 or older to play.
            </p>
          </div>

          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-cozy-500"
            />
            <span className="text-slate-300 text-sm">I confirm that I am at least 18 years old and I understand this game involves simulated gambling.</span>
          </label>

          <button
            onClick={() => {
              if (confirmed) {
                sounds.click();
                onVerify();
              }
            }}
            disabled={!confirmed}
            className="w-full py-3 bg-cozy-500 hover:bg-cozy-600 text-white rounded-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
