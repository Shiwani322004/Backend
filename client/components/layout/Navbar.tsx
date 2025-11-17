"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Settings, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import LogoutButton from '../ui/LogoutButton';
import NotificationCenter from '../ui/NotificationCenter';
import { useState } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <motion.nav 
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduManage Pro
              </span>
            </Link>
          </motion.div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <NotificationCenter />

                {/* User Profile */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.fullname}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user.role}
                      </div>
                    </div>
                  </motion.button>

                  {/* Profile Dropdown */}
                  {showProfile && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullname}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                      
                      <Link
                        href={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowProfile(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowProfile(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                      <div className="px-4 py-2">
                        <LogoutButton />
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/login" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg">
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/register" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}