// src/components/Loading/Loading.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './loading.module.scss';

const Loading = () => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const dotsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Backdrop fade in
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      // Dialog pop-in with elastic effect
      gsap.fromTo(
        dialogRef.current,
        { scale: 0.5, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.15,
          ease: 'back.out(1.7)',
        }
      );

      // Spinner pulse effect
      gsap.to(spinnerRef.current, {
        scale: 1.1,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Text fade in
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.4, ease: 'power2.out' }
      );

      // Animated dots
      gsap.to(dotsRef.current, {
        opacity: 0.3,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={backdropRef} className={styles.backdrop}>
      <div ref={dialogRef} className={styles.dialog}>
        <div ref={spinnerRef} className={styles.spinner}></div>
        <p ref={textRef} className={styles.text}>
          Loading<span ref={dotsRef} className={styles.dots}>...</span>
        </p>
      </div>
    </div>
  );
};

export default Loading;