const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

// Student Registration
const registerStudent = async (req, res) => {
  try {
    const { fullname, email, password, rollNumber, class: studentClass, phone } = req.body;
    
    const studentExists = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }
    
    const student = await Student.create({
      fullname, email, password, rollNumber, class: studentClass, phone
    });
    
    res.status(201).json({
      message: 'Registration submitted for approval',
      student: {
        id: student._id,
        fullname: student.fullname,
        email: student.email,
        status: student.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student Login
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    
    if (!student || student.status !== 'approved') {
      return res.status(401).json({ message: 'Account not approved or invalid credentials' });
    }
    
    if (await student.matchPassword(password)) {
      res.json({
        id: student._id,
        fullname: student.fullname,
        email: student.email,
        rollNumber: student.rollNumber,
        class: student.class,
        role: 'student',
        token: generateToken(student._id, 'student')
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if it's the default admin
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      let admin = await Admin.findOne({ email });
      if (!admin) {
        admin = await Admin.create({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          fullname: 'System Administrator'
        });
      }
      
      return res.json({
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: 'admin',
        token: generateToken(admin._id, 'admin')
      });
    }
    
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: 'admin',
        token: generateToken(admin._id, 'admin')
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerStudent, loginStudent, loginAdmin };