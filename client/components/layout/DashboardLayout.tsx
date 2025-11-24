"use client";
import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: 'admin' | 'student';
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
      <Sidebar userType={userType} />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
