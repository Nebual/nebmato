import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import queryString from 'query-string';

import {
	useCleanup,
	useEffectAfterInit,
	useLogs,
	useRefFn,
	useUpdateUrl,
} from './hooks';
import AddRemoveButtons from './AddRemoveButtons';
import TimeDisplay from './TimeDisplay';
import { PlayPauseButton } from './IconButton';
import useAudioGen from './audio';

function readIsRunning(timerId) {
	return !!localStorage.getItem(`${timerId}:running`);
}
function readStoredDuration(timerId) {
	return parseFloat(localStorage.getItem(`${timerId}:duration`)) || 0;
}
function readStoredLastTime(timerId) {
	return parseInt(localStorage.getItem(`${timerId}:lastTime`)) || 0;
}

export default function TimerContainer({ timerId, showLogs }) {
	const [running, setRunning] = useState(() => readIsRunning(timerId));
	const durationRef = useRef(0);
	const lastTimeRef = useRefFn(() => readStoredLastTime(timerId));
	const [duration, setDuration] = useState(() => readStoredDuration(timerId));
	durationRef.current = duration;

	const [logs, appendLogs] = useLogs(timerId, durationRef);
	useUpdateUrl({
		id: timerId !== 'timer' ? timerId : undefined,
	});

	const { playFrequency, notes } = useAudioGen();
	const requestRef = useRef(0);
	const updateDuration = () => {
		if (lastTimeRef.current) {
			const deltaTime = Date.now() - lastTimeRef.current;

			setDuration(prevDuration => {
				if (prevDuration < 0 && deltaTime / 1000 + prevDuration > 0) {
					[
						['F#4', 8],
						['F#4', 8],
						['E4', 8],
						['G#4', 4],
						['C#4', 8],
					].map(([letter, size]) =>
						playFrequency(
							notes[letter],
							1000 / (size / 4) / (128 / 60),
						),
					);
				}
				return prevDuration + deltaTime * 0.001;
			});
			if (lastTimeRef.current) {
				lastTimeRef.current += deltaTime;
			}
		}
		requestRef.current = requestAnimationFrame(updateDuration);
	};
	useLayoutEffect(() => {
		if (running) {
			if (!lastTimeRef.current) {
				lastTimeRef.current = Date.now();
			}
			requestRef.current = requestAnimationFrame(updateDuration);
		} else {
			lastTimeRef.current = 0;
		}
		return () => cancelAnimationFrame(requestRef.current);
	}, [running, timerId]);

	useEffectAfterInit(() => {
		setDuration(readStoredDuration(timerId));
		lastTimeRef.current = readStoredLastTime(timerId);
		setRunning(readIsRunning(timerId));
	}, [timerId]);
	function save() {
		localStorage.setItem(`${timerId}:running`, running ? 1 : '');
		localStorage.setItem(`${timerId}:duration`, durationRef.current);
		localStorage.setItem(`${timerId}:lastTime`, lastTimeRef.current);
	}
	useCleanup(save, [running, timerId, duration]);
	useEffectAfterInit(save, [running, timerId, duration]);

	useEffect(() => {
		const $_GET = queryString.parse(location.search);
		if ($_GET.timer) {
			const seconds = parseTimeShorthand($_GET.timer);
			if (seconds) {
				setDuration(-seconds);
				setRunning(!$_GET.paused);
				lastTimeRef.current = Date.now();
			}
		}
	}, []);

	return (
		<>
			<section className="section" style={{ paddingBottom: '8rem' }}>
				<div className="container is-align-content-center margin-auto text-center">
					{timerId !== 'timer' && (
						<a href={`?id=${timerId}`} className="timer-link">
							{timerId}
						</a>
					)}
					<TimeDisplay duration={duration} />
					<div
						className="margin-auto"
						style={{
							width: '10rem',
							position: 'relative',
						}}
					>
						<PlayPauseButton
							{...{ appendLogs, running, setRunning }}
						/>
						<AddRemoveButtons
							appendLogs={appendLogs}
							setDuration={setDuration}
							setRunning={setRunning}
						/>
					</div>
				</div>
			</section>
			{showLogs && (
				<section className="section">
					{logs.slice(0, 10).map((logLine, i) => (
						<p key={i}>{logLine}</p>
					))}
				</section>
			)}
		</>
	);
}

function parseTimeShorthand(str) {
	const match = str.match(/^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
	if (match) {
		let [_, days, hours, minutes, seconds] = match;

		hours = parseInt(days || 0) * 24 + parseInt(hours || 0);
		minutes = hours * 60 + parseInt(minutes || 0);
		seconds = minutes * 60 + parseInt(seconds || 0);
		return seconds;
	}
	return 0;
}
