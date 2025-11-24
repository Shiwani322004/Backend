const fetch = require('node-fetch');

const API_BASE = 'http://localhost:8000/api';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  // Test server health
  try {
    const response = await fetch('http://localhost:8000');
    const data = await response.json();
    console.log('✅ Server health:', data.message);
  } catch (error) {
    console.log('❌ Server not running:', error.message);
    return;
  }

  // Test admin login
  try {
    const adminLogin = await fetch(`${API_BASE}/auth/login/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@sms.com',
        password: 'admin123'
      })
    });
    
    if (adminLogin.ok) {
      const adminData = await adminLogin.json();
      console.log('✅ Admin login successful:', adminData.fullname);
    } else {
      const error = await adminLogin.json();
      console.log('❌ Admin login failed:', error.message);
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.message);
  }

  // Test student registration
  try {
    const studentReg = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: 'Test Student',
        email: 'test@student.com',
        password: 'password123',
        rollNumber: 'TEST001',
        class: '10th',
        phone: '1234567890'
      })
    });
    
    if (studentReg.ok) {
      const studentData = await studentReg.json();
      console.log('✅ Student registration successful:', studentData.message);
    } else {
      const error = await studentReg.json();
      console.log('❌ Student registration failed:', error.message);
    }
  } catch (error) {
    console.log('❌ Student registration error:', error.message);
  }

  console.log('\nAPI testing completed.');
}

testAPI();