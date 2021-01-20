import { useRef } from 'react';

import noteFrequencies from './noteFrequencies';

export default function useAudioGen() {
	const audioContextRef = useRef();
	const nextTimeRef = useRef(0);

	function playFrequency(frequency, duration = 200, type = 'sine') {
		if (!nextTimeRef.current || nextTimeRef.current < Date.now()) {
			nextTimeRef.current = Date.now() + 200;
			immediatePlayFrequency(frequency, type);
		} else {
			setTimeout(
				() => immediatePlayFrequency(frequency, type),
				 nextTimeRef.current - Date.now(),
			);
			nextTimeRef.current += duration;
		}
	}
	function immediatePlayFrequency(frequency, type = 'sine') {
		if (!audioContextRef.current) {
			audioContextRef.current = new AudioContext();
		}
		const context = audioContextRef.current;
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		oscillator.type = type;
		oscillator.connect(gain);
		oscillator.frequency.value = frequency;
		gain.connect(context.destination);
		oscillator.start(0);
		gain.gain.exponentialRampToValueAtTime(
			0.00001,
			context.currentTime + 0.5,
		);
	}
	window.playFrequency = playFrequency;
	window.notes = noteFrequencies;

	return {
		playFrequency,
		notes: noteFrequencies,
	};
}
