import axios from "axios";
import { ApiResponse, User } from "../../types/RequestOrResponse";

const AUTH_API_BASE = import.meta.env.VITE_API_EXTERNAL_URL;
const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

export const getIsAppUser = async (): Promise<boolean> => {
  try {
    console.log("[authService] GET /auth/is-app-user");
    const res = await axios.get<ApiResponse<boolean>>(
      `${AUTH_API_BASE}/auth/is-app-user`,
      { withCredentials: true }
    );
    console.log("[authService] /auth/is-app-user response:", res.data);
    return res.data.data ?? false;
  } catch (e: any) {
    console.error("[authService] /auth/is-app-user error:", e?.response?.status, e?.response?.data);
    throw e;
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  if (axios.defaults.headers?.common?.Authorization) {
    delete axios.defaults.headers.common.Authorization;
  }

  try {
    console.log("[authService] GET /user/me");
    const res = await axios.get<ApiResponse<User>>(`${AUTH_API_BASE}/user/me`, {
      withCredentials: true,
    });
    console.log("[authService] /user/me response:", res.data?.status);
    return res.data.data;
  } catch (e: any) {
    console.error("[authService] /user/me error:", e?.response?.status, e?.response?.data);
    throw e;
  }
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