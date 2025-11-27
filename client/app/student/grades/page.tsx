"use client";
import { useEffect, useState } from 'react';
import { Award, TrendingUp, BookOpen, Download, Filter, BarChart3 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface SubjectGrade {
  subject: string;
  assignments: number;
  midterm: number;
  final: number;
  total: number;
  maxTotal: number;
  grade: string;
  credits: number;
  percentage: number;
}

interface SemesterData {
  semester: string;
  gpa: number;
  totalCredits: number;
  subjects: SubjectGrade[];
}

export default function GradesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
  const [semesterData, setSemesterData] = useState<SemesterData | null>(null);
  const [semesters] = useState(['Fall 2024', 'Spring 2024', 'Fall 2023', 'Spring 2023']);

  useEffect(() => {
    fetchGradesData();
  }, [user, selectedSemester]);

  const fetchGradesData = async () => {
    try {
      if (user?.token) {
        // Mock data - replace with actual API call
        const mockData: SemesterData = {
          semester: selectedSemester,
          gpa: 3.75,
          totalCredits: 18,
          subjects: [
            {
              subject: 'Advanced Mathematics',
              assignments: 45,
              midterm: 42,
              final: 88,
              total: 175,
              maxTotal: 200,
              grade: 'A',
              credits: 4,
              percentage: 87.5
            },
            {
              subject: 'Physics II',
              assignments: 48,
              midterm: 45,
              final: 90,
              total: 183,
              maxTotal: 200,
              grade: 'A',
              credits: 4,
              percentage: 91.5
            },
            {
              subject: 'Chemistry',
              assignments: 42,
              midterm: 38,
              final: 82,
              total: 162,
              maxTotal: 200,
              grade: 'B+',
              credits: 3,
              percentage: 81.0
            },
            {
              subject: 'English Literature',
              assignments: 47,
              midterm: 44,
              final: 86,
              total: 177,
              maxTotal: 200,
              grade: 'A',
              credits: 3,
              percentage: 88.5
            },
            {
              subject: 'Computer Science',
              assignments: 49,
              midterm: 47,
              final: 92,
              total: 188,
              maxTotal: 200,
              grade: 'A+',
              credits: 4,
              percentage: 94.0
            }
          ]
        };

        setSemesterData(mockData);
      }
    } catch (error) {
      console.error('Failed to fetch grades:', error);
      toast.error('Failed to load grades data');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'B+':
      case 'B':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'C+':
      case 'C':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-red-500';
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grades & Performance</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Track your academic performance and grades
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {semesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </div>
        </div>

        {/* GPA and Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Current GPA</p>
                  <p className="text-4xl font-bold mt-2">{semesterData?.gpa.toFixed(2)}</p>
                  <p className="text-xs text-blue-100 mt-1">Out of 4.0</p>
                </div>
                <Award className="w-12 h-12 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Credits</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{semesterData?.totalCredits}</p>
                </div>
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Subjects</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{semesterData?.subjects.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Average</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                    {semesterData ? Math.round(semesterData.subjects.reduce((acc, s) => acc + s.percentage, 0) / semesterData.subjects.length) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Grades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {semesterData?.subjects.map((subject, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{subject.subject}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(subject.grade)}`}>
                    {subject.grade}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Percentage Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {subject.total}/{subject.maxTotal} ({subject.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getPercentageColor(subject.percentage)}`}
                        style={{ width: `${subject.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assignments</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{subject.assignments}/50</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Midterm</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{subject.midterm}/50</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Final</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{subject.final}/100</p>
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="flex items-center justify-between pt-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Credits</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{subject.credits}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map(grade => {
                const count = semesterData?.subjects.filter(s => s.grade === grade).length || 0;
                const percentage = semesterData ? (count / semesterData.subjects.length) * 100 : 0;
                
                return (
                  <div key={grade} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(grade)}`}>
                        {grade}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {count} {count === 1 ? 'subject' : 'subjects'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
