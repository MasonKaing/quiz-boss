import React, { useState, useCallback, useEffect } from 'react';
import { generateFlashcards, generateSummary, generateQuiz } from './services/geminiService';
import type { Flashcard, QuizQuestion } from './types';
import { Header } from './components/Header';
import { SidePanel } from './components/SidePanel';
import { PageOne } from './components/PageOne';
import { PageTwo } from './components/PageTwo';


const App: React.FC = () => {
  const [notes, setNotes] = useState<string>('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [loadingStates, setLoadingStates] = useState({
    flashcards: false,
    summary: false,
    quiz: false,
  });
  const [error, setError] = useState<string | null>(null);

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState<'pageOne' | 'pageTwo'>('pageOne');


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('study-app-theme', theme);
  }, [theme]);
  
  useEffect(() => {
      const savedTheme = localStorage.getItem('study-app-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
      }
  }, []);

  const createGenerateHandler = useCallback((
    type: 'flashcards' | 'summary' | 'quiz',
    generator: (notes: string) => Promise<any>,
    setter: (data: any) => void,
    clearer: () => void
  ) => async () => {
    if (!notes.trim()) {
      setError('Please enter some notes first.');
      return;
    }
    setLoadingStates(prev => ({ ...prev, [type]: true }));
    setError(null);
    clearer();

    try {
      const generatedData = await generator(notes);
      setter(generatedData);
    } catch (err) {
      setError(`Failed to generate ${type}. Please check your API key and try again.`);
      console.error(err);
    } finally {
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    }
  }, [notes]);

  const handleGenerateFlashcards = createGenerateHandler('flashcards', generateFlashcards, setFlashcards, () => setFlashcards([]));
  const handleGenerateSummary = createGenerateHandler('summary', generateSummary, setSummary, () => setSummary(''));
  const handleGenerateQuiz = createGenerateHandler('quiz', generateQuiz, setQuiz, () => setQuiz([]));

  const handleNavigate = (page: 'pageOne' | 'pageTwo') => {
    setCurrentPage(page);
    setIsSidePanelOpen(false); // Close panel on navigation
  };


  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <Header onMenuClick={() => setIsSidePanelOpen(true)} />
      <SidePanel 
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        theme={theme}
        setTheme={setTheme}
        isTimerVisible={isTimerVisible}
        setIsTimerVisible={setIsTimerVisible}
        onNavigate={handleNavigate}
        setPoints={setPoints}
      />
      
      <div className={currentPage === 'pageOne' ? 'contents' : 'hidden'}>
        <PageOne
          notes={notes}
          setNotes={setNotes}
          onGenerateFlashcards={handleGenerateFlashcards}
          onGenerateSummary={handleGenerateSummary}
          onGenerateQuiz={handleGenerateQuiz}
          loadingStates={loadingStates}
          flashcards={flashcards}
          summary={summary}
          quiz={quiz}
          error={error}
          isTimerVisible={isTimerVisible}
          points={points}
          setPoints={setPoints}
          isActive={currentPage === 'pageOne'}
        />
      </div>
      <div className={currentPage === 'pageTwo' ? 'contents' : 'hidden'}>
        <PageTwo 
          points={points}
          setPoints={setPoints}
          onNavigateBack={() => handleNavigate('pageOne')}
        />
      </div>
    </div>
  );
};

export default App;