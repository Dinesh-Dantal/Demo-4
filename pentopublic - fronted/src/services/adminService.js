import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const adminService = {
  // Dashboard endpoints
  async getDashboard() {
    try {
      const response = await api.get('/Admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  },

  async getPendingBooks() {
    try {
      const response = await api.get('/Admin/pending-books');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending books:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch pending books');
    }
  },

  async getBooksSummary() {
    try {
      const response = await api.get('/Admin/books/summary');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch books summary:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch books summary');
    }
  },

  async getReaders() {
    try {
      const response = await api.get('/Admin/readers');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch readers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch readers');
    }
  },

  async getAuthors() {
    try {
      const response = await api.get('/Admin/authors');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch authors');
    }
  },

  // Book management actions
  async approveBook(bookId) {
    try {
      const response = await api.post(`/Admin/approve/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to approve book:', error);
      throw new Error(error.response?.data?.message || 'Failed to approve book');
    }
  },

  async rejectBook(bookId) {
    try {
      const response = await api.post(`/Admin/reject/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to reject book:', error);
      throw new Error(error.response?.data?.message || 'Failed to reject book');
    }
  },

  // Additional admin endpoints
  async getBookDetails(bookId) {
    try {
      const response = await api.get(`/Admin/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch book details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch book details');
    }
  },

  async updateBookStatus(bookId, status) {
    try {
      const response = await api.put(`/Admin/books/${bookId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update book status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update book status');
    }
  },

  async deleteBook(bookId) {
    try {
      const response = await api.delete(`/Admin/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete book:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete book');
    }
  },

  // User management
  async getUserDetails(userId) {
    try {
      const response = await api.get(`/Admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
  },

  async updateUserStatus(userId, isActive) {
    try {
      const response = await api.put(`/Admin/users/${userId}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
  },

  // Reports and analytics
  async getAnalytics(dateRange) {
    try {
      const response = await api.get('/Admin/analytics', {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
    }
  },

  async exportData(type, format = 'csv') {
    try {
      const response = await api.get(`/Admin/export/${type}`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error(error.response?.data?.message || 'Failed to export data');
    }
  }
};

export default adminService;