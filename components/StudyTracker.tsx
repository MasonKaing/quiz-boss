import React, { useState, useEffect, useRef } from 'react';

interface StudyTrackerProps {
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return [minutes, seconds]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};
const formatTimeLong = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

const POINTS_PER_MINUTE = 10;
const SECONDS_PER_POINT_AWARD = 60;
const STUDY_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
const BIRD_CHIRP_SOUND = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjgyLjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWWmb2RlemFmYXJrNjc4OEAxNjMuY29t//tAwlYn1bM2q3MAqCIo0fN7f9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v9/v...';

export const StudyTracker: React.FC<StudyTrackerProps> = ({ setPoints, isActive }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
  const intervalRef = useRef<number | null>(null);

  const [isPomodoroEnabled, setIsPomodoroEnabled] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'study' | 'break'>('study');
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(STUDY_DURATION);
  const pomodoroIntervalRef = useRef<number | null>(null);
  const audioRef = useRef(new Audio(BIRD_CHIRP_SOUND));

  // Visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Pomodoro Timer Logic
  useEffect(() => {
    if (!isPomodoroEnabled || !isPageVisible || !isActive) {
      if (pomodoroIntervalRef.current) clearInterval(pomodoroIntervalRef.current);
      return;
    }

    pomodoroIntervalRef.current = window.setInterval(() => {
      setPomodoroTimeLeft(prev => {
        if (prev <= 1) {
          if (pomodoroMode === 'study') {
            setPomodoroMode('break');
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            return BREAK_DURATION;
          } else {
            setPomodoroMode('study');
            return STUDY_DURATION;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (pomodoroIntervalRef.current) clearInterval(pomodoroIntervalRef.current);
    };
  }, [isPomodoroEnabled, isPageVisible, pomodoroMode, isActive]);

  // Main Study Timer Logic
  useEffect(() => {
    const shouldTimerRun = isPageVisible && isActive && (!isPomodoroEnabled || pomodoroMode === 'study');

    if (shouldTimerRun) {
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime > 0 && newTime % SECONDS_PER_POINT_AWARD === 0) {
            setPoints(prevPoints => prevPoints + POINTS_PER_MINUTE);
          }
          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPageVisible, isPomodoroEnabled, pomodoroMode, setPoints, isActive]);

  const shouldTimerRun = isPageVisible && isActive && (!isPomodoroEnabled || pomodoroMode === 'study');
  const statusText = shouldTimerRun ? 'Active' : 'Paused';
  let statusDescription;
  if (!isActive) {
      statusDescription = 'Timer paused. You are on another page.';
  } else if (!isPageVisible) {
      statusDescription = 'Timer paused. Return to this tab to resume.';
  } else if (isPomodoroEnabled && pomodoroMode === 'break') {
      statusDescription = 'On a break! Points and timer are paused.';
  } else {
      statusDescription = 'Timer is running. You are earning points!';
  }


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-violet-600 dark:text-violet-300 mb-4">Study Tracker</h2>
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Total Study Time</p>
        <p className="text-5xl font-mono font-bold text-cream-500 dark:text-grey-400 tracking-wider">
          {formatTimeLong(elapsedTime)}
        </p>
      </div>
      <div className={`mt-6 p-4 rounded-md text-center transition-colors duration-300 ${shouldTimerRun ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
        <p className={`font-semibold text-lg ${shouldTimerRun ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>{statusText}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {statusDescription}
        </p>
      </div>
       <div className="mt-6 text-sm text-gray-500 dark:text-gray-500 text-center">
        <p>You earn {POINTS_PER_MINUTE} points for every focused minute on this page.</p>
      </div>
      
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="relative group flex items-center">
            <label className="flex items-center cursor-pointer">
                <input
                type="checkbox"
                checked={isPomodoroEnabled}
                onChange={(e) => {
                    setIsPomodoroEnabled(e.target.checked);
                    setPomodoroMode('study');
                    setPomodoroTimeLeft(STUDY_DURATION);
                }}
                className="h-5 w-5 rounded text-cyan-600 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-cyan-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-300">Enable Pomodoro Technique</span>
            </label>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-black text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                The Pomodoro Technique breaks work into focused 25-minute intervals, separated by short 5-minute breaks. This method helps maintain concentration and prevent mental fatigue.
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black"></div>
            </div>
        </div>
      </div>
      {isPomodoroEnabled && (
        <div className="mt-4 text-center bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
            <p className="text-lg font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">{pomodoroMode}</p>
            <p className="text-4xl font-mono font-bold text-cream-500 dark:text-grey-400 mt-1">
                {formatTime(pomodoroTimeLeft)}
            </p>
        </div>
        )}
    </div>
  );
};