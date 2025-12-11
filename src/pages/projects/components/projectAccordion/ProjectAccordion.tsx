import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import { ProjectData, sampleProjects } from "./projectData";
import styles from "./projectAccordion.module.scss";

interface ProjectAccordionProps {
  projects?: ProjectData[];
}

const ProjectAccordion = ({
  projects = sampleProjects,
}: ProjectAccordionProps) => {
  // Initially expand first 2 projects
  const [expanded, setExpanded] = useState<string[]>(["1", "2"]);

  const handleChange = (projectId: string) => {
    setExpanded((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const getStatusClass = (status: ProjectData["status"]) => {
    switch (status) {
      case "dev":
        return styles.statusDev;
      case "stg":
        return styles.statusStg;
      case "prod":
        return styles.statusProd;
      case "local":
        return styles.statusLocal;
      default:
        return "";
    }
  };

  const getStatusLabel = (status: ProjectData["status"]) => {
    switch (status) {
      case "dev":
        return "Development";
      case "stg":
        return "Staging";
      case "prod":
        return "Production";
      case "local":
        return "Localhost";
      default:
        return status;
    }
  };

  return (
    <Box className={styles.accordionContainer}>
      {projects.map((project) => (
        <Accordion
          key={project.id}
          expanded={expanded.includes(project.id)}
          onChange={() => handleChange(project.id)}
          className={styles.accordion}
          disableGutters
          elevation={0}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`project-${project.id}-content`}
            id={`project-${project.id}-header`}
            className={styles.accordionSummary}
          >
            <Box className={styles.headerContent}>
              <Typography
                variant="h6"
                component="h3"
                className={styles.projectTitle}
              >
                {project.title}
              </Typography>
              <Box
                className={`${styles.statusBadge} ${getStatusClass(
                  project.status
                )}`}
              >
                {getStatusLabel(project.status)}
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails className={styles.accordionDetails}>
            {/* Tech Stack Section */}
            <Box className={styles.section}>
              <Typography variant="subtitle2" className={styles.sectionLabel}>
                Technologies
              </Typography>
              <Box className={styles.techStack}>
                {project.techStack.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    size="small"
                    className={styles.techChip}
                  />
                ))}
              </Box>
            </Box>

            {/* Description Section */}
            <Box className={styles.section}>
              <Typography variant="subtitle2" className={styles.sectionLabel}>
                Description
              </Typography>
              <Box component="ul" className={styles.descriptionList}>
                {project.description.map((item, index) => (
                  <Box
                    component="li"
                    key={index}
                    className={styles.descriptionItem}
                  >
                    <Typography variant="body2" className={styles.description}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Links Section */}
            {(project.links.github || project.links.app) && (
              <Box className={styles.section}>
                <Typography variant="subtitle2" className={styles.sectionLabel}>
                  Links
                </Typography>

                <Box className={styles.links}>
                  {/* GitHub Links */}
                  {project.links.github &&
                    Array.isArray(project.links.github) &&
                    project.links.github.map((repo, idx) => (
                      <Tooltip key={idx} title="View on GitHub" arrow>
                        <Box
                          component="a"
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.linkButton}
                        >
                          <GitHubIcon />
                          <Typography
                            variant="body2"
                            className={styles.linkText}
                          >
                            {repo.label}
                          </Typography>
                        </Box>
                      </Tooltip>
                    ))}

                  {/* Live App */}
                  {project.links.app && (
                    <Tooltip title="Open Application" arrow>
                      <Box
                        component="a"
                        className={styles.linkButton}
                        href={project.links.app}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Live application"
                      >
                        <LaunchIcon />
                        <Typography variant="body2" className={styles.linkText}>
                          Live App
                        </Typography>
                      </Box>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ProjectAccordion;
