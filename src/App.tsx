import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchCurrentUser, getIsAppUserThunk } from "./features/auth/authThunks";
import NavsAndTabs from "./components/common/navBarTabs/NavsBarTabs";
import AppRoutes from "./app/AppRoutes";
import Loading from "./components/common/loading/Loading";
import { selectGetisAppUserLoading } from "./features/auth/authSelectors";
import { useSelector } from "react-redux";

const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

function App() {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const isAppUserLoading = useSelector(selectGetisAppUserLoading);
  const [hasChecked, setHasChecked] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // initial is-app-user check -> if false redirect immediately, if true call /me
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const isAppUserResult: boolean = await (dispatch as any)(getIsAppUserThunk()).unwrap();
        if (!mounted) return;

        setHasChecked(true);

        if (!isAppUserResult) {
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
          return;
        }

        // confirmed app user -> fetch current user
        try {
          await (dispatch as any)(fetchCurrentUser()).unwrap();
          setAuthReady(true);
        } catch (_e) {
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
          return;
        }
      } catch (err) {
        if (!mounted) return;
        setHasChecked(true);
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
        dispatch(fetchCurrentUser());
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
