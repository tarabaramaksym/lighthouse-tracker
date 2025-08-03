import { useState, useEffect } from 'preact/compat';
import { apiService } from '@/services/api';
import { Button } from '@/components/Button';
import './UrlList.css';

interface Url {
	id: number;
	path: string;
	status: 'monitoring' | 'ignored' | '404';
	created_at: string;
	updated_at: string;
}

interface UrlListProps {
	domainId: number | null;
	selectedWebsiteId: number | null;
	onAddUrl: () => void;
	onWebsiteSelect: (websiteId: number) => void;
}

export function UrlList({ domainId, selectedWebsiteId, onAddUrl, onWebsiteSelect }: UrlListProps) {
	const [urls, setUrls] = useState<Url[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (domainId) {
			fetchUrls();
		} else {
			setUrls([]);
		}
	}, [domainId]);

	useEffect(() => {
		if (urls.length > 0 && selectedWebsiteId === null) {
			onWebsiteSelect(urls[0].id);
		}
	}, [urls, selectedWebsiteId, onWebsiteSelect]);

	const fetchUrls = async () => {
		if (!domainId) return;

		try {
			setIsLoading(true);
			setError(null);
			const response = await apiService.urls.getUrls(domainId);
			setUrls(response.urls);
		} catch (err: any) {
			setError(err.message || 'Failed to fetch URLs');
		} finally {
			setIsLoading(false);
		}
	};

	if (!domainId) {
		return (
			<div className="url-list">
				<div className="url-list-header">
					<h4>URLs</h4>
				</div>
				<div className="url-list-content">
					<div className="no-domain-selected">
						Select a domain to view URLs
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="url-list">
				<div className="url-list-header">
					<h4>URLs</h4>
				</div>
				<div className="url-list-content">
					<div className="loading-urls">
						Loading URLs...
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="url-list">
				<div className="url-list-header">
					<h4>URLs</h4>
				</div>
				<div className="url-list-content">
					<div className="error-message">
						{error}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="url-list">
			<div className="url-list-header">
				<h4>URLs</h4>
				<div className="url-list-actions">
					<span className="url-count">{urls.length} URLs</span>
					<Button title="Add URL" onClick={onAddUrl} disabled={!domainId} className="add-url-button">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<span>Add URL</span>
					</Button>
				</div>
			</div>
			<div className="url-list-content">
				{urls.length === 0 ? (
					<div className="no-urls">
						No URLs found for this domain
					</div>
				) : (
					urls.map(url => (
						<div
							key={url.id}
							className={`url-item ${selectedWebsiteId === url.id ? 'selected' : ''}`}
							onClick={() => onWebsiteSelect(url.id)}
						>
							<span className="url-path">{url.path}</span>
							<span className={`url-status url-status-${url.status}`}>
								{url.status}
							</span>
						</div>
					))
				)}
			</div>
		</div>
	);
} 