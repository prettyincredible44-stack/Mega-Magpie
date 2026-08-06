import { useState, useEffect } from 'react';
import { Sparkles, Coins, Trophy, Wallet, Gift, Star, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    icon: Sparkles,
    title: 'Welcome, Magpie!',
    subtitle: 'Collect shiny things',
    body: 'Mega Magpie loves all things shiny. Play solitaire, win coins, and build your stash of treasure. The more you play, the more you collect!',
    accent: 'from-amber-400 to-orange-500',
    glow: 'rgba(252, 211, 77, 0.4)',
  },
  {
    icon: Trophy,
    title: 'Win Real Cash',
    subtitle: 'Skill-based rewards',
    body: 'Every 10 wins earns a cash milestone. The higher your level, the bigger the payout. Climb from Rookie to Magpie King and watch your wallet grow.',
    accent: 'from-yellow-400 to-amber-500',
    glow: 'rgba(252, 211, 77, 0.4)',
  },
  {
    icon: Wallet,
    title: 'Your Private Wallet',
    subtitle: 'Deposit, play, withdraw',
    body: 'Your winnings are yours. Deposit coins to play, win with skill, and withdraw straight to your bank. Everything is private to your account.',
    accent: 'from-teal-400 to-cyan-500',
    glow: 'rgba(45, 212, 191, 0.4)',
  },
  {
    icon: Gift,
    title: 'Daily Rewards & Streaks',
    subtitle: 'Come back every day',
    body: 'Log in daily for increasing rewards. Build streaks for bonus coins, tokens, and streak freezes. Miss a day and your streak might break!',
    accent: 'from-pink-400 to-rose-500',
    glow: 'rgba(244, 114, 182, 0.4)',
  },
  {
    icon: ShieldCheck,
    title: 'Play Safely',
    subtitle: '18+ only',
    body: 'This game involves real money. Only spend what you can afford to lose. Set limits, take breaks, and play for fun first. Help is always available.',
    accent: 'from-teal-400 to-emerald-500',
    glow: 'rgba(45, 212, 191, 0.4)',
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [slide, setSlide] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;
  const Icon = current.icon;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setSlide((s) => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] felt-texture flex items-center justify-center p-4 overflow-y-auto">
      {/* Floating sparkles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-300/30 animate-sparkle-float"
            style={{
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 13) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          >
            <Sparkles className="w-3 h-3" />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-sm my-auto">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide ? 'w-8 bg-amber-400' : i < slide ? 'w-1.5 bg-amber-600/60' : 'w-1.5 bg-teal-700/40'
              }`}
            />
          ))}
        </div>

        <div
          key={slide}
          className="rounded-3xl bg-gradient-to-b from-teal-900/90 to-teal-950/95 border border-teal-700/50 shadow-2xl overflow-hidden animate-scale-in backdrop-blur-md"
        >
          {/* Top accent bar */}
          <div className={`h-1.5 bg-gradient-to-r ${current.accent}`} />

          <div className="p-6 text-center">
            {/* Mascot */}
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${current.accent} opacity-20 animate-glow-amber`}
                style={{ filter: 'blur(20px)' }}
              />
              <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${current.accent} flex items-center justify-center shadow-xl overflow-hidden animate-float-magical`}>
                {slide === 0 ? (
                  <img src="/mascot-magpie.webp" alt="Mega Magpie" className="w-full h-full object-cover" />
                ) : (
                  <Icon className="w-12 h-12 text-white" />
                )}
              </div>
              {/* Sparkles around mascot */}
              {slide === 0 && (
                <>
                  <Sparkles className="absolute -top-2 -right-1 w-5 h-5 text-amber-300 animate-sparkle" style={{ animationDelay: '0s' }} />
                  <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 text-amber-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
                  <Star className="absolute top-2 -left-3 w-3 h-3 text-amber-200 animate-sparkle" style={{ animationDelay: '1s' }} />
                </>
              )}
            </div>

            <h2 className="text-2xl font-bold gold-text mb-1">{current.title}</h2>
            <p className="text-xs uppercase tracking-widest text-teal-300/70 mb-4">{current.subtitle}</p>
            <p className="text-sm text-teal-100/80 leading-relaxed mb-6">{current.body}</p>

            {/* Age confirmation on last slide */}
            {isLast && (
              <label className="flex items-start gap-2.5 cursor-pointer mb-5 text-left bg-amber-500/10 border border-amber-400/30 rounded-xl p-3">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-5 h-5 rounded accent-amber-400 mt-0.5 shrink-0"
                />
                <span className="text-xs text-amber-200/90 leading-relaxed">
                  I confirm I am 18 years or older and I understand this game involves spending and winning real money through skill-based play.
                </span>
              </label>
            )}

            <button
              onClick={handleNext}
              disabled={isLast && !confirmed}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                isLast
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-teal-950 disabled:opacity-40 disabled:cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-teal-950'
              }`}
            >
              {isLast ? (
                <>
                  <Heart className="w-4 h-4" fill="currentColor" />
                  Start Playing
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Skip button */}
            {!isLast && (
              <button
                onClick={onComplete}
                className="mt-3 text-xs text-teal-500/60 hover:text-teal-300 transition-colors"
              >
                Skip intro
              </button>
            )}

            {isLast && (
              <p className="mt-4 text-[10px] text-teal-500/50 leading-relaxed">
                Play responsibly. Only spend what you can afford to lose. If play is affecting your life, seek help at BeGambleAware.org or call 1-800-522-4700.
              </p>
            )}
          </div>
        </div>

        {/* Footer with magpie personality */}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-teal-400/50">
          <Coins className="w-3 h-3" />
          <span>Mega Magpie Solitaire</span>
          <Sparkles className="w-3 h-3 text-amber-400/50" />
        </div>
      </div>
    </div>
  );
}
