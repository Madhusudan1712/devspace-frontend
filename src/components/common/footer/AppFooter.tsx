import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  TextField, 
  Divider, 
  IconButton 
} from '@mui/material';
import { useState } from 'react';
import AppButton from '../button/AppButton';
import styles from './appFooter.module.scss';

// Social Icons
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function AppFooter() {
  const [email, setEmail] = useState('');
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Coming soon 🚀');
  };

  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg" className={styles.container}>
        {/* Logo + brand */}
        <Box className={styles.logoSection}>
          <img
            src={import.meta.env.VITE_API_TITLE_LOGO_URL}
            alt="App Logo"
            className={styles.logo}
          />
          <Typography variant="h6" className={styles.brandTitle}>
            DevSpace
          </Typography>
        </Box>

        {/* Main section */}
        <Box className={styles.mainSection}>
          {/* Products */}
          <Box className={styles.section}>
            <Typography variant="subtitle1" className={styles.sectionTitle}>
              Products
            </Typography>
            {['DevSpace', 'SocialFlux'].map((item) => (
              <Link
                key={item}
                href="#"
                onClick={handleComingSoon}
                className={styles.sectionLink}
              >
                {item}
              </Link>
            ))}
          </Box>

          {/* About */}
          <Box className={styles.section}>
            <Typography variant="subtitle1" className={styles.sectionTitle}>
              About
            </Typography>
            {['About', 'Services', 'Blog', 'Contact'].map((item) => (
              <Link
                key={item}
                href="#"
                onClick={handleComingSoon}
                className={styles.sectionLink}
              >
                {item}
              </Link>
            ))}
          </Box>

          {/* Legal */}
          <Box className={styles.section}>
            <Typography variant="subtitle1" className={styles.sectionTitle}>
              Legal
            </Typography>
            {['Terms & Conditions', 'Privacy Policy'].map((item) => (
              <Link
                key={item}
                href="#"
                onClick={handleComingSoon}
                className={styles.sectionLink}
              >
                {item}
              </Link>
            ))}
          </Box>

          {/* Subscribe */}
          <Box className={styles.subscribeSection}>
            <Typography variant="subtitle1" className={styles.sectionTitle}>
              Subscribe
            </Typography>
            <Typography variant="body2" className={styles.subscribeDescription}>
              Stay updated with our latest offers and news.
            </Typography>
            <Box className={styles.subscribeForm}>
              <TextField
                size="small"
                placeholder="Enter your email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.textField}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--color-surface)',
                    '& fieldset': {
                      borderColor: 'rgba(17, 45, 78, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(17, 45, 78, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--color-accent)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'var(--color-text)',
                    '&::placeholder': {
                      color: 'rgba(17, 45, 78, 0.5)',
                      opacity: 1,
                    },
                  },
                }}
              />
              <AppButton
                variant="primary"
                disabled={!isValidEmail(email)}
                className={styles.subscribeButton}
              >
                Subscribe
              </AppButton>
            </Box>
          </Box>
        </Box>

        {/* Separator */}
        <Divider className={styles.divider} />

        {/* Bottom bar */}
        <Box className={styles.bottomBar}>
          <Typography variant="body2" className={styles.copyright}>
            © {new Date().getFullYear()} DevSpace. All Rights Reserved.
          </Typography>

          <Box className={styles.socialIcons}>
            {[InstagramIcon, LinkedInIcon, GitHubIcon].map(
              (Icon, i) => (
                <IconButton
                  key={i}
                  onClick={handleComingSoon}
                  size="small"
                  className={styles.socialIconButton}
                >
                  <Icon fontSize="small" />
                </IconButton>
              )
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
