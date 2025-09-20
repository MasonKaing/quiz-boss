import React from 'react';
import { StudyTracker } from './StudyTracker';
import { TabbedContent } from './TabbedContent';
import { PointsDisplay } from './PointsDisplay';
import type { Flashcard, QuizQuestion } from '../types';

interface PageOneProps {
  notes: string;
  setNotes: (notes: string) => void;
  onGenerateFlashcards: () => void;
  onGenerateSummary: () => void;
  onGenerateQuiz: () => void;
  loadingStates: { flashcards: boolean; summary: boolean; quiz: boolean; };
  flashcards: Flashcard[];
  summary: string;
  quiz: QuizQuestion[];
  error: string | null;
  isTimerVisible: boolean;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
}

export const PageOne: React.FC<PageOneProps> = ({
  notes, setNotes, onGenerateFlashcards, onGenerateSummary, onGenerateQuiz,
  loadingStates, flashcards, summary, quiz, error, isTimerVisible, points, setPoints,
  isActive
}) => {
  return (
    <div className="flex-grow flex flex-col lg:flex-row gap-8 mt-6">
      {/* Left Side: Tabbed Content Area */}
      <main className="flex-grow lg:w-2/3 flex flex-col">
        {error && (
          <div className="bg-red-200 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <TabbedContent
          notes={notes}
          setNotes={setNotes}
          onGenerateFlashcards={onGenerateFlashcards}
          onGenerateSummary={onGenerateSummary}
          onGenerateQuiz={onGenerateQuiz}
          loadingStates={loadingStates}
          flashcards={flashcards}
          summary={summary}
          quiz={quiz}
        />
      </main>

      {/* Right Side: Study Tracker */}
      <aside className={`lg:w-1/3 xl:w-1/4 ${!isTimerVisible ? 'hidden' : ''}`}>
        <div className="sticky top-8 flex flex-col gap-6">
          <StudyTracker setPoints={setPoints} isActive={isActive} />
          <PointsDisplay points={points} />
        </div>
      </aside>
    </div>
  );
};