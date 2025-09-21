import React, { useState } from 'react';
import type { QuizQuestion } from '../types';

interface PageTwoProps {
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  onNavigateBack: () => void;
  quiz: QuizQuestion[];
}

type ActiveTab = 'shop' | 'battle';

const armorItems = [
    { id: 'helmet', name: 'Shield 1', cost: 100 },
    { id: 'chestplate', name: 'Shield 2', cost: 100 },
    { id: 'gauntlets', name: 'Shield 3', cost: 100 },
    { id: 'greaves', name: 'Shield 4', cost: 100 },
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
        const initialBossHealth = quiz.length > 0 ? quiz.length : 5; // Ensure boss has health even if quiz is empty
        
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
    
        // Logic branch for correct answers
        if (isCorrect) {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/battle/resolve-turn', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        wasAnswerCorrect: true,
                        playerHealth,
                        bossHealth,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const result = await response.json();
                setBossHealth(result.newBossHealth);
                setTurnMessage(result.message);
                setIsTurnResolved(true);
    
                if (result.newBossHealth <= 0) {
                    setBattleState('won');
                }
    
            } catch (err) {
                setError('Failed to connect to the battle server. Please ensure the backend is running.');
                console.error(err);
            } finally {
                setIsSubmitting(false);
            }
        } else { // Logic branch for incorrect answers
            if (armorRetries > 0) {
                // Incorrect answer WITH armor: consume armor, take 1 damage, get retry. Client-side.
                const newPlayerHealth = playerHealth - 1;
                setArmorRetries(prev => prev - 1);
                setPlayerHealth(newPlayerHealth);
                setTurnMessage("Your armor absorbed the blow, but you take 1 damage! Try again.");
                setIsArmorBreak(true);
    
                if (newPlayerHealth <= 0) {
                    setBattleState('lost');
                    setTurnMessage("Your armor broke, but the final blow was fatal!");
                }
                setIsSubmitting(false);
            } else {
                // Incorrect answer WITHOUT armor: take full damage. Backend call.
                try {
                    const response = await fetch('http://127.0.0.1:5000/api/battle/resolve-turn', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            wasAnswerCorrect: false,
                            playerHealth,
                            bossHealth,
                        }),
                    });
                    
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
    
                    const result = await response.json();
                    setPlayerHealth(result.newPlayerHealth);
                    setTurnMessage(result.message);
                    setIsTurnResolved(true);
    
                    if (result.newPlayerHealth <= 0) {
                        setBattleState('lost');
                    }
                } catch (err) {
                    setError('Failed to connect to the battle server. Please ensure the backend is running.');
                    console.error(err);
                } finally {
                    setIsSubmitting(false);
                }
            }
        }
    };

    const handleTryAgain = () => {
        setIsArmorBreak(false);
        setSelectedAnswer(null);
        setTurnMessage('');
    };
    
    const handleNextQuestion = () => {
        setIsArmorBreak(false);
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsTurnResolved(false);
            setTurnMessage('');
        } else {
            // If it's the last question and boss is still alive, player wins.
            if(bossHealth > 0 && playerHealth > 0) {
                setBattleState('won');
                setTurnMessage('You survived all the questions! You win!');
            }
        }
    };

    // --- UI Components ---
    const HealthBar: React.FC<{ current: number; max: number; color: string }> = ({ current, max, color }) => (
        <div className="flex items-center gap-1.5 w-full">
            <span className="text-xs font-bold bg-yellow-400 border-2 border-gray-600 dark:border-gray-900 text-gray-800 px-1 rounded">HP</span>
            <div className="w-full bg-black rounded-full h-4 p-0.5 border-2 border-gray-500">
                <div 
                    className={`${color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${max > 0 ? (current / max) * 100 : 0}%` }}
                />
            </div>
        </div>
    );
    
    const ShieldIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
      <svg
        className={`w-5 h-5 ${filled ? 'text-cyan-500' : 'text-gray-500 opacity-50'}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L2 7V13C2 18.52 7.14 23.24 12 23.24C16.86 23.24 22 18.52 22 13V7L12 2Z" />
      </svg>
    );

    const BattleScreenContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="relative w-full h-[550px] font-mono border-4 border-black rounded-lg overflow-hidden bg-green-300 dark:bg-green-800">
            <div className="absolute w-full h-full z-10 p-4">
                {children}
            </div>
        </div>
    );

    if (battleState === 'idle' || battleState === 'won' || battleState === 'lost') {
        const canStart = quiz.length > 0;
        return (
            <BattleScreenContainer>
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-800 dark:text-gray-100">
                    {battleState === 'idle' && <>
                        <h3 className="text-3xl font-bold">Prepare for Battle!</h3>
                        <p className="mt-4 max-w-md">
                            Use the quiz you generated from your notes to defeat the Quiz Monster. Your health is determined by your armor.
                        </p>
                        <div className="mt-6 text-xl">
                            <p>Your Health: <span className="font-bold text-green-600 dark:text-green-400">{1 + purchasedArmor.length}</span></p>
                            <p>Opponent's Health: <span className="font-bold text-red-600 dark:text-red-400">{quiz.length > 0 ? quiz.length : 'N/A'}</span></p>
                        </div>
                        <button
                            onClick={handleStartBattle}
                            disabled={!canStart}
                            className="mt-8 px-8 py-4 font-bold text-white bg-red-600 rounded-lg hover:bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-transform transform hover:scale-110 shadow-lg border-2 border-black"
                        >
                            {canStart ? 'Start Battle' : 'Generate a Quiz First!'}
                        </button>
                    </>}
                    {(battleState === 'won' || battleState === 'lost') && <>
                         <h3 className={`text-5xl font-extrabold ${battleState === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                            {battleState === 'won' ? 'You Win!' : 'You Lose!'}
                        </h3>
                        <p className="mt-4 text-lg">
                            {turnMessage || (battleState === 'won' ? 'Congratulations, you defeated the boss!' : 'The boss was too strong. Study more and try again!')}
                        </p>
                        <button
                            onClick={handleStartBattle}
                            className="mt-8 px-8 py-4 font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-transform transform hover:scale-110 shadow-lg border-2 border-black"
                        >
                            Play Again
                        </button>
                    </>}
                </div>
            </BattleScreenContainer>
        );
    }
    
    const currentQuestion = quiz[currentQuestionIndex];

    return (
        <BattleScreenContainer>
            <div className="relative w-full h-full flex flex-col justify-between">
                {/* Boss Area */}
                <div className="absolute top-0 left-0 w-[45%] z-20">
                    <div className="bg-gray-200/90 dark:bg-gray-700/90 p-2 border-4 border-gray-800 dark:border-gray-500 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-base font-bold text-gray-800 dark:text-gray-100">QUIZ MONSTER</span>
                            <span className="text-base font-bold text-gray-800 dark:text-gray-100">Lv{maxBossHealth}</span>
                        </div>
                        <HealthBar current={bossHealth} max={maxBossHealth} color="bg-red-500" />
                    </div>
                </div>
                <div className="absolute top-[10%] right-[5%] w-56 flex flex-col items-center z-10">
                     <div className="w-48 h-32 bg-white border-4 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300">
                        <img 
                            src={"Images/Q - Character - Bg.png"}
                            alt={"Character "}
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="w-56 h-8 bg-green-400 dark:bg-green-900 rounded-full border-b-4 border-green-600 dark:border-green-950 -mt-4 shadow-inner"></div>
                </div>

                {/* Player Area */}
                 <div className="absolute bottom-[35%] right-0 w-[45%] z-20">
                    <div className="bg-gray-200/90 dark:bg-gray-700/90 p-2 border-4 border-gray-800 dark:border-gray-500 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-base font-bold text-gray-800 dark:text-gray-100">Character</span>
                            <span className="text-base font-bold text-gray-800 dark:text-gray-100">Lv{maxPlayerHealth}</span>
                        </div>
                        <HealthBar current={playerHealth} max={maxPlayerHealth} color="bg-green-500" />
                        <div className="flex justify-between items-center mt-1">
                            <div className="flex gap-1.5">
                                {[...Array(purchasedArmor.length)].map((_, i) => (
                                   <ShieldIcon key={i} filled={i < armorRetries} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{playerHealth}/{maxPlayerHealth}</span>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-[35%] left-[5%] w-56 flex flex-col items-center z-10">
                    <div className="w-48 h-32 bg-white border-4 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300">
                        <img 
                            src={"Images/C - Character - Bg.png"}
                            alt={"Character "}
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="w-56 h-8 bg-green-400 dark:bg-green-900 rounded-full border-b-4 border-green-600 dark:border-green-950 -mt-4 shadow-inner"></div>
                </div>

                {/* Action Panel */}
                <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gray-300 dark:bg-gray-800 border-t-8 border-black p-2 flex gap-2">
                    <div className="w-1/2 border-4 border-gray-800 dark:border-gray-500 rounded-lg p-2 flex items-center justify-center text-center">
                        {error ? <p className="text-red-500">{error}</p> :
                         isSubmitting ? <p className="text-cyan-500">Resolving...</p> :
                         <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {turnMessage || currentQuestion.question}
                        </p>
                        }
                    </div>
                    <div className="w-1/2 border-4 border-gray-800 dark:border-gray-500 rounded-lg p-2">
                        { (isTurnResolved || isArmorBreak) ? (
                             <div className="h-full flex items-center justify-center">
                                {isTurnResolved && !isArmorBreak && (
                                     <button onClick={handleNextQuestion} className="px-6 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 border-2 border-black">
                                       {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish'}
                                    </button>
                                )}
                                 {isArmorBreak && (
                                     <button onClick={handleTryAgain} className="px-6 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 border-2 border-black">
                                       Try Again
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 h-full">
                                {currentQuestion.options.map((option, index) => {
                                    let buttonClass = 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600';
                                    const isSelectedAnswer = option === selectedAnswer;
                                    const isCorrectAnswer = option === currentQuestion.correctAnswer;
                                    
                                    if(isTurnResolved) {
                                        if (isCorrectAnswer) buttonClass = 'bg-green-500 text-white';
                                        else if (isSelectedAnswer) buttonClass = 'bg-red-500 text-white';
                                        else buttonClass = 'bg-gray-400 opacity-60';
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelect(option)}
                                            disabled={isTurnResolved || isArmorBreak || isSubmitting}
                                            className={`p-2 rounded-lg text-center w-full transition-all duration-200 disabled:cursor-not-allowed font-semibold border-2 border-black text-gray-800 dark:text-gray-100 ${buttonClass}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BattleScreenContainer>
    )
}


export const PageTwo: React.FC<PageTwoProps> = ({ points, setPoints, onNavigateBack, quiz }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('shop');
    const [purchasedArmor, setPurchasedArmor] = useState<string[]>([]);

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
            className={`px-6 py-2 text-lg font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 border-b-2
              ${isActive 
                ? 'border-violet-500 text-violet-600 dark:text-violet-400' 
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
                    className="absolute top-0 left-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-20"
                    aria-label="Go back to study page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                <div className="w-full flex justify-center my-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl text-center border border-violet-500/50">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">YOUR POINTS</p>
                        <p className="font-bold text-4xl text-violet-500 dark:text-violet-400 mt-1">{points}</p>
                    </div>
                </div>

                <div className="flex justify-center border-b border-gray-300 dark:border-gray-700 mb-4">
                    <TabButton tabName="shop" label="Shop" />
                    <TabButton tabName="battle" label="Battle" />
                </div>

                <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-inner p-6">
                    {activeTab === 'shop' && (
                        <div className="flex flex-col items-center justify-start h-full">
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl text-center">
                                Welcome to the Armory. Each piece of armor you buy grants you an extra life in battle against the Quiz Monster.
                            </p>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
                                {armorItems.map(item => {
                                    const isPurchased = purchasedArmor.includes(item.id);
                                    const canAfford = points >= item.cost;
                                    return (
                                        <div key={item.id} className="flex flex-col items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-900/50">
                                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{item.name}</h3>
                                            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md flex items-center justify-center">
                                                <img
                                                    src={"Images/wood_kite_shield_alt.png"}
                                                    alt={"shields"}
                                                    className="w-full h-full object-cover" 
                                                />
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
        </>
    );
};