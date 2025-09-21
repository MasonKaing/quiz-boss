import React, { useState } from 'react';
import { RewardModal } from './RewardModal';
import type { RewardOutcome, QuizQuestion } from '../types';

interface PageTwoProps {
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  onNavigateBack: () => void;
  quiz: QuizQuestion[];
}

type ActiveTab = 'streetVendor' | 'shop' | 'battle';

const streetVendorItems = [
    { 
        id: 'beginner', 
        name: 'Beginner Chest', 
        cost: 50,
        outcomes: [
            { label: '-50%', value: (c: number) => c / 2, probability: 0.55, type: 'loss' },
            { label: '+20', value: (c: number) => c + 20, probability: 0.40, type: 'win' },
            { label: 'x2', value: (c: number) => c * 2, probability: 0.05, type: 'multiplier' },
        ] as RewardOutcome[],
    },
    { 
        id: 'advanced', 
        name: 'Advanced Chest', 
        cost: 100,
        outcomes: [
            { label: '-50%', value: (c: number) => c / 2, probability: 0.50, type: 'loss' },
            { label: '+40', value: (c: number) => c + 40, probability: 0.40, type: 'win' },
            { label: 'x2', value: (c: number) => c * 2, probability: 0.10, type: 'multiplier' },
        ] as RewardOutcome[],
    },
    { 
        id: 'mystery', 
        name: 'Mystery Chest', 
        cost: 200,
        outcomes: [
            { label: '-75%', value: (c: number) => c / 4, probability: 0.70, type: 'loss' },
            { label: 'x2', value: (c: number) => c * 2, probability: 0.25, type: 'multiplier' },
            { label: 'x3', value: (c: number) => c * 3, probability: 0.05, type: 'multiplier' },
        ] as RewardOutcome[],
    },
];

const armorItems = [
    { id: 'helmet', name: 'War-Torn Helm', cost: 100 },
    { id: 'chestplate', name: 'Scuffed Chestplate', cost: 100 },
    { id: 'gauntlets', name: 'Rusted Gauntlets', cost: 100 },
    { id: 'greaves', name: 'Battered Greaves', cost: 100 },
];

const BattleComponent: React.FC<{ purchasedArmor: string[], quiz: QuizQuestion[] }> = ({ purchasedArmor, quiz }) => {
    type BattleState = 'idle' | 'ongoing' | 'won' | 'lost';

    const [battleState, setBattleState] = useState<BattleState>('idle');
    const [playerHealth, setPlayerHealth] = useState(0);
    const [maxPlayerHealth, setMaxPlayerHealth] = useState(0);
    const [bossHealth, setBossHealth] = useState(0);
    const [maxBossHealth, setMaxBossHealth] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isTurnResolved, setIsTurnResolved] = useState(false);
    const [turnMessage, setTurnMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [armorRetries, setArmorRetries] = useState(0);
    const [isArmorBreak, setIsArmorBreak] = useState(false);


    const handleStartBattle = () => {
        const initialPlayerHealth = 1 + purchasedArmor.length;
        const initialBossHealth = quiz.length;
        
        setPlayerHealth(initialPlayerHealth);
        setMaxPlayerHealth(initialPlayerHealth);
        setBossHealth(initialBossHealth);
        setMaxBossHealth(initialBossHealth);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsTurnResolved(false);
        setTurnMessage('');
        setError(null);
        setBattleState('ongoing');
        setArmorRetries(purchasedArmor.length);
        setIsArmorBreak(false);
    };

    const handleAnswerSelect = async (answer: string) => {
        if (isTurnResolved || isArmorBreak || isSubmitting) return;

        setSelectedAnswer(answer);
        setIsSubmitting(true);
        setError(null);

        const isCorrect = answer === quiz[currentQuestionIndex].correctAnswer;
        const hasArmorRetry = !isCorrect && armorRetries > 0;
        
        try {
            const response = await fetch('http://127.0.0.1:5000/api/battle/resolve-turn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wasAnswerCorrect: isCorrect,
                    playerHealth: playerHealth,
                    bossHealth: bossHealth,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            
            setPlayerHealth(result.newPlayerHealth);
            setBossHealth(result.newBossHealth);

            if (result.newPlayerHealth <= 0) {
                setBattleState('lost');
                setTurnMessage(result.message);
                setIsTurnResolved(true);
                return;
            } else if (result.newBossHealth <= 0) {
                setBattleState('won');
                setTurnMessage(result.message);
                setIsTurnResolved(true);
                return;
            }
            
            if (hasArmorRetry) {
                setArmorRetries(prev => prev - 1);
                setTurnMessage("Your armor broke! You took damage but get another chance.");
                setIsArmorBreak(true);
            } else {
                setTurnMessage(result.message);
                setIsTurnResolved(true);
            }

        } catch (err) {
            setError('Failed to connect to the battle server. Please ensure the backend is running.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTryAgain = () => {
        setIsArmorBreak(false);
        setSelectedAnswer(null);
        setTurnMessage('');
    };
    
    const handleNextQuestion = () => {
        setIsArmorBreak(false); // Should not be needed, but good for safety
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsTurnResolved(false);
            setTurnMessage('');
        } else {
            if(bossHealth > 0 && playerHealth > 0) {
                setBattleState('won');
            }
        }
    };

    const HealthBar: React.FC<{ current: number; max: number; label: string; color: string; retries?: number }> = ({ current, max, label, color, retries }) => (
        <div className="w-full">
            <div className="flex justify-between items-baseline">
                <span className="text-lg font-semibold">{label}</span>
                {typeof retries !== 'undefined' && (
                     <span className="text-sm font-mono text-gray-500 dark:text-gray-400">Armor Retries: {retries}</span>
                )}
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-6 my-1">
                <div 
                    className={`${color} h-6 rounded-full transition-all duration-500 text-white font-bold flex items-center justify-center`}
                    style={{ width: `${max > 0 ? (current / max) * 100 : 0}%` }}
                >
                    {current}/{max}
                </div>
            </div>
        </div>
    );
    
    if (battleState === 'idle') {
        const canStart = quiz.length > 0;
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="text-3xl font-bold text-red-500">Prepare for Battle!</h3>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
                    Use the quiz you generated from your notes to defeat the boss. Your health is determined by your armor, and the boss's health is based on the number of questions.
                </p>
                <div className="mt-6 text-xl">
                    <p>Your Health: <span className="font-bold text-green-500">{1 + purchasedArmor.length}</span></p>
                    <p>Opponent's Health: <span className="font-bold text-red-500">{quiz.length}</span></p>
                </div>
                <button
                    onClick={handleStartBattle}
                    disabled={!canStart}
                    className="mt-8 px-8 py-4 font-bold text-white bg-red-600 rounded-lg hover:bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-transform transform hover:scale-110"
                >
                    {canStart ? 'Start Battle' : 'Generate a Quiz First!'}
                </button>
            </div>
        );
    }

    if (battleState === 'won' || battleState === 'lost') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className={`text-5xl font-extrabold ${battleState === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                    {battleState === 'won' ? 'You Win!' : 'You Lose!'}
                </h3>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    {battleState === 'won' ? 'Congratulations, you defeated the boss!' : 'The boss was too strong. Study more and try again!'}
                </p>
                <button
                    onClick={handleStartBattle}
                    className="mt-8 px-8 py-4 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-110"
                >
                    Play Again
                </button>
            </div>
        );
    }
    
    const currentQuestion = quiz[currentQuestionIndex];

    return (
        <div className="flex flex-col items-center justify-between h-full p-4">
            <div className="w-full max-w-2xl flex flex-col items-center gap-4">
                 <HealthBar current={bossHealth} max={maxBossHealth} label="Opponent's Health" color="bg-red-600" />
                 <HealthBar current={playerHealth} max={maxPlayerHealth} label="Your Health" color="bg-green-600" retries={armorRetries}/>
            </div>

            {error && <p className="text-red-500 text-center my-4">{error}</p>}
            
            <div className="my-6 text-center w-full max-w-3xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">Question {currentQuestionIndex + 1} / {quiz.length}</p>
                <h4 className="text-2xl font-semibold mt-1">{currentQuestion.question}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
                {currentQuestion.options.map((option, index) => {
                    let buttonClass = 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
                    const isSelectedAnswer = option === selectedAnswer;

                    if (isArmorBreak) {
                        // Armor break logic: only show the selected wrong answer
                        if (isSelectedAnswer) {
                            buttonClass = 'bg-red-600 text-white ring-2 ring-red-400';
                        } else {
                            buttonClass = 'bg-gray-200 dark:bg-gray-700 opacity-50';
                        }
                    } else if (isTurnResolved) {
                        // Normal turn resolved logic: show correct and incorrect
                        const isCorrectAnswer = option === currentQuestion.correctAnswer;
                        if (isCorrectAnswer) {
                            buttonClass = 'bg-green-600 text-white ring-2 ring-green-400';
                        } else if (isSelectedAnswer && !isCorrectAnswer) {
                            buttonClass = 'bg-red-600 text-white ring-2 ring-red-400';
                        } else {
                             buttonClass = 'bg-gray-200 dark:bg-gray-700 opacity-50';
                        }
                    }
                    return (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={isTurnResolved || isArmorBreak || isSubmitting}
                            className={`p-4 rounded-lg text-left w-full transition-all duration-200 disabled:cursor-not-allowed font-semibold ${buttonClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            
            <div className="mt-6 text-center h-20 w-full max-w-3xl flex flex-col justify-center items-center">
                {isSubmitting && <p className="text-cyan-500">Resolving turn...</p>}
                {(isTurnResolved || isArmorBreak) && !isSubmitting && (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-lg font-semibold text-yellow-500 dark:text-yellow-400">{turnMessage}</p>
                        {isTurnResolved && !isArmorBreak && (
                             <button
                                onClick={handleNextQuestion}
                                className="px-8 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105"
                            >
                               {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish'}
                            </button>
                        )}
                         {isArmorBreak && (
                             <button
                                onClick={handleTryAgain}
                                className="px-8 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-transform transform hover:scale-105"
                            >
                               Try Again
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}


export const PageTwo: React.FC<PageTwoProps> = ({ points, setPoints, onNavigateBack, quiz }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('streetVendor');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<{ winningOutcome: RewardOutcome; reel: RewardOutcome[] } | null>(null);
    const [pendingRewardValue, setPendingRewardValue] = useState<number>(0);
    const [purchasedArmor, setPurchasedArmor] = useState<string[]>([]);


    const handlePurchase = (item: typeof streetVendorItems[0]) => {
        if (points < item.cost) return;
        
        setPoints(prevPoints => prevPoints - item.cost);

        const rand = Math.random();
        let cumulativeProbability = 0;
        const winningOutcome = item.outcomes.find(outcome => {
            cumulativeProbability += outcome.probability;
            return rand < cumulativeProbability;
        }) || item.outcomes[0];

        // Generate a long reel for visual effect
        const reel: RewardOutcome[] = [];
        for (let i = 0; i < 50; i++) {
            const r = Math.random();
            let cp = 0;
            const randomOutcome = item.outcomes.find(o => {
                cp += o.probability;
                return r < cp;
            }) || item.outcomes[0];
            reel.push(randomOutcome);
        }

        // Place the winning item at a fixed position near the end
        reel[45] = winningOutcome; 

        setPendingRewardValue(winningOutcome.value(item.cost));
        setModalContent({ winningOutcome, reel });
        setIsModalOpen(true);
    };

    const handleClaimReward = () => {
        setPoints(prevPoints => prevPoints + pendingRewardValue);
        setIsModalOpen(false);
        setModalContent(null);
        setPendingRewardValue(0);
    };

    const handleArmorPurchase = (armorPiece: typeof armorItems[0]) => {
        if (points >= armorPiece.cost && !purchasedArmor.includes(armorPiece.id)) {
            setPoints(p => p - armorPiece.cost);
            setPurchasedArmor(prev => [...prev, armorPiece.id]);
        }
    };


    const TabButton: React.FC<{ tabName: ActiveTab; label: string }> = ({ tabName, label }) => {
        const isActive = activeTab === tabName;
        return (
          <button
            onClick={() => setActiveTab(tabName)}
            className={`px-6 py-2 text-lg font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 border-b-2
              ${isActive 
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            {label}
          </button>
        );
      };

    return (
        <>
            <div className="flex-grow flex flex-col p-4 relative">
                <button 
                    onClick={onNavigateBack} 
                    className="absolute top-0 left-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Go back to study page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                <div className="w-full flex justify-center my-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl text-center border border-yellow-500/50">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">YOUR POINTS</p>
                        <p className="font-bold text-4xl text-yellow-500 dark:text-yellow-400 mt-1">{points}</p>
                    </div>
                </div>

                <div className="flex justify-center border-b border-gray-300 dark:border-gray-700 mb-4">
                    <TabButton tabName="streetVendor" label="Street Vendor" />
                    <TabButton tabName="shop" label="Shop" />
                    <TabButton tabName="battle" label="Battle" />
                </div>

                <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-inner p-6">
                {activeTab === 'streetVendor' && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                                {streetVendorItems.map(item => (
                                    <div key={item.id} className="flex flex-col items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-900/50">
                                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{item.name}</h3>
                                        <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md flex items-center justify-center">
                                            <span className="text-gray-500">Image Placeholder</span>
                                        </div>
                                        <button 
                                            onClick={() => handlePurchase(item)}
                                            disabled={points < item.cost}
                                            className="px-6 py-2 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-cyan-500 shadow-lg"
                                        >
                                            Cost: {item.cost} Points
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'shop' && (
                        <div className="flex flex-col items-center justify-start h-full">
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl text-center">
                                Welcome to the Armory. Each armor piece you purchase will give you one more try against the final boss.
                            </p>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
                                {armorItems.map(item => {
                                    const isPurchased = purchasedArmor.includes(item.id);
                                    const canAfford = points >= item.cost;
                                    return (
                                        <div key={item.id} className="flex flex-col items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-900/50">
                                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{item.name}</h3>
                                            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md flex items-center justify-center">
                                                <span className="text-gray-500">Image Placeholder</span>
                                            </div>
                                            <button 
                                                onClick={() => handleArmorPurchase(item)}
                                                disabled={isPurchased || !canAfford}
                                                className="px-6 py-2 w-full font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 shadow-lg"
                                            >
                                                {isPurchased ? 'Purchased' : `Buy: ${item.cost} Points`}
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    {activeTab === 'battle' && (
                       <BattleComponent purchasedArmor={purchasedArmor} quiz={quiz} />
                    )}
                </div>
            </div>
            {modalContent && (
                 <RewardModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    winningOutcome={modalContent.winningOutcome}
                    reel={modalContent.reel}
                    onClaim={handleClaimReward}
                />
            )}
        </>
    );
};