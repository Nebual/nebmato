import React from 'react';

import { MdPauseCircleFilled, MdPlayCircleFilled } from 'react-icons/md';
import { useOnKeyDown } from './hooks';

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
export function PlayPauseButton({ running, setRunning }) {
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
