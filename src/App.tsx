import { Box } from '@mui/material';
import NavsAndTabs from './components/common/navBarTabs/NavsBarTabs';
import AppRoutes from './app/AppRoutes';
import useAuthCheck from './hooks/useAuthCheck';
import Loading from './components/common/loading/Loading';

function App() {
  const { loading, isAuthenticated, redirecting } = useAuthCheck();

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
