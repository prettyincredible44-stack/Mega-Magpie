import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { sounds } from '@/lib/sounds';

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
    const fn = mode === 'signin' ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      sounds.click();
      onAuthed();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/mascot-magpie.webp" alt="Mega Magpie" className="w-24 h-24 mx-auto mb-4 animate-float-magical" />
          <h1 className="text-3xl font-bold text-white mb-1">Mega Magpie</h1>
          <p className="text-cozy-400 text-lg font-semibold">Solitaire</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${mode === 'signup' ? 'bg-cozy-500 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${mode === 'signin' ? 'bg-cozy-500 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cozy-500 focus:outline-none placeholder-slate-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-cozy-500 focus:outline-none placeholder-slate-400"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cozy-500 hover:bg-cozy-600 text-white rounded-lg font-bold transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
