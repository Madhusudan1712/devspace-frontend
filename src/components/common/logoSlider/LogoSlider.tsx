import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './logoSlider.module.scss';

export type LogoItem = {
	id: string;
	alt: string;
	href?: string;
};

type SpeedProp = number | `${number}s` | `${number}ms`;

export type LogoSliderProps = {
	logos: LogoItem[];
	speed?: SpeedProp;
	pauseOnHover?: boolean;
	visibleCount?: number;
	gap?: number;
	ariaLabel?: string;
	useCssFallback?: boolean;
	className?: string;
};

export const TECH_STACK_ICONS: Record<string, string> = {
	javascript: 'simple-icons:javascript',
	react: 'simple-icons:react',
	bootstrap: 'simple-icons:bootstrap',
	java: 'logos:java',
	spring: 'simple-icons:spring',
	nodejs: 'simple-icons:nodedotjs',
	mongodb: 'simple-icons:mongodb',
	postgresql: 'simple-icons:postgresql',
	mysql: 'simple-icons:mysql',
	docker: 'simple-icons:docker',
	kubernetes: 'simple-icons:kubernetes',
	git: 'simple-icons:git',
	aws: 'simple-icons:amazonaws',
	csharp: 'simple-icons:csharp'
};

const DEFAULT_SPEED_PX_S = 60;

function parseDurationToSeconds(duration: `${number}s` | `${number}ms`): number {
	if (duration.endsWith('ms')) {
		const ms = parseFloat(duration.slice(0, -2));
		return isNaN(ms) ? 0 : ms / 1000;
	}
	if (duration.endsWith('s')) {
		const s = parseFloat(duration.slice(0, -1));
		return isNaN(s) ? 0 : s;
	}
	return 0;
}

export function LogoSlider({
	logos,
	speed = DEFAULT_SPEED_PX_S,
	pauseOnHover = true,
	visibleCount = 6,
	gap = 2,
	ariaLabel = 'Logo slider',
	useCssFallback = false,
	className
}: LogoSliderProps) {
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<HTMLDivElement | null>(null);

	const [isHovering, setIsHovering] = useState(false);
	const [isFocusWithin, setIsFocusWithin] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [isInteracting, setIsInteracting] = useState(false);

	const [halfWidth, setHalfWidth] = useState(0);
	const pxPerSecondRef = useRef<number>(typeof speed === 'number' ? speed : DEFAULT_SPEED_PX_S);
	const rafRef = useRef<number | null>(null);
	const lastTsRef = useRef<number | null>(null);
	const resumeTimerRef = useRef<number | null>(null);
	const pointerStartXRef = useRef<number>(0);
	const scrollStartRef = useRef<number>(0);

	const paused = (pauseOnHover && isHovering) || isFocusWithin || isDragging || isInteracting;

	const doubledLogos = useMemo(() => {
		if (!logos || logos.length === 0) return [];
		return [...logos, ...logos];
	}, [logos]);

	const measure = useCallback(() => {
		const track = trackRef.current;
		if (!track) return;
		const total = track.scrollWidth;
		const half = Math.floor(total / 2);
		setHalfWidth(half);

		if (typeof speed === 'string') {
			const seconds = parseDurationToSeconds(speed);
			if (seconds > 0 && half > 0) {
				pxPerSecondRef.current = half / seconds;
			}
		} else if (typeof speed === 'number') {
			pxPerSecondRef.current = speed;
		} else {
			pxPerSecondRef.current = DEFAULT_SPEED_PX_S;
		}
	}, [speed]);

	useEffect(() => {
		if (useCssFallback) return;
		const viewport = viewportRef.current;
		if (!viewport || halfWidth === 0) return;

		function step(ts: number) {
			if (!viewport) return;
			if (lastTsRef.current == null) lastTsRef.current = ts;
			const dt = (ts - lastTsRef.current) / 1000;
			lastTsRef.current = ts;

			if (!paused) {
				const dx = pxPerSecondRef.current * dt;
				let next = viewport.scrollLeft + dx;
				if (next >= halfWidth) {
					next -= halfWidth;
				}
				viewport.scrollLeft = next;
			}
			rafRef.current = requestAnimationFrame(step);
		}
		rafRef.current = requestAnimationFrame(step);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
			lastTsRef.current = null;
		};
	}, [paused, halfWidth, useCssFallback]);

	useEffect(() => {
		measure();
		const handle = () => measure();
		window.addEventListener('resize', handle);
		return () => window.removeEventListener('resize', handle);
	}, [measure]);

	const onMouseEnter = useCallback(() => setIsHovering(true), []);
	const onMouseLeave = useCallback(() => setIsHovering(false), []);

	const onFocusCapture = useCallback(() => setIsFocusWithin(true), []);
	const onBlurCapture = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setIsFocusWithin(false);
		}
	}, []);

	const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		setIsDragging(true);
		setIsInteracting(true);
		if (resumeTimerRef.current) {
			window.clearTimeout(resumeTimerRef.current);
			resumeTimerRef.current = null;
		}
		viewport.setPointerCapture(e.pointerId);
		pointerStartXRef.current = e.clientX;
		scrollStartRef.current = viewport.scrollLeft;
	}, []);

	const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging) return;
		const viewport = viewportRef.current;
		if (!viewport) return;
		const delta = pointerStartXRef.current - e.clientX;
		let next = scrollStartRef.current + delta;
		if (halfWidth > 0) {
			next = ((next % halfWidth) + halfWidth) % halfWidth;
		}
		viewport.scrollLeft = next;
	}, [isDragging, halfWidth]);

	const onPointerUpOrCancel = useCallback(() => {
		setIsDragging(false);
		if (resumeTimerRef.current) {
			window.clearTimeout(resumeTimerRef.current);
		}
		resumeTimerRef.current = window.setTimeout(() => {
			setIsInteracting(false);
		}, 1200);
	}, []);

	useEffect(() => {
		return () => {
			if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
		};
	}, []);

	const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
		const container = trackRef.current;
		if (!container) return;
		const links = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'));
		if (links.length === 0) return;
		const activeEl = document.activeElement as HTMLElement | null;
		let idx = links.findIndex(l => l === activeEl);
		if (idx === -1) {
			idx = e.key === 'ArrowRight' ? -1 : 0;
		}
		e.preventDefault();
		const delta = e.key === 'ArrowRight' ? 1 : -1;
		let next = idx + delta;
		if (next < 0) next = links.length - 1;
		if (next >= links.length) next = 0;
		links[next]?.focus({ preventScroll: true });
		const viewport = viewportRef.current;
		if (viewport) {
			const target = links[next];
			const rect = target.getBoundingClientRect();
			const vrect = viewport.getBoundingClientRect();
			const overflowLeft = rect.left - vrect.left;
			const overflowRight = rect.right - vrect.right;
			let adjust = 0;
			if (overflowLeft < 0) adjust = overflowLeft;
			if (overflowRight > 0) adjust = overflowRight;
			if (adjust !== 0) {
				let nextScroll = viewport.scrollLeft + adjust;
				if (halfWidth > 0) {
					nextScroll = ((nextScroll % halfWidth) + halfWidth) % halfWidth;
				}
				viewport.scrollLeft = nextScroll;
			}
		}
	}, [halfWidth]);

	const cssFallbackStyle: React.CSSProperties = useMemo(() => {
		if (!useCssFallback) return {};
		let durationStr: string | undefined;
		if (typeof speed === 'string') {
			durationStr = speed;
		} else if (typeof speed === 'number' && halfWidth > 0 && speed > 0) {
			const seconds = halfWidth / speed;
			durationStr = `${seconds}s`;
		}
		return durationStr ? ({ ['--duration' as any]: durationStr } as React.CSSProperties) : {};
	}, [useCssFallback, speed, halfWidth]);

	if (!doubledLogos.length) return null;

	return (
		<div
			className={[styles.slider, useCssFallback ? styles.cssFallback : '', className ?? ''].filter(Boolean).join(' ')}
			aria-label={ariaLabel}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onFocusCapture={onFocusCapture}
			onBlurCapture={onBlurCapture}
			onKeyDown={onKeyDown}
		>
			<div
				ref={viewportRef}
				className={[
					styles.viewport,
					isDragging ? styles.dragging : ''
				].filter(Boolean).join(' ')}
				style={
					{
						// Large-screen gap; small-screen gap is controlled by CSS
						['--gapLarge' as any]: `${gap}px`,
						['--visibleCountLarge' as any]: visibleCount
					} as React.CSSProperties
				}
				role="region"
				aria-roledescription="carousel"
				aria-label={ariaLabel}
				tabIndex={0}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUpOrCancel}
				onPointerCancel={onPointerUpOrCancel}
			>
				<div
					ref={trackRef}
					className={styles.track}
					role="list"
					aria-live="off"
					data-paused={paused ? 'true' : 'false'}
					style={cssFallbackStyle}
					>
					{doubledLogos.map((logo, idx) => {
						const iconName = TECH_STACK_ICONS[logo.id] ?? logo.id;

						const content = (
							<Icon
								className={styles.image}
								icon={iconName}
								color="#112D4E"
								role="img"
								aria-label={logo.alt}
							/>
						);
						return (
							<div key={`${logo.id}-${idx}`} className={styles.item} role="listitem">
								{logo.href ? (
									<a
										className={styles.link}
										href={logo.href}
										target="_blank"
										rel="noreferrer noopener"
										tabIndex={0}
									>
										{content}
									</a>
								) : (
									content
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default LogoSlider;
