import React from 'react';

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    theme: 'dark' | 'light';
    setTheme: (theme: 'dark' | 'light') => void;
    isTimerVisible: boolean;
    setIsTimerVisible: (isVisible: boolean) => void;
    setPoints: React.Dispatch<React.SetStateAction<number>>;
}

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between cursor-pointer w-full">
        <span className="text-lg text-gray-800 dark:text-gray-200">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
        </div>
    </label>
);

export const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, theme, setTheme, isTimerVisible, setIsTimerVisible, setPoints }) => {

    const handleThemeChange = (isChecked: boolean) => {
        setTheme(isChecked ? 'dark' : 'light');
    };

    return (
        <div
            className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <header className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">Settings</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Close settings menu"
                    >
                         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                <div className="p-6 flex-grow flex flex-col gap-8">
                    <div className="space-y-6">
                        <Toggle 
                            label="Dark Mode"
                            checked={theme === 'dark'}
                            onChange={handleThemeChange}
                        />
                        <Toggle
                            label="Show Timer"
                            checked={isTimerVisible}
                            onChange={setIsTimerVisible}
                        />
                    </div>

                     {/* Admin Commands */}
                    <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="px-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Admin Commands
                        </h3>
                        <div className="mt-2 flex flex-col gap-1">
                            <button
                                onClick={() => setPoints(p => p + 200)}
                                className="w-full text-left px-2 py-2 rounded text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Add 200 Points
                            </button>
                            <button
                                onClick={() => setPoints(p => Math.max(0, p - 50))}
                                className="w-full text-left px-2 py-2 rounded text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Remove 50 Points
                            </button>
                            <button
                                onClick={() => setPoints(0)}
                                className="w-full text-left px-2 py-2 rounded text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Reset Points
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};