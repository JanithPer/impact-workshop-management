import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});