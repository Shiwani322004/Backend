const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, loginAdmin } = require('../controllers/authController');
const { logout } = require('../controllers/logoutController');
const {
  getAllStudents, getPendingStudents, updateStudentStatus, getStudentProfile,
  updateStudentProfile, addAttendance, addGrades, deleteStudent, getDashboardStats,
  updateUserPreferences, getUserPreferences, getStudentAnalytics
} = require('../controllers/studentController');
const { protect, adminOnly } = require('../middleware/auth');

// Auth routes
router.post('/auth/register', registerStudent);
router.post('/auth/login/student', loginStudent);
router.post('/auth/login/admin', loginAdmin);
router.post('/auth/logout', logout);

// Student routes
router.get('/students', protect, adminOnly, getAllStudents);
router.get('/students/pending', protect, adminOnly, getPendingStudents);
router.put('/students/:id/status', protect, adminOnly, updateStudentStatus);
router.delete('/students/:id', protect, adminOnly, deleteStudent);
router.post('/students/attendance', protect, adminOnly, addAttendance);
router.post('/students/grades', protect, adminOnly, addGrades);

// Student profile routes
router.get('/profile', protect, getStudentProfile);
router.put('/profile', protect, updateStudentProfile);

// User preferences routes
router.get('/user/preferences', protect, getUserPreferences);
router.put('/user/preferences', protect, updateUserPreferences);

// Analytics routes
router.get('/student/analytics', protect, getStudentAnalytics);

// Dashboard routes
router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);

module.exports = router;