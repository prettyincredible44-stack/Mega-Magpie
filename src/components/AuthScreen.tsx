import { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, UserPlus, LogIn, Sparkles, Star, Coins, Trophy, Wallet } from 'lucide-react';

interface AuthScreenProps {
  onSignIn: (email: string, password: string) => Promise<{ error: string | null }>;
  onSignUp: (email: string, password: string) => Promise<{ error: string | null }>;
}

export function AuthScreen({ onSignIn, onSignUp }: AuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError(null);
    const fn = mode === 'signin' ? onSignIn : onSignUp;
    const { error: err } = await fn(email.trim(), password.trim());
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen felt-texture flex items-center justify-center p-6 relative overflow-hidden">
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-300/20 animate-sparkle-float"
            style={{
              left: `${(i * 10) % 100}%`,
              top: `${(i * 15) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo & title with personality */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-3">
            <div className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-glow-amber" style={{ filter: 'blur(16px)' }} />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 shadow-xl overflow-hidden animate-float-magical">
              <img src="/magpie-logo.webp" alt="Mega Magpie" className="w-full h-full object-cover" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-sparkle" />
          </div>
          <h1 className="text-2xl font-bold gold-text">Mega Magpie Solitaire</h1>
          <p className="text-sm text-teal-400/70 mt-1 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            Your private wallet, your progress, your winnings.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <FeatureChip icon={<Trophy className="w-4 h-4 text-amber-300" />} label="Win Cash" />
          <FeatureChip icon={<Wallet className="w-4 h-4 text-teal-300" />} label="Withdraw" />
          <FeatureChip icon={<Star className="w-4 h-4 text-cyan-300" />} label="Level Up" />
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-gradient-to-b from-teal-900 to-teal-950 border border-cyan-400/30 shadow-2xl p-6 animate-win-pop">
          <div className="flex gap-2 mb-5 p-1 rounded-xl bg-teal-950/60 border border-teal-800/50">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signin' ? 'bg-cyan-500/20 text-cyan-200' : 'text-teal-500 hover:text-teal-300'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-cyan-500/20 text-cyan-200' : 'text-teal-500 hover:text-teal-300'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </div>

          <label className="block text-sm font-semibold text-teal-100 mb-2">Email address</label>
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              disabled={loading}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-teal-950/60 border border-teal-700/50 text-teal-50 placeholder-teal-600/60 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all"
            />
          </div>

          <label className="block text-sm font-semibold text-teal-100 mb-2">Password</label>
          <div className="relative mb-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={loading}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-teal-950/60 border border-teal-700/50 text-teal-50 placeholder-teal-600/60 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all"
            />
          </div>
          {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-teal-950 font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="mt-4 text-xs text-teal-500/60 text-center leading-relaxed">
            {mode === 'signin'
              ? 'Use your email and password to pick up where you left off.'
              : 'Create an account to save your coins, winnings, and progress privately.'}
          </p>
        </form>
      </div>
    </div>
  );
}

function FeatureChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-teal-900/40 border border-teal-700/30">
      {icon}
      <span className="text-[10px] font-medium text-teal-300/80">{label}</span>
    </div>
  );
}
