import React, { useState, useEffect, useRef } from 'react';
import type { RewardOutcome } from '../types';

// FIX: Updated props to match what is passed from PageTwo.tsx
interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  winningOutcome: RewardOutcome;
  reel: RewardOutcome[];
  onClaim: () => void;
}

const getOutcomeStyle = (type: RewardOutcome['type']) => {
    switch (type) {
        case 'win': return 'text-green-500 dark:text-green-400';
        case 'loss': return 'text-red-500 dark:text-red-400';
        case 'multiplier': return 'text-yellow-500 dark:text-yellow-400';
        default: return 'text-gray-500 dark:text-gray-400';
    }
};

// FIX: Re-implemented component to support reel animation and new props.
export const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, winningOutcome, reel, onClaim }) => {
    const [isFinished, setIsFinished] = useState(false);
    const reelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setIsFinished(false);

            if (reelRef.current) {
                reelRef.current.style.transition = 'none';
                reelRef.current.style.transform = `translateY(0px)`;
            }

            const spinTimeout = setTimeout(() => {
                if (reelRef.current) {
                    const itemHeight = 80; // h-20 is 5rem = 80px
                    const targetIndex = 45; // As defined in PageTwo.tsx
                    const targetPosition = targetIndex * itemHeight;

                    reelRef.current.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)';
                    reelRef.current.style.transform = `translateY(-${targetPosition}px)`;
                }
            }, 100);

            const finishTimeout = setTimeout(() => {
                setIsFinished(true);
            }, 4100); 

            return () => {
                clearTimeout(spinTimeout);
                clearTimeout(finishTimeout);
            };
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const winnerClassName = getOutcomeStyle(winningOutcome.type);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 m-4 w-full max-w-sm text-center transform transition-all" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">
                    {!isFinished ? "Spinning for a Reward..." : "Result!"}
                </h2>
                
                <div className="h-20 overflow-hidden relative border-y-2 border-cyan-500 my-4 rounded">
                    <div ref={reelRef}>
                        {reel.map((outcome, index) => (
                            <div key={index} className={`h-20 flex items-center justify-center text-3xl font-extrabold ${getOutcomeStyle(outcome.type)}`}>
                                {outcome.label}
                            </div>
                        ))}
                    </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white dark:from-gray-800 dark:via-transparent dark:to-gray-800 pointer-events-none"></div>
                     <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-cyan-500/30"></div>
                </div>

                {isFinished && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className={`text-5xl font-extrabold p-4 rounded-lg ${winnerClassName}`}>
                            {winningOutcome.label}
                        </div>
                        <button
                            onClick={onClaim}
                            className="mt-6 px-8 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-cyan-500 shadow-lg"
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
