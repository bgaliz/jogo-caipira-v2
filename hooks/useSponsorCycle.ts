'use client';

import { useState, useEffect } from 'react';
import type { Sponsor } from '@/lib/types';

export function useSponsorCycle(
  sponsors: Sponsor[],
  screen: 'between_questions' | 'victory' | 'welcome'
) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const active = sponsors
    .filter((s) => s.active && s.displayOnScreens.includes(screen))
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (active.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % active.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [active.length]);

  return active.length > 0 ? active[currentIdx % active.length] : null;
}
