import { Box } from '@mui/material'
import NavsAndTabs from './components/common/navBarTabs/NavsBarTabs';
import AppRoutes from './app/AppRoutes';

function App() {
  return (
    <Box>
      <NavsAndTabs />
      <AppRoutes />
    </Box>
  );
}

export default App;
