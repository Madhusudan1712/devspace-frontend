import { useEffect, useRef, useLayoutEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@iconify/react";
import Loading from "../../components/common/loading/Loading";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchCurrentUser } from "../../features/auth/authThunks";
import StreamCard from "./components/streamCard/StreamCard";
import { sampleCards } from "./components/streamCard/streamData";
import styles from "./streamPage.module.scss";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Stats data for articles
const articleStats = [
  { id: "total", value: sampleCards.length, suffix: "", label: "Total Articles", icon: "ph:article-duotone" },
  { id: "new", value: sampleCards.filter(c => c.badge === "NEW").length, suffix: "", label: "New This Week", icon: "ph:star-duotone" },
  { id: "popular", value: sampleCards.filter(c => c.badge === "Popular").length, suffix: "", label: "Popular Posts", icon: "ph:fire-duotone" },
  { id: "authors", value: [...new Set(sampleCards.map(c => c.author.name))].length, suffix: "", label: "Contributors", icon: "ph:users-duotone" },
];

// Category highlight cards
const categoryCards = [
  {
    id: "tutorials",
    title: "Tutorials",
    description: "Step-by-step guides to help you master new technologies and concepts",
    icon: "ph:graduation-cap-duotone",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "insights",
    title: "Tech Insights",
    description: "Deep dives into modern development practices and industry trends",
    icon: "ph:lightbulb-duotone",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "tips",
    title: "Quick Tips",
    description: "Bite-sized productivity boosters and coding shortcuts for developers",
    icon: "ph:lightning-duotone",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
];

function StreamPage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      console.log("User Info:", user);
    }
  }, [user]);

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
                const targetValue = articleStats[index].value;
                gsap.fromTo(
                  { val: 0 },
                  { val: targetValue },
                  {
                    val: targetValue,
                    duration: 1.5,
                    delay: 0.2 + index * 0.1,
                    ease: "power2.out",
                    onUpdate: function () {
                      valueEl.textContent = Math.floor(this.targets()[0].val) + articleStats[index].suffix;
                    },
                  }
                );
              }
            });
          },
        });
      }

      // Category cards animation
      categoryRefs.current.forEach((card, index) => {
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
          gsap.to(card.querySelector(`.${styles.categoryIcon}`), {
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
          gsap.to(card.querySelector(`.${styles.categoryIcon}`), {
            scale: 1,
            rotation: 0,
            duration: 0.35,
            ease: "power2.inOut",
          });
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);
      });

      // Stream cards staggered entrance with scroll trigger
      const visibleCards = cardRefs.current.filter(card => card !== null);

      visibleCards.forEach((card, index) => {
        if (!card) return;

        gsap.set(card, {
          opacity: 0,
          y: 80,
          scale: 0.9,
          rotationX: 12,
          transformPerspective: 1200,
          transformOrigin: "center top",
        });

        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: 0.8,
              delay: index * 0.1,
              ease: "power3.out",
            });
          },
        });

        // Subtle parallax effect on scroll
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          onUpdate: (self) => {
            const yOffset = (self.progress - 0.5) * -20;
            gsap.set(card, { y: yOffset });
          },
        });
      });

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
    <Container ref={containerRef} maxWidth="xl" className={styles.streamPage}>
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
            <Icon icon="ph:newspaper-duotone" className={styles.titleIcon} />
            <span className={styles.titleText}>Latest Articles</span>
          </Typography>

          <Typography
            ref={subtitleRef}
            variant="body1"
            className={styles.heroSubtitle}
          >
            Stay updated with curated articles, tutorials, and insights about 
            modern web development, best practices, and emerging technologies.
          </Typography>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box ref={statsContainerRef} className={styles.statsSection}>
        <Box className={styles.statsGrid}>
          {articleStats.map((stat, index) => (
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

      {/* Categories Section */}
      <Box className={styles.categoriesSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h5" component="h2" className={styles.sectionTitle}>
            Browse by Category
          </Typography>
          <Typography className={styles.sectionSubtitle}>
            Find content that matches your interests and learning goals
          </Typography>
        </Box>

        <Box className={styles.categoriesGrid}>
          {categoryCards.map((card, index) => (
            <Box
              key={card.id}
              ref={(el: HTMLDivElement | null) => {
                categoryRefs.current[index] = el;
              }}
              className={styles.categoryCard}
            >
              <Box
                className={styles.categoryGradient}
                style={{ background: card.gradient }}
              />
              <Box className={styles.categoryContent}>
                <Box className={styles.categoryIconWrapper}>
                  <Icon icon={card.icon} className={styles.categoryIcon} />
                </Box>
                <Typography variant="h6" className={styles.categoryTitle}>
                  {card.title}
                </Typography>
                <Typography className={styles.categoryDescription}>
                  {card.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Articles Section */}
      <Box className={styles.articlesSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h5" component="h2" className={styles.sectionTitle}>
            Featured Articles
          </Typography>
          <Typography className={styles.sectionSubtitle}>
            Explore our latest content, handpicked for developers and tech enthusiasts
          </Typography>
        </Box>

        <Box className={styles.cardGrid}>
          {sampleCards.map((card, index) => (
            <StreamCard
              key={card.id}
              ref={(el: HTMLDivElement | null) => { cardRefs.current[index] = el; }}
              data={card}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default StreamPage;
