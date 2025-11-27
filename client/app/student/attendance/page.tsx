"use client";
import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, CheckCircle, XCircle, Clock, Download, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'leave' | 'holiday';
  subject?: string;
  remarks?: string;
}

interface SubjectAttendance {
  subject: string;
  totalClasses: number;
  attended: number;
  percentage: number;
}

export default function AttendancePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    leaveDays: 0,
    percentage: 0
  });

  useEffect(() => {
    fetchAttendanceData();
  }, [user, selectedMonth]);

  const fetchAttendanceData = async () => {
    try {
      if (user?.token) {
        const analytics = await api.getStudentAnalytics(user.token);
        
        // Mock data for demonstration - replace with actual API calls
        const mockRecords: AttendanceRecord[] = generateMockAttendance();
        const mockSubjects: SubjectAttendance[] = [
          { subject: 'Mathematics', totalClasses: 45, attended: 42, percentage: 93.3 },
          { subject: 'Physics', totalClasses: 40, attended: 38, percentage: 95.0 },
          { subject: 'Chemistry', totalClasses: 42, attended: 39, percentage: 92.9 },
          { subject: 'English', totalClasses: 35, attended: 33, percentage: 94.3 },
          { subject: 'Computer Science', totalClasses: 38, attended: 36, percentage: 94.7 }
        ];

        setAttendanceRecords(mockRecords);
        setSubjectAttendance(mockSubjects);

        const present = mockRecords.filter(r => r.status === 'present').length;
        const absent = mockRecords.filter(r => r.status === 'absent').length;
        const leave = mockRecords.filter(r => r.status === 'leave').length;
        const total = present + absent + leave;

        setStats({
          totalDays: total,
          presentDays: present,
          absentDays: absent,
          leaveDays: leave,
          percentage: total > 0 ? Math.round((present / total) * 100) : 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockAttendance = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const today = new Date();
    const currentMonth = selectedMonth.getMonth();
    const currentYear = selectedMonth.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      if (date > today) break;
      
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        records.push({
          date: date.toISOString().split('T')[0],
          status: 'holiday',
          remarks: 'Weekend'
        });
      } else {
        const random = Math.random();
        const status = random > 0.95 ? 'absent' : random > 0.90 ? 'leave' : 'present';
        records.push({
          date: date.toISOString().split('T')[0],
          status,
          subject: 'All Subjects'
        });
      }
    }
    return records;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'leave': return 'bg-yellow-500';
      case 'holiday': return 'bg-gray-300 dark:bg-gray-600';
      default: return 'bg-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'leave': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  const renderCalendar = () => {
    const currentMonth = selectedMonth.getMonth();
    const currentYear = selectedMonth.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Day headers
    dayNames.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2">
          {day}
        </div>
      );
    });

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const record = attendanceRecords.find(r => r.date === dateStr);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 text-center rounded-lg transition-all ${
            isToday ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{day}</div>
          {record && (
            <div className={`w-6 h-6 rounded-full ${getStatusColor(record.status)} mx-auto`} title={record.status}></div>
          )}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (direction: number) => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Track your attendance records and statistics
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Overall</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">{stats.percentage}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Days</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalDays}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Present</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{stats.presentDays}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Absent</p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">{stats.absentDays}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Leave</p>
                  <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">{stats.leaveDays}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Attendance Calendar
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>
                    ←
                  </Button>
                  <span className="text-sm font-medium min-w-[120px] text-center">
                    {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>
                    →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Leave</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Holiday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject-wise Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectAttendance.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {subject.subject}
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {subject.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{subject.attended}/{subject.totalClasses} classes</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          subject.percentage >= 90 ? 'bg-green-500' :
                          subject.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${subject.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
