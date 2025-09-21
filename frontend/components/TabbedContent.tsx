import React, { useState } from 'react';
import { NotesEditor } from './NotesEditor';
import { FlashcardViewer } from './FlashcardViewer';
import { SummaryViewer } from './SummaryViewer';
import { QuizViewer } from './QuizViewer';
import type { Flashcard, QuizQuestion } from '../types';

interface TabbedContentProps {
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
  flashcards: Flashcard[];
  summary: string;
  quiz: QuizQuestion[];
}

type Tab = 'notes' | 'flashcards' | 'summary' | 'quiz';

export const TabbedContent: React.FC<TabbedContentProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('notes');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notes':
        return (
          <NotesEditor
            notes={props.notes}
            setNotes={props.setNotes}
            onGenerateFlashcards={props.onGenerateFlashcards}
            onGenerateSummary={props.onGenerateSummary}
            onGenerateQuiz={props.onGenerateQuiz}
            loadingStates={props.loadingStates}
          />
        );
      case 'flashcards':
        return (
          <FlashcardViewer flashcards={props.flashcards} isLoading={props.loadingStates.flashcards} />
        );
      case 'summary':
        return (
          <SummaryViewer summary={props.summary} isLoading={props.loadingStates.summary} />
        );
      case 'quiz':
        return (
            <QuizViewer quiz={props.quiz} isLoading={props.loadingStates.quiz} />
        );
      default:
        return null;
    }
  };
  
  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900
          ${isActive 
            ? 'bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400' 
            : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
          }`}
      >
        {label}
      </button>
    );
  };


  return (
    <div className="flex flex-col flex-grow">
        <div className="flex border-b border-gray-300 dark:border-gray-700">
            <TabButton tabName="notes" label="Study Notes" />
            <TabButton tabName="flashcards" label="Flashcards" />
            <TabButton tabName="summary" label="Summary" />
            <TabButton tabName="quiz" label="Quiz" />
        </div>
        <div className="flex-grow">
            {renderTabContent()}
        </div>
    </div>
  );
};