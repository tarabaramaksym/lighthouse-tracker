import { LighthouseEffect } from '@/components/LighthouseEffect';
import dayPng from '@/assets/day.png';
import nightPng from '@/assets/night.png';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function Test() {
	useDocumentTitle('Lighthouse Keeper – Test');
	return (
		<div className="home-container">
			<h1>Test Route</h1>
			<LighthouseEffect dayImageUrl={dayPng} nightImageUrl={nightPng} />
		</div>
	);
}

export default Test; 