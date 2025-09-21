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
  onNavigateToRewards: () => void;
}

export const PageOne: React.FC<PageOneProps> = ({
  notes, setNotes, onGenerateFlashcards, onGenerateSummary, onGenerateQuiz,
  loadingStates, flashcards, summary, quiz, error, isTimerVisible, points, setPoints,
  isActive, onNavigateToRewards
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl">
            <div className="relative group">
              <button
                onClick={onNavigateToRewards}
                className="w-full px-6 py-3 font-bold text-white bg-violet-500 rounded-lg hover:bg-violet-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-yellow-500 shadow-lg"
                aria-label="Go to battle page to spend points"
              >
                Get Ready for Battle!
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-black text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                Spend your points to get better armor. Challenge a boss with your knowledge!
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};