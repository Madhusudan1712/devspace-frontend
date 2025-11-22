import { Box, Container, Typography } from "@mui/material";
import styles from "./homePage.module.scss";

function HomePage() {
  return (
    <Container maxWidth="xl" className={styles.homePage}>
      <Box className={styles.header}>
        <Typography variant="h4" component="h1" className={styles.pageTitle}>
          Welcome
        </Typography>
      </Box>

      <Box className={styles.content}>
        {/* Home page content goes here */}
      </Box>
    </Container>
  );
}

export default HomePage;