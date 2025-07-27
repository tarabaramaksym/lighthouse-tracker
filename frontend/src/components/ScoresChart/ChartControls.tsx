import type { MetricType } from './types';
import './ChartControls.css';

interface ChartControlsProps {
	dateRange: '7d' | '14d' | '30d';
	onDateRangeChange: (range: '7d' | '14d' | '30d') => void;
	selectedMetrics: MetricType[];
	onMetricToggle: (metric: MetricType) => void;
}

const DATE_RANGE_OPTIONS = [
	{ value: '7d', label: '7 Days' },
	{ value: '14d', label: '14 Days' },
	{ value: '30d', label: '30 Days' }
] as const;

const METRIC_OPTIONS: { value: MetricType; label: string; color: string }[] = [
	{ value: 'performance', label: 'Performance', color: '#4CAF50' },
	{ value: 'accessibility', label: 'Accessibility', color: '#2196F3' },
	{ value: 'best_practices', label: 'Best Practices', color: '#FF9800' },
	{ value: 'seo', label: 'SEO', color: '#9C27B0' },
	{ value: 'pwa', label: 'PWA', color: '#607D8B' }
];

export function ChartControls({ dateRange, onDateRangeChange, selectedMetrics, onMetricToggle }: ChartControlsProps) {
	return (
		<div className="chart-controls">
			<div className="control-group">
				<label className="control-label">Date Range:</label>
				<div className="date-range-buttons">
					{DATE_RANGE_OPTIONS.map(option => (
						<button
							key={option.value}
							className={`range-button ${dateRange === option.value ? 'active' : ''}`}
							onClick={() => onDateRangeChange(option.value)}
						>
							{option.label}
						</button>
					))}
				</div>
			</div>

			<div className="control-group">
				<label className="control-label">Metrics:</label>
				<div className="metric-toggles">
					{METRIC_OPTIONS.map(metric => (
						<label key={metric.value} className="metric-toggle">
							<input
								type="checkbox"
								checked={selectedMetrics.includes(metric.value)}
								onChange={() => onMetricToggle(metric.value)}
							/>
							<span
								className="metric-color"
								style={{ backgroundColor: metric.color }}
							></span>
							<span className="metric-label">{metric.label}</span>
						</label>
					))}
				</div>
			</div>
		</div>
	);
} 