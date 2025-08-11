// === src/services/api.js ===
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5041/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ✅ Export function correctly
export const getSubscriptionStatus = async (userId) => {
  try {
    const { data } = await api.get(`/Reader/${userId}/subscription`);
    return data;
  } catch (err) {
    console.error("Failed to fetch subscription status:", err);
    throw err;
  }
};

export default api;
