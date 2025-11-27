"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils/cn';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Bell,
  FileText
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  userType: 'admin' | 'student';
}

export default function Sidebar({ userType }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/students', label: 'Students', icon: Users },
    { href: '/admin/pending', label: 'Pending Approvals', icon: Users },
    { href: '/admin/attendance', label: 'Attendance', icon: FileText },
    { href: '/admin/announcements', label: 'Announcements', icon: Bell },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/profile', label: 'Profile', icon: Users },
    { href: '/student/attendance', label: 'Attendance', icon: FileText },
    { href: '/student/grades', label: 'Grades', icon: GraduationCap },
    { href: '/student/notifications', label: 'Notifications', icon: Bell },
  ];

  const links = userType === 'admin' ? adminLinks : studentLinks;

  const handleLogout = async () => {
    try {
      await api.logout();
      logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-slate-700/50 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static shadow-2xl lg:shadow-none",
          !isOpen && "lg:hidden"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-8 border-b border-gray-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                  SMS Portal
                </h1>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {userType === 'admin' ? 'Administrator' : 'Student Portal'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block"
                >
                  <div className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                  )}>
                    {isActive && (
                      <div
                        className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                      />
                    )}
                    <Icon size={20} className={cn("relative z-10", isActive && "text-blue-600 dark:text-blue-400")} />
                    <span className="relative z-10">{link.label}</span>
                    
                    {isActive && (
                      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200/50 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
            >
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                <LogOut size={18} />
              </div>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
