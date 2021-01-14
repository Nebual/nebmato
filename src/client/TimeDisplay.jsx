import React from 'react';

export default function TimeDisplay({ duration }) {
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
				fontSize: `${
					Math.abs(duration) / (60 * 60) >= 10 ? '4' : '5'
				}rem`,
			}}
		>
			{calcHours(duration)}
			{calcMinutes(duration)}:{calcSeconds(duration)}
		</div>
	);
}
