"use client";
import { useEffect, useState } from 'react';

import { Search, Filter, MoreVertical, Trash2, Edit, Eye, UserCheck, Mail, Phone, GraduationCap } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

interface Student {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  rollNumber: string;
  class: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AllStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();

    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000');

    socket.on('connect', () => {
      if (user?.id) {
        socket.emit('join-room', user.id);
      }
    });

    socket.on('student-registered', (newStudent: any) => {
      setStudents(prev => {
        if (prev.some(s => s._id === newStudent._id)) return prev;
        return [newStudent, ...prev];
      });
      toast.success('New student registered');
    });

    socket.on('student-status-updated', (data: any) => {
      setStudents(prev => prev.map(student => 
        student._id === data._id ? { ...student, status: data.status } : student
      ));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchStudents = async () => {
    try {
      if (user?.token) {
        const response = await api.getAllStudents(user.token);
        setStudents(response || []);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    setActionLoading(studentId);
    try {
      if (user?.token) {
        await api.deleteStudent(studentId, user.token);
        toast.success('Student deleted successfully!');
        setStudents(prev => prev.filter(student => student._id !== studentId));
      }
    } catch (error: any) {
      console.error('Failed to delete student:', error);
      toast.error(error.message || 'Failed to delete student');
    } finally {
      setActionLoading(null);
      setShowDropdown(null);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border border-slate-200 dark:border-slate-800';
    }
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
              All Students
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Manage and view all registered students
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {filteredStudents.length} Students
            </span>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search students by name, email, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-11 pl-9 pr-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer min-w-[160px]"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No Students Found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-center">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No students have been registered yet.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">

              {filteredStudents.map((student, index) => (
                <div
                  key={student._id}
                >
                  <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            {student.fullname.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {student.fullname}
                              </h3>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="text-sm truncate">{student.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <GraduationCap className="w-4 h-4 text-slate-400" />
                                <span className="text-sm">Roll: {student.rollNumber}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <GraduationCap className="w-4 h-4 text-slate-400" />
                                <span className="text-sm">Class: {student.class}</span>
                              </div>
                              {student.phone && (
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                  <Phone className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm">{student.phone}</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                Registered: {new Date(student.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions Dropdown */}
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDropdown(showDropdown === student._id ? null : student._id)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                          
                          {showDropdown === student._id && (
                            <div
                              className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-10 overflow-hidden"
                            >
                              <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                                <Eye className="w-4 h-4 text-slate-400" />
                                View Details
                              </button>
                              <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                                <Edit className="w-4 h-4 text-slate-400" />
                                Edit Student
                              </button>
                              <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                              <button
                                onClick={() => handleDeleteStudent(student._id)}
                                disabled={actionLoading === student._id}
                                className="w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-3 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                {actionLoading === student._id ? 'Deleting...' : 'Delete Student'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}