import { useState, useEffect } from 'preact/compat';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { apiService } from '@/services/api';
import type { ScoresChartProps, ChartDataPoint, MetricConfig } from './types';
import './ScoresChart.css';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const METRIC_CONFIGS: MetricConfig[] = [
	{ key: 'performance', label: 'Performance', color: '#4CAF50' },
	{ key: 'accessibility', label: 'Accessibility', color: '#2196F3' },
	{ key: 'best_practices', label: 'Best Practices', color: '#FF9800' },
	{ key: 'seo', label: 'SEO', color: '#9C27B0' },
	{ key: 'pwa', label: 'PWA', color: '#607D8B' }
];

export function ScoresChart({ domainId, websiteId, dateRange, selectedMetrics, height = 300, cache }: ScoresChartProps) {
	const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (domainId && websiteId) {
			fetchChartData();
		} else {
			setChartData([]);
		}
	}, [domainId, websiteId, dateRange]);

	const fetchChartData = async () => {
		if (!domainId || !websiteId) return;

		const days = parseInt(dateRange.replace('d', ''));

		// Check cache first
		const cacheKey = `${domainId}-${websiteId}-chart-${dateRange}`;
		const cachedData = cache.get(domainId, websiteId, cacheKey);
		if (cachedData) {
			setChartData(cachedData);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			const response = await apiService.issues.getChartData(domainId, websiteId, days);
			setChartData(response.data);
			cache.set(domainId, websiteId, cacheKey, response.data);
		} catch (err: any) {
			setError(err.message || 'Failed to fetch chart data');
		} finally {
			setIsLoading(false);
		}
	};

	const chartOptions: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
				labels: {
					usePointStyle: true,
					padding: 20
				}
			},
			title: {
				display: true,
				text: 'Performance Scores Over Time'
			}
		},
		scales: {
			y: {
				beginAtZero: true,
				max: 100,
				ticks: {
					stepSize: 20
				}
			},
			x: {
				grid: {
					display: false
				}
			}
		},
		elements: {
			point: {
				radius: 4,
				hoverRadius: 6
			},
			line: {
				tension: 0.1
			}
		}
	};

	const datasets = METRIC_CONFIGS
		.filter(config => selectedMetrics.includes(config.key))
		.map(config => ({
			label: config.label,
			data: chartData.map(point => point[config.key]),
			borderColor: config.color,
			backgroundColor: config.color + '20',
			borderWidth: 2,
			fill: false
		}));

	const data = {
		labels: chartData.map(point => {
			const date = new Date(point.date);
			return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		}),
		datasets
	};

	if (!domainId || !websiteId) {
		return (
			<div className="scores-chart">
				<div className="no-selection">
					Select a domain and website to view performance trends
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="scores-chart">
				<div className="loading">
					Loading chart data...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="scores-chart">
				<div className="error">
					{error}
				</div>
			</div>
		);
	}

	if (chartData.length === 0) {
		return (
			<div className="scores-chart">
				<div className="no-data">
					No performance data available for the selected date range
				</div>
			</div>
		);
	}

	return (
		<div className="scores-chart" style={{ height }}>
			<Line data={data} options={chartOptions} />
		</div>
	);
} 