// src/services/authorService.js
import api from './apiService';

export const fetchAuthorBooks = async (userId) => {
  const response = await api.get(`/author/books/${userId}`);
  return response.data;
};

export const uploadBook = async (bookData) => {
  const response = await api.post('/author/upload', bookData);
  return response.data;
};
