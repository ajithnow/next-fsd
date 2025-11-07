/**
 * Pre-configured Axios instance used across the application.
 */
import axios, { AxiosHeaders } from 'axios';
import { env } from '@/core/utils';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      const token = globalThis.localStorage.getItem('accessToken');

      if (token) {
        const headers = config.headers ? AxiosHeaders.from(config.headers) : new AxiosHeaders();
        headers.set('Authorization', `Bearer ${token}`);
        config.headers = headers;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
