import axios from "axios";
import { ApiResponse, User } from "../../types/RequestOrResponse";

const API_BASE = import.meta.env.VITE_API_EXTERNAL_URL;
const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log("[getCurrentUser] API call started:", `${API_BASE}/user/me`);
    
    const res = await axios.get<ApiResponse<User>>(`${API_BASE}/user/me`, {
      withCredentials: true,
    });

    console.log("[getCurrentUser] Response:", res);

    // Pause execution for step-by-step debugging in browser dev tools
    debugger;

    return res.data.data;

  } catch (error: any) {
    console.error("[getCurrentUser] Error occurred:", error);

    // Pause here if you want to inspect 'error' in dev tools
    debugger;

    // If Axios error, show detailed info
    if (error.response) {
      console.error("[getCurrentUser] Response Error Data:", error.response.data);
      console.error("[getCurrentUser] Response Status:", error.response.status);
      console.error("[getCurrentUser] Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("[getCurrentUser] No response received:", error.request);
    } else {
      console.error("[getCurrentUser] Request setup error:", error.message);
    }

    // Return null so app can handle gracefully
    return null;
  }
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
  const res = await axios.post(
    `${API_BASE}/auth/refresh`,
    {},
    {
      withCredentials: true, 
    }
  );
  return res.data;
};
