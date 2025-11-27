"use client";

import { GraduationCap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div
          className="relative mx-auto mb-4"
          style={{ width: 'fit-content' }}
        >
          {/* Outer ring */}
          <div
            className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin`}
          />
          
          {/* Inner ring */}
          <div
            className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full animate-spin`}
          />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="animate-pulse"
            >
              <GraduationCap className={`${
                size === 'sm' ? 'w-2 h-2' : 
                size === 'md' ? 'w-4 h-4' : 'w-6 h-6'
              } text-blue-600`} />
            </div>
          </div>
        </div>
        
        {text && (
          <p
            className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium animate-pulse`}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
}