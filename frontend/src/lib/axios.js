import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5173/api',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
export default axiosInstance;