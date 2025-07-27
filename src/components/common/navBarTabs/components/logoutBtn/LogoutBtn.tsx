import { Button } from '@mui/material';
import styles from './logoutBtn.module.css';
import LogoutIcon from '@mui/icons-material/Logout';

const handleLogout = () => {
  console.warn("Clear storage/cookies need to be implemented");
};

const LogoutBtn = () => {
  return (
    <Button
      variant="contained"
      onClick={handleLogout}
      disableElevation
      className={styles.loggedOut}
      sx={{
        width: 90,
        backgroundColor: '#052a7a',
        color: '#ffffff',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#205781',
        },
      }}
      startIcon={<LogoutIcon/>}
    >
      Logout
    </Button>
  );
};

export default LogoutBtn;
