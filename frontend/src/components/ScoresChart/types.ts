export interface ChartDataPoint {
	date: string;
	performance: number;
	accessibility: number;
	best_practices: number;
	seo: number;
	pwa: number;
}

export interface ScoresChartProps {
	domainId: number | null;
	websiteId: number | null;
	dateRange: '7d' | '14d' | '30d';
	selectedMetrics: string[];
	height?: number;
	cache?: any;
	isMobile: boolean;
}

export type MetricType = 'performance' | 'accessibility' | 'best_practices' | 'seo' | 'pwa';

export interface MetricConfig {
	key: MetricType;
	label: string;
	color: string;
} 