export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// FIX: Added RewardOutcome interface to resolve type error in PageTwo.tsx
export interface RewardOutcome {
  label: string;
  value: (cost: number) => number;
  probability: number;
  type: 'loss' | 'win' | 'multiplier';
}
