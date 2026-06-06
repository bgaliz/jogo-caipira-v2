'use client';

import { motion } from 'framer-motion';

interface Props {
  label: string;
  text: string;
  state: 'default' | 'selected-correct' | 'selected-wrong' | 'dimmed';
  onClick: () => void;
  disabled: boolean;
}

const variants = {
  'default': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 border-yellow-300 hover:from-yellow-300 hover:to-yellow-400 hover:scale-[1.02] active:scale-[0.98]',
  'selected-correct': 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-300',
  'selected-wrong': 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-300',
  'dimmed': 'bg-blue-900/40 text-blue-400 border-blue-700/50 opacity-40',
};

export function AnswerOption({ label, text, state, onClick, disabled }: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-bold text-left transition-colors cursor-pointer ${variants[state]}`}
      animate={
        state === 'selected-wrong'
          ? { x: [0, -8, 8, -8, 8, 0] }
          : state === 'selected-correct'
          ? { scale: [1, 1.04, 1] }
          : {}
      }
      transition={{ duration: 0.4 }}
    >
      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-900/30 flex items-center justify-center font-black text-sm">
        {label}
      </span>
      <span className="text-sm leading-tight">{text}</span>
      {state === 'selected-correct' && (
        <motion.span
          className="ml-auto text-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          ✓
        </motion.span>
      )}
      {state === 'selected-wrong' && (
        <span className="ml-auto text-xl">✗</span>
      )}
    </motion.button>
  );
}
