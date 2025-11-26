const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Enhanced API client with better error handling and response parsing
class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const config: RequestInit = {
      cache: 'no-store', // Disable caching to ensure fresh data
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

      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return null;
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

  // Student endpoints (Admin only)
  async getAllStudents(token: string) {
    return this.request('/students', {
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

  // Student Profile endpoints
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

  // User Preferences
  async getUserPreferences(token: string) {
    return this.request('/user/preferences', {
      headers: this.getAuthHeaders(token)
    });
  }

  async updateUserPreferences(data: any, token: string) {
    return this.request('/user/preferences', {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data)
    });
  }

  // Analytics
  async getStudentAnalytics(token: string) {
    return this.request('/student/analytics', {
      headers: this.getAuthHeaders(token)
    });
  }

  // Dashboard endpoints (Admin only)
  async getDashboardStats(token: string) {
    return this.request('/dashboard/stats', {
      headers: this.getAuthHeaders(token)
    });
  }
}

// Export singleton instance
export const api = new ApiClient();

// Types for better TypeScript support
export interface Student {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  rollNumber?: string;
  class?: string;
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

export interface AnalyticsData {
  attendance: {
    total: number;
    present: number;
    absent: number;
    percentage: number;
  };
  grades: {
    average: number;
    subjects: {
      subject: string;
      grade: number;
    }[];
  };
}