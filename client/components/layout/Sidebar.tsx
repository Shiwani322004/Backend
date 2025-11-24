"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
          !isOpen && "lg:hidden"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              SMS Portal
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {userType === 'admin' ? 'Administrator' : 'Student Portal'}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon size={20} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
