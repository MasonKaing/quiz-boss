import React, { useState } from 'react';

interface PageTwoProps {
  points: number;
  onNavigateBack: () => void;
}

type ActiveTab = 'shop' | 'map';

export const PageTwo: React.FC<PageTwoProps> = ({ points, onNavigateBack }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('shop');

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
        <div className="flex-grow flex flex-col p-4 relative">
            {/* Back Arrow */}
            <button 
                onClick={onNavigateBack} 
                className="absolute top-0 left-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Go back to study page"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            {/* Points Box */}
            <div className="w-full flex justify-center my-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl text-center border border-yellow-500/50">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">YOUR POINTS</p>
                    <p className="font-bold text-4xl text-yellow-500 dark:text-yellow-400 mt-1">{points}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center border-b border-gray-300 dark:border-gray-700 mb-4">
                <TabButton tabName="shop" label="Shop" />
                <TabButton tabName="map" label="Map" />
            </div>

            {/* User-Interface Block */}
            <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-inner p-6">
               {activeTab === 'shop' && (
                    <div className="flex items-center justify-center h-full">
                         <p className="text-gray-500 dark:text-gray-400">Shop interface coming soon!</p>
                    </div>
                )}
                {activeTab === 'map' && (
                    <div className="flex items-center justify-center h-full">
                         <p className="text-gray-500 dark:text-gray-400">Map feature coming soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};