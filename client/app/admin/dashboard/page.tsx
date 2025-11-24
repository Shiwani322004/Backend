"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    pendingStudents: 0,
    averageAttendance: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.token) {
           const response = await api.getDashboardStats(user.token);
           if (response && !response.error) {
             setStats(response);
           }
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Active Students",
      value: stats.activeStudents,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Pending Approvals",
      value: stats.pendingStudents,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/20"
    },
    {
      title: "Avg. Attendance",
      value: `${stats.averageAttendance}%`,
      icon: UserX,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20"
    }
  ];

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Welcome back, {user?.fullname || 'Admin'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                          {stat.value}
                        </h3>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bg}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-500">Manage students, attendance, and more.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">List of recently registered students...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}