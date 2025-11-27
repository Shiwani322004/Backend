"use client";

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface Grade {
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
}

interface GradeProgressProps {
  grades: Grade[];
}

export default function GradeProgress({ grades }: GradeProgressProps) {
  const calculateGPA = () => {
    if (!grades.length) return 0;
    const gradePoints = { 'A+': 4.0, 'A': 3.7, 'B+': 3.3, 'B': 3.0, 'C+': 2.7, 'C': 2.3, 'D': 2.0, 'F': 0 };
    const total = grades.reduce((sum, grade) => sum + (gradePoints[grade.grade as keyof typeof gradePoints] || 0), 0);
    return (total / grades.length).toFixed(2);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🎯 Grade Progress
          </span>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{calculateGPA()}</div>
            <div className="text-xs text-gray-500">GPA</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {grades.map((grade, index) => {
            const percentage = (grade.marks / grade.totalMarks) * 100;
            return (
              <div
                key={index}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {grade.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {grade.marks}/{grade.totalMarks}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {grade.grade}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getGradeColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}