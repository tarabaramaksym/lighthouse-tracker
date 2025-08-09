import nightPng from '@/assets/calendar_night.png';
import clouds from '@/assets/clouds.png';
import authNightPng from '@/assets/night.png';

export function preloadHomePageAssets() {
	const criticalImages = [nightPng, clouds];

	criticalImages.forEach(src => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'image';
		link.href = src;
		document.head.appendChild(link);
	});
}

export function preloadAuthPageAssets() {
	const criticalImages = [authNightPng];

	criticalImages.forEach(src => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'image';
		link.href = src;
		document.head.appendChild(link);
	});
}
