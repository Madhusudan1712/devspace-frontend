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

  // initial is-app-user check -> if false redirect immediately, if true call /me
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const isAppUserResult: boolean = await (dispatch as any)(getIsAppUserThunk()).unwrap?.()
          ?? (await (dispatch as any)(getIsAppUserThunk())).payload ?? false;
        if (!mounted) return;

        setHasChecked(true);

        if (!isAppUserResult) {
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
          return;
        }

        // confirmed app user -> fetch current user
        dispatch(fetchCurrentUser());
      } catch (err) {
        if (!mounted) return;
        setHasChecked(true);
        const redirectUri = encodeURIComponent(window.location.href);
        window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
      }
    })();

    return () => {
      mounted = false;
    };
  }, [dispatch, navigate]);

  // revalidation hooks: only fetch /me when we know the user is an app user
  useEffect(() => {
    if (!hasChecked) return;

    const revalidate = async () => {
      try {
        const isAppUserResult: boolean = await (dispatch as any)(getIsAppUserThunk()).unwrap?.()
          ?? (await (dispatch as any)(getIsAppUserThunk())).payload ?? false;
        if (!isAppUserResult) {
          const redirectUri = encodeURIComponent(window.location.href);
          window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
          return;
        }
        dispatch(fetchCurrentUser());
      } catch (_e) {
        const redirectUri = encodeURIComponent(window.location.href);
        window.location.href = `${AUTH_UI_URL}/auth?redirect=${redirectUri}`;
      }
    };

    // initial revalidate when the check has completed
    revalidate();

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
  }, [dispatch, hasChecked]);

  // show loading while checking isAppUser or its loading state
  if (!hasChecked || isAppUserLoading) {
    return <Loading />;
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
