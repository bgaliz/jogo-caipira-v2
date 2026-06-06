export interface Question {
  id: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string | null;
  };
  correctOption: 'A' | 'B' | 'C' | 'D' | 'E';
  category?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  imageUrl: string;
  displayOnScreens: Array<'between_questions' | 'victory' | 'welcome'>;
  order: number;
  active: boolean;
  createdAt: string;
}

export type GamePhase =
  | 'IDLE'
  | 'SHOWING_QUESTION'
  | 'ANSWER_FEEDBACK'
  | 'CLIMBING'
  | 'SHOWING_SPONSOR'
  | 'FALLING'
  | 'GAME_OVER'
  | 'WIN';
