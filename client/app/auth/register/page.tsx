"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { api } from '../../../utils/api';
import Navbar from '../../../components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    rollNumber: '',
    class: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.registerStudent(formData);
      // api.ts registerStudent returns response.json() on success or throws
      const data = response;

      toast.success('Registration submitted! Wait for admin approval.');
      router.push('/auth/login');
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-fit mb-4"
              >
                <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Account
              </CardTitle>
              <CardDescription>
                Join as a new student
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullname}
                    onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                    required
                    className="bg-white/50 dark:bg-slate-900/50"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="bg-white/50 dark:bg-slate-900/50"
                  />
                  <Input
                    label="Roll Number"
                    type="text"
                    placeholder="Roll No."
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                    required
                    className="bg-white/50 dark:bg-slate-900/50"
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
                      Class
                    </label>
                    <select
                      required
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                      className="flex h-11 w-full rounded-xl border border-gray-200 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    >
                      <option value="">Select Class</option>
                      <option value="10th">10th Grade</option>
                      <option value="11th">11th Grade</option>
                      <option value="12th">12th Grade</option>
                      <option value="BSc">BSc</option>
                      <option value="MSc">MSc</option>
                    </select>
                  </div>
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-white/50 dark:bg-slate-900/50"
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="bg-white/50 dark:bg-slate-900/50"
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>
                      <strong>Note:</strong> Your registration will be reviewed by an admin. 
                      You'll be able to login once approved.
                    </span>
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  isLoading={loading}
                >
                  Register
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">
                  Sign in here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}