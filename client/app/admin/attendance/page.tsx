"use client";
import { useEffect, useState } from 'react';

import { Calendar, Users, Check, X, Clock, Search, Filter, Save, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface Student {
  _id: string;
  fullname: string;
  rollNumber: string;
  class: string;
  email: string;
}

export default function AttendancePage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    try {
      if (user?.token) {
        const response = await api.getAllStudents(user.token);
        const approvedStudents = (response.students || []).filter((s: Student) => s.status === 'approved');
        setStudents(approvedStudents);
        
        const initialAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
        approvedStudents.forEach((student: Student) => {
          initialAttendance[student._id] = 'present';
        });
        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      if (user?.token) {
        const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
          date: selectedDate,
          subject: 'General'
        }));

        await api.addAttendance({ records: attendanceRecords }, user.token);
        toast.success('Attendance saved successfully!');
      }
    } catch (error: any) {
      console.error('Failed to save attendance:', error);
      toast.error(error.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getStatusColor = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 ring-2 ring-emerald-500/20';
      case 'absent':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 ring-2 ring-rose-500/20';
      case 'late':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 ring-2 ring-amber-500/20';
    }
  };

  const attendanceStats = {
    present: Object.values(attendance).filter(status => status === 'present').length,
    absent: Object.values(attendance).filter(status => status === 'absent').length,
    late: Object.values(attendance).filter(status => status === 'late').length,
  };

  if (loading) {
    return (
      <DashboardLayout userType="admin">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Attendance Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Mark and manage daily student attendance
            </p>
          </div>
          <Button
            onClick={handleSaveAttendance}
            disabled={saving}
            isLoading={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-xl px-6"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Attendance
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Students</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{filteredStudents.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Present</p>
                  <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{attendanceStats.present}</h3>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Absent</p>
                  <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{attendanceStats.absent}</h3>
                </div>
                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                  <X className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Late</p>
                  <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{attendanceStats.late}</h3>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls & List */}
        <Card className="border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader className="border-b border-slate-100 dark:border-slate-700">
            <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                Mark Attendance
              </CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                  >
                    <option value="all">All Classes</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                    <option value="BSc">BSc</option>
                    <option value="MSc">MSc</option>
                  </select>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-[38px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No students found matching your criteria</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-sm">
                        {student.fullname.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">{student.fullname}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Roll: {student.rollNumber} • Class: {student.class}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg self-start sm:self-center">
                      {(['present', 'late', 'absent'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleAttendanceChange(student._id, status)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                            attendance[student._id] === status
                              ? getStatusColor(status) + ' shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
                          }`}
                        >
                          {status === 'present' && <Check className="w-3 h-3" />}
                          {status === 'late' && <Clock className="w-3 h-3" />}
                          {status === 'absent' && <X className="w-3 h-3" />}
                          <span className="capitalize">{status}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}