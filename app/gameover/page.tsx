'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function GameOverPage() {
  const router = useRouter();
  const { resetGame, questions, currentIndex } = useGameStore();

  const handleRestart = () => {
    resetGame();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 14 }}
        className="flex flex-col items-center gap-6 text-center max-w-md w-full"
      >
        {/* Falling character illustration */}
        <motion.div
          initial={{ y: -60, rotate: -20 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.1 }}
          className="text-8xl"
        >
          😵
        </motion.div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-black text-red-400 drop-shadow-lg"
          >
            ESCORREGOU!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-red-300 font-bold mt-1"
          >
            Caiu do pau de sebo... 💨
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-900/70 backdrop-blur-sm rounded-2xl p-5 border border-red-500/30 w-full shadow-xl"
        >
          <p className="text-white font-bold text-lg mb-1">
            Você chegou até a pergunta{' '}
            <span className="text-yellow-400">{currentIndex + 1}</span>{' '}
            de{' '}
            <span className="text-yellow-400">{questions.length || 10}</span>.
          </p>
          <p className="text-blue-300 text-sm mt-1">
            Tente novamente e chegue ao topo! Você consegue! 💪
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: questions.length || 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < currentIndex ? 'bg-yellow-400' : i === currentIndex ? 'bg-red-400' : 'bg-blue-700'
                }`}
              />
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
          🔄 Tentar Novamente
        </motion.button>
      </motion.div>
    </div>
  );
}
