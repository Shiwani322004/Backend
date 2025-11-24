// Simple API utility with error handling
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API call to:', url);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text || 'Unknown error' };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle different types of errors
    let errorMessage = 'Network error. Please check if the server is running.';
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8000';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

// Auth API functions
export const authAPI = {
  // Student registration
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Student login
  loginStudent: async (credentials) => {
    return apiCall('/auth/login/student', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Admin login
  loginAdmin: async (credentials) => {
    return apiCall('/auth/login/admin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Logout
  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },
};

// Student API functions
export const studentAPI = {
  // Get profile
  getProfile: async (token) => {
    return apiCall('/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update profile
  updateProfile: async (token, profileData) => {
    return apiCall('/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  },
};

// Admin API functions
export const adminAPI = {
  // Get dashboard stats
  getDashboardStats: async (token) => {
    return apiCall('/dashboard/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get all students
  getAllStudents: async (token) => {
    return apiCall('/students', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get pending students
  getPendingStudents: async (token) => {
    return apiCall('/students/pending', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};