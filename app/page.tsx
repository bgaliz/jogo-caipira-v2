'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useGameStore } from '@/store/gameStore';
import { useAudio } from '@/hooks/useAudio';
import type { Sponsor } from '@/lib/types';

export default function WelcomePage() {
  const router = useRouter();
  const { initGame, loading, error } = useGameEngine();
  const { phase, resetGame } = useGameStore();
  const { play } = useAudio();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [stars, setStars] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    setStars(Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 70,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 3,
    })));
    resetGame();
    fetch('/api/sponsors').then(r => r.json()).then(setSponsors).catch(() => {});
  }, [resetGame]);

  useEffect(() => {
    if (phase === 'SHOWING_QUESTION') {
      router.push('/game');
    }
  }, [phase, router]);

  const handleStart = async () => {
    play('click');
    await initGame();
  };

  const welcomeSponsors = sponsors.filter(s => s.active && s.displayOnScreens.includes('welcome'));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 relative overflow-hidden px-4 py-8">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: `${star.left}%`, top: `${star.top}%` }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          />
        ))}
      </div>

      {/* Bandeirolas at top */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 800 80" preserveAspectRatio="none" className="w-full h-full">
          {Array.from({ length: 16 }).map((_, i) => {
            const colors = ['#FF3333', '#FFD700', '#00AA44', '#FF6600', '#AA00FF', '#00AAFF'];
            const x1 = i * 55;
            const x2 = (i + 1) * 55;
            const midX = (x1 + x2) / 2;
            return (
              <g key={i} className="bandeirola" style={{ animationDelay: `${i * 0.15}s` }}>
                <line x1={x1} y1={8} x2={x2} y2={8} stroke="#666" strokeWidth={1.5} />
                <polygon points={`${x1 + 3},8 ${x2 - 3},8 ${midX},38`} fill={colors[i % 6]} opacity={0.9} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 text-center max-w-md w-full z-10 mt-8"
      >
        {/* Title */}
        <div>
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            className="text-7xl mb-2"
          >
            🏆
          </motion.div>
          <h1 className="text-4xl font-black text-yellow-400 leading-tight drop-shadow-lg">
            PAU DE SEBO
          </h1>
          <h2 className="text-xl font-bold text-yellow-300 tracking-widest uppercase">
            Cultural
          </h2>
          <p className="text-blue-300 text-sm mt-2 font-semibold">
            🎪 Edição Festa Junina 🎪
          </p>
        </div>

        {/* Game description */}
        <div className="bg-blue-900/60 backdrop-blur-sm rounded-2xl p-5 border border-yellow-500/30 w-full shadow-xl">
          <p className="text-white font-semibold text-base mb-3">
            Responda 10 perguntas corretamente para chegar ao topo! 🌟
          </p>
          <div className="flex justify-around text-sm text-blue-300">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">✅</span>
              <span>Acertou? Sobe!</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">❌</span>
              <span>Errou? Cai!</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">🎉</span>
              <span>Gabaritou? Ganhou!</span>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/60 text-red-300 text-sm px-4 py-3 rounded-xl border border-red-700 w-full text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Start button */}
        <motion.button
          onClick={handleStart}
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 font-black text-xl py-5 rounded-2xl shadow-2xl disabled:opacity-50 border-b-4 border-orange-600 hover:border-b-2 hover:mt-0.5 active:border-b-0 active:mt-1 transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                ⚙️
              </motion.span>
              Carregando...
            </span>
          ) : (
            '🎮 Iniciar Jogo'
          )}
        </motion.button>

        {/* Admin link (subtle) */}
        <a
          href="/admin"
          className="text-blue-600/40 text-xs hover:text-blue-400/60 transition-colors"
        >
          ⚙
        </a>
      </motion.div>

      {/* Sponsors */}
      {welcomeSponsors.length > 0 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
          {welcomeSponsors.map((sp) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={sp.id} src={sp.imageUrl} alt={sp.name} className="h-10 object-contain opacity-70" />
          ))}
        </div>
      )}
    </div>
  );
}
