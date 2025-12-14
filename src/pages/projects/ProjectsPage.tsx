import { useEffect, useRef, useLayoutEffect, forwardRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@iconify/react";
import Loading from "../../components/common/loading/Loading";
import LogoSlider from "../../components/common/logoSlider/LogoSlider";
import teckStackLogo from "../../constants/teckStackLogo.json";
import ProjectAccordion from "./components/projectAccordion/ProjectAccordion";
import { sampleProjects } from "./components/projectAccordion/projectData";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchCurrentUser } from "../../features/auth/authThunks";
import styles from "./projectsPage.module.scss";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Stats data for projects
const projectStats = [
  { id: "total", value: sampleProjects.length, suffix: "", label: "Total Projects", icon: "ph:folder-open-duotone" },
  { id: "prod", value: sampleProjects.filter(p => p.status === "prod").length, suffix: "", label: "In Production", icon: "ph:rocket-launch-duotone" },
  { id: "dev", value: sampleProjects.filter(p => p.status === "dev" || p.status === "stg").length, suffix: "", label: "In Development", icon: "ph:code-duotone" },
  { id: "tech", value: [...new Set(sampleProjects.flatMap(p => p.techStack))].length, suffix: "+", label: "Technologies", icon: "ph:cpu-duotone" },
];

// Forward ref wrapper for ProjectAccordion
const AnimatedProjectAccordion = forwardRef<HTMLDivElement, object>((_, ref) => (
  <Box ref={ref}>
    <ProjectAccordion />
  </Box>
));
AnimatedProjectAccordion.displayName = "AnimatedProjectAccordion";

function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [user, dispatch]);

  // GSAP Animations
  useLayoutEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Create master timeline for hero entrance
      const heroTl = gsap.timeline();

      // Decorative background animation
      if (decorRef.current) {
        heroTl.fromTo(
          decorRef.current.querySelectorAll(".decorShape"),
          {
            opacity: 0,
            scale: 0,
            rotation: -180,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          0
        );
      }

      // Title entrance with blur reveal
      if (titleRef.current) {
        heroTl.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 60,
            scale: 0.9,
            filter: "blur(15px)",
            rotationX: 30,
            transformPerspective: 1200,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            rotationX: 0,
            duration: 0.9,
            ease: "power4.out",
          },
          0.2
        );
      }

      // Subtitle fade in
      if (subtitleRef.current) {
        heroTl.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 30,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
          },
          0.4
        );
      }

      // Stats counter animation with scroll trigger
      if (statsContainerRef.current) {
        ScrollTrigger.create({
          trigger: statsContainerRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            statRefs.current.forEach((stat, index) => {
              if (!stat) return;

              // Entrance animation
              gsap.fromTo(
                stat,
                {
                  opacity: 0,
                  y: 40,
                  scale: 0.85,
                },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "back.out(1.5)",
                }
              );

              // Counter animation
              const valueEl = stat.querySelector(`.${styles.statValue}`);
              if (valueEl) {
                const targetValue = projectStats[index].value;
                gsap.fromTo(
                  { val: 0 },
                  { val: targetValue },
                  {
                    val: targetValue,
                    duration: 1.5,
                    delay: 0.2 + index * 0.1,
                    ease: "power2.out",
                    onUpdate: function () {
                      valueEl.textContent = Math.floor(this.targets()[0].val) + projectStats[index].suffix;
                    },
                  }
                );
              }
            });
          },
        });
      }

      // Logo slider animation
      if (sliderRef.current) {
        ScrollTrigger.create({
          trigger: sliderRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              sliderRef.current,
              {
                opacity: 0,
                y: 50,
                scale: 0.95,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
              }
            );
          },
        });
      }

      // Accordion scroll-triggered animation
      if (accordionRef.current) {
        gsap.set(accordionRef.current, {
          opacity: 0,
          y: 60,
        });

        ScrollTrigger.create({
          trigger: accordionRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(accordionRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });

            // Animate individual accordion items
            const accordionItems = accordionRef.current?.querySelectorAll('.MuiAccordion-root');
            if (accordionItems) {
              gsap.fromTo(
                accordionItems,
                {
                  opacity: 0,
                  x: -30,
                },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.6,
                  stagger: 0.12,
                  delay: 0.2,
                  ease: "power2.out",
                }
              );
            }
          },
        });
      }

      // Floating animation for decorative elements
      gsap.to(".floatingDecor", {
        y: -15,
        rotation: 3,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.4,
      });

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();
    }, containerRef);

    // Cleanup
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading]);

  if (loading) return <Loading />;

  return (
    <Container ref={containerRef} maxWidth="xl" className={styles.projectsPage}>
      {/* Hero Section */}
      <Box ref={heroRef} className={styles.hero}>
        {/* Decorative Background */}
        <Box ref={decorRef} className={styles.heroDecor}>
          <Box className={`${styles.decorShape} ${styles.shape1} decorShape floatingDecor`} />
          <Box className={`${styles.decorShape} ${styles.shape2} decorShape floatingDecor`} />
          <Box className={`${styles.decorShape} ${styles.shape3} decorShape floatingDecor`} />
        </Box>

        <Box className={styles.heroContent}>
          <Typography
            ref={titleRef}
            variant="h1"
            component="h1"
            className={styles.heroTitle}
          >
            <Icon icon="ph:code-duotone" className={styles.titleIcon} />
            <span className={styles.titleText}>My Projects</span>
          </Typography>

          <Typography
            ref={subtitleRef}
            variant="body1"
            className={styles.heroSubtitle}
          >
            Explore a collection of projects built with modern technologies, 
            from full-stack applications to innovative tools and solutions.
          </Typography>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box ref={statsContainerRef} className={styles.statsSection}>
        <Box className={styles.statsGrid}>
          {projectStats.map((stat, index) => (
            <Box
              key={stat.id}
              ref={(el: HTMLDivElement | null) => {
                statRefs.current[index] = el;
              }}
              className={styles.statCard}
            >
              <Box className={styles.statIconWrapper}>
                <Icon icon={stat.icon} className={styles.statIcon} />
              </Box>
              <Typography className={styles.statValue}>0{stat.suffix}</Typography>
              <Typography className={styles.statLabel}>{stat.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Tech Stack Slider */}
      <Box className={styles.sliderSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h5" component="h2" className={styles.sectionTitle}>
            Technologies I Work With
          </Typography>
        </Box>
        <Box ref={sliderRef} className={styles.sliderWrapper}>
          <LogoSlider logos={teckStackLogo} />
        </Box>
      </Box>

      {/* Projects Accordion */}
      <Box className={styles.projectsSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h5" component="h2" className={styles.sectionTitle}>
            Project Portfolio
          </Typography>
          <Typography className={styles.sectionSubtitle}>
            Click on each project to explore details, technologies, and live demos
          </Typography>
        </Box>
        <AnimatedProjectAccordion ref={accordionRef} />
      </Box>
    </Container>
  );
}

export default ProjectsPage;
