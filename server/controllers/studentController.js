const Student = require('../models/Student');

// Get all students (Admin only)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending registrations (Admin only)
const getPendingStudents = async (req, res) => {
  try {
    const students = await Student.find({ status: 'pending' }).select('-password');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject student (Admin only)
const updateStudentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student profile
const updateStudentProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update through this route
    
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add attendance (Admin only)
const addAttendance = async (req, res) => {
  try {
    const { studentId, status } = req.body;
    const student = await Student.findById(studentId);
    
    student.attendance.push({ status });
    await student.save();
    
    res.json({ success: true, message: 'Attendance added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add grades (Admin only)
const addGrades = async (req, res) => {
  try {
    const { studentId, subject, marks, totalMarks, grade } = req.body;
    const student = await Student.findById(studentId);
    
    student.grades.push({ subject, marks, totalMarks, grade });
    await student.save();
    
    res.json({ success: true, message: 'Grades added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete student (Admin only)
const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard analytics
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ status: 'approved' });
    const pendingApprovals = await Student.countDocuments({ status: 'pending' });
    const activeStudents = await Student.countDocuments({ status: 'approved', isActive: true });
    
    res.json({
      success: true,
      data: { totalStudents, pendingApprovals, activeStudents }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user preferences
const updateUserPreferences = async (req, res) => {
  try {
    const { theme, notifications, language } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { 
        'preferences.theme': theme,
        'preferences.notifications': notifications,
        'preferences.language': language
      },
      { new: true }
    ).select('preferences');
    
    res.json({ success: true, data: student.preferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user preferences
const getUserPreferences = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('preferences');
    res.json({ success: true, ...student.preferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student analytics
const getStudentAnalytics = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    
    const analytics = {
      attendancePercentage: student.calculateAttendancePercentage(),
      gpa: student.calculateGPA(),
      totalAssignments: student.assignments?.length || 0,
      completedAssignments: student.assignments?.filter(a => a.status === 'submitted').length || 0,
      pendingAssignments: student.assignments?.filter(a => a.status === 'pending').length || 0,
      studyStreak: student.studyStats?.studyStreak || 0,
      totalStudyHours: student.studyStats?.totalStudyHours || 0,
      weeklyGoal: student.studyStats?.weeklyGoal || 20,
      recentActivities: student.activities?.slice(-10) || []
    };
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStudents,
  getPendingStudents,
  updateStudentStatus,
  getStudentProfile,
  updateStudentProfile,
  addAttendance,
  addGrades,
  deleteStudent,
  getDashboardStats,
  updateUserPreferences,
  getUserPreferences,
  getStudentAnalytics
};