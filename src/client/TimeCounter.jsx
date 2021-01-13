import React, { useRef, useLayoutEffect } from 'react';

export default function TimeCounter({ time, setTime, running, timerId }) {
	const requestRef = useRef(0);
	const previousTimeRef = useRef(0);

	const animate = time => {
		if (previousTimeRef.current) {
			const deltaTime = time - previousTimeRef.current;

			setTime(prevTime => prevTime + deltaTime * 0.001);
		}
		previousTimeRef.current = time;
		requestRef.current = requestAnimationFrame(animate);
	};

	useLayoutEffect(() => {
		previousTimeRef.current = 0;
		if (running) {
			requestRef.current = requestAnimationFrame(animate);
		}
		return () => cancelAnimationFrame(requestRef.current);
	}, [running, timerId]);

	function calcHours(time) {
		return (
			Math.abs(Math.trunc(time / (60 * 60))) > 0 &&
			`${String(Math.trunc(time / (60 * 60))).padStart(2, '0')}:`
		);
	}
	function calcMinutes(time) {
		if (time <= -60 * 60) {
			time = Math.abs(time);
		}
		return (
			(time < 0 ? '-' : '') +
			String(Math.trunc(Math.abs(time) / 60) % 60).padStart(2, '0')
		);
	}
	function calcSeconds(time) {
		const seconds = Math.abs(time % 60);
		return seconds >= 10 ? seconds.toFixed(1) : '0' + seconds.toFixed(1);
	}

	return (
		<div
			style={{
				fontSize: `${Math.abs(time) / (60 * 60) >= 10 ? '4' : '5'}rem`,
			}}
		>
			{calcHours(time)}
			{calcMinutes(time)}:{calcSeconds(time)}
		</div>
	);
}
