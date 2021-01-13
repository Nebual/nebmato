import React, { useCallback, useState, useEffect, useRef } from 'react';
import queryString from 'query-string';

import { useCleanup, useUpdateUrl } from './hooks';
import AddRemoveButtons from './AddRemoveButtons';
import TimeCounter from './TimeCounter';
import { PlayPauseButton } from './IconButton';

export default function TimerContainer({ timerId }) {
	function readIsRunning() {
		return !!localStorage.getItem(`${timerId}:running`);
	}
	const [running, setRunning] = useState(readIsRunning);
	function readStoredTime() {
		const lastTime =
			parseInt(localStorage.getItem(`${timerId}:lastTime`)) || 0;
		return (
			(parseFloat(localStorage.getItem(`${timerId}:time`)) || 0) +
			(lastTime && running && (Date.now() - lastTime) / 1000)
		);
	}
	const timeRef = useRef(0);
	const [time, setTime] = useState(readStoredTime);
	timeRef.current = time;

	useEffect(() => {
		const $_GET = queryString.parse(location.search);
		if ($_GET.timer) {
			const seconds = parseTimeShorthand($_GET.timer);
			if (seconds) {
				setTime(-seconds);
				setRunning(true);
			}
		}
	}, []);

	useUpdateUrl({
		id: timerId !== 'timer' ? timerId : undefined,
	});

	useCleanup(() => {
		localStorage.setItem(`${timerId}:running`, running ? 1 : '');
		localStorage.setItem(`${timerId}:time`, timeRef.current);
		localStorage.setItem(`${timerId}:lastTime`, Date.now());
	}, [running, timerId]);
	useEffect(() => {
		setTime(readStoredTime());
		setRunning(readIsRunning());
	}, [timerId]);

	return (
		<section className="section">
			<div className="container is-align-content-center margin-auto text-center">
				{timerId !== 'timer' && (
					<a href={`?id=${timerId}`} className="timer-link">
						{timerId}
					</a>
				)}
				<TimeCounter {...{ time, setTime, running, timerId }} />
				<div
					className="margin-auto"
					style={{
						width: '10rem',
						position: 'relative',
					}}
				>
					<PlayPauseButton {...{ running, setRunning }} />
					<AddRemoveButtons setTime={setTime} />
				</div>
			</div>
		</section>
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
