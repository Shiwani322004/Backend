"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Search, Save, BookOpen } from 'lucide-react';
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
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select Student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {filteredStudents.map(student => (
                  <button
                    key={student._id}
                    onClick={() => setSelectedStudent(student._id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${
                      selectedStudent === student._id
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                        : 'hover:bg-gray-50 border-transparent dark:hover:bg-gray-800'
                    }`}
                  >
                    <p className={`font-medium ${
                      selectedStudent === student._id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}>
                      {student.fullname}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Roll: {student.rollNumber} • {student.class}
                    </p>
                  </button>
                ))}
                {filteredStudents.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No students found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Grade Entry Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Add Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStudent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                          className="pl-9"
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      isLoading={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Grade
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mb-4 opacity-20" />
                  <p>Select a student from the list to add grades</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
