import React, { useState } from 'react';

import { MdAdd, MdRefresh, MdRemove } from 'react-icons/md';

import IconButton from './IconButton';

function AddRemoveButtons({ setDuration, setRunning, appendLogs }) {
	const [mode, setMode] = useState(0);
	const sign = (
		<span style={{ display: 'inline-block', width: '1.25rem' }}>
			{mode < 0 ? '-' : '+'}
		</span>
	);

	const recentChangesRef = React.useRef({ tally: 0, timer: 0 });
	function addTime(seconds) {
		setDuration(time => time + seconds);
		recentChangesRef.current.tally += seconds;
		clearTimeout(recentChangesRef.current.timer);
		recentChangesRef.current.timer = setTimeout(() => {
			const tally = recentChangesRef.current.tally;
			recentChangesRef.current.tally = 0;
			if (tally) {
				const verb = tally >= 0 ? 'Added' : 'Removed';
				appendLogs(`${verb} ${Math.abs(tally / 60)} minutes`);
			}
		}, 2500);
	}

	return (
		<>
			<IconButton
				onClick={() => {
					setMode(mode => (mode === 1 ? 0 : 1));
				}}
				Icon={MdAdd}
				size={3}
				style={{
					position: 'absolute',
					left: '0rem',
					top: '5rem',
					backgroundColor: mode === 1 ? '#ddd' : undefined,
				}}
			/>
			<IconButton
				onClick={() => {
					setMode(mode => (mode === -1 ? 0 : -1));
				}}
				Icon={MdRemove}
				size={3}
				style={{
					position: 'absolute',
					left: '6rem',
					top: '5rem',
					backgroundColor: mode === -1 ? '#ddd' : undefined,
				}}
			/>

			{mode !== 0 && (
				<>
					<IconButton
						onClick={() => {
							addTime(60 * 60 * 7 * mode);
						}}
						children={
							<span style={{ fontSize: '2rem' }}>{sign}7h</span>
						}
						size={3}
						style={{
							position: 'absolute',
							left: '-6rem',
							top: '6rem',
						}}
					/>
					<IconButton
						onClick={() => {
							addTime(60 * 60 * mode);
						}}
						children={
							<span style={{ fontSize: '2rem' }}>{sign}60</span>
						}
						size={3}
						style={{
							position: 'absolute',
							left: '-3.5rem',
							top: '9rem',
						}}
					/>
					<IconButton
						onClick={() => {
							addTime(60 * 15 * mode);
						}}
						children={
							<span style={{ fontSize: '2rem' }}>{sign}15</span>
						}
						size={3}
						style={{
							position: 'absolute',
							left: '1rem',
							top: '10rem',
						}}
					/>
					<IconButton
						onClick={() => {
							addTime(60 * 5 * mode);
						}}
						children={
							<span style={{ fontSize: '2rem' }}>{sign}5</span>
						}
						size={3}
						style={{
							position: 'absolute',
							left: '5rem',
							top: '10rem',
						}}
					/>
					<IconButton
						onClick={() => {
							addTime(60 * mode);
						}}
						children={
							<span style={{ fontSize: '2rem' }}>{sign}1</span>
						}
						size={3}
						style={{
							position: 'absolute',
							left: '9rem',
							top: '9rem',
						}}
					/>
				</>
			)}
			{mode === -1 && (
				<IconButton
					onClick={() => {
						setDuration(0);
						setRunning(false);
					}}
					Icon={MdRefresh}
					size={3}
					style={{
						position: 'absolute',
						left: '3.2rem',
						top: '16rem',
					}}
				/>
			)}
		</>
	);
}
export default AddRemoveButtons = React.memo(AddRemoveButtons);
