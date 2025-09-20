import React, { useState } from 'react';

interface FlashcardProps {
  question: string;
  answer: string;
}

export const Flashcard: React.FC<FlashcardProps> = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="perspective-1000 h-48 cursor-pointer group"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFlip()}
      aria-pressed={isFlipped}
      aria-label="Flip flashcard"
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden bg-gray-200 dark:bg-gray-700 rounded-lg p-4 flex flex-col justify-center items-center shadow-lg border border-gray-300 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">{question}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">Click to flip</p>
        </div>
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-cyan-600 dark:bg-cyan-800 rounded-lg p-4 flex flex-col justify-center items-center shadow-lg border border-cyan-500 dark:border-cyan-600">
          <p className="text-base text-center text-white">{answer}</p>
        </div>
      </div>
    </div>
  );
};

// Add some CSS to utility classes for 3D transforms
const styleId = 'flashcard-3d-styles';
if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .perspective-1000 { perspective: 1000px; }
      .transform-style-preserve-3d { transform-style: preserve-3d; }
      .rotate-y-180 { transform: rotateY(180deg); }
      .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
    `;
    document.head.append(style);
}