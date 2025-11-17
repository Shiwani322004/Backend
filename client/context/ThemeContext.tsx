"use client";
import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  isLoading: false
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeTheme();
  }, []);

  const initializeTheme = async () => {
    try {
      const saved = localStorage.getItem('theme');
      setIsDark(saved === 'dark');
    } catch (error) {
      setIsDark(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark, isLoading]);

  const toggleTheme = async () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};