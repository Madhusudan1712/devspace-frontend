import { useEffect, useRef, useLayoutEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@iconify/react";
import Loading from "../../components/common/loading/Loading";
import AppButton from "../../components/common/button/AppButton";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchCurrentUser } from "../../features/auth/authThunks";
import styles from "./homePage.module.scss";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Feature cards data
const featureCards = [
  {
    id: "stream",
    title: "Latest Articles",
    description: "Explore curated articles, tutorials, and insights about modern web development.",
    icon: "ph:newspaper-duotone",
    path: "/stream",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "projects",
    title: "My Projects",
    description: "Discover innovative projects built with cutting-edge technologies.",
    icon: "ph:code-duotone",
    path: "/projects",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "experience",
    title: "Work Experience",
    description: "Professional journey through various roles and accomplishments.",
    icon: "ph:briefcase-duotone",
    path: "/experience",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
];

// Stats data
const statsData = [
  { id: "years", value: 2, suffix: "+", label: "Years Experience", icon: "ph:calendar-check-duotone" },
  { id: "projects", value: 10, suffix: "+", label: "Projects Built", icon: "ph:folder-open-duotone" },
  { id: "tech", value: 15, suffix: "+", label: "Technologies", icon: "ph:cpu-duotone" },
  { id: "commits", value: 500, suffix: "+", label: "Git Commits", icon: "ph:git-branch-duotone" },
];

function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.auth);

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
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

      // Title entrance with split text effect
      if (titleRef.current) {
        heroTl.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 80,
            scale: 0.85,
            filter: "blur(20px)",
            rotationX: 45,
            transformPerspective: 1200,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            rotationX: 0,
            duration: 1,
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
            y: 40,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          0.5
        );
      }

      // CTA buttons entrance
      if (ctaRef.current) {
        heroTl.fromTo(
          ctaRef.current.children,
          {
            opacity: 0,
            y: 30,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "back.out(1.5)",
          },
          0.7
        );
      }

      // Feature cards scroll-triggered animation
      featureRefs.current.forEach((card, index) => {
        if (!card) return;

        gsap.set(card, {
          opacity: 0,
          y: 80,
          scale: 0.9,
          rotationY: 15,
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
              duration: 0.8,
              delay: index * 0.15,
              ease: "power3.out",
            });
          },
        });

        // Hover animation setup
        const handleMouseEnter = () => {
          gsap.to(card, {
            y: -12,
            scale: 1.03,
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
            duration: 0.4,
            ease: "power2.out",
          });
          gsap.to(card.querySelector(`.${styles.featureIcon}`), {
            scale: 1.2,
            rotation: 10,
            duration: 0.4,
            ease: "back.out(1.7)",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            duration: 0.4,
            ease: "power2.inOut",
          });
          gsap.to(card.querySelector(`.${styles.featureIcon}`), {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "power2.inOut",
          });
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);
      });

      // Stats counter animation
      if (statsContainerRef.current) {
        ScrollTrigger.create({
          trigger: statsContainerRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            statRefs.current.forEach((stat, index) => {
              if (!stat) return;

              // Entrance animation
              gsap.fromTo(
                stat,
                {
                  opacity: 0,
                  y: 50,
                  scale: 0.8,
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
                const targetValue = statsData[index].value;
                gsap.fromTo(
                  { val: 0 },
                  { val: targetValue },
                  {
                    val: targetValue,
                    duration: 2,
                    delay: 0.3 + index * 0.1,
                    ease: "power2.out",
                    onUpdate: function () {
                      valueEl.textContent = Math.floor(this.targets()[0].val) + statsData[index].suffix;
                    },
                  }
                );
              }
            });
          },
        });
      }

      // Floating animation for decorative elements
      gsap.to(".floatingDecor", {
        y: -20,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (loading) return <Loading />;

  return (
    <Container ref={containerRef} maxWidth="xl" className={styles.homePage}>
      {/* Hero Section */}
      <Box ref={heroRef} className={styles.hero}>
        {/* Decorative Background */}
        <Box ref={decorRef} className={styles.heroDecor}>
          <Box className={`${styles.decorShape} ${styles.shape1} decorShape floatingDecor`} />
          <Box className={`${styles.decorShape} ${styles.shape2} decorShape floatingDecor`} />
          <Box className={`${styles.decorShape} ${styles.shape3} decorShape floatingDecor`} />
          <Box className={`${styles.decorShape} ${styles.shape4} decorShape floatingDecor`} />
        </Box>

        <Box className={styles.heroContent}>
          <Typography
            ref={titleRef}
            variant="h1"
            component="h1"
            className={styles.heroTitle}
          >
            <span className={styles.greeting}>Hello, I'm</span>
            <span className={styles.name}>{user?.name || "Developer"}</span>
            <span className={styles.role}>Full-Stack Engineer</span>
          </Typography>

          <Typography
            ref={subtitleRef}
            variant="body1"
            className={styles.heroSubtitle}
          >
            Crafting elegant solutions with modern technologies. Passionate about 
            building scalable applications, exploring new frameworks, and turning 
            complex problems into intuitive user experiences.
          </Typography>

          <Box ref={ctaRef} className={styles.ctaButtons}>
            <AppButton
              variant="primary"
              onClick={() => handleNavigation("/projects")}
              startIcon={<Icon icon="ph:rocket-launch-duotone" />}
            >
              View Projects
            </AppButton>
            <AppButton
              variant="outline"
              onClick={() => handleNavigation("/experience")}
              startIcon={<Icon icon="ph:user-circle-duotone" />}
            >
              My Journey
            </AppButton>
          </Box>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box ref={statsContainerRef} className={styles.statsSection}>
        <Box className={styles.statsGrid}>
          {statsData.map((stat, index) => (
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

      {/* Features Section */}
      <Box className={styles.featuresSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h4" component="h2" className={styles.sectionTitle}>
            Explore My Space
          </Typography>
          <Typography className={styles.sectionSubtitle}>
            Discover my work, projects, and professional experience
          </Typography>
        </Box>

        <Box className={styles.featuresGrid}>
          {featureCards.map((feature, index) => (
            <Box
              key={feature.id}
              ref={(el: HTMLDivElement | null) => {
                featureRefs.current[index] = el;
              }}
              className={styles.featureCard}
              onClick={() => handleNavigation(feature.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleNavigation(feature.path);
                }
              }}
            >
              <Box
                className={styles.featureGradient}
                style={{ background: feature.gradient }}
              />
              <Box className={styles.featureContent}>
                <Box className={styles.featureIconWrapper}>
                  <Icon icon={feature.icon} className={styles.featureIcon} />
                </Box>
                <Typography variant="h5" className={styles.featureTitle}>
                  {feature.title}
                </Typography>
                <Typography className={styles.featureDescription}>
                  {feature.description}
                </Typography>
                <Box className={styles.featureArrow}>
                  <Icon icon="ph:arrow-right-bold" />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;
