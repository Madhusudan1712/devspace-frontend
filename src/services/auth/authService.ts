import axios from "axios";
import { ApiResponse, User } from "../../types/RequestOrResponse";

const AUTH_API_BASE = import.meta.env.VITE_API_EXTERNAL_URL;
const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

export const getIsAppUser = async (): Promise<boolean> => {
  const res = await axios.get<ApiResponse<boolean>>(
    `${AUTH_API_BASE}/auth/is-app-user`,
    { withCredentials: true }
  );
  return res.data.data ?? false; 
}

export const getCurrentUser = async (): Promise<User | null> => {
  if (axios.defaults.headers?.common?.Authorization) {
    delete axios.defaults.headers.common.Authorization;
  }

  const res = await axios.get<ApiResponse<User>>(`${AUTH_API_BASE}/user/me`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const redirectToLogin = () => {
  const redirectUri = encodeURIComponent(window.location.href);
  window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
};

export const logoutService = async () => {
  try {
    const res = await axios.post(
      `${AUTH_API_BASE}/auth/logout`,
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
  const res = await axios.post(
    `${AUTH_API_BASE}/auth/refresh`,
    {},
    {
      withCredentials: true, 
    }
  );
  return res.data;
};