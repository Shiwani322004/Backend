"use client";
import { useEffect, useState } from 'react';

import { Users, UserCheck, Clock, UserX, BarChart3 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    pendingApprovals: 0,
    averageAttendance: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.token) {
           const response = await api.getDashboardStats(user.token);
           if (response) {
             setStats(response);
           }
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();

    // Real-time updates
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000');

    socket.on('connect', () => {
      console.log('Connected to socket server');
      if (user?.id) {
        socket.emit('join-room', user.id);
      }
    });

    socket.on('student-registered', () => {
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals + 1
      }));
      toast.success('New student registration received!');
    });

    socket.on('student-status-updated', (data: any) => {
      if (data.status === 'approved') {
        setStats(prev => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
          totalStudents: prev.totalStudents + 1,
          activeStudents: prev.activeStudents + 1
        }));
      } else if (data.status === 'rejected') {
        setStats(prev => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-800",
      trend: "+12% growth"
    },
    {
      title: "Active Students",
      value: stats.activeStudents,
      icon: UserCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-800",
      trend: "+5% this month"
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-100 dark:border-amber-800",
      trend: "Action required"
    },
    {
      title: "Avg. Attendance",
      value: `${stats.averageAttendance}%`,
      icon: UserX,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
      border: "border-violet-100 dark:border-violet-800",
      trend: "Stable"
    }
  ];

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Welcome back, {user?.fullname || 'Admin'}. Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Online
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
              >
                <Card className={`border shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-800 ${stat.border}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                        {stat.trend}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {stat.title}
                      </p>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {stat.value}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <Card className="border shadow-sm bg-white dark:bg-slate-800 h-full border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <div className="w-full h-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400">
                    <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                    <p>Attendance Analytics Chart</p>
                    <p className="text-sm mt-2 opacity-70">(Integration ready)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-100 dark:border-blue-800 group">
                  <span className="font-medium">Review Pending Students</span>
                  <UserCheck className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors border border-violet-100 dark:border-violet-800 group">
                  <span className="font-medium">Post Announcement</span>
                  <Clock className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </CardContent>
            </Card>

            <Card className="border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Server Status</span>
                    <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Database</span>
                    <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Last Backup</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      2 hours ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}