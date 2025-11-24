"use client";
import { useState } from 'react';
import { authAPI } from '../../utils/api';

export default function APITest() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, success, message) => {
    setResults(prev => [...prev, { test, success, message, time: new Date().toLocaleTimeString() }]);
  };

  const testConnection = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Basic server connection
    try {
      const response = await fetch('http://localhost:8000');
      if (response.ok) {
        const data = await response.json();
        addResult('Server Connection', true, data.message);
      } else {
        addResult('Server Connection', false, `HTTP ${response.status}`);
      }
    } catch (error) {
      addResult('Server Connection', false, error.message);
    }

    // Test 2: Admin login
    try {
      const result = await authAPI.loginAdmin({
        email: 'admin@sms.com',
        password: 'admin123'
      });
      
      if (result.success) {
        addResult('Admin Login', true, `Logged in as ${result.data.fullname}`);
      } else {
        addResult('Admin Login', false, result.error);
      }
    } catch (error) {
      addResult('Admin Login', false, error.message);
    }

    // Test 3: Student registration
    try {
      const result = await authAPI.register({
        fullname: 'Test Student',
        email: `test${Date.now()}@student.com`,
        password: 'password123',
        rollNumber: `TEST${Date.now()}`,
        class: '10th'
      });
      
      if (result.success) {
        addResult('Student Registration', true, result.data.message || 'Registration successful');
      } else {
        addResult('Student Registration', false, result.error);
      }
    } catch (error) {
      addResult('Student Registration', false, error.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold">Test Results:</h3>
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border ${
                result.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{result.test}:</span>
                  <span className="ml-2">{result.success ? '✅' : '❌'}</span>
                </div>
                <span className="text-xs opacity-75">{result.time}</span>
              </div>
              <p className="text-sm mt-1">{result.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium mb-2">Environment Check:</h4>
        <p className="text-sm text-gray-600">
          API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
        </p>
        <p className="text-sm text-gray-600">
          Socket URL: {process.env.NEXT_PUBLIC_SOCKET_URL || 'Not set'}
        </p>
      </div>
    </div>
  );
}