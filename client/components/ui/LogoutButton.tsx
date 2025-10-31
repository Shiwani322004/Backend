"use client";
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className = "", children = "Logout" }: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Logging out...');
      
      // Call logout API
      await api.logout();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success message
      toast.success('Logged out successfully!');
      
      // Call context logout (which handles redirect)
      await logout();
      
    } catch (error) {
      toast.error('Logout failed. Redirecting anyway...');
      // Force logout even if API call fails
      await logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors ${className}`}
    >
      {children}
    </button>
  );
}