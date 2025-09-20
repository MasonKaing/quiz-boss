import React from 'react';

interface SummaryViewerProps {
  summary: string;
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
     <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-6"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
  </div>
);


export const SummaryViewer: React.FC<SummaryViewerProps> = ({ summary, isLoading }) => {
  return (
    <div className="flex-grow bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-xl overflow-y-auto h-full">
      <h2 className="text-2xl font-semibold text-cyan-600 dark:text-cyan-300 mb-4">Notes Summary</h2>
      {isLoading && <LoadingSkeleton />}
      {!isLoading && !summary && (
        <div className="flex items-center justify-center h-full min-h-48 bg-gray-100/50 dark:bg-gray-900/50 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Generate a summary from your notes to see it here.</p>
        </div>
      )}
      {!isLoading && summary && (
        <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {summary}
        </div>
      )}
    </div>
  );
};