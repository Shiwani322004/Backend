"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, FileText, Calendar, Bell } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.token) {
           const response = await api.getStudentDashboard(user.token);
           if (response && !response.error) {
             setDashboardData(response);
           }
        }
      } catch (error) {
        console.error("Failed to fetch student dashboard", error);
      }
    };

    fetchData();
  }, [user]);

  const statCards = [
    {
      title: "Attendance",
      value: dashboardData?.attendancePercentage ? `${dashboardData.attendancePercentage}%` : '0%',
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "CGPA / Grade",
      value: dashboardData?.cgpa || 'N/A',
      icon: GraduationCap,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Assignments",
      value: dashboardData?.pendingAssignments || 0,
      icon: FileText,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/20"
    },
    {
      title: "Notifications",
      value: dashboardData?.unreadNotifications || 0,
      icon: Bell,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20"
    }
  ];

  return (
    <DashboardLayout userType="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Student Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Welcome back, {user?.fullname}
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
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No recent activity.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No upcoming classes.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}