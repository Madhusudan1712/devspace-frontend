import { useEffect } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchCurrentUser } from "./features/auth/authThunks";
import NavsAndTabs from "./components/common/navBarTabs/NavsBarTabs";
import AppRoutes from "./app/AppRoutes";
import AppFooter from "./components/common/footer/AppFooter";
import Loading from "./components/common/loading/Loading";

const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

function App() {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, redirecting } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const revalidate = () => {
      dispatch(fetchCurrentUser());
    };

    // initial fetch
    revalidate();

    // revalidate when the tab gains focus (covers tab switching)
    window.addEventListener("focus", revalidate);

    // revalidate when the page becomes visible (covers restoring from background)
    const onVisibility = () => {
      if (document.visibilityState === "visible") revalidate();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // revalidate when localStorage changes in other tabs (e.g., logout/login)
    const onStorage = () => {
      // optionally, only react to auth-related keys. Revalidate anyway to be safe.
      revalidate();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", revalidate);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
    };
  }, [dispatch]);

  useEffect(() => {
    if (redirecting) {
      const redirectUri = encodeURIComponent(window.location.href);
      window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
    }
  }, [redirecting]);

  if (loading || redirecting) return <Loading />;
  if (!isAuthenticated) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <NavsAndTabs />
      <Box component="main" sx={{ flex: 1 }}>
        <AppRoutes />
      </Box>
      <AppFooter />
    </Box>
  );
}

export default App;
