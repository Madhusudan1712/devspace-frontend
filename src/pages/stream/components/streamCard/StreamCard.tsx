import { useRef, useEffect, forwardRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import gsap from 'gsap';
import AppButton from '@/components/common/button/AppButton';
import styles from './streamCard.module.scss';
import { StreamData } from './streamData';

interface StreamCardProps {
  data: StreamData;
  className?: string;
  index?: number;
}

const StreamCard = forwardRef<HTMLDivElement, StreamCardProps>(
  ({ data, className }, forwardedRef) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const gradientRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const waveRef = useRef<HTMLDivElement>(null);
    const primaryBtnRef = useRef<HTMLButtonElement>(null);
    const shareBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const card = cardRef.current;
      const image = imageRef.current;
      const gradient = gradientRef.current;
      const badge = badgeRef.current;
      const title = titleRef.current;
      const content = contentRef.current;
      const wave = waveRef.current;

      if (!card) return;

      // Set initial state for 3D transforms
      gsap.set(card, { transformPerspective: 1200, transformStyle: 'preserve-3d' });

      // Hover animation handlers - orchestrated timeline
      const handleMouseEnter = () => {
        const tl = gsap.timeline();

        // Card lift and enhanced shadow with accent color glow
        tl.to(
          card,
          {
            scale: 1.03,
            boxShadow:
              '0 25px 50px rgba(0, 0, 0, 0.18), 0 12px 24px rgba(99, 102, 241, 0.15)',
            duration: 0.45,
            ease: 'power2.out',
          },
          0
        );

        // Image zoom with subtle Ken Burns effect
        if (image) {
          tl.to(
            image,
            {
              scale: 1.12,
              duration: 0.7,
              ease: 'power2.out',
            },
            0
          );
        }

        // Gradient overlay fade for more image visibility
        if (gradient) {
          tl.to(
            gradient,
            {
              opacity: 0.7,
              duration: 0.4,
              ease: 'power2.out',
            },
            0
          );
        }

        // Badge pop animation with enhanced shadow
        if (badge) {
          tl.to(
            badge,
            {
              scale: 1.15,
              y: -5,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
              duration: 0.35,
              ease: 'back.out(2.5)',
            },
            0.05
          );
        }

        // Wave shape subtle lift
        if (wave) {
          tl.to(
            wave,
            {
              y: -4,
              duration: 0.4,
              ease: 'power2.out',
            },
            0
          );
        }

        // Title color transition to primary
        if (title) {
          tl.to(
            title,
            {
              color: '#6366f1',
              duration: 0.3,
              ease: 'power2.out',
            },
            0.1
          );
        }

        // Content section lift for depth
        if (content) {
          tl.to(
            content,
            {
              y: -6,
              duration: 0.45,
              ease: 'power2.out',
            },
            0
          );
        }
      };

      const handleMouseLeave = () => {
        const tl = gsap.timeline();

        // Reset card to original state
        tl.to(
          card,
          {
            scale: 1,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          0
        );

        // Reset image
        if (image) {
          tl.to(
            image,
            {
              scale: 1,
              x: 0,
              y: 0,
              duration: 0.6,
              ease: 'power2.inOut',
            },
            0
          );
        }

        // Reset gradient
        if (gradient) {
          tl.to(
            gradient,
            {
              opacity: 1,
              duration: 0.4,
              ease: 'power2.inOut',
            },
            0
          );
        }

        // Reset badge
        if (badge) {
          tl.to(
            badge,
            {
              scale: 1,
              y: 0,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              duration: 0.35,
              ease: 'power2.inOut',
            },
            0
          );
        }

        // Reset wave
        if (wave) {
          tl.to(
            wave,
            {
              y: 0,
              duration: 0.4,
              ease: 'power2.inOut',
            },
            0
          );
        }

        // Reset title color
        if (title) {
          tl.to(
            title,
            {
              color: '#1a1a1a',
              duration: 0.3,
              ease: 'power2.inOut',
            },
            0
          );
        }

        // Reset content position
        if (content) {
          tl.to(
            content,
            {
              y: 0,
              duration: 0.45,
              ease: 'power2.inOut',
            },
            0
          );
        }
      };

      // 3D tilt effect with magnetic image follow
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate 3D rotation
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.4,
          ease: 'power2.out',
        });

        // Image parallax follow effect
        if (image) {
          const moveX = ((x - centerX) / centerX) * 10;
          const moveY = ((y - centerY) / centerY) * 6;
          gsap.to(image, {
            x: moveX,
            y: moveY,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('mousemove', handleMouseMove);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);

    const handlePrimaryAction = () => {
      // Enhanced button click animation with ripple effect
      if (primaryBtnRef.current) {
        gsap
          .timeline()
          .to(primaryBtnRef.current, {
            scale: 0.92,
            duration: 0.1,
            ease: 'power2.in',
          })
          .to(primaryBtnRef.current, {
            scale: 1.08,
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
            duration: 0.2,
            ease: 'back.out(2)',
          })
          .to(primaryBtnRef.current, {
            scale: 1,
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
            duration: 0.15,
            ease: 'power2.out',
          });
      }

      if (data.primaryAction.onClick) {
        data.primaryAction.onClick();
      }
    };

    const handleSecondaryAction = () => {
      // Share button click animation with rotation and bounce
      if (shareBtnRef.current) {
        gsap
          .timeline()
          .to(shareBtnRef.current, {
            scale: 0.85,
            rotation: -20,
            duration: 0.12,
            ease: 'power2.in',
          })
          .to(shareBtnRef.current, {
            scale: 1.2,
            rotation: 10,
            duration: 0.2,
            ease: 'back.out(2)',
          })
          .to(shareBtnRef.current, {
            scale: 1,
            rotation: 0,
            duration: 0.25,
            ease: 'elastic.out(1, 0.5)',
          });
      }

      if (data.secondaryAction?.onClick) {
        data.secondaryAction.onClick();
      }
    };

    return (
      <Box ref={forwardedRef} className={styles.cardWrapper}>
        <Box ref={cardRef} className={`${styles.card} ${className || ''}`}>
          {/* Top section: Image with gradient overlay and wave bottom */}
          <Box className={styles.imageSection}>
            <Box className={styles.imageWrapper}>
              <img
                ref={imageRef}
                src={data.imageUrl}
                alt={data.title}
                className={styles.image}
              />
              <Box ref={gradientRef} className={styles.gradientOverlay} />
              {data.badge && (
                <Box
                  ref={badgeRef}
                  className={styles.badge}
                  aria-label={`Badge: ${data.badge}`}
                >
                  {data.badge}
                </Box>
              )}
            </Box>
            <Box ref={waveRef} className={styles.waveShape} />
          </Box>

          {/* Bottom section: White container with content */}
          <Box ref={contentRef} className={styles.contentSection}>
            <Typography
              ref={titleRef}
              variant="h4"
              component="h2"
              className={styles.title}
            >
              {data.title}
            </Typography>

            <Typography variant="body1" className={styles.description}>
              {data.description}
            </Typography>

            {/* Bottom row: Author info on left, buttons on right */}
            <Box className={styles.bottomRow}>
              {/* Author and Date metadata */}
              <Box className={styles.metadata}>
                <Box className={styles.authorInfo}>
                  {data.author.avatar && (
                    <img
                      src={data.author.avatar}
                      alt={data.author.name}
                      className={styles.avatar}
                    />
                  )}
                  <Box className={styles.authorDetails}>
                    <Typography variant="body2" className={styles.authorName}>
                      {data.author.name}
                    </Typography>
                    <Typography variant="caption" className={styles.publishDate}>
                      {data.publishedDate.day}th {data.publishedDate.month}{' '}
                      {data.publishedDate.year}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Action buttons */}
              <Box className={styles.actionButtons}>
                <AppButton
                  ref={primaryBtnRef}
                  variant="primary"
                  className={styles.moreButton}
                  onClick={handlePrimaryAction}
                  aria-label={data.primaryAction.label}
                >
                  {data.primaryAction.label}
                </AppButton>

                {data.secondaryAction && (
                  <IconButton
                    ref={shareBtnRef}
                    className={styles.shareButton}
                    onClick={handleSecondaryAction}
                    aria-label="Share"
                  >
                    <ShareIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
);

StreamCard.displayName = 'StreamCard';

export default StreamCard;
