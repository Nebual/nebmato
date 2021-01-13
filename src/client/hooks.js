import { useEffect, useRef } from 'react';

export function useUnload(fn) {
	const cb = useRef(fn); // init with fn, so that type checkers won't assume that current might be undefined

	useEffect(() => {
		cb.current = fn;
	}, [fn]);

	useEffect(() => {
		const onUnload = (...args) => cb.current?.(...args);

		window.addEventListener('beforeunload', onUnload);

		return () => window.removeEventListener('beforeunload', onUnload);
	}, []);
}

export function useCleanup(fn) {
	useUnload(fn);
	useEffect(() => useCleanup, []);
}

const SENTINEL = {};
export function useRefFn(init) {
	const ref = useRef(SENTINEL);
	if (ref.current === SENTINEL) {
		ref.current = typeof init === 'function' ? init() : init;
	}
	return ref;
}


export function useEventListener(eventName, handler, element) {
	const savedHandler = useRef();

	// Update ref, to avoid passing the handler as a dep, which would trigger constant rerenders
	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const isSupported = element && element.addEventListener;
		if (!isSupported) return;

		const eventListener = (event) => savedHandler.current(event);
		element.addEventListener(eventName, eventListener);

		return () => {
			element.removeEventListener(eventName, eventListener);
		};
	}, [eventName, element]);
}

export function useOnKeyDown(onKeyDownHandler, keyCode) {
	return useEventListener(
		'keydown',
		(e) => {
			if (e.which === keyCode) {
				onKeyDownHandler && onKeyDownHandler(e);
			}
		},
		document
	);
}