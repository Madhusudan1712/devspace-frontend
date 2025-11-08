import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchCurrentUser, getIsAppUserThunk } from "./features/auth/authThunks";
import NavsAndTabs from "./components/common/navBarTabs/NavsBarTabs";
import AppRoutes from "./app/AppRoutes";
import Loading from "./components/common/loading/Loading";
import { selectGetisAppUserLoading, selectIsAppUser } from "./features/auth/authSelectors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

function App() {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, redirecting } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const isAppUser = useSelector(selectIsAppUser);
  const isAppUserLoading = useSelector(selectGetisAppUserLoading);
  const [hasChecked, setHasChecked] = useState(false);

  // initial load + revalidation hooks for focus/visibility/storage to force calling getCurrentUser
  useEffect(() => {
    (dispatch as any)(getIsAppUserThunk()).then(() => {
      // Only set hasChecked after API call completes
      setHasChecked(true);
    });

    const revalidate = () => {
      // always call the server to get current user (no reliance on stored token)
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
    const onStorage = (e: StorageEvent) => {
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
  // Only redirect after API call completes and Redux state is updated
  if (hasChecked && !isAppUser) {
      const fullRedirectUrl = `${window.location.origin}/super-admin/home`;
      navigate(`/auth?redirect=${encodeURIComponent(fullRedirectUrl)}`, { replace: true });
  }
  }, [hasChecked, isAppUser, navigate]);

  if (!hasChecked || isAppUserLoading) {
      return <Loading/>;
  }

  useEffect(() => {
    if (redirecting) {
      const redirectUri = encodeURIComponent(window.location.href);
      window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
    }
  }, [redirecting]);

  if (loading || redirecting) return <Loading />;
  if (!isAuthenticated) return null;

  return (
    <Box>
      <NavsAndTabs />
      <AppRoutes />
    </Box>
  );
}

export default App;