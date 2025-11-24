const mongoose = require('mongoose');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createStudent() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/student-management');
    console.log('Connected to MongoDB');

    const studentEmail = 'student@example.com';
    const existingStudent = await Student.findOne({ email: studentEmail });
    
    if (existingStudent) {
      console.log('Student already exists:', existingStudent.email);
      // Ensure status is approved for testing
      existingStudent.status = 'approved';
      await existingStudent.save();
      console.log('Student status set to approved.');
      process.exit(0);
    }

    // const hashedPassword = await bcrypt.hash('student123', 10); // REMOVED: Mongoose pre-save hook handles hashing

    const student = new Student({
      fullname: 'John Doe',
      email: studentEmail,
      password: 'student123', // Pass plain text
      rollNumber: 'CS-2024-001',
      class: 'Computer Science',
      phone: '1234567890',
      status: 'approved' // Auto-approve for testing
    });

    await student.save();
    console.log('Student created successfully:');
    console.log('Email:', student.email);
    console.log('Password: student123');
    console.log('Roll Number:', student.rollNumber);

  } catch (error) {
    console.error('Error creating student:', error);
  } finally {
    mongoose.connection.close();
  }
}

createStudent();
