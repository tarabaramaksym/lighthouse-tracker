import './IssuesList.css';

interface Issue {
	id: number;
	issue_id: string;
	title: string;
	description: string;
	category: string;
	affected_urls: Array<{
		website_id: number;
		path: string;
		record_id: number;
	}>;
	total_affected: number;
	severity?: 'high' | 'medium' | 'low';
	savings_time?: number;
	savings_bytes?: number;
}

interface IssuesListProps {
	issues: Issue[];
	category: string;
	isLoading: boolean;
	error: string | null;
}

export function IssuesList({ issues, category, isLoading, error }: IssuesListProps) {
	const filteredIssues = issues
		.filter(issue => issue.category === category)
		.sort((a, b) => {
			const severityOrder = { high: 3, medium: 2, low: 1 };
			const aSeverity = severityOrder[a.severity || 'medium'] || 2;
			const bSeverity = severityOrder[b.severity || 'medium'] || 2;
			return bSeverity - aSeverity;
		});

	const getCategoryLabel = (category: string): string => {
		switch (category) {
			case 'performance':
				return 'Performance Issues';
			case 'accessibility':
				return 'Accessibility Issues';
			case 'best-practices':
				return 'Best Practices Issues';
			case 'seo':
				return 'SEO Issues';
			case 'pwa':
				return 'PWA Issues';
			default:
				return 'Issues';
		}
	};

	const getCategoryIcon = (category: string): string => {
		switch (category) {
			case 'performance':
				return '⚡';
			case 'accessibility':
				return '♿';
			case 'best-practices':
				return '✅';
			case 'seo':
				return '🔍';
			case 'pwa':
				return '📱';
			default:
				return '⚠️';
		}
	};

	const getSeverityIcon = (severity: string): string => {
		switch (severity) {
			case 'high':
				return 'high';
			case 'medium':
				return 'medium';
			case 'low':
				return 'low';
			default:
				return 'medium';
		}
	};

	const formatSavings = (savingsTime?: number, savingsBytes?: number): string => {
		if (savingsTime && savingsBytes) {
			return `Estimated savings of ${formatBytes(savingsBytes)} and ${formatTime(savingsTime)}`;
		} else if (savingsBytes) {
			return `Estimated savings of ${formatBytes(savingsBytes)}`;
		} else if (savingsTime) {
			return `Estimated savings of ${formatTime(savingsTime)}`;
		}
		return '';
	};

	const formatBytes = (bytes: number): string => {
		if (bytes >= 1024 * 1024) {
			return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
		} else if (bytes >= 1024) {
			return `${(bytes / 1024).toFixed(1)} KiB`;
		}
		return `${bytes} B`;
	};

	const formatTime = (time: number): string => {
		if (time >= 1000) {
			return `${(time / 1000).toFixed(1)} s`;
		}
		return `${time} ms`;
	};

	if (isLoading) {
		return (
			<div className="issues-list">
				<div className="issues-loading">
					Loading issues...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="issues-list">
				<div className="issues-error">
					{error}
				</div>
			</div>
		);
	}

	if (filteredIssues.length === 0) {
		return (
			<div className="issues-list">
				<div className="issues-empty">
					<div className="empty-title">No {getCategoryLabel(category).toLowerCase()}</div>
					<div className="empty-description">
						No issues found for this category.
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="issues-list">
			<div className="issues-header">
				<span className="category-icon">{getCategoryIcon(category)}</span>
				<h4 className="category-title">{getCategoryLabel(category)}</h4>
				<span className="issues-count">({filteredIssues.length})</span>
			</div>
			<div className="issues-container">
				{filteredIssues.map(issue => (
					<div key={issue.id} className="issue-item">
						<div className="issue-header">
							<div className="issue-title-section">
								<div className={`severity-icon ${getSeverityIcon(issue.severity || 'medium')}`}></div>
								<h5 className="issue-title">{issue.title}</h5>
							</div>
							{/* <span className="issue-count">
								{issue.total_affected} affected
							</span> */}
						</div>
						<div className="issue-description-container">
							<p className="issue-description">{issue.description}</p>
							{formatSavings(issue.savings_time, issue.savings_bytes) && (
								<p className="issue-savings">- {formatSavings(issue.savings_time, issue.savings_bytes)}</p>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default IssuesList;