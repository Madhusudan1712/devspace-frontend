import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchCurrentUser } from "./features/auth/authThunks";
import NavsAndTabs from "./components/common/navBarTabs/NavsBarTabs";
import AppRoutes from "./app/AppRoutes";
import Loading from "./components/common/loading/Loading";

const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

function getUserFingerprint(result: unknown): string | null {
  const r: any = result as any;
  const id = r?.id ?? r?.data?.id;
  const email = r?.email ?? r?.data?.email;
  const fingerprintSource = id ?? email ?? null;
  return fingerprintSource ? String(fingerprintSource) : null;
}

function App() {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    const validateSession = async () => {
      try {
        if (!mounted) return;
        try {
          const result = await dispatch(fetchCurrentUser()).unwrap();
          const currentFp = getUserFingerprint(result);
          const lastFp = sessionStorage.getItem("devspace.userFingerprint");
          if (currentFp && lastFp && lastFp !== currentFp) {
            // Different user detected for this tab -> force re-login
            const redirectUri = encodeURIComponent(globalThis.location.href);
            sessionStorage.removeItem("devspace.userFingerprint");
            globalThis.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
            return;
          }
          if (currentFp) {
            sessionStorage.setItem("devspace.userFingerprint", currentFp);
          }
          if (!mounted) return;
          setChecking(false);
        } catch {
          const redirectUri = encodeURIComponent(globalThis.location.href);
          globalThis.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
        }
      } catch {
        const redirectUri = encodeURIComponent(globalThis.location.href);
        globalThis.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
      }
    };

    // Initial validation on app load
    void validateSession();

    // Revalidate when tab regains focus or becomes visible (detect cross-app/user changes)
    const onFocus = () => void validateSession();
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void validateSession();
      }
    };
    globalThis.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    (async () => {
    })();
    return () => {
      mounted = false;
      globalThis.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [dispatch]);

  if (checking || loading) return <Loading />;
  if (!isAuthenticated) return null;

  return (
    <Box>
      <NavsAndTabs />
      <AppRoutes />
    </Box>
  );
}

export default App;
