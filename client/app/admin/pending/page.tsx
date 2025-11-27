"use client";
import { useEffect, useState } from 'react';

import { Check, X, Clock, Search, Filter, Mail, Phone, GraduationCap, AlertCircle } from 'lucide-react';
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
}

export default function PendingApprovals() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingStudents();

    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000');
    
    socket.on('connect', () => {
      if (user?.id) socket.emit('join-room', user.id);
    });

    socket.on('student-registered', (newStudent: any) => {
      setStudents(prev => {
        if (prev.some(s => s._id === newStudent._id)) return prev;
        return [newStudent, ...prev];
      });
      toast.success('New registration request received');
    });

    return () => socket.disconnect();
  }, [user]);

  const fetchPendingStudents = async () => {
    try {
      if (user?.token) {
        const response = await api.getPendingStudents(user.token);
        setStudents(response || []);
      }
    } catch (error) {
      console.error('Failed to fetch pending students:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId: string) => {
    if (!confirm('Are you sure you want to approve this student?')) return;
    
    setProcessingId(studentId);
    try {
      if (user?.token) {
        await api.updateStudentStatus(studentId, 'approved', user.token);
        toast.success('Student approved successfully');
        setStudents(prev => prev.filter(s => s._id !== studentId));
      }
    } catch (error) {
      console.error('Failed to approve student:', error);
      toast.error('Failed to approve student');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (studentId: string) => {
    if (!confirm('Are you sure you want to reject this student?')) return;
    
    setProcessingId(studentId);
    try {
      if (user?.token) {
        await api.updateStudentStatus(studentId, 'rejected', user.token);
        toast.success('Student rejected');
        setStudents(prev => prev.filter(s => s._id !== studentId));
      }
    } catch (error) {
      console.error('Failed to reject student:', error);
      toast.error('Failed to reject student');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredStudents = students.filter(student => 
    student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Pending Approvals
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Review and manage new student registration requests
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {filteredStudents.length} Pending Requests
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search requests by name, email, or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">

            {filteredStudents.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">All Caught Up!</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                  There are no pending registration requests at the moment.
                </p>
              </div>
            ) : (
              filteredStudents.map((student, index) => (
                <div
                  key={student._id}
                >
                  <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Student Info */}
                      <div className="flex-1 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                            {student.fullname.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              {student.fullname}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              Pending Review
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <Mail className="w-4 h-4" />
                              {student.email}
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <GraduationCap className="w-4 h-4" />
                              Roll: {student.rollNumber}
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <GraduationCap className="w-4 h-4" />
                              Class: {student.class}
                            </div>
                            {student.phone && (
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Phone className="w-4 h-4" />
                                {student.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500">
                              <Clock className="w-4 h-4" />
                              Applied: {new Date(student.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 lg:pt-0 lg:border-l lg:border-slate-100 dark:lg:border-slate-700 lg:pl-6">
                        <Button
                          onClick={() => handleReject(student._id)}
                          disabled={processingId === student._id}
                          variant="outline"
                          className="flex-1 lg:flex-none border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleApprove(student._id)}
                          disabled={processingId === student._id}
                          className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                        >
                          {processingId === student._id ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          ) : (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          Approve
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            )}

        </div>
      </div>
    </DashboardLayout>
  );
}