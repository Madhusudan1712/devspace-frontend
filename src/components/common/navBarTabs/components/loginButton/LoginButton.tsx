import React from 'react';
import { Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from './loginButton.module.css';

type Props = {
  onClick: () => void; // Handles both login dialog and logout in parent
  isLoggedIn: boolean;
};

const LoginButton: React.FC<Props> = ({ onClick, isLoggedIn }) => {
  const buttonClass = `${styles.button} ${isLoggedIn ? styles.loggedIn : styles.loggedOut}`;
  const IconComponent = isLoggedIn ? LogoutIcon : LoginIcon;

  return (
    <Button
      variant="contained"
      onClick={onClick}
      disableElevation
      className={buttonClass}
      sx={{
        width: 90,
        backgroundColor: isLoggedIn ? '#4F959D' : '#052a7a',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: isLoggedIn ? '#98D2C0' : '#205781',
        },
      }}
      startIcon={<IconComponent className={styles.icon} />}
    >
      {isLoggedIn ? 'Logout' : 'Login'}
    </Button>
  );
};

export default LoginButton;
