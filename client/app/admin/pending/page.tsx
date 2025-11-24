"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Check, X, Clock, User } from 'lucide-react';

interface Student {
  _id: string;
  fullname: string;
  email: string;
  rollNumber: string;
  class: string;
  phone?: string;
  status: string;
  createdAt: string;
}

export default function PendingApprovals() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    if (!user?.token) return;
    
    try {
      const response = await api.getPendingStudents(user.token);
      // api.ts returns data directly on success
      if (response && response.data) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error("Fetch pending students error:", error);
      toast.error('Failed to fetch pending students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (studentId: string, status: 'approved' | 'rejected') => {
    if (!user?.token) return;
    
    try {
      await api.updateStudentStatus(studentId, status, user.token);
      toast.success(`Student ${status} successfully`);
      setStudents(students.filter(s => s._id !== studentId));
    } catch (error) {
      toast.error(`Failed to ${status} student`);
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pending Approvals
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and approve student registrations
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : students.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-12 text-center border border-gray-200 dark:border-slate-700"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No pending student registrations at the moment.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, index) => (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {student.fullname}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {student.email}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Class</span>
                      <span className="font-medium text-gray-900 dark:text-white">{student.class}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Roll Number</span>
                      <span className="font-medium text-gray-900 dark:text-white">{student.rollNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Registered</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate(student._id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(student._id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg shadow-blue-500/25"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}