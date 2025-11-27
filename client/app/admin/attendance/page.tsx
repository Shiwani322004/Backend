"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Check, X, Clock, Search, Filter, Save } from 'lucide-react';
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

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
  date: string;
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
        
        // Initialize attendance state
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
          subject: 'General' // You can make this dynamic
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
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 ring-2 ring-green-500/20';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 ring-2 ring-red-500/20';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800 ring-2 ring-yellow-500/20';
    }
  };

  const getStatusIcon = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return <Check className="w-4 h-4" />;
      case 'absent':
        return <X className="w-4 h-4" />;
      case 'late':
        return <Clock className="w-4 h-4" />;
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Attendance Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Mark and manage student attendance
            </p>
          </div>
          <Button
            onClick={handleSaveAttendance}
            disabled={saving}
            isLoading={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Attendance
          </Button>
        </div>

        {/* Controls */}
        <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Class Filter
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                  >
                    <option value="all">All Classes</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                    <option value="BSc">BSc</option>
                    <option value="MSc">MSc</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Students
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-[42px] bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-md bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{filteredStudents.length}</h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Present</p>
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{attendanceStats.present}</h3>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Absent</p>
                  <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{attendanceStats.absent}</h3>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Late</p>
                  <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{attendanceStats.late}</h3>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance List */}
        <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Student Attendance - {new Date(selectedDate).toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No students found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-200 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                        {student.fullname.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{student.fullname}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Roll: {student.rollNumber} • Class: {student.class}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 p-1.5 rounded-xl">
                      {(['present', 'late', 'absent'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleAttendanceChange(student._id, status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                            attendance[student._id] === status
                              ? getStatusColor(status) + ' shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700'
                          }`}
                        >
                          {getStatusIcon(status)}
                          <span className="capitalize">{status}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}