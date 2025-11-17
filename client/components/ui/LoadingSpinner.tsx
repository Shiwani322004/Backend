"use client";
import { motion } from 'framer-motion';
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
        <motion.div
          className="relative mx-auto mb-4"
          style={{ width: 'fit-content' }}
        >
          {/* Outer ring */}
          <motion.div
            className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner ring */}
          <motion.div
            className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full`}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <GraduationCap className={`${
                size === 'sm' ? 'w-2 h-2' : 
                size === 'md' ? 'w-4 h-4' : 'w-6 h-6'
              } text-blue-600`} />
            </motion.div>
          </div>
        </motion.div>
        
        {text && (
          <motion.p
            className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
}