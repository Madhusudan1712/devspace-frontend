import { Box, Typography, Button, IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import styles from './streamCard.module.scss';
import { StreamData } from './streamData';

interface StreamCardProps {
  data: StreamData;
  className?: string;
}

const StreamCard = ({ data, className }: StreamCardProps) => {
  const handlePrimaryAction = () => {
    if (data.primaryAction.onClick) {
      data.primaryAction.onClick();
    }
  };

  const handleSecondaryAction = () => {
    if (data.secondaryAction?.onClick) {
      data.secondaryAction.onClick();
    }
  };

  return (
    <Box className={`${styles.card} ${className || ''}`}>
      {/* Top section: Image with gradient overlay and wave bottom */}
      <Box className={styles.imageSection}>
        <Box className={styles.imageWrapper}>
          <img 
            src={data.imageUrl} 
            alt={data.title} 
            className={styles.image}
          />
          <Box className={styles.gradientOverlay} />
          {data.badge && (
            <Box className={styles.badge} aria-label={`Badge: ${data.badge}`}>
              {data.badge}
            </Box>
          )}
        </Box>
        <Box className={styles.waveShape} />
      </Box>

      {/* Bottom section: White container with content */}
      <Box className={styles.contentSection}>
        <Typography 
          variant="h4" 
          component="h2" 
          className={styles.title}
        >
          {data.title}
        </Typography>

        <Typography 
          variant="body1" 
          className={styles.description}
        >
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
                  {data.publishedDate.day}th {data.publishedDate.month} {data.publishedDate.year}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box className={styles.actionButtons}>
            <Button 
              variant="contained" 
              className={styles.moreButton}
              onClick={handlePrimaryAction}
              aria-label={data.primaryAction.label}
            >
              {data.primaryAction.label}
            </Button>
            
            {data.secondaryAction && (
              <IconButton 
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
  );
};

export default StreamCard;

