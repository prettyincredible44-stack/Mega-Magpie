import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthScreenProps {
  onAuthed: () => void;
}

export default function AuthScreen({ onAuthed }: AuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fn = mode === 'signin'
      ? supabase.auth.signInWithPassword.bind(supabase.auth)
      : supabase.auth.signUp.bind(supabase.auth);
    const { error: err } = await fn({ email, password });
    setLoading(false);
    if (err) setError(err.message);
    else onAuthed();
  };

  return (
    <div className="felt-surface flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/mascot-magpie.webp" alt="Mega Magpie" className="mx-auto mb-4 h-24 w-24 animate-float-magical" />
          <h1 className="text-3xl font-bold text-white">Mega Magpie</h1>
          <p className="mt-1 text-brand-400 font-semibold tracking-wide">Free Solitaire</p>
        </div>

        <div className="glass rounded-2xl p-6 shadow-2xl">
          <div className="mb-5 flex gap-2">
            {(['signup', 'signin'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                  mode === m
                    ? 'bg-brand-600 text-white'
                    : 'bg-felt-600/50 text-white/60 hover:text-white'
                }`}
              >
                {m === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-brand-700/40 bg-felt-600/60 px-4 py-3 text-white placeholder-white/30 focus:border-brand-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password (6+ chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-brand-700/40 bg-felt-600/60 px-4 py-3 text-white placeholder-white/30 focus:border-brand-500 focus:outline-none"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white transition hover:bg-brand-500 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Please wait…' : mode === 'signup' ? 'Get Started — Free' : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-white/30">
            Free to play · No ads · No real money
          </p>
        </div>
      </div>
    </div>
  );
}
