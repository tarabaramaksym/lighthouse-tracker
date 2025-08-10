import nightPng from '@/assets/calendar_night.png';
import clouds from '@/assets/clouds.png';
import authGif from '@/assets/lighthouse.gif';

export function preloadHomePageAssets() {
	const criticalImages = [nightPng, clouds];
	const appended = new Set<string>();
	criticalImages.forEach(src => {
		if (!src || appended.has(src)) {
			return
		};

		if (!document.querySelector(`link[rel="preload"][as="image"][href="${src}"]`)) {
			const link = document.createElement('link');
			link.rel = 'preload';
			link.as = 'image';
			link.href = src;
			document.head.appendChild(link);
		}

		const img = new Image();

		img.decoding = 'async' as any;
		img.src = src;
		appended.add(src);
	});
}

export function preloadAuthPageAssets() {
	const criticalImages = [authGif];
	const appended = new Set<string>();

	criticalImages.forEach(src => {
		if (!src || appended.has(src)) {
			return
		};

		if (!document.querySelector(`link[rel="preload"][as="image"][href="${src}"]`)) {
			const link = document.createElement('link');
			link.rel = 'preload';
			link.as = 'image';
			link.href = src;
			document.head.appendChild(link);
		}
		const img = new Image();
		img.decoding = 'async' as any;
		img.src = src;
		appended.add(src);
	});
}
