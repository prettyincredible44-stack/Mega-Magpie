import { useState } from 'react';
import { ChevronRight, Gift, Trophy, Wallet, Sparkles, Shield } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: Gift,
    title: 'Daily Rewards',
    desc: 'Log in every day to build your streak and earn bigger coin and token rewards.',
    color: '#f97316',
  },
  {
    icon: Trophy,
    title: 'Level Up',
    desc: 'Win games to earn XP and climb from Rookie to Legend across 10 levels.',
    color: '#fcd34d',
  },
  {
    icon: Wallet,
    title: 'Cash Milestones',
    desc: 'Every 10 wins unlocks a cash milestone payout. Reach Level 10 for a £25 reward.',
    color: '#10b981',
  },
  {
    icon: Sparkles,
    title: 'Collect & Customize',
    desc: 'Unlock characters, outfits, and card backs. Make the game yours.',
    color: '#14b8a6',
  },
  {
    icon: Shield,
    title: 'Play Safe',
    desc: '18+ only. Set spending limits, take breaks, and play responsibly.',
    color: '#3b82f6',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/mascot-magpie.webp" alt="Mega Magpie" className="w-20 h-20 mx-auto mb-3 animate-float-magical" />
          <h1 className="text-2xl font-bold text-white">Mega Magpie Solitaire</h1>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <div className="flex justify-center gap-1.5 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-cozy-500' : 'w-1.5 bg-slate-600'}`}
              />
            ))}
          </div>

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: current.color + '20' }}>
            <current.icon className="w-8 h-8" style={{ color: current.color }} />
          </div>

          <h2 className="text-xl font-bold text-white text-center mb-2">{current.title}</h2>
          <p className="text-slate-300 text-sm text-center mb-6">{current.desc}</p>

          <button
            onClick={() => {
              sounds.click();
              if (isLast) onComplete();
              else setStep((s) => s + 1);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-cozy-500 hover:bg-cozy-600 text-white rounded-lg font-bold transition"
          >
            {isLast ? 'Start Playing' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
