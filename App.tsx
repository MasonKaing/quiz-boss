
import React, { useState, useCallback } from 'react';
import { NotesEditor } from './components/NotesEditor';
import { FlashcardViewer } from './components/FlashcardViewer';
import { StudyTracker } from './components/StudyTracker';
import { generateFlashcards } from './services/geminiService';
import type { Flashcard } from './types';

const App: React.FC = () => {
  const [notes, setNotes] = useState<string>('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateFlashcards = useCallback(async () => {
    if (!notes.trim()) {
      setError('Please enter some notes before generating flashcards.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFlashcards([]);

    try {
      const generated = await generateFlashcards(notes);
      setFlashcards(generated);
    } catch (err) {
      setError('Failed to generate flashcards. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [notes]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">Gemini Study Buddy</h1>
        <div className="bg-gray-800 rounded-lg px-4 py-2 shadow-md">
          <span className="font-semibold text-lg">Points: </span>
          <span className="font-bold text-xl text-yellow-400">{points}</span>
        </div>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row gap-8">
        {/* Left Side: Notes and Flashcards */}
        <main className="flex-grow lg:w-2/3 flex flex-col gap-6">
          <NotesEditor
            notes={notes}
            setNotes={setNotes}
            onGenerate={handleGenerateFlashcards}
            isLoading={isLoading}
          />
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <FlashcardViewer flashcards={flashcards} isLoading={isLoading} />
        </main>

        {/* Right Side: Study Tracker */}
        <aside className="lg:w-1/3 xl:w-1/4">
          <StudyTracker setPoints={setPoints} />
        </aside>
      </div>
    </div>
  );
};

export default App;
