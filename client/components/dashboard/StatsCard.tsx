"use client";
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  subtitle?: string;
  loading?: boolean;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue', 
  subtitle,
  loading = false 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
    cyan: 'from-cyan-500 to-cyan-600'
  };

  const shadowClasses = {
    blue: 'shadow-blue-500/25',
    green: 'shadow-green-500/25',
    purple: 'shadow-purple-500/25',
    orange: 'shadow-orange-500/25',
    red: 'shadow-red-500/25',
    indigo: 'shadow-indigo-500/25',
    pink: 'shadow-pink-500/25',
    cyan: 'shadow-cyan-500/25'
  };

  if (loading) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
              <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`overflow-hidden border-0 shadow-lg hover:shadow-2xl ${shadowClasses[color as keyof typeof shadowClasses]} transition-all duration-300 bg-white dark:bg-gray-800`}>
        <CardContent className="p-6 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <div className={`w-full h-full bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-full transform translate-x-16 -translate-y-16`}></div>
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                {title}
              </p>
              <motion.p 
                className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {value}
              </motion.p>
              
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {subtitle}
                </p>
              )}
              
              {trend && (
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    trend.isPositive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {trend.isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(trend.value)}%
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    vs last period
                  </span>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className={`w-14 h-14 bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center text-white shadow-lg`}
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}