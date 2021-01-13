import { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';

export function useUnload(fn) {
	const cb = useRef(fn);

	useEffect(() => {
		cb.current = fn;
	}, [fn]);

	useEffect(() => {
		const onUnload = (...args) => cb.current?.(...args);

		window.addEventListener('beforeunload', onUnload);

		return () => window.removeEventListener('beforeunload', onUnload);
	}, []);
}

export function useCleanup(fn, deps) {
	useUnload(fn);
	useEffect(() => fn, deps);
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

		const eventListener = event => savedHandler.current(event);
		element.addEventListener(eventName, eventListener);

		return () => {
			element.removeEventListener(eventName, eventListener);
		};
	}, [eventName, element]);
}

export function useOnKeyDown(onKeyDownHandler, keyCode) {
	return useEventListener(
		'keydown',
		e => {
			if (e.which === keyCode) {
				onKeyDownHandler && onKeyDownHandler(e);
			}
		},
		document,
	);
}

/**
 * A useEffect() wrapper (with the same signature), which does not fire when inputs are first defined (ie. on mount)
 */
export function useEffectAfterInit(effect, inputs) {
	const isInitialMount = useRef(true);
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		return effect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, inputs);
}

/**
 * Deeply compares an object (or array) against its previous versions,
 * attempting to reuse the old reference if similar, to avoid triggering useEffect
 */
export function useMemoObject(newState) {
	const [prevState, setPrevState] = useState(newState);

	if (JSON.stringify(newState) === JSON.stringify(prevState)) {
		return prevState;
	} else {
		setPrevState(newState);
		return newState;
	}
}

/**
 * Updates the current URL with specified query parameters, with history support, whenever they deeply change
 */
export function useUpdateUrl(urlParameters) {
	const cachedParameters = useMemoObject(urlParameters);
	useEffectAfterInit(() => {
		const query = queryString.stringify(urlParameters);

		history.replaceState(
			{ query },
			location.title,
			`${location.pathname}?${query}`,
		);
	}, [cachedParameters]);
}
