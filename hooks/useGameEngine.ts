'use client';

import { useState, useCallback } from 'react';
import { shuffle } from '@/lib/shuffle';
import { useGameStore } from '@/store/gameStore';
import type { Question } from '@/lib/types';

const QUESTIONS_PER_GAME = 10;

export function useGameEngine() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startGame = useGameStore((s) => s.startGame);

  const initGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/questions');
      const all: Question[] = await res.json();
      const active = all.filter((q) => q.active);
      if (active.length < QUESTIONS_PER_GAME) {
        setError(`Precisamos de pelo menos ${QUESTIONS_PER_GAME} perguntas ativas. Atualmente há ${active.length}.`);
        return;
      }
      const drawn = shuffle(active).slice(0, QUESTIONS_PER_GAME);
      startGame(drawn);
    } catch {
      setError('Erro ao carregar perguntas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [startGame]);

  return { initGame, loading, error };
}
