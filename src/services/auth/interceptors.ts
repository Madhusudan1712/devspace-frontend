import axios from "axios";
import { refreshAccessToken } from "../auth/authService";

const API_BASE = import.meta.env.VITE_API_EXTERNAL_URL;
const AUTHCENTER_URL = "https://authcenter.madhusudan.space";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken(); // silently refresh cookies
        return api(originalRequest); // retry failed request
      } catch (refreshError) {
        // If refresh fails, redirect to login
        const redirectUri = encodeURIComponent(window.location.href);
        window.location.href = `${AUTHCENTER_URL}/auth?redirect=${redirectUri}`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
