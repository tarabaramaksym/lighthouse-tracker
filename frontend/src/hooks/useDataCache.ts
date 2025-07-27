import { useRef } from 'preact/compat';

interface CacheKey {
	domainId: number;
	websiteId: number;
	date: string;
}

interface CacheEntry {
	data: any;
	timestamp: number;
}

export function useDataCache() {
	const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

	const generateKey = (domainId: number, websiteId: number, date: string): string => {
		return `${domainId}-${websiteId}-${date}`;
	};

	const get = (domainId: number, websiteId: number, date: string): any | null => {
		const key = generateKey(domainId, websiteId, date);
		const entry = cacheRef.current.get(key);

		if (!entry) {
			return null;
		}

		// Check if cache is still valid (24 hours)
		const now = Date.now();
		const cacheAge = now - entry.timestamp;
		const maxAge = 24 * 60 * 60 * 1000; // 24 hours

		if (cacheAge > maxAge) {
			cacheRef.current.delete(key);
			return null;
		}

		return entry.data;
	};

	const set = (domainId: number, websiteId: number, date: string, data: any): void => {
		const key = generateKey(domainId, websiteId, date);
		cacheRef.current.set(key, {
			data,
			timestamp: Date.now()
		});
	};

	const clear = (): void => {
		cacheRef.current.clear();
	};

	const has = (domainId: number, websiteId: number, date: string): boolean => {
		const key = generateKey(domainId, websiteId, date);
		return cacheRef.current.has(key);
	};

	return {
		get,
		set,
		clear,
		has
	};
} 