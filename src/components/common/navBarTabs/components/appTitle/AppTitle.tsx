import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import styles from './appTitle.module.css';

const AppTitle: React.FC = () => {
  return (
    <Button component={Link} to="/" className={styles.logoButton}>
      <img
        src="/assets/appTitle.png"
        alt="DevSpace Logo"
        className={styles.logoImage}
      />
    </Button>
  );
};

export default AppTitle;
