import { useState, useEffect } from 'preact/compat';
import { apiService } from '@/services/api';
import { useDataCache } from '@/hooks/useDataCache';
import './ScoresBreakdown.css';

interface DailyData {
	date: string;
	domain: {
		id: number;
		url: string;
	};
	website: {
		id: number;
		path: string;
	};
	performance_scores: {
		performance: number;
		accessibility: number;
		best_practices: number;
		seo: number;
		pwa: number;
		first_contentful_paint?: number;
		largest_contentful_paint?: number;
		total_blocking_time?: number;
		cumulative_layout_shift?: number;
		speed_index?: number;
	} | null;
	issues: any[];
	total_issues: number;
	total_records: number;
}

interface ScoresBreakdownProps {
	domainId: number | null;
	websiteId: number | null;
	selectedDate: string | null;
}

type TabType = 'performance' | 'accessibility' | 'best-practices' | 'seo' | 'pwa';

export function ScoresBreakdown({ domainId, websiteId, selectedDate }: ScoresBreakdownProps) {
	const [data, setData] = useState<DailyData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedTab, setSelectedTab] = useState<TabType>('performance');
	const cache = useDataCache();

	useEffect(() => {
		if (domainId && websiteId && selectedDate) {
			fetchDailyData();
		} else {
			setData(null);
		}
	}, [domainId, websiteId, selectedDate]);

	const fetchDailyData = async () => {
		if (!domainId || !websiteId || !selectedDate) return;

		// Check cache first
		const cachedData = cache.get(domainId, websiteId, selectedDate);
		if (cachedData) {
			setData(cachedData);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);
			const response = await apiService.issues.getDailyIssues(domainId, websiteId, selectedDate);
			setData(response.data);

			// Cache the response
			cache.set(domainId, websiteId, selectedDate, response.data);
		} catch (err: any) {
			setError(err.message || 'Failed to fetch daily data');
		} finally {
			setIsLoading(false);
		}
	};

	const getScoreColor = (score: number): string => {
		if (score >= 90) return 'green';
		if (score >= 50) return 'yellow';
		return 'red';
	};

	const getScoreText = (score: number): string => {
		if (score >= 90) return 'Good';
		if (score >= 50) return 'Needs improvement';
		return 'Poor';
	};

	const formatMetric = (value: number | undefined, unit: string): string => {
		if (value === undefined || value === 0) {
			return 'N/A';
		}
		if (unit === 'ms') {
			return `${value} ms`;
		}
		if (unit === 's') {
			return `${value} s`;
		}
		return value.toString();
	};

	const getScoreKey = (tabKey: TabType): keyof typeof data.performance_scores => {
		if (tabKey === 'best-practices') return 'best_practices';
		return tabKey as keyof typeof data.performance_scores;
	};

	const hasScore = (tabKey: TabType): boolean => {
		if (!data?.performance_scores) return false;
		const scoreKey = getScoreKey(tabKey);
		const score = data.performance_scores[scoreKey];
		return score !== null && score !== undefined;
	};

	const renderPerformanceMetrics = () => {
		if (!data?.performance_scores) return null;

		const scores = data.performance_scores;
		const metrics = [
			{
				name: 'First Contentful Paint',
				value: scores.first_contentful_paint ?? 0,
				unit: 's',
				status: (scores.first_contentful_paint ?? 0) <= 1.8 ? 'good' : 'needs-improvement',
				displayValue: scores.first_contentful_paint ? Math.round(scores.first_contentful_paint * 10) / 10 : 0
			},
			{
				name: 'Largest Contentful Paint',
				value: scores.largest_contentful_paint ?? 0,
				unit: 's',
				status: (scores.largest_contentful_paint ?? 0) <= 2.5 ? 'good' : 'needs-improvement',
				displayValue: scores.largest_contentful_paint ? Math.round(scores.largest_contentful_paint * 10) / 10 : 0
			},
			{
				name: 'Total Blocking Time',
				value: scores.total_blocking_time ?? 0,
				unit: 'ms',
				status: (scores.total_blocking_time ?? 0) <= 200 ? 'good' : 'needs-improvement',
				displayValue: scores.total_blocking_time ?? 0
			},
			{
				name: 'Cumulative Layout Shift',
				value: scores.cumulative_layout_shift ?? 0,
				unit: '',
				status: (scores.cumulative_layout_shift ?? 0) <= 0.1 ? 'good' : 'needs-improvement',
				displayValue: scores.cumulative_layout_shift ? Math.round(scores.cumulative_layout_shift * 1000) / 1000 : 0
			},
			{
				name: 'Speed Index',
				value: scores.speed_index ?? 0,
				unit: 's',
				status: (scores.speed_index ?? 0) <= 3.4 ? 'good' : 'needs-improvement',
				displayValue: scores.speed_index ? Math.round(scores.speed_index * 10) / 10 : 0
			}
		];

		return (
			<div className="metrics-section">
				<h4>Core Web Vitals</h4>
				<div className="metrics-grid">
					{metrics.map(metric => (
						<div key={metric.name} className={`metric-item ${metric.status}`}>
							<div className={`metric-circle ${metric.status}`}>
								{metric.displayValue}
							</div>
							<div className="metric-label">{metric.name}</div>
							<div className="metric-value">
								{formatMetric(metric.value || 0, metric.unit)}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderTabContent = () => {
		if (!data?.performance_scores) {
			return (
				<div className="no-data">
					No performance data available for this date
				</div>
			);
		}

		const getScoreKey = (tabKey: TabType): keyof typeof data.performance_scores => {
			if (tabKey === 'best-practices') return 'best_practices';
			return tabKey as keyof typeof data.performance_scores;
		};

		const scoreKey = getScoreKey(selectedTab);
		const score = data.performance_scores[scoreKey];
		const color = getScoreColor(score);
		const text = getScoreText(score);

		return (
			<div className="tab-content">
				<div className="score-display">
					<div className={`score-circle ${color}`}>
						<span className="score-number">{score}</span>
					</div>
					<div className="score-text">{text}</div>
				</div>
				{selectedTab === 'performance' && renderPerformanceMetrics()}
			</div>
		);
	};

	const tabs: { key: TabType; label: string }[] = [
		{ key: 'performance', label: 'Performance' },
		{ key: 'accessibility', label: 'Accessibility' },
		{ key: 'best-practices', label: 'Best Practices' },
		{ key: 'seo', label: 'SEO' },
		{ key: 'pwa', label: 'PWA' }
	];

	if (!domainId || !websiteId) {
		return (
			<div className="scores-breakdown">
				<div className="no-selection">
					Select a domain and website to view performance scores
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="scores-breakdown">
				<div className="loading">
					Loading performance data...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="scores-breakdown">
				<div className="error">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className="scores-breakdown">
			<div className="tabs-header">
				{tabs.map(tab => {
					const isDisabled = !hasScore(tab.key);
					return (
						<button
							key={tab.key}
							className={`tab-button ${selectedTab === tab.key ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
							onClick={() => !isDisabled && setSelectedTab(tab.key)}
							disabled={isDisabled}
						>
							<span className="tab-label">{tab.label}</span>
							{data?.performance_scores && hasScore(tab.key) && (
								<span className={`tab-score ${getScoreColor(data.performance_scores[getScoreKey(tab.key)])}`}>
									{data.performance_scores[getScoreKey(tab.key)]}
								</span>
							)}
						</button>
					);
				})}
			</div>
			<div className="tab-content-wrapper">
				{renderTabContent()}
			</div>
		</div>
	);
} 