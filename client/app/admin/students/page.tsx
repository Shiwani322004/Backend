"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Trash2, Edit, Eye, UserCheck, Mail, Phone, GraduationCap } from 'lucide-react';
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
  }, [user]);

  const fetchStudents = async () => {
    try {
      if (user?.token) {
      if (user?.token) {
        const response = await api.getAllStudents(user.token);
        // api.ts now returns the data array directly
        setStudents(response || []);
      }
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
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
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
              All Students
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage and view all registered students
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {filteredStudents.length} Students
            </span>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search students by name, email, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Students Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
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
              <motion.div
                key={student._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {student.fullname.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {student.fullname}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">{student.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">Roll: {student.rollNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">Class: {student.class}</span>
                            </div>
                            {student.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{student.phone}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Registered: {new Date(student.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Actions Dropdown */}
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDropdown(showDropdown === student._id ? null : student._id)}
                          className="p-2"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        
                        {showDropdown === student._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10"
                          >
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Edit Student
                            </button>
                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                            <button
                              onClick={() => handleDeleteStudent(student._id)}
                              disabled={actionLoading === student._id}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              {actionLoading === student._id ? 'Deleting...' : 'Delete Student'}
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}