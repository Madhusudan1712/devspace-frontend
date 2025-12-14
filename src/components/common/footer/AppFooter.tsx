import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  TextField, 
  Divider, 
  IconButton 
} from '@mui/material';
import { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AppButton from '../button/AppButton';
import styles from './appFooter.module.scss';

// Social Icons
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function AppFooter() {
  const [email, setEmail] = useState('');
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  // Refs for GSAP animations
  const footerRef = useRef<HTMLElement>(null);
  const logoSectionRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRef = useRef<HTMLHRElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const socialIconsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Coming soon 🚀');
  };

  // GSAP animations with ScrollTrigger
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(logoSectionRef.current, { opacity: 0, y: 30 });
      gsap.set(sectionsRef.current, { opacity: 0, y: 40 });
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(bottomBarRef.current, { opacity: 0, y: 20 });

      // Animation function to play the reveal
      const playRevealAnimation = () => {
        const tl = gsap.timeline();

        // Logo section animation
        tl.to(logoSectionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        });

        // Staggered sections animation
        tl.to(sectionsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }, '-=0.3');

        // Divider line animation
        tl.to(dividerRef.current, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.inOut'
        }, '-=0.2');

        // Bottom bar animation
        tl.to(bottomBarRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.4');

        return tl;
      };

      // Check if footer is already in viewport
      const checkAndAnimate = () => {
        if (!footerRef.current) return;
        
        const rect = footerRef.current.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.95;
        
        if (isInView) {
          // Footer is already visible, play animation immediately
          playRevealAnimation();
        } else {
          // Footer is not visible, use ScrollTrigger
          ScrollTrigger.create({
            trigger: footerRef.current,
            start: 'top 90%',
            once: true,
            onEnter: () => playRevealAnimation(),
          });
        }
      };

      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        checkAndAnimate();
      });

      // Social icons hover animations
      socialIconsRef.current.forEach((icon) => {
        if (icon) {
          icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
              scale: 1.2,
              rotation: 5,
              duration: 0.3,
              ease: 'back.out(1.7)'
            });
          });
          icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        }
      });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  const setSectionRef = (index: number) => (el: HTMLDivElement | null) => {
    sectionsRef.current[index] = el;
  };

  const setSocialIconRef = (index: number) => (el: HTMLButtonElement | null) => {
    socialIconsRef.current[index] = el;
  };

  return (
    <Box component="footer" ref={footerRef} className={styles.footer}>
      <Container maxWidth="lg" className={styles.container}>
        {/* Logo + brand */}
        <Box ref={logoSectionRef} className={styles.logoSection}>
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
          <Box ref={setSectionRef(0)} className={styles.section}>
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
          <Box ref={setSectionRef(1)} className={styles.section}>
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
          <Box ref={setSectionRef(2)} className={styles.section}>
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
          <Box ref={setSectionRef(3)} className={styles.subscribeSection}>
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
        <Divider ref={dividerRef} className={styles.divider} />

        {/* Bottom bar */}
        <Box ref={bottomBarRef} className={styles.bottomBar}>
          <Typography variant="body2" className={styles.copyright}>
            © {new Date().getFullYear()} DevSpace. All Rights Reserved.
          </Typography>

          <Box className={styles.socialIcons}>
            {[InstagramIcon, LinkedInIcon, GitHubIcon].map(
              (Icon, i) => (
                <IconButton
                  key={i}
                  ref={setSocialIconRef(i)}
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
