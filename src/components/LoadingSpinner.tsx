import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div id="loading-spinner" className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin mb-3`} />
      {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-3 p-4 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="h-12 bg-slate-100 rounded-lg w-full flex items-center px-4 gap-4">
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-40"></div>
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-28 ml-auto"></div>
        </div>
      ))}
    </div>
  );
};
