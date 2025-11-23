import AppButton from '@/components/common/button/AppButton';
import styles from './logoutBtn.module.scss';
import LogoutIcon from '@mui/icons-material/Logout';

const handleLogout = () => {
  console.warn("Clear storage/cookies need to be implemented");
};

const LogoutBtn = () => {
  return (
    <AppButton
      variant="primary"
      onClick={handleLogout}
      className={styles.loggedOut}
      startIcon={<LogoutIcon/>}
      sx={{
        width: 90,
      }}
    >
      Logout
    </AppButton>
  );
};

export default LogoutBtn;
