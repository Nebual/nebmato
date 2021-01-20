import React from 'react';

import { MdPauseCircleFilled, MdPlayCircleFilled } from 'react-icons/md';
import { useOnKeyDown } from './hooks';
import { FaGithub } from 'react-icons/fa';

export default function IconButton({
	onClick,
	Icon,
	children,
	size = 4,
	style,
}) {
	return (
		<button
			className="button is-white"
			onClick={onClick}
			type="button"
			style={{
				height: `${size + 1}rem`,
				width: `${size + 1}rem`,
				borderRadius: '3rem',
				...style,
			}}
		>
			{Icon ? (
				<Icon
					className="icon"
					style={{
						height: `${size}rem`,
						width: `${size}rem`,
					}}
				/>
			) : (
				<span
					className="icon"
					style={{
						height: `${size}rem`,
						width: `${size}rem`,
					}}
				>
					{children}
				</span>
			)}
		</button>
	);
}

const KEYCODE_SPACE = 32;
const KEYCODE_P = 80;
export function PlayPauseButton({
	appendLogs,
	running,
	setRunning: setRunningState,
}) {
	const setRunning = innerFunc =>
		setRunningState(old => {
			const newState = innerFunc(old);
			appendLogs(newState ? 'Running' : 'Paused');
			return newState;
		});
	useOnKeyDown(() => setRunning(running => !running), KEYCODE_SPACE);
	useOnKeyDown(() => setRunning(running => !running), KEYCODE_P);
	return (
		<IconButton
			onClick={() => {
				setRunning(running => !running);
			}}
			Icon={running ? MdPauseCircleFilled : MdPlayCircleFilled}
			size={5}
		/>
	);
}

export function GithubButton() {
	return (
		<a
			href="https://github.com/Nebual/nebmato"
			target="_blank"
			style={{
				display: 'flex',
				marginTop: 2,
			}}
		>
			<FaGithub />
		</a>
	);
}
