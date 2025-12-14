import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface UseStreamAnimationsOptions {
  /** Delay before animations start (in seconds) */
  initialDelay?: number;
  /** Duration of each card animation (in seconds) */
  duration?: number;
  /** Stagger delay between cards (in seconds) */
  stagger?: number;
  /** Enable scroll-triggered animations for cards below fold */
  enableScrollTrigger?: boolean;
}

interface UseStreamAnimationsReturn {
  containerRef: RefObject<HTMLDivElement | null>;
  headerRef: RefObject<HTMLDivElement | null>;
  cardRefs: RefObject<(HTMLDivElement | null)[]>;
  addCardRef: (index: number) => (el: HTMLDivElement | null) => void;
}

/**
 * Custom hook for orchestrating GSAP animations on the Stream page
 * Provides entrance animations, scroll triggers, and smooth reveals
 */
export const useStreamAnimations = (
  cardCount: number,
  options: UseStreamAnimationsOptions = {}
): UseStreamAnimationsReturn => {
  const {
    initialDelay = 0.2,
    duration = 0.8,
    stagger = 0.15,
    enableScrollTrigger = true,
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Helper to add card refs
  const addCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - hide elements
      if (headerRef.current) {
        gsap.set(headerRef.current, {
          opacity: 0,
          y: -30,
        });
      }

      // Set initial state for all cards
      cardRefs.current.forEach((card) => {
        if (card) {
          gsap.set(card, {
            opacity: 0,
            y: 60,
            scale: 0.95,
          });
        }
      });

      // Create master timeline for entrance animations
      const masterTl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
          duration,
        },
      });

      // Animate header first
      if (headerRef.current) {
        masterTl.to(
          headerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          initialDelay
        );
      }

      // Get cards that are in viewport initially
      const viewportHeight = window.innerHeight;
      const cardsInView: HTMLDivElement[] = [];
      const cardsOutOfView: HTMLDivElement[] = [];

      cardRefs.current.forEach((card) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          if (rect.top < viewportHeight) {
            cardsInView.push(card);
          } else {
            cardsOutOfView.push(card);
          }
        }
      });

      // Animate cards in viewport with stagger
      if (cardsInView.length > 0) {
        masterTl.to(
          cardsInView,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: {
              each: stagger,
              ease: 'power2.out',
            },
            ease: 'power3.out',
          },
          '-=0.3'
        );
      }

      // Set up ScrollTrigger for cards below the fold
      if (enableScrollTrigger && cardsOutOfView.length > 0) {
        cardsOutOfView.forEach((card) => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 60%',
              toggleActions: 'play none none none',
            },
          });
        });
      }
    }, containerRef);

    // Cleanup
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [cardCount, initialDelay, duration, stagger, enableScrollTrigger]);

  return {
    containerRef,
    headerRef,
    cardRefs,
    addCardRef,
  };
};

/**
 * Hook for individual card hover and click animations
 */
export const useCardAnimations = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const badge = badgeRef.current;

    let hoverTl: gsap.core.Timeline | null = null;

    const handleMouseEnter = () => {
      hoverTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Subtle lift effect
      hoverTl.to(card, {
        y: -8,
        duration: 0.3,
      });

      // Image zoom effect
      if (image) {
        hoverTl.to(
          image.querySelector('img'),
          {
            scale: 1.05,
            duration: 0.5,
          },
          0
        );
      }

      // Badge pulse
      if (badge) {
        hoverTl.to(
          badge,
          {
            scale: 1.1,
            duration: 0.3,
          },
          0
        );
      }

      // Content subtle shift
      if (content) {
        hoverTl.to(
          content,
          {
            y: -2,
            duration: 0.3,
          },
          0
        );
      }
    };

    const handleMouseLeave = () => {
      if (hoverTl) {
        hoverTl.kill();
      }

      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });

      if (image) {
        gsap.to(image.querySelector('img'), {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      }

      if (badge) {
        gsap.to(badge, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      if (content) {
        gsap.to(content, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (hoverTl) hoverTl.kill();
    };
  }, []);

  // Button click animation
  const animateButtonClick = (button: HTMLElement) => {
    gsap.timeline()
      .to(button, {
        scale: 0.92,
        duration: 0.1,
        ease: 'power2.in',
      })
      .to(button, {
        scale: 1,
        duration: 0.2,
        ease: 'elastic.out(1, 0.5)',
      });
  };

  // Share button ripple effect
  const animateShareClick = (button: HTMLElement) => {
    gsap.timeline()
      .to(button, {
        rotation: 15,
        duration: 0.15,
        ease: 'power2.out',
      })
      .to(button, {
        rotation: -10,
        duration: 0.1,
      })
      .to(button, {
        rotation: 0,
        duration: 0.2,
        ease: 'elastic.out(1, 0.5)',
      });
  };

  return {
    cardRef,
    imageRef,
    contentRef,
    badgeRef,
    buttonRef,
    animateButtonClick,
    animateShareClick,
  };
};

export default useStreamAnimations;


