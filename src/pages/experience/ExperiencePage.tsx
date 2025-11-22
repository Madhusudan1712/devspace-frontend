import { Box, Container, Typography } from "@mui/material";
import ExperienceTree from "./components/experienceTree/ExperienceTree";
import styles from "./experiencePage.module.scss";

function ExperiencePage() {
  return (
    <Container maxWidth="xl" className={styles.experiencePage}>
      <Box className={styles.header}>
        <Typography variant="h4" component="h1" className={styles.pageTitle}>
          Work Experience
        </Typography>
      </Box>

      <Box className={styles.content}>
        <ExperienceTree />
      </Box>
    </Container>
  );
}

export default ExperiencePage;