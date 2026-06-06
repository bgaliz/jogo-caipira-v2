'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { AnswerOption } from './AnswerOption';
import { ProgressBar } from './ProgressBar';

type OptionState = 'default' | 'selected-correct' | 'selected-wrong' | 'dimmed';

export function QuestionCard() {
  const { questions, currentIndex, selectedOption, phase, selectAnswer } = useGameStore();

  if (!questions.length) return null;
  const question = questions[currentIndex];
  const isAnswered = phase === 'ANSWER_FEEDBACK' || phase === 'CLIMBING' || phase === 'FALLING';

  const options = (['A', 'B', 'C', 'D', 'E'] as const).filter(
    (key) => question.options[key] !== null
  );

  const getState = (key: string): OptionState => {
    if (!isAnswered) return 'default';
    if (key === question.correctOption) return 'selected-correct';
    if (key === selectedOption) return 'selected-wrong';
    return 'dimmed';
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <ProgressBar current={currentIndex + 1} total={questions.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="bg-blue-900/70 backdrop-blur-sm rounded-2xl p-5 border border-yellow-500/30 shadow-xl"
        >
          <p className="text-white font-bold text-lg leading-snug mb-5 text-center">
            {question.text}
          </p>
          <div className="flex flex-col gap-2">
            {options.map((key) => (
              <AnswerOption
                key={key}
                label={key}
                text={question.options[key] as string}
                state={getState(key)}
                onClick={() => selectAnswer(key)}
                disabled={isAnswered}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
