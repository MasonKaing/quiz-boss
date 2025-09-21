export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// FIX: Add missing RewardOutcome interface. This was causing a compilation error in components/RewardModal.tsx.
export interface RewardOutcome {
  type: 'win' | 'loss' | 'multiplier';
  label: string;
}
