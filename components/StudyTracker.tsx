
import React, { useState, useEffect, useRef } from 'react';

interface StudyTrackerProps {
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

const POINTS_PER_MINUTE = 10;
const SECONDS_PER_POINT_AWARD = 60;

export const StudyTracker: React.FC<StudyTrackerProps> = ({ setPoints }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isPageVisible) {
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime % SECONDS_PER_POINT_AWARD === 0 && newTime > 0) {
            setPoints(prevPoints => prevPoints + POINTS_PER_MINUTE);
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPageVisible, setPoints]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl sticky top-8">
      <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Study Tracker</h2>
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-2">Total Study Time</p>
        <p className="text-5xl font-mono font-bold text-yellow-400 tracking-wider">
          {formatTime(elapsedTime)}
        </p>
      </div>
      <div className={`mt-6 p-4 rounded-md text-center transition-colors duration-300 ${isPageVisible ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
        <p className="font-semibold text-lg">{isPageVisible ? 'Active' : 'Paused'}</p>
        <p className="text-sm text-gray-300">
          {isPageVisible 
            ? 'Timer is running. You are earning points!' 
            : 'Timer paused. Return to this tab to resume.'}
        </p>
      </div>
       <div className="mt-6 text-sm text-gray-500 text-center">
        <p>You earn {POINTS_PER_MINUTE} points for every focused minute on this page.</p>
      </div>
    </div>
  );
};
