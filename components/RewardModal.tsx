import React, { useState, useEffect } from 'react';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: { text: string; type: 'win' | 'loss' } | null;
  onClaim: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({ isOpen, reward, onClaim }) => {
  const [countdown, setCountdown] = useState(3);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setShowResult(false);
      setCountdown(3);

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowResult(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 m-4 w-full max-w-md text-center transform transition-all">
        {!showResult ? (
          <div>
            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">Revealing your reward...</h2>
            <div className="text-8xl font-mono font-extrabold text-yellow-500 dark:text-yellow-400 animate-ping">
              {countdown}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Result:</h2>
            {reward && (
              <div
                className={`text-2xl font-semibold p-4 rounded-lg ${
                  reward.type === 'win'
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                }`}
              >
                {reward.text}
              </div>
            )}
            <button
              onClick={onClaim}
              className="mt-8 px-8 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-cyan-500 shadow-lg"
            >
              Claim Reward
            </button>
          </div>
        )}
      </div>
       <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};