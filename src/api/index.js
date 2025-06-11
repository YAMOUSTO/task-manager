import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log("API Interceptor: Token from localStorage:", token);
    if (token) {
      config.headers['x-auth-token'] = token;
      console.log("API Interceptor: Attaching x-auth-token:", token); 
    } else {
      console.log("API Interceptor: No token found in localStorage to attach.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const changePassword = (passwordData) => apiClient.put('/auth/change-password', passwordData);

export const fetchTasks = () => apiClient.get('/tasks');
export const createTask = (taskData) => apiClient.post('/tasks', taskData);
export const updateTaskById = (taskId, taskData) => apiClient.put(`/tasks/${taskId}`, taskData);
export const deleteTaskById = (taskId) => apiClient.delete(`/tasks/${taskId}`);

export default apiClient;