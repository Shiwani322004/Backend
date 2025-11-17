"use client";
import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-xl border transition-all duration-200';
    
    const variants = {
      default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md',
      glass: 'glass dark:glass-dark border-white/20 dark:border-white/10',
      gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800'
    };
    
    const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-lg cursor-pointer' : '';

    return (
      <motion.div
        ref={ref}
        className={clsx(baseClasses, variants[variant], hoverClasses, className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('p-6 pb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={clsx('text-lg font-semibold text-gray-900 dark:text-white', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };