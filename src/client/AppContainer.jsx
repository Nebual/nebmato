import React, { useState } from 'react';
import IconButton, { GithubButton } from './IconButton';
import TimerContainer from './TimerContainer';
import queryString from 'query-string';
import { MdAlarmAdd, MdSubject } from 'react-icons/md';
import { useLocalStorage } from './hooks';

export default function AppContainer() {
	const [timerId, setTimerId] = useState(
		() => queryString.parse(location.search).id || 'timer',
	);
	const [showLogs, setShowLogs] = useLocalStorage('showLogs', false);
	return (
		<>
			<nav className="navbar is-spaced">
				<div className="navbar-brand">
					<div className="navbar-item">
						<h1 className="title is-4">Nebmato</h1>
					</div>
					<div className="navbar-item">
						<GithubButton />
					</div>
					<div className="navbar-item">
						<IconButton
							onClick={() => setShowLogs(old => !old)}
							Icon={MdSubject}
							size={1.5}
							style={{
								opacity: showLogs ? 1 : 0.25,
							}}
						/>
					</div>
				</div>
				<div className="navbar-item" style={{ marginLeft: 'auto' }}>
					<IconButton
						onClick={() => {
							setTimerId(timerId => {
								// Increment id
								const match = timerId.match(/^(.*?)(\d+)?$/);
								return `${match[1]}${
									match[2] > 0 ? parseInt(match[2]) + 1 : '2'
								}`;
							});
						}}
						Icon={MdAlarmAdd}
						size={1.5}
					/>
				</div>
			</nav>
			<TimerContainer timerId={timerId} showLogs={showLogs} />
		</>
	);
}
