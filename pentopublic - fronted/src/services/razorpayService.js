// src/services/razorpayService.js
import axios from "axios";

const API_URL = "https://localhost:44357/api/payment";

export const createRazorpayOrder = async (userId, subscriptionType) => {
  const response = await axios.post(`${API_URL}/create-order`, {
    userId,
    subscriptionType, // should be "monthly" or "yearly"
  });
  return response.data;
};

export const confirmPayment = async (razorpayPaymentId, orderId, userId) => {
  const response = await axios.post(`${API_URL}/confirm`, {
    razorpayPaymentId,
    orderId,
    userId,
  });
  return response.data;
};

export const subscribeUser = async (userId, subscriptionType) => {
  const response = await axios.post(`${API_URL}/subscribe`, {
    userId,
    subscriptionType,
  });
  return response.data;
};

export const getAllPayments = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};
