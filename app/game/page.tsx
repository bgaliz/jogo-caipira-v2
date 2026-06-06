'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useAudio } from '@/hooks/useAudio';
import { useSponsorCycle } from '@/hooks/useSponsorCycle';
import { PoleScene } from '@/components/game/PoleScene';
import { QuestionCard } from '@/components/game/QuestionCard';
import { SponsorBanner } from '@/components/game/SponsorBanner';
import type { Sponsor } from '@/lib/types';

export default function GamePage() {
  const router = useRouter();
  const { play } = useAudio();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorTimer, setSponsorTimer] = useState(false);

  const {
    phase,
    questions,
    currentIndex,
    selectedOption,
    advanceAfterFeedback,
    advanceAfterClimb,
    advanceAfterSponsor,
    triggerFall,
  } = useGameStore();

  const betweenSponsor = useSponsorCycle(sponsors, 'between_questions');

  useEffect(() => {
    fetch('/api/sponsors').then(r => r.json()).then(setSponsors).catch(() => {});
  }, []);

  // Redirect if no game in progress
  useEffect(() => {
    if (phase === 'IDLE') router.replace('/');
  }, [phase, router]);

  // Handle phase transitions
  useEffect(() => {
    if (phase === 'ANSWER_FEEDBACK') {
      const q = questions[currentIndex];
      const isCorrect = selectedOption === q?.correctOption;
      play(isCorrect ? 'correct' : 'wrong');
      const t = setTimeout(() => advanceAfterFeedback(), 1200);
      return () => clearTimeout(t);
    }

    if (phase === 'CLIMBING') {
      const t = setTimeout(() => advanceAfterClimb(), 800);
      return () => clearTimeout(t);
    }

    if (phase === 'SHOWING_SPONSOR') {
      const hasSponsor = betweenSponsor !== null;
      setSponsorTimer(hasSponsor);
      const delay = hasSponsor ? 2800 : 0;
      const t = setTimeout(() => {
        setSponsorTimer(false);
        advanceAfterSponsor();
      }, delay);
      return () => clearTimeout(t);
    }

    if (phase === 'FALLING') {
      play('fall');
      const t = setTimeout(() => {
        triggerFall();
        router.push('/gameover');
      }, 1000);
      return () => clearTimeout(t);
    }

    if (phase === 'WIN') {
      play('victory');
      const t = setTimeout(() => router.push('/victory'), 600);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === 'IDLE' || !questions.length) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 flex flex-col md:flex-row overflow-hidden">
      {/* Pole section */}
      <div className="relative flex-shrink-0 w-full md:w-148 h-64 md:h-screen">
        <PoleScene />
      </div>

      {/* Question section */}
      <div className="flex-1 flex flex-col p-4 md:p-6 relative">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-yellow-400 font-black text-2xl">🎪 Pau de Sebo Cultural</h2>
          <button
            onClick={() => { if (confirm('Deseja reiniciar o jogo?')) router.push('/'); }}
            className="text-blue-400 hover:text-yellow-400 text-sm border border-blue-700 hover:border-yellow-500/50 rounded-lg px-3 py-1 transition-colors"
          >
            ↩ Reiniciar
          </button>
        </div>

        {/* Question card — grows to fill available space */}
        <div className="flex-1 flex flex-col justify-center relative">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <QuestionCard />
            <SponsorBanner sponsor={betweenSponsor} visible={sponsorTimer} />
          </motion.div>
        </div>

        {/* Persistent sponsor strip — always visible at the bottom */}
        {betweenSponsor && (
          <div className="mt-4 flex items-center justify-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">Apoio</span>
            <div className="w-px h-4 bg-blue-700" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={betweenSponsor.imageUrl}
              alt={betweenSponsor.name}
              className="h-12 object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
