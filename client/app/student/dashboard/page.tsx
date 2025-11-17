"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp, Calendar, BookOpen, Target, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';
import Navbar from '../../../components/layout/Navbar';
import StatsCard from '../../../components/dashboard/StatsCard';
import AttendanceChart from '../../../components/dashboard/AttendanceChart';
import GradeProgress from '../../../components/dashboard/GradeProgress';
import AssignmentTracker from '../../../components/dashboard/AssignmentTracker';
import QuickActions from '../../../components/dashboard/QuickActions';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import toast from 'react-hot-toast';

interface StudentProfile {
  _id: string;
  fullname: string;
  email: string;
  rollNumber: string;
  class: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  attendance: Array<{
    date: string;
    status: 'present' | 'absent' | 'late';
  }>;
  grades: Array<{
    subject: string;
    marks: number;
    totalMarks: number;
    grade: string;
    date: string;
  }>;
  notifications: Array<{
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }>;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!user?.token) return;
    
    try {
      const response = await api.getProfile(user.token);
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.data);
      } else {
        toast.error('Failed to fetch profile');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = () => {
    if (!profile?.attendance?.length) return 0;
    const presentDays = profile.attendance.filter(a => a.status === 'present').length;
    return Math.round((presentDays / profile.attendance.length) * 100);
  };

  const calculateGPA = () => {
    if (!profile?.grades?.length) return '0.0';
    const gradePoints = { 'A+': 4.0, 'A': 3.7, 'B+': 3.3, 'B': 3.0, 'C+': 2.7, 'C': 2.3, 'D': 2.0, 'F': 0 };
    const total = profile.grades.reduce((sum, grade) => sum + (gradePoints[grade.grade as keyof typeof gradePoints] || 0), 0);
    return (total / profile.grades.length).toFixed(1);
  };

  const getAttendanceChartData = () => {
    if (!profile?.attendance?.length) return [];
    return profile.attendance.slice(-7).map(record => ({
      date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      attendance: record.status === 'present' ? 100 : record.status === 'late' ? 50 : 0
    }));
  };

  const mockAssignments = [
    {
      id: '1',
      title: 'Mathematics Assignment',
      subject: 'Mathematics',
      dueDate: '2024-01-20',
      status: 'pending' as const,
      priority: 'high' as const
    },
    {
      id: '2',
      title: 'Physics Lab Report',
      subject: 'Physics',
      dueDate: '2024-01-25',
      status: 'pending' as const,
      priority: 'medium' as const
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <motion.div 
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome back, {profile?.fullname}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Here's your academic overview and recent updates.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatsCard
            title="Attendance Rate"
            value={`${calculateAttendancePercentage()}%`}
            change="+2% from last week"
            changeType="positive"
            icon={Calendar}
            gradient="from-green-500 to-emerald-600"
          />
          <StatsCard
            title="Current GPA"
            value={calculateGPA()}
            change="+0.2 from last semester"
            changeType="positive"
            icon={GraduationCap}
            gradient="from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Assignments Due"
            value={mockAssignments.filter(a => a.status === 'pending').length}
            change="2 due this week"
            changeType="neutral"
            icon={BookOpen}
            gradient="from-orange-500 to-red-600"
          />
          <StatsCard
            title="Study Streak"
            value="7 days"
            change="Personal best!"
            changeType="positive"
            icon={Target}
            gradient="from-purple-500 to-pink-600"
          />
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AttendanceChart data={getAttendanceChartData()} />
            </motion.div>

            {/* Grade Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GradeProgress grades={profile?.grades || []} />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Assignment Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AssignmentTracker assignments={mockAssignments} />
            </motion.div>

            {/* Recent Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔔 Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.notifications?.length ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {profile.notifications.slice(0, 3).map((notification, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                        >
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-2">🔔</div>
                      <p>No notifications yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <QuickActions />
        </motion.div>
      </div>
    </div>
  );
}