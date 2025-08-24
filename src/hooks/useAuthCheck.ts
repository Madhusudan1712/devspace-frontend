import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_EXTERNAL_URL;
const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

interface User {
  id: string;
  name: string;
  email: string;
  domain: string;
  approved: boolean;
  mfaEnabled: boolean;
  role: string;
}

export default function useAuthCheck() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_BASE}/user/me`, { withCredentials: true })
      .then((res) => {
        if (!cancelled && res.status === 200) {
          setAuthenticated(true);
          setUser(res.data.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRedirecting(true);
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, isAuthenticated, redirecting, user };
}
