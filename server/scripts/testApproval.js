const mongoose = require('mongoose');
const Student = require('../models/Student');
require('dotenv').config();

async function testApproval() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/student-management');
    console.log('Connected to MongoDB');

    // 1. Create a pending student
    const pendingStudent = new Student({
      fullname: 'Test Pending',
      email: `pending_${Date.now()}@test.com`,
      password: 'password123',
      rollNumber: `PENDING_${Date.now()}`,
      class: 'Test Class',
      status: 'pending'
    });
    await pendingStudent.save();
    console.log('Created pending student:', pendingStudent._id);

    // 2. Simulate Update Status (what the controller does)
    const updatedStudent = await Student.findByIdAndUpdate(
      pendingStudent._id,
      { status: 'approved' },
      { new: true }
    );
    console.log('Updated student status:', updatedStudent.status);

    // 3. Simulate Get All Students (what the controller does)
    const allStudents = await Student.find({}).select('-password').sort({ createdAt: -1 });
    const found = allStudents.find(s => s._id.toString() === pendingStudent._id.toString());
    
    if (found && found.status === 'approved') {
      console.log('SUCCESS: Student found in all students list with status approved.');
    } else {
      console.log('FAILURE: Student not found or status incorrect.');
      console.log('Found:', found);
    }

    // Cleanup
    await Student.findByIdAndDelete(pendingStudent._id);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testApproval();
