import React, { useState, useMemo, useEffect } from 'react';
import type { QuizQuestion } from '../types';

interface QuizViewerProps {
  quiz: QuizQuestion[];
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );

export const QuizViewer: React.FC<QuizViewerProps> = ({ quiz, isLoading }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const score = useMemo(() => {
    return userAnswers.reduce((correctCount, answer, index) => {
        return answer === quiz[index]?.correctAnswer ? correctCount + 1 : correctCount;
    }, 0);
  }, [userAnswers, quiz]);

  useEffect(() => {
    // Reset state when a new quiz is generated
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsFinished(false);
  }, [quiz]);


  const handleAnswerSelect = (option: string) => {
    if (userAnswers.length > currentQuestionIndex) return; // Already answered
    setUserAnswers([...userAnswers, option]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
        setIsFinished(true);
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsFinished(false);
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const hasAnsweredCurrent = userAnswers.length > currentQuestionIndex;

  if (isLoading) {
    return (
        <div className="flex-grow bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-xl h-full">
            <h2 className="text-2xl font-semibold text-cyan-600 dark:text-cyan-300 mb-6">Quiz Time!</h2>
            <LoadingSkeleton />
        </div>
    );
  }

  if (quiz.length === 0) {
    return (
        <div className="flex-grow bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-xl h-full">
             <h2 className="text-2xl font-semibold text-cyan-600 dark:text-cyan-300 mb-4">Quiz Time!</h2>
            <div className="flex items-center justify-center h-full min-h-48 bg-gray-100/50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Generate a quiz from your notes to test your knowledge.</p>
            </div>
        </div>
    );
  }

  if(isFinished) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
        <div className="flex-grow bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-xl h-full flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Quiz Complete!</h2>
            <p className="text-xl mt-4">Your Score: 
                <span className="font-bold text-yellow-500 dark:text-yellow-400 ml-2">{score} / {quiz.length} ({percentage}%)</span>
            </p>
            <button
                onClick={handleRestart}
                className="mt-8 px-6 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-cyan-500 shadow-lg"
            >
                Try Again
            </button>
        </div>
    )
  }

  return (
    <div className="flex-grow bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-baseline">
        <h2 className="text-2xl font-semibold text-cyan-600 dark:text-cyan-300 mb-4">Quiz Time!</h2>
        <p className="text-gray-500 dark:text-gray-400 font-mono">Question {currentQuestionIndex + 1} / {quiz.length}</p>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-xl my-4 text-gray-800 dark:text-gray-200">{currentQuestion.question}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = userAnswers[currentQuestionIndex] === option;
            const isCorrect = currentQuestion.correctAnswer === option;
            
            let buttonClass = 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200';
            if(hasAnsweredCurrent) {
                if(isCorrect) {
                    buttonClass = 'bg-green-600 dark:bg-green-700 ring-2 ring-green-500 dark:ring-green-400 text-white';
                } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-600 dark:bg-red-700 ring-2 ring-red-500 dark:ring-red-400 text-white';
                } else {
                    buttonClass = 'bg-gray-200 dark:bg-gray-700 opacity-60 text-gray-800 dark:text-gray-200';
                }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={hasAnsweredCurrent}
                className={`p-4 rounded-lg text-left w-full transition-all duration-200 disabled:cursor-not-allowed ${buttonClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      {hasAnsweredCurrent && (
         <button
            onClick={handleNext}
            className="self-end mt-6 px-6 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-cyan-500 shadow-lg"
        >
            {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
};