import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchCurrentUser, getIsAppUserThunk } from "./features/auth/authThunks";
import NavsAndTabs from "./components/common/navBarTabs/NavsBarTabs";
import AppRoutes from "./app/AppRoutes";
import Loading from "./components/common/loading/Loading";
import { refreshAccessToken } from "./services/auth/authService";

const AUTH_UI_URL = import.meta.env.VITE_AUTH_UI_URL;

function App() {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const isAppUserLoading = useAppSelector((state) => state.auth.getIsAppUserLoading);
  const [hasChecked, setHasChecked] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // initial is-app-user check -> proceed to /me on success, else redirect
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const action = await dispatch(getIsAppUserThunk());
        const isApp = action?.payload === true;
        if (!mounted) return;

        if (!isApp) {
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
          return;
        }

        try {
          await dispatch(fetchCurrentUser()).unwrap();
          if (!mounted) return;
          setAuthReady(true);
          setHasChecked(true);
        } catch {
          // single refresh + retry before redirect
          try {
            await refreshAccessToken();
            await dispatch(fetchCurrentUser()).unwrap();
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
        const redirectUri = encodeURIComponent(window.location.href);
        window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
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
        const isAppUserResult: boolean = await dispatch(getIsAppUserThunk()).unwrap();
        if (!isAppUserResult) {
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
          return;
        }
        await dispatch(fetchCurrentUser()).unwrap();
      } catch {
        const redirectUri = encodeURIComponent(window.location.href);
        window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
      }
    };

    const onFocus = () => { void revalidate(); };
    const onVisibility = () => {
      if (document.visibilityState === "visible") void revalidate();
    };
    const onStorage = () => { void revalidate(); };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
    };
  }, [dispatch, authReady]);

  // show loading while checking isAppUser or its loading state
  if (!hasChecked || isAppUserLoading || loading) {
    return <Loading />;
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <NavsAndTabs />
      <AppRoutes />
    </>
  );
}

export default App;
