"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Moon, Globe, Save } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    theme: 'light',
    language: 'en'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings updated successfully!');
    }, 1500);
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your account preferences and system settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation (Optional, for now just a list) */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-none shadow-lg">
              <CardContent className="p-4 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-colors">
                  <User className="w-5 h-5" />
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">
                  <Bell className="w-5 h-5" />
                  Notifications
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">
                  <Shield className="w-5 h-5" />
                  Security
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">
                  <Moon className="w-5 h-5" />
                  Appearance
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={formData.fullname}
                        onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                      />
                      <Input
                        label="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <Input
                          type="password"
                          label="Current Password"
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                            type="password"
                            label="New Password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          />
                          <Input
                            type="password"
                            label="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" isLoading={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
