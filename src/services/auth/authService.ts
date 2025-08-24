import axios from "axios";

const API_BASE = import.meta.env.VITE_API_EXTERNAL_URL;
const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

export const getCurrentUser = async () => {
  const res = await axios.get(`${API_BASE}/user/me`, { withCredentials: true });
  return res.data.data;
};

export const redirectToLogin = () => {
  const redirectUri = encodeURIComponent(window.location.href);
  window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
};

export const logoutService = async () => {
  try {
    const res = await axios.post(
      `${API_BASE}/auth/logout`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Logout failed");
  }
};

export const refreshAccessToken = async () => {
  await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
};
