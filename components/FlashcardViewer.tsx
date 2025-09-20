
import React from 'react';
import { Flashcard } from './Flashcard';
import type { Flashcard as FlashcardType } from '../types';

interface FlashcardViewerProps {
  flashcards: FlashcardType[];
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="bg-gray-700 rounded-lg p-6 animate-pulse" style={{ height: '12rem' }}>
    <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
  </div>
);

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ flashcards, isLoading }) => {
  return (
    <div className="flex-grow bg-gray-800 p-6 rounded-lg shadow-xl overflow-y-auto">
      <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Generated Flashcards</h2>
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <LoadingSkeleton key={i} />)}
        </div>
      )}
      {!isLoading && flashcards.length === 0 && (
        <div className="flex items-center justify-center h-48 bg-gray-900/50 rounded-lg">
          <p className="text-gray-400">Your flashcards will appear here once generated.</p>
        </div>
      )}
      {!isLoading && flashcards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcards.map((card, index) => (
            <Flashcard key={index} question={card.question} answer={card.answer} />
          ))}
        </div>
      )}
    </div>
  );
};
