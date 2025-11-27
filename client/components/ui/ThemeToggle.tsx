"use client";

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div
        className={`w-5 h-5 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${isDark ? 'translate-x-7' : 'translate-x-0'}`}
      >
        <div
          className={`transition-transform duration-300 ${isDark ? 'rotate-180' : 'rotate-0'}`}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-blue-500" />
          ) : (
            <Sun className="w-3 h-3 text-yellow-500" />
          )}
        </div>
      </div>
      
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-60'} text-yellow-500`} />
        <Moon className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-60' : 'opacity-30'} text-blue-500`} />
      </div>
    </button>
  );
}