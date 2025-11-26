"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, TrendingUp, Clock, Award, Bell } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

interface StudentStats {
  totalAttendance: number;
  averageGrade: number;
  totalSubjects: number;
  upcomingAssignments: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats>({
    totalAttendance: 0,
    averageGrade: 0,
    totalSubjects: 0,
    upcomingAssignments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (user?.token) {
          // For now, we'll use mock data since the backend endpoints might not be fully implemented
          // In a real scenario, you'd call api.getStudentAnalytics(user.token)
          setStats({
            totalAttendance: 85,
            averageGrade: 87.5,
            totalSubjects: 6,
            upcomingAssignments: 3
          });
        }
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const statCards = [
    {
      title: "Attendance Rate",
      value: `${stats.totalAttendance}%`,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      description: "This month"
    },
    {
      title: "Average Grade",
      value: `${stats.averageGrade}%`,
      icon: Award,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
      description: "Current semester"
    },
    {
      title: "Total Subjects",
      value: stats.totalSubjects,
      icon: BookOpen,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
      description: "Enrolled courses"
    },
    {
      title: "Assignments Due",
      value: stats.upcomingAssignments,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
      description: "This week"
    }
  ];

  const recentActivities = [
    {
      type: "grade",
      subject: "Mathematics",
      description: "New grade posted: 92%",
      time: "2 hours ago",
      icon: Award,
      color: "text-green-600"
    },
    {
      type: "attendance",
      subject: "Physics",
      description: "Attendance marked: Present",
      time: "1 day ago",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      type: "assignment",
      subject: "Chemistry",
      description: "Assignment due tomorrow",
      time: "2 days ago",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  if (loading) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.fullname?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Here's your academic overview for today
          </p>
        </div>

        {/* Stats Grid */}
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
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                          {stat.value}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {stat.description}
                        </p>
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
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className={`p-2 rounded-full bg-white dark:bg-gray-700`}>
                        <Icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.subject}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">View Attendance</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Check your attendance record</p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <Award className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">View Grades</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Check your latest grades</p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <BookOpen className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Assignments</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View pending assignments</p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-left hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <Clock className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View class schedule</p>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}