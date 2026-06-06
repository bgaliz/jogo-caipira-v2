'use client';

import { motion } from 'framer-motion';

interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = (current / total) * 100;

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center text-sm font-bold text-yellow-300">
        <span>Questão {current} de {total}</span>
        <span className="text-yellow-400">{current}/{total}</span>
      </div>
      <div className="w-full h-3 bg-blue-900/60 rounded-full overflow-hidden border border-yellow-500/30">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div className="flex gap-1 justify-center">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              i < current
                ? 'bg-yellow-400 border-yellow-400 scale-110'
                : 'bg-blue-900/50 border-blue-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
