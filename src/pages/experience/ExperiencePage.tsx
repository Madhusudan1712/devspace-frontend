import { useEffect, useRef, useLayoutEffect, forwardRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@iconify/react";
import Loading from "../../components/common/loading/Loading";
import ExperienceTree, { exampleExperienceGroups } from "./components/experienceTree/ExperienceTree";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchCurrentUser } from "../../features/auth/authThunks";
import styles from "./experiencePage.module.scss";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Calculate experience stats dynamically
const calculateStats = () => {
  const allRoles = exampleExperienceGroups.flatMap(g => g.roles);
  const totalCompanies = exampleExperienceGroups.length;
  const totalRoles = allRoles.length;
  
  // Calculate total years (approximate)
  const currentDate = new Date();
  const earliestRole = allRoles.reduce((earliest, role) => {
    const startDate = new Date(role.start);
    return startDate < earliest ? startDate : earliest;
  }, currentDate);
  const yearsExp = Math.max(1, Math.floor((currentDate.getTime() - earliestRole.getTime()) / (365.25 * 24 * 60 * 60 * 1000)));

  return [
    { id: "years", value: yearsExp, suffix: "+", label: "Years Experience", icon: "ph:calendar-check-duotone" },
    { id: "companies", value: totalCompanies, suffix: "", label: "Companies", icon: "ph:buildings-duotone" },
    { id: "roles", value: totalRoles, suffix: "", label: "Roles Held", icon: "ph:briefcase-duotone" },
    { id: "projects", value: 10, suffix: "+", label: "Projects Delivered", icon: "ph:rocket-launch-duotone" },
  ];
};

const experienceStats = calculateStats();

// Highlight cards data
const highlightCards = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "React, TypeScript, Redux, MUI, GSAP, and modern UI/UX patterns",
    icon: "ph:browser-duotone",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Spring Boot, Node.js, REST APIs, PostgreSQL, MongoDB",
    icon: "ph:database-duotone",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    description: "Docker, AWS S3, CI/CD pipelines, Nginx, deployment automation",
    icon: "ph:cloud-duotone",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
];

// Forward ref wrapper for ExperienceTree
const AnimatedExperienceTree = forwardRef<HTMLDivElement, object>((_, ref) => (
  <Box ref={ref}>
    <ExperienceTree />
  </Box>
));
AnimatedExperienceTree.displayName = "AnimatedExperienceTree";

function ExperiencePage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const highlightRefs = useRef<(HTMLDivElement | null)[]>([]);

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
                const targetValue = experienceStats[index].value;
                gsap.fromTo(
                  { val: 0 },
                  { val: targetValue },
                  {
                    val: targetValue,
                    duration: 1.5,
                    delay: 0.2 + index * 0.1,
                    ease: "power2.out",
                    onUpdate: function () {
                      valueEl.textContent = Math.floor(this.targets()[0].val) + experienceStats[index].suffix;
                    },
                  }
                );
              }
            });
          },
        });
      }

      // Highlight cards animation
      highlightRefs.current.forEach((card, index) => {
        if (!card) return;

        gsap.set(card, {
          opacity: 0,
          y: 60,
          scale: 0.92,
          rotationY: 10,
          transformPerspective: 1200,
          transformOrigin: "center center",
        });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: 0.7,
              delay: index * 0.12,
              ease: "power3.out",
            });
          },
        });

        // Hover animation setup
        const handleMouseEnter = () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
            duration: 0.35,
            ease: "power2.out",
          });
          gsap.to(card.querySelector(`.${styles.highlightIcon}`), {
            scale: 1.15,
            rotation: 8,
            duration: 0.35,
            ease: "back.out(1.7)",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
            duration: 0.35,
            ease: "power2.inOut",
          });
          gsap.to(card.querySelector(`.${styles.highlightIcon}`), {
            scale: 1,
            rotation: 0,
            duration: 0.35,
            ease: "power2.inOut",
          });
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);
      });

      // Experience tree scroll-triggered animation
      if (treeRef.current) {
        gsap.set(treeRef.current, {
          opacity: 0,
          y: 50,
        });

        ScrollTrigger.create({
          trigger: treeRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(treeRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });

            // Animate timeline groups
            const groups = treeRef.current?.querySelectorAll('li');
            if (groups) {
              gsap.fromTo(
                groups,
                {
                  opacity: 0,
                  x: -40,
                },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.6,
                  stagger: 0.15,
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
    <Container ref={containerRef} maxWidth="xl" className={styles.experiencePage}>
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
            <Icon icon="ph:briefcase-duotone" className={styles.titleIcon} />
            <span className={styles.titleText}>Work Experience</span>
          </Typography>

          <Typography
            ref={subtitleRef}
            variant="body1"
            className={styles.heroSubtitle}
          >
            A journey through my professional career, showcasing roles, 
            accomplishments, and the technologies I've mastered along the way.
          </Typography>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box ref={statsContainerRef} className={styles.statsSection}>
        <Box className={styles.statsGrid}>
          {experienceStats.map((stat, index) => (
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

      {/* Skills Highlight Section */}
      <Box className={styles.highlightsSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h5" component="h2" className={styles.sectionTitle}>
            Core Expertise
          </Typography>
          <Typography className={styles.sectionSubtitle}>
            Key areas of technical proficiency developed through hands-on experience
          </Typography>
        </Box>

        <Box className={styles.highlightsGrid}>
          {highlightCards.map((card, index) => (
            <Box
              key={card.id}
              ref={(el: HTMLDivElement | null) => {
                highlightRefs.current[index] = el;
              }}
              className={styles.highlightCard}
            >
              <Box
                className={styles.highlightGradient}
                style={{ background: card.gradient }}
              />
              <Box className={styles.highlightContent}>
                <Box className={styles.highlightIconWrapper}>
                  <Icon icon={card.icon} className={styles.highlightIcon} />
                </Box>
                <Typography variant="h6" className={styles.highlightTitle}>
                  {card.title}
                </Typography>
                <Typography className={styles.highlightDescription}>
                  {card.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Experience Timeline Section */}
      <Box className={styles.timelineSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h5" component="h2" className={styles.sectionTitle}>
            Career Timeline
          </Typography>
          <Typography className={styles.sectionSubtitle}>
            My professional journey from the beginning to present
          </Typography>
        </Box>
        <AnimatedExperienceTree ref={treeRef} />
      </Box>
    </Container>
  );
}

export default ExperiencePage;
