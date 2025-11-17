const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Enhanced API client with better error handling and response parsing
class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  private getAuthHeaders(token: string) {
    return { 'Authorization': `Bearer ${token}` };
  }

  // Auth endpoints
  async registerStudent(data: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async loginStudent(data: any) {
    return this.request('/auth/login/student', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async loginAdmin(data: any) {
    return this.request('/auth/login/admin', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  // Student endpoints
  async getProfile(token: string) {
    return this.request('/profile', {
      headers: this.getAuthHeaders(token)
    });
  }

  async updateProfile(data: any, token: string) {
    return this.request('/profile', {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  }

  async getStudentDashboard(token: string) {
    return this.request('/student/dashboard', {
      headers: this.getAuthHeaders(token)
    });
  }

  async getStudentAttendance(token: string, period?: string) {
    const query = period ? `?period=${period}` : '';
    return this.request(`/student/attendance${query}`, {
      headers: this.getAuthHeaders(token)
    });
  }

  async getStudentGrades(token: string, semester?: string) {
    const query = semester ? `?semester=${semester}` : '';
    return this.request(`/student/grades${query}`, {
      headers: this.getAuthHeaders(token)
    });
  }

  // Admin endpoints
  async getAllStudents(token: string, page = 1, limit = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    return this.request(`/students?${params}`, {
      headers: this.getAuthHeaders(token)
    });
  }

  async getPendingStudents(token: string) {
    return this.request('/students/pending', {
      headers: this.getAuthHeaders(token)
    });
  }

  async updateStudentStatus(id: string, status: string, token: string) {
    return this.request(`/students/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ status })
    });
  }

  async deleteStudent(id: string, token: string) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token)
    });
  }

  async getDashboardStats(token: string) {
    return this.request('/dashboard/stats', {
      headers: this.getAuthHeaders(token)
    });
  }

  async addAttendance(data: any, token: string) {
    return this.request('/students/attendance', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  }

  async addGrades(data: any, token: string) {
    return this.request('/students/grades', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  }

  async bulkUpdateAttendance(data: any[], token: string) {
    return this.request('/students/attendance/bulk', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ records: data })
    });
  }

  // Notifications
  async getNotifications(token: string, unreadOnly = false) {
    const query = unreadOnly ? '?unread=true' : '';
    return this.request(`/notifications${query}`, {
      headers: this.getAuthHeaders(token)
    });
  }

  async markNotificationRead(id: string, token: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token)
    });
  }

  async sendAnnouncement(data: any, token: string) {
    return this.request('/announcements', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  }

  // Analytics
  async getAnalytics(token: string, type: string, period = '30d') {
    return this.request(`/analytics/${type}?period=${period}`, {
      headers: this.getAuthHeaders(token)
    });
  }

  async exportData(token: string, type: string, format = 'csv') {
    return this.request(`/export/${type}?format=${format}`, {
      headers: this.getAuthHeaders(token)
    });
  }

  // Settings
  async getSettings(token: string) {
    return this.request('/settings', {
      headers: this.getAuthHeaders(token)
    });
  }

  async updateSettings(data: any, token: string) {
    return this.request('/settings', {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  }
}

// Export singleton instance
export const api = new ApiClient();

// Legacy compatibility
export const legacyApi = {
  registerStudent: (data: any) => api.registerStudent(data),
  loginStudent: (data: any) => api.loginStudent(data),
  loginAdmin: (data: any) => api.loginAdmin(data),
  getProfile: (token: string) => api.getProfile(token),
  updateProfile: (data: any, token: string) => api.updateProfile(data, token),
  getAllStudents: (token: string) => api.getAllStudents(token),
  getPendingStudents: (token: string) => api.getPendingStudents(token),
  updateStudentStatus: (id: string, status: string, token: string) => api.updateStudentStatus(id, status, token),
  deleteStudent: (id: string, token: string) => api.deleteStudent(id, token),
  getDashboardStats: (token: string) => api.getDashboardStats(token),
  addAttendance: (data: any, token: string) => api.addAttendance(data, token),
  addGrades: (data: any, token: string) => api.addGrades(data, token),
  logout: () => api.logout()
};

// Types for better TypeScript support
export interface Student {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  pendingApprovals: number;
  activeStudents: number;
  averageAttendance: number;
  recentActivity: any[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  subject?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  grade: number;
  maxGrade: number;
  semester: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}