import { Box, Container, Typography } from "@mui/material";
import LogoSlider from "../../components/common/logoSlider/LogoSlider";
import teckStackLogo from "../../constants/teckStackLogo.json";
import ProjectAccordion from "./components/projectAccordion/ProjectAccordion";
import styles from "./projectsPage.module.scss";

function ProjectsPage() {
  return (
    <Container maxWidth="xl" className={styles.projectsPage}>
      <Box className={styles.header}>
        <Typography variant="h4" component="h1" className={styles.pageTitle}>
          My Projects
        </Typography>
      </Box>

      <Box className={styles.content}>
        <LogoSlider logos={teckStackLogo} />
        <ProjectAccordion />
      </Box>
    </Container>
  );
}

export default ProjectsPage;
