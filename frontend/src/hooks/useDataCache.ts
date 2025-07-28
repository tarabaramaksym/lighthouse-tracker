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

	const generateKey = (domainId: number, websiteId: number, date: string, isMobile: boolean = false): string => {
		return `${domainId}-${websiteId}-${date}-${isMobile}`;
	};

	const get = (domainId: number, websiteId: number, date: string, isMobile: boolean = false): any | null => {
		const key = generateKey(domainId, websiteId, date, isMobile);
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

	const set = (domainId: number, websiteId: number, date: string, data: any, isMobile: boolean = false): void => {
		const key = generateKey(domainId, websiteId, date, isMobile);
		cacheRef.current.set(key, {
			data,
			timestamp: Date.now()
		});
	};

	const clear = (): void => {
		cacheRef.current.clear();
	};

	const has = (domainId: number, websiteId: number, date: string, isMobile: boolean = false): boolean => {
		const key = generateKey(domainId, websiteId, date, isMobile);
		return cacheRef.current.has(key);
	};

	return {
		get,
		set,
		clear,
		has
	};
} 