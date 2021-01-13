import React, { useState } from 'react';

import { MdAdd, MdRefresh, MdRemove } from 'react-icons/md';

import IconButton from './IconButton';

function AddRemoveButtons({ setTime }) {
	const [mode, setMode] = useState(0);
	const sign = (
		<span style={{ display: 'inline-block', width: '1.25rem' }}>
			{mode < 0 ? '-' : '+'}
		</span>
	);

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
							setTime(time => time + 60 * 60 * 7 * mode);
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
							setTime(time => time + 60 * 60 * mode);
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
							setTime(time => time + 60 * 15 * mode);
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
							setTime(time => time + 60 * 5 * mode);
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
							setTime(time => time + 60 * mode);
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
						setTime(0);
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
