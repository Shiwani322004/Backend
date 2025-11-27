"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Search, Save, BookOpen, GraduationCap } from 'lucide-react';
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

export default function ResultsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    maxGrade: '100',
    semester: '1st Semester'
  });

  useEffect(() => {
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    try {
      if (user?.token) {
        const response = await api.getAllStudents(user.token);
        const approvedStudents = (response.students || []).filter((s: Student) => s.status === 'approved');
        setStudents(approvedStudents);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    setSaving(true);
    try {
      if (user?.token) {
        await api.addGrades({
          studentId: selectedStudent,
          subject: formData.subject,
          grade: Number(formData.grade),
          maxGrade: Number(formData.maxGrade),
          semester: formData.semester
        }, user.token);
        
        toast.success('Grade added successfully!');
        // Reset form but keep student selected
        setFormData(prev => ({ ...prev, subject: '', grade: '' }));
      }
    } catch (error: any) {
      console.error('Failed to add grade:', error);
      toast.error(error.message || 'Failed to add grade');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Results Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Add and manage student results
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Selection */}
          <Card className="lg:col-span-1 border-none shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md h-[calc(100vh-200px)] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Select Student
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="space-y-2 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                {filteredStudents.map(student => (
                  <button
                    key={student._id}
                    onClick={() => setSelectedStudent(student._id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 border ${
                      selectedStudent === student._id
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 shadow-sm'
                        : 'hover:bg-gray-50 border-transparent dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        selectedStudent === student._id 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                          : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300'
                      }`}>
                        {student.fullname.charAt(0)}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${
                          selectedStudent === student._id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                        }`}>
                          {student.fullname}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Roll: {student.rollNumber}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No students found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Grade Entry Form */}
          <Card className="lg:col-span-2 border-none shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Add Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStudent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Selected Student</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {students.find(s => s._id === selectedStudent)?.fullname}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subject
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          required
                          placeholder="e.g. Mathematics"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="pl-9 bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Semester/Term
                      </label>
                      <select
                        value={formData.semester}
                        onChange={(e) => setFormData({...formData, semester: e.target.value})}
                        className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option>1st Semester</option>
                        <option>2nd Semester</option>
                        <option>3rd Semester</option>
                        <option>4th Semester</option>
                        <option>5th Semester</option>
                        <option>6th Semester</option>
                        <option>Final Exam</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Grade/Score
                      </label>
                      <Input
                        required
                        type="number"
                        min="0"
                        max={formData.maxGrade}
                        placeholder="0"
                        value={formData.grade}
                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                        className="bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Max Score
                      </label>
                      <Input
                        required
                        type="number"
                        min="1"
                        value={formData.maxGrade}
                        onChange={(e) => setFormData({...formData, maxGrade: e.target.value})}
                        className="bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      isLoading={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 w-full md:w-auto"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Grade
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/50 dark:bg-slate-900/50">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium">Select a student to add grades</p>
                  <p className="text-sm mt-1">Choose a student from the list on the left</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
