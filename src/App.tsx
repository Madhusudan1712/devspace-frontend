import { useEffect } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchCurrentUser } from "./features/auth/authThunks";
import NavsAndTabs from "./components/common/navBarTabs/NavsBarTabs";
import AppRoutes from "./app/AppRoutes";
import Loading from "./components/common/loading/Loading";

function App() {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, redirecting } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (redirecting) {
      const redirectUri = encodeURIComponent(window.location.href);
      window.location.href = `http://authcenter.madhusudan.space:5000/auth?redirect=${redirectUri}`;
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
