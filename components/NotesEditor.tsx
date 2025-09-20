import React from 'react';

interface NotesEditorProps {
  notes: string;
  setNotes: (notes: string) => void;
  onGenerateFlashcards: () => void;
  onGenerateSummary: () => void;
  onGenerateQuiz: () => void;
  loadingStates: {
    flashcards: boolean;
    summary: boolean;
    quiz: boolean;
  };
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const NotesEditor: React.FC<NotesEditorProps> = ({ notes, setNotes, onGenerateFlashcards, onGenerateSummary, onGenerateQuiz, loadingStates }) => {
  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  
  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-xl h-full">
      <h2 className="text-2xl font-semibold text-cyan-600 dark:text-cyan-300">Your Study Notes</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Enter your notes below. Then use the buttons to generate study materials with Gemini.
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Start typing your notes here..."
        className="w-full flex-grow p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-y text-gray-800 dark:text-gray-200 placeholder-gray-500 transition-shadow duration-200"
        disabled={isAnyLoading}
        style={{ minHeight: '200px' }}
      />
      <div className="flex flex-wrap justify-end items-center gap-3 mt-2">
        <button
            onClick={onGenerateFlashcards}
            disabled={isAnyLoading}
            className="px-5 py-2.5 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-cyan-500 shadow-lg"
        >
            {loadingStates.flashcards ? <div className="flex items-center"><LoadingSpinner /> Generating...</div> : 'Generate Flashcards'}
        </button>
        <button
            onClick={onGenerateSummary}
            disabled={isAnyLoading}
            className="px-5 py-2.5 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 shadow-lg"
        >
            {loadingStates.summary ? <div className="flex items-center"><LoadingSpinner /> Summarizing...</div> : 'Generate Summary'}
        </button>
        <button
            onClick={onGenerateQuiz}
            disabled={isAnyLoading}
            className="px-5 py-2.5 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-purple-500 shadow-lg"
        >
            {loadingStates.quiz ? <div className="flex items-center"><LoadingSpinner /> Quizzing...</div> : 'Generate Quiz'}
        </button>
      </div>
    </div>
  );
};