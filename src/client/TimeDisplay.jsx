import React from 'react';

function calcHours(time) {
	return Math.abs(Math.trunc(time / (60 * 60))) > 0
		? `${String(Math.trunc(time / (60 * 60))).padStart(2, '0')}:`
		: '';
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
function calcSeconds(time, fractionDigits = 1) {
	const seconds = Math.abs(time % 60);
	return seconds >= 10
		? seconds.toFixed(fractionDigits)
		: '0' + seconds.toFixed(fractionDigits);
}

export function formatTime(time, { fractional } = { fractional: true }) {
	return `${calcHours(time)}${calcMinutes(time)}:${calcSeconds(
		time,
		fractional ? 1 : 0,
	)}`;
}

export default function TimeDisplay({ duration }) {
	return (
		<div
			style={{
				fontSize: `${
					Math.abs(duration) / (60 * 60) >= 10 ? '4' : '5'
				}rem`,
			}}
		>
			{formatTime(duration)}
		</div>
	);
}
