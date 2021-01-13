import React, { useState } from 'react';
import IconButton, { GithubButton } from './IconButton';
import TimerContainer from './TimerContainer';
import queryString from 'query-string';
import { MdAlarmAdd } from 'react-icons/md';

export default function AppContainer() {
	const [timerId, setTimerId] = useState(
		() => queryString.parse(location.search).id || 'timer',
	);
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
			<TimerContainer timerId={timerId} />
		</>
	);
}
