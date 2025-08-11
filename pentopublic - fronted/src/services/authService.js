// src/services/authService.js
import api from './apiService'; // ✅ Correctly imported

// 🔐 Authentication
export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const registerUser = async (userData) => {
  return await api.post("/auth/register", userData); // ✅ use api, not axios
};

// 🔁 Forgot Password Flow
export const sendOtp = async (email) => {
  return await api.post('/ForgotPassword/send-otp', { email });
};

export const verifyOtp = async (email, otp) => {
  return await api.post('/ForgotPassword/verify-otp', { email, otp });
};

export const resetPassword = async (email, newPassword) => {
  return await api.post('/ForgotPassword/reset-password', {
    email,
    newPassword,
  });
};
