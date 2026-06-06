'use client';

import { useState, useEffect, type ReactNode } from 'react';

export function PasswordGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_authed');
    if (stored === 'true') setAuthed(true);
    setChecked(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';
    if (pin === correct) {
      sessionStorage.setItem('admin_authed', 'true');
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  if (!checked) return null;
  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-blue-800/60 backdrop-blur-sm rounded-2xl p-8 w-full max-w-sm border border-yellow-500/30 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-black text-yellow-400">Área Admin</h1>
          <p className="text-blue-300 text-sm mt-1">Pau de Sebo Cultural</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-yellow-300 text-sm font-bold mb-2">PIN de acesso</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              placeholder="Digite o PIN"
              className="w-full bg-blue-900/80 border-2 border-blue-600 rounded-xl px-4 py-3 text-white placeholder-blue-400 focus:border-yellow-400 focus:outline-none text-center text-lg tracking-widest"
              maxLength={8}
              autoFocus
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center font-semibold">PIN incorreto. Tente novamente.</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-black py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all active:scale-95"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
