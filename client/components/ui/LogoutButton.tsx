"use client";
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from './Button';

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      size="sm"
      className="w-full justify-start"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}