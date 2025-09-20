
import React from 'react';

interface NotesEditorProps {
  notes: string;
  setNotes: (notes: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({ notes, setNotes, onGenerate, isLoading }) => {
  return (
    <div className="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-cyan-300">Your Study Notes</h2>
      <p className="text-gray-400">
        Enter your notes, summaries, or key points below. Then, click "Generate Flashcards" to have Gemini create a study set for you.
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Start typing your notes here..."
        className="w-full h-64 p-4 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-y text-gray-200 placeholder-gray-500 transition-shadow duration-200"
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="self-end px-6 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </div>
        ) : 'Generate Flashcards'}
      </button>
    </div>
  );
};
