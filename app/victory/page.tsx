'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import type { Sponsor } from '@/lib/types';

export default function VictoryPage() {
  const router = useRouter();
  const { resetGame, questions } = useGameStore();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    fetch('/api/sponsors').then(r => r.json()).then(setSponsors).catch(() => {});

    // Trigger confetti
    import('canvas-confetti').then(({ default: confetti }) => {
      const fire = (particleRatio: number, opts: object) =>
        confetti({
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FF3333', '#00AA44', '#FF6600', '#FFFFFF'],
          ...opts,
          particleCount: Math.floor(200 * particleRatio),
        });
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    });
  }, []);

  const handleRestart = () => {
    resetGame();
    router.push('/');
  };

  const victorySponsors = sponsors.filter(s => s.active && s.displayOnScreens.includes('victory'));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        className="flex flex-col items-center gap-6 text-center max-w-md w-full z-10"
      >
        {/* Trophy */}
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl"
        >
          🏆
        </motion.div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-black text-yellow-400 drop-shadow-lg"
          >
            PARABÉNS!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-yellow-300 font-bold mt-1"
          >
            Você chegou ao topo! 🎉
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-900/70 backdrop-blur-sm rounded-2xl p-5 border border-yellow-500/30 w-full shadow-xl"
        >
          <p className="text-white font-bold text-lg mb-1">
            🎊 Você acertou todas as {questions.length} perguntas!
          </p>
          <p className="text-blue-300 text-sm">
            Subiu o pau de sebo do começo ao fim. Incrível!
          </p>

          {/* Correct stars */}
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.07, type: 'spring' }}
                className="text-xl"
              >
                ⭐
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={handleRestart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 font-black text-xl py-5 rounded-2xl shadow-2xl border-b-4 border-orange-600 hover:border-b-2 hover:mt-0.5 active:border-b-0 active:mt-1 transition-all"
        >
          🎮 Jogar Novamente
        </motion.button>
      </motion.div>

      {/* Sponsors */}
      {victorySponsors.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10"
        >
          {victorySponsors.map((sp) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={sp.id} src={sp.imageUrl} alt={sp.name} className="h-10 object-contain opacity-80" />
          ))}
        </motion.div>
      )}
    </div>
  );
}
