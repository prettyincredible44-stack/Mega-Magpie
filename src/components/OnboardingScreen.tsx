import { useState } from 'react';
import { ChevronRight, Gift, Trophy, Palette, Sparkles } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: Gift,
    title: 'Daily Rewards',
    desc: 'Log in every day to build your streak and earn bigger point bonuses.',
    color: '#f59e0b',
  },
  {
    icon: Trophy,
    title: 'Level Up',
    desc: 'Win games to earn XP and climb from Rookie to Legend across 10 levels.',
    color: '#2dd4bf',
  },
  {
    icon: Palette,
    title: 'Make It Yours',
    desc: 'Unlock characters, outfits, and card backs using free points.',
    color: '#14b8a6',
  },
  {
    icon: Sparkles,
    title: 'Hints & Undo',
    desc: 'Use hints to spot moves and undo to rewind — play at your own pace.',
    color: '#fbbf24',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="felt-surface flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <img src="/mascot-magpie.webp" alt="Mega Magpie" className="mx-auto mb-3 h-20 w-20 animate-float-magical" />
          <h1 className="text-2xl font-bold text-white">Mega Magpie</h1>
          <p className="text-sm text-brand-400">Free solitaire</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="mb-6 flex justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-brand-400' : i < step ? 'w-1.5 bg-brand-700' : 'w-1.5 bg-felt-500'}`}
              />
            ))}
          </div>

          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: current.color + '22' }}
          >
            <current.icon className="h-8 w-8" style={{ color: current.color }} />
          </div>

          <h2 className="mb-2 text-center text-xl font-bold text-white">{current.title}</h2>
          <p className="mb-6 text-center text-sm text-white/60">{current.desc}</p>

          <button
            onClick={() => {
              sounds.click();
              if (isLast) onComplete();
              else setStep((s) => s + 1);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-bold text-white transition hover:bg-brand-500 active:scale-95"
          >
            {isLast ? 'Start Playing' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
