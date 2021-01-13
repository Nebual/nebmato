import React, { useCallback, useState, useEffect, useRef } from 'react';
import queryString from 'query-string';

import { useRefFn } from './hooks';
import AddRemoveButtons from './AddRemoveButtons';
import TimeCounter from './TimeCounter';
import { PlayPauseButton } from './IconButton';

export default function AppContainer() {
	const [running, setRunning] = useState(
		() => !!localStorage.getItem('running'),
	);
	const timeRef = useRefFn(() => {
		const lastTime = parseInt(localStorage.getItem('lastTime')) || 0;
		return (
			(parseFloat(localStorage.getItem('time')) || 0) +
			(lastTime && running && (Date.now() - lastTime) / 1000)
		);
	});
	const [time, setTime] = useState(timeRef.current);

	useEffect(() => {
		localStorage.setItem('running', running ? 1 : '');
	}, [running]);
	useEffect(() => {
		const $_GET = queryString.parse(location.search);
		if ($_GET.timer) {
			const seconds = parseTimeShorthand($_GET.timer);
			if (seconds) {
				setTime(-seconds);
				setRunning(true);
				history.pushState(
					{},
					'',
					location.href.substr(0, location.href.indexOf('?')),
				);
			}
		}
	}, []);

	return (
		<>
			<nav className="navbar is-spaced">
				<div className="navbar-brand">
					<div className="navbar-item">
						<h1 className="title is-4">Nebmato</h1>
					</div>
				</div>
			</nav>
			<section className="section">
				<div
					className="container is-align-content-center"
					style={{
						marginLeft: 'auto',
						marginRight: 'auto',
						textAlign: 'center',
					}}
				>
					<TimeCounter {...{ time, setTime, running, timeRef }} />
					<div
						style={{
							width: '10rem',
							marginLeft: 'auto',
							marginRight: 'auto',
							position: 'relative',
						}}
					>
						<PlayPauseButton {...{ running, setRunning }} />
						<AddRemoveButtons setTime={setTime} />
					</div>
				</div>
			</section>
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
