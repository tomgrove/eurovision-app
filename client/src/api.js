import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (username, email, password, displayName) =>
    api.post('/auth/signup', { username, email, password, displayName }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

export const performersAPI = {
  getAll: () => api.get('/performers'),
  getById: (id) => api.get(`/performers/${id}`),
  getAverage: (id) => api.get(`/performers/${id}/average`),
};

export const scoresAPI = {
  submit: (performerId, score, comment) =>
    api.post('/scores', { performerId, score, comment }),
  getUserScores: () => api.get('/scores/user/scores'),
  compare: (userId) => api.get(`/scores/compare/${userId}`),
};

export default api;
