import React, { useState } from 'react';
import { RewardModal } from './RewardModal';

interface PageTwoProps {
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  onNavigateBack: () => void;
}

type ActiveTab = 'shop' | 'map';

const shopItems = [
    { id: 'beginner', name: 'Beginner', cost: 50 },
    { id: 'advanced', name: 'Advanced', cost: 100 },
    { id: 'mystery', name: 'Mystery', cost: 200 },
];

export const PageTwo: React.FC<PageTwoProps> = ({ points, setPoints, onNavigateBack }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('shop');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingReward, setPendingReward] = useState<{ text: string; type: 'win' | 'loss'; netChange: number } | null>(null);

    const handlePurchase = (item: { id: string; cost: number }) => {
        if (points < item.cost) return;
        
        // Deduct cost immediately for a better UX
        setPoints(prevPoints => prevPoints - item.cost);

        const rand = Math.random();
        let outcome = 0; // The amount to be returned to the user

        switch (item.id) {
            case 'beginner': // Cost: 50
                if (rand < 0.40) { outcome = item.cost / 2; } 
                else if (rand < 0.95) { outcome = item.cost + 20; }
                else { outcome = item.cost * 2; }
                break;
            case 'advanced': // Cost: 100
                if (rand < 0.50) { outcome = item.cost / 2; }
                else if (rand < 0.90) { outcome = item.cost + 40; }
                else { outcome = item.cost * 2; }
                break;
            case 'mystery': // Cost: 200
                if (rand < 0.70) { outcome = item.cost / 4; }
                else { outcome = item.cost * 2; }
                break;
        }

        const netChange = outcome - item.cost;
        let message = '';
        let messageType: 'win' | 'loss' = 'win';

        if (netChange > 0) {
            message = `You won ${netChange} points!`;
            messageType = 'win';
        } else {
            message = `You lost ${Math.abs(netChange)} points.`;
            messageType = 'loss';
        }

        setPendingReward({ text: message, type: messageType, netChange: outcome });
        setIsModalOpen(true);
    };

    const handleClaimReward = () => {
        if (pendingReward) {
            setPoints(prevPoints => prevPoints + pendingReward.netChange);
        }
        setIsModalOpen(false);
        setPendingReward(null);
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
                    <TabButton tabName="shop" label="Shop" />
                    <TabButton tabName="map" label="Map" />
                </div>

                <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-inner p-6">
                {activeTab === 'shop' && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                                {shopItems.map(item => (
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
                            <div className="h-16 mt-4 flex items-center" />
                        </div>
                    )}
                    {activeTab === 'map' && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-gray-400">Map feature coming soon!</p>
                        </div>
                    )}
                </div>
            </div>
            <RewardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                reward={pendingReward}
                onClaim={handleClaimReward}
            />
        </>
    );
};