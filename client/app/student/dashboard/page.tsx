"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';
import Navbar from '../../../components/layout/Navbar';
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

  const calculateAverageGrade = () => {
    if (!profile?.grades?.length) return 'N/A';
    const totalPercentage = profile.grades.reduce((sum, grade) => {
      return sum + (grade.marks / grade.totalMarks) * 100;
    }, 0);
    const average = totalPercentage / profile.grades.length;
    
    if (average >= 90) return 'A+';
    if (average >= 80) return 'A';
    if (average >= 70) return 'B+';
    if (average >= 60) return 'B';
    if (average >= 50) return 'C';
    return 'D';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {profile?.fullname}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's your academic overview and recent updates.
          </p>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Full Name
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {profile?.fullname}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {profile?.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Roll Number
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {profile?.rollNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Class
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {profile?.class}
                  </p>
                </div>
                {profile?.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Phone
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {profile.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Attendance</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {calculateAttendancePercentage()}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Average Grade</span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculateAverageGrade()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Subjects</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {profile?.grades?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Recent Attendance
            </h3>
            {profile?.attendance?.length ? (
              <div className="space-y-3">
                {profile.attendance.slice(-5).reverse().map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-gray-900 dark:text-white">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      record.status === 'present' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : record.status === 'late'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No attendance records yet
              </p>
            )}
          </div>

          {/* Grades */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Recent Grades
            </h3>
            {profile?.grades?.length ? (
              <div className="space-y-3">
                {profile.grades.slice(-5).reverse().map((grade, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {grade.subject}
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {grade.grade}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {grade.marks}/{grade.totalMarks} ({Math.round((grade.marks/grade.totalMarks)*100)}%)
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No grades recorded yet
              </p>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Notifications
          </h3>
          {profile?.notifications?.length ? (
            <div className="space-y-3">
              {profile.notifications.slice(0, 5).map((notification, index) => (
                <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-gray-500 dark:text-gray-400">
                No notifications yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}