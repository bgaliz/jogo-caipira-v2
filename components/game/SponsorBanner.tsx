'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { Sponsor } from '@/lib/types';

interface Props {
  sponsor: Sponsor | null;
  visible: boolean;
}

export function SponsorBanner({ sponsor, visible }: Props) {
  return (
    <AnimatePresence>
      {visible && sponsor && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center bg-black/70 z-20 rounded-2xl"
        >
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3 max-w-xs mx-4">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Patrocinador</p>
            <div className="relative w-48 h-24">
              <Image
                src={sponsor.imageUrl}
                alt={sponsor.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-gray-700 font-bold text-sm">{sponsor.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
