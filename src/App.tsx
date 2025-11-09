import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchCurrentUser, getIsAppUserThunk } from "./features/auth/authThunks";
import NavsAndTabs from "./components/common/navBarTabs/NavsBarTabs";
import AppRoutes from "./app/AppRoutes";
import Loading from "./components/common/loading/Loading";

const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

function App() {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        console.log("[App] Checking is-app-user...");
        const isAppUser: boolean = await dispatch(getIsAppUserThunk()).unwrap();
        console.log("[App] /is-app-user result:", isAppUser);
        if (!mounted) return;
        if (!isAppUser) {
          console.warn("[App] Not an app user → redirecting to auth UI");
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
          return;
        }
        try {
          console.log("[App] Calling /user/me ...");
          await dispatch(fetchCurrentUser()).unwrap();
          console.log("[App] /user/me success. Rendering app.");
          if (!mounted) return;
          setChecking(false);
        } catch {
          console.error("[App] /user/me failed → redirecting to auth UI");
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
        }
      } catch {
        console.error("[App] /is-app-user failed → redirecting to auth UI");
        const redirectUri = encodeURIComponent(window.location.href);
        window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
      }
    })();
    return () => {
      mounted = false;
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
