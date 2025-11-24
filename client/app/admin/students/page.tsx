"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Trash2, FileText, BarChart2 } from 'lucide-react';

interface Student {
  _id: string;
  fullname: string;
  email: string;
  rollNumber: string;
  class: string;
  phone?: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  attendance: any[];
  grades: any[];
}

export default function AllStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({ status: 'present' });
  const [gradesData, setGradesData] = useState({
    subject: '',
    marks: '',
    totalMarks: '',
    grade: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    if (!user?.token) return;
    
    try {
      const response = await api.getAllStudents(user.token);
      console.log('All Students Response:', response); // Debugging
      
      if (response && response.data) {
        const approvedStudents = response.data.filter((s: Student) => {
          const status = s.status?.toLowerCase().trim();
          console.log(`Student: ${s.fullname}, Status: ${s.status} -> ${status}`); // Debugging
          return status === 'approved';
        });
        setStudents(approvedStudents);
      }
    } catch (error) {
      console.error("Fetch students error:", error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    if (!user?.token) return;
    
    try {
      await api.deleteStudent(studentId, user.token);
      toast.success('Student deleted successfully');
      setStudents(students.filter(s => s._id !== studentId));
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const handleAddAttendance = async () => {
    if (!selectedStudent || !user?.token) return;
    
    try {
      await api.addAttendance({
        studentId: selectedStudent._id,
        status: attendanceData.status
      }, user.token);
      
      toast.success('Attendance added successfully');
      setShowAttendanceModal(false);
      setAttendanceData({ status: 'present' });
      fetchAllStudents();
    } catch (error) {
      toast.error('Failed to add attendance');
    }
  };

  const handleAddGrades = async () => {
    if (!selectedStudent || !user?.token) return;
    
    try {
      await api.addGrades({
        studentId: selectedStudent._id,
        ...gradesData,
        marks: parseInt(gradesData.marks),
        totalMarks: parseInt(gradesData.totalMarks)
      }, user.token);
      
      toast.success('Grades added successfully');
      setShowGradesModal(false);
      setGradesData({ subject: '', marks: '', totalMarks: '', grade: '' });
      fetchAllStudents();
    } catch (error) {
      toast.error('Failed to add grades');
    }
  };

  const filteredStudents = students.filter(student => 
    student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Students
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage student records, attendance, and grades
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <button 
              onClick={fetchAllStudents}
              className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              title="Refresh List"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </button>
            <button className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Academic Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No students found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <motion.tr 
                      key={student._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-sm">
                            {student.fullname.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.fullname}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          Class {student.class}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Roll No: {student.rollNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Attendance</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.attendance?.length || 0} records
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Grades</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.grades?.length || 0} subjects
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowAttendanceModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Add Attendance"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowGradesModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Add Grades"
                          >
                            <BarChart2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-slate-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Mark Attendance
              <span className="block text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
                {selectedStudent?.fullname}
              </span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['present', 'absent', 'late'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setAttendanceData({ status })}
                      className={`py-2 px-4 rounded-lg text-sm font-medium capitalize transition-all ${
                        attendanceData.status === status
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAttendance}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/25"
              >
                Save Record
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Grades Modal */}
      {showGradesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-slate-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Add Grades
              <span className="block text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
                {selectedStudent?.fullname}
              </span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={gradesData.subject}
                  onChange={(e) => setGradesData({...gradesData, subject: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g., Mathematics"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Marks Obtained
                  </label>
                  <input
                    type="number"
                    value={gradesData.marks}
                    onChange={(e) => setGradesData({...gradesData, marks: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={gradesData.totalMarks}
                    onChange={(e) => setGradesData({...gradesData, totalMarks: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grade
                </label>
                <select
                  value={gradesData.grade}
                  onChange={(e) => setGradesData({...gradesData, grade: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="">Select Grade</option>
                  {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowGradesModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGrades}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/25"
              >
                Save Grades
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}