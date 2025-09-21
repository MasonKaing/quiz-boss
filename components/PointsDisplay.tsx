import React from 'react';

interface PointsDisplayProps {
    points: number;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({ points }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl text-center">
            <p>
                <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">Points: </span>
                <span className="font-bold text-xl text-violet-500 dark:text-violet-400">{points}</span>
            </p>
        </div>
    );
};