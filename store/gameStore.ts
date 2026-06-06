import { create } from 'zustand';
import type { Question, GamePhase } from '@/lib/types';

interface GameState {
  phase: GamePhase;
  questions: Question[];
  currentIndex: number;
  characterStep: number;
  selectedOption: string | null;
  isLocked: boolean;

  startGame: (questions: Question[]) => void;
  selectAnswer: (option: string) => void;
  advanceAfterFeedback: () => void;
  advanceAfterClimb: () => void;
  advanceAfterSponsor: () => void;
  triggerFall: () => void;
  resetGame: () => void;
}

const initialState = {
  phase: 'IDLE' as GamePhase,
  questions: [],
  currentIndex: 0,
  characterStep: 0,
  selectedOption: null,
  isLocked: false,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  startGame: (questions) =>
    set({
      phase: 'SHOWING_QUESTION',
      questions,
      currentIndex: 0,
      characterStep: 0,
      selectedOption: null,
      isLocked: false,
    }),

  selectAnswer: (option) => {
    const { isLocked, phase } = get();
    if (isLocked || phase !== 'SHOWING_QUESTION') return;
    set({ selectedOption: option, isLocked: true, phase: 'ANSWER_FEEDBACK' });
  },

  advanceAfterFeedback: () => {
    const { questions, currentIndex, selectedOption, characterStep } = get();
    const question = questions[currentIndex];
    const isCorrect = selectedOption === question.correctOption;
    if (isCorrect) {
      const newStep = characterStep + 1;
      if (newStep >= 10) {
        set({ characterStep: newStep, phase: 'WIN' });
      } else {
        set({ characterStep: newStep, phase: 'CLIMBING' });
      }
    } else {
      set({ phase: 'FALLING' });
    }
  },

  advanceAfterClimb: () => {
    set({ phase: 'SHOWING_SPONSOR' });
  },

  advanceAfterSponsor: () => {
    const { currentIndex, questions } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      set({ phase: 'WIN' });
    } else {
      set({
        currentIndex: nextIndex,
        selectedOption: null,
        isLocked: false,
        phase: 'SHOWING_QUESTION',
      });
    }
  },

  triggerFall: () => {
    set({ characterStep: 0, phase: 'GAME_OVER' });
  },

  resetGame: () => set({ ...initialState }),
}));
