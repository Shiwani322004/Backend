const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

// Student Registration
const registerStudent = async (req, res) => {
  try {
    console.log('Registration request:', req.body);
    const { fullname, email, password, rollNumber, class: studentClass, phone } = req.body;
    
    // Validate required fields
    if (!fullname || !email || !password || !rollNumber || !studentClass) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    const studentExists = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this email or roll number already exists' });
    }
    
    const student = await Student.create({
      fullname, 
      email, 
      password, 
      rollNumber, 
      class: studentClass, 
      phone: phone || ''
    });
    
    console.log('Student created:', student._id);
    
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
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Student Login
const loginStudent = async (req, res) => {
  try {
    console.log('Student login request:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const student = await Student.findOne({ email });
    console.log('Student found:', student ? 'Yes' : 'No');
    
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (student.status !== 'approved') {
      return res.status(401).json({ message: 'Account is pending approval. Please wait for admin approval.' });
    }
    
    const isPasswordValid = await student.matchPassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      const token = generateToken(student._id, 'student');
      res.json({
        id: student._id,
        fullname: student.fullname,
        email: student.email,
        rollNumber: student.rollNumber,
        class: student.class,
        role: 'student',
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    console.log('Admin login request:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Check if it's the default admin credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      let admin = await Admin.findOne({ email });
      
      if (!admin) {
        console.log('Creating default admin...');
        admin = await Admin.create({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          fullname: 'System Administrator'
        });
        console.log('Default admin created:', admin._id);
      }
      
      const token = generateToken(admin._id, 'admin');
      return res.json({
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: 'admin',
        token
      });
    }
    
    // Check for existing admin in database
    const admin = await Admin.findOne({ email });
    console.log('Admin found in DB:', admin ? 'Yes' : 'No');
    
    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id, 'admin');
      res.json({
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: 'admin',
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerStudent, loginStudent, loginAdmin };