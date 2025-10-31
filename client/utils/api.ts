const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // Auth endpoints
  registerStudent: (data: any) => 
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),

  loginStudent: (data: any) =>
    fetch(`${API_URL}/auth/login/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),

  loginAdmin: (data: any) =>
    fetch(`${API_URL}/auth/login/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),

  // Student endpoints
  getProfile: (token: string) =>
    fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  updateProfile: (data: any, token: string) =>
    fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),

  // Admin endpoints
  getAllStudents: (token: string) =>
    fetch(`${API_URL}/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getPendingStudents: (token: string) =>
    fetch(`${API_URL}/students/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  updateStudentStatus: (id: string, status: string, token: string) =>
    fetch(`${API_URL}/students/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status })
    }),

  deleteStudent: (id: string, token: string) =>
    fetch(`${API_URL}/students/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  getDashboardStats: (token: string) =>
    fetch(`${API_URL}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),

  addAttendance: (data: any, token: string) =>
    fetch(`${API_URL}/students/attendance`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),

  addGrades: (data: any, token: string) =>
    fetch(`${API_URL}/students/grades`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),

  // Logout endpoint
  logout: () =>
    fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
};