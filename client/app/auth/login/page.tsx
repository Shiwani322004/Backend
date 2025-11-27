"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';
import Navbar from '../../../components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [userType, setUserType] = useState<'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = userType === 'admin' 
        ? await api.loginAdmin(formData)
        : await api.loginStudent(formData);
      
      // api.ts returns the parsed JSON directly if successful, or throws
      // But wait, api.ts request method returns `await response.json()`.
      // So `response` is the data.
      // Let's check api.ts again. Yes, it returns `response.json()`.
      
      // However, the original code was:
      // const response = ...
      // const data = await response.json();
      // if (response.ok) ...
      
      // My new api.ts throws on error. So if we are here, it's success.
      const data = response;
      
      login(data);
      toast.success(`Welcome back, ${data.fullname || 'Admin'}!`);
      router.push(userType === 'admin' ? '/admin/dashboard' : '/student/dashboard');

    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-fit mb-4">
                {userType === 'student' ? (
                  <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Sign in to your {userType} account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex p-1 bg-gray-100 dark:bg-slate-700 rounded-xl mb-6">
                <button
                  onClick={() => setUserType('student')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    userType === 'student'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => setUserType('admin')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    userType === 'admin'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Admin
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="bg-white/50 dark:bg-slate-900/50"
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="bg-white/50 dark:bg-slate-900/50"
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  isLoading={loading}
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}