const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  profilePhoto: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isActive: { type: Boolean, default: true },
  
  // Enhanced fields
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  
  attendance: [{
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    subject: String,
    period: Number
  }],
  
  grades: [{
    subject: String,
    marks: Number,
    totalMarks: Number,
    grade: String,
    semester: String,
    examType: { type: String, enum: ['quiz', 'midterm', 'final', 'assignment'], default: 'quiz' },
    date: { type: Date, default: Date.now }
  }],
  
  assignments: [{
    title: String,
    subject: String,
    description: String,
    dueDate: Date,
    status: { type: String, enum: ['pending', 'submitted', 'overdue', 'graded'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    submissionDate: Date,
    grade: String,
    feedback: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  notifications: [{
    title: String,
    message: String,
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    isRead: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    createdAt: { type: Date, default: Date.now }
  }],
  
  activities: [{
    type: { type: String, enum: ['login', 'assignment_submit', 'grade_received', 'attendance_marked'] },
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
  }],
  
  studyStats: {
    totalStudyHours: { type: Number, default: 0 },
    studyStreak: { type: Number, default: 0 },
    lastStudyDate: Date,
    weeklyGoal: { type: Number, default: 20 },
    completedAssignments: { type: Number, default: 0 },
    averageGrade: { type: Number, default: 0 }
  }
}, { timestamps: true });

studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Calculate GPA
studentSchema.methods.calculateGPA = function() {
  if (!this.grades || this.grades.length === 0) return 0;
  
  const gradePoints = { 'A+': 4.0, 'A': 3.7, 'B+': 3.3, 'B': 3.0, 'C+': 2.7, 'C': 2.3, 'D': 2.0, 'F': 0 };
  const totalPoints = this.grades.reduce((sum, grade) => {
    return sum + (gradePoints[grade.grade] || 0);
  }, 0);
  
  return (totalPoints / this.grades.length).toFixed(2);
};

// Calculate attendance percentage
studentSchema.methods.calculateAttendancePercentage = function() {
  if (!this.attendance || this.attendance.length === 0) return 0;
  
  const presentDays = this.attendance.filter(record => record.status === 'present').length;
  return Math.round((presentDays / this.attendance.length) * 100);
};

module.exports = mongoose.model('Student', studentSchema);