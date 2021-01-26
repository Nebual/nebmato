import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import queryString from 'query-string';

import {formatTime} from "./TimeDisplay";

export function useUnload(fn) {
	const cb = useRef(fn);

	useEffect(() => {
		cb.current = fn;
	}, [fn]);

	useEffect(() => {
		const onUnload = (...args) => cb.current?.(...args);

		window.addEventListener('pagehide', onUnload);

		return () => window.removeEventListener('pagehide', onUnload);
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

export function useLocalStorage(key, defaultValue = undefined) {
	const [, setChangeCount] = useState(0);

	const incrementChangeCount = useCallback(() => {
		setChangeCount(count => count + 1);
	}, []);

	defaultValue = useMemoObject(defaultValue);

	const itemRef = useRef();
	const serializedItem = localStorage.getItem(key);

	itemRef.current = useMemo(
		() =>
			(serializedItem !== undefined
				? JSON.parse(serializedItem)
				: undefined) ?? defaultValue,
		[defaultValue, serializedItem],
	);

	const setItem = useCallback(
		(newValue = undefined) => {
			if (newValue === undefined) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(
					key,
					JSON.stringify(
						typeof newValue === 'function'
							? newValue(itemRef.current)
							: newValue,
					),
				);
			}

			incrementChangeCount();
		},
		[key, incrementChangeCount],
	);

	return [itemRef.current, setItem];
}

function getNowHms() {
	const date = new Date()
	return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export function useLogs(timerId, durationRef) {
	const [logs, setLogs] = useLocalStorage(`${timerId}:logs`, []);
	function appendLogs(newLine) {
		setLogs(oldLogs => [
			`${getNowHms()}: (${formatTime(durationRef.current, {fractional: false})}) ${newLine}`,
			...oldLogs,
		]);
	}
	return [logs, appendLogs];
}
