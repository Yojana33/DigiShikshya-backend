import axios from 'axios';
import { useRouter } from 'next/router'; // Ensure you import useRouter
import Cookies from 'js-cookie';
// Create an instance of axios with custom configurations
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
  timeout: 10000, // Set a timeout limit
});

// Add a request interceptor to attach the access token to every request
axiosInstance.interceptors.request.use(
  config => {
    const token = Cookies.get('AccessToken'); // Get the access token from cookies
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach the access token to the Authorization header
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and token refresh
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const router = useRouter(); // Get the router for redirecting the user if needed

    // Check if the error is due to token expiration and the request is not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('RefreshToken'); // Get the refresh token from cookies

      if (refreshToken) {
        try {
          // Attempt to refresh the access token
          const { data } = await axios.post(`${process.env.NEXT_BACKEND_URL}/refresh`, null, {
            withCredentials: true, // Send cookies with the request
          });

          // Save the new tokens in cookies
          Cookies.set('AccessToken', data.AccessToken, { secure: true, sameSite: 'Strict', path: '/' });
          Cookies.set('RefreshToken', data.RefereshToken, { secure: true, sameSite: 'Strict', path: '/' });

          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${data.AccessToken}`;
          return axiosInstance(originalRequest); // Retry the request
        } catch (refreshError) {
          // If token refresh fails, remove the tokens and redirect to the login page
          Cookies.remove('AccessToken');
          Cookies.remove('RefreshToken');
          router.push('/login'); // Redirect to the login page
        }
      }
    }

    // If the error is not related to token expiration, just reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
