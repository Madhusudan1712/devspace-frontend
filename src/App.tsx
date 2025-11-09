import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchCurrentUser, getIsAppUserThunk } from "./features/auth/authThunks";
import NavsAndTabs from "./components/common/navBarTabs/NavsBarTabs";
import AppRoutes from "./app/AppRoutes";
import Loading from "./components/common/loading/Loading";
import { selectGetisAppUserLoading, selectIsAppUser } from "./features/auth/authSelectors";
import { useSelector } from "react-redux";
import { refreshAccessToken } from "./services/auth/authService";

const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

function App() {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const isAppUserLoading = useSelector(selectGetisAppUserLoading);
  const [hasChecked, setHasChecked] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // initial is-app-user check -> proceed to /me on success, else redirect
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const action = await (dispatch as any)(getIsAppUserThunk());
        const isApp = action?.payload === true;
        if (!mounted) return;

        if (!isApp) {
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
          return;
        }

        try {
          await (dispatch as any)(fetchCurrentUser()).unwrap();
          if (!mounted) return;
          setAuthReady(true);
          setHasChecked(true);
        } catch {
          try {
            await refreshAccessToken();
            await (dispatch as any)(fetchCurrentUser()).unwrap();
            if (!mounted) return;
            setAuthReady(true);
            setHasChecked(true);
          } catch {
            const redirectUri = encodeURIComponent(window.location.href);
            window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
            return;
          }
        }
      } catch {
        if (!mounted) return;
        const redirectUri = encodeURIComponent(window.location.href);
        window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
        return;
      }
    })();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  // revalidation hooks: only after initial /me succeeded
  useEffect(() => {
    if (!authReady) return;

    const revalidate = async () => {
      try {
        const isAppUserResult: boolean = await (dispatch as any)(getIsAppUserThunk()).unwrap();
        if (!isAppUserResult) {
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
          return;
        }
        try {
          await (dispatch as any)(fetchCurrentUser()).unwrap();
        } catch {
          try {
            await refreshAccessToken();
            await (dispatch as any)(fetchCurrentUser()).unwrap();
          } catch {
            const redirectUri = encodeURIComponent(window.location.href);
            window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
            return;
          }
        }
      } catch (_e) {
        const redirectUri = encodeURIComponent(window.location.href);
        window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
        return;
      }
    };

    window.addEventListener("focus", revalidate);

    const onVisibility = () => {
      if (document.visibilityState === "visible") revalidate();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onStorage = (_e: StorageEvent) => {
      revalidate();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", revalidate);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
    };
  }, [dispatch, authReady]);

  // show loading while checking isAppUser or its loading state
  if (!hasChecked || isAppUserLoading) {
    return <Loading />;
  }

  if (loading) return <Loading />;
  if (!isAuthenticated) return null;

  return (
    <Box>
      <NavsAndTabs />
      <AppRoutes />
    </Box>
  );
}

export default App;
