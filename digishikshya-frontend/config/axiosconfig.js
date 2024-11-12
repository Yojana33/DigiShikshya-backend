import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
  timeout: 10000, 
  withCredentials: true, // This allows the browser to send cookies with cross-origin requests
});

// You can now omit the Authorization header, as the cookies will automatically be sent with each request.
axiosInstance.interceptors.request.use(
  config => config, // No need to manually attach tokens anymore
  error => Promise.reject(error)
);

// Add a response interceptor to handle token refresh errors
let isRefreshing = false;
let refreshSubscribers = [];

function onRrefreshed() {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
}

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`, null, { withCredentials: true });

          isRefreshing = false;
          onRrefreshed();  // Notify all subscribers that the token has been refreshed
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          window.location.href = '/auth/login';
          throw new Error('AUTH_REQUIRED');
        }
      }

      // Queue the request until the token is refreshed
      return new Promise((resolve) => {
        refreshSubscribers.push(() => {
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
