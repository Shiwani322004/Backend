const mongoose = require('mongoose');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testLogin() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/student-management');
    console.log('Connected to MongoDB');

    const email = `testlogin_${Date.now()}@test.com`;
    const password = 'password123';

    // Case 1: Pre-hashing (Simulating the buggy script)
    console.log('\n--- Case 1: Pre-hashing (Buggy) ---');
    const hashedPassword = await bcrypt.hash(password, 10);
    const student1 = new Student({
      fullname: 'Double Hash',
      email: email,
      password: hashedPassword,
      rollNumber: `DH_${Date.now()}`,
      class: 'Test',
      status: 'approved'
    });
    await student1.save();
    
    // Try to match
    const isMatch1 = await student1.matchPassword(password);
    console.log('Double Hashed Match Result:', isMatch1); // Expect false

    // Case 2: Plain text (Correct way)
    console.log('\n--- Case 2: Plain text (Correct) ---');
    const email2 = `testlogin2_${Date.now()}@test.com`;
    const student2 = new Student({
      fullname: 'Single Hash',
      email: email2,
      password: password, // Plain text
      rollNumber: `SH_${Date.now()}`,
      class: 'Test',
      status: 'approved'
    });
    await student2.save();

    // Try to match
    const isMatch2 = await student2.matchPassword(password);
    console.log('Single Hash Match Result:', isMatch2); // Expect true

    // Cleanup
    await Student.deleteMany({ email: { $in: [email, email2] } });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testLogin();
