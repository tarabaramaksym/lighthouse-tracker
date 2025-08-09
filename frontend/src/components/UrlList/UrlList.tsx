import { useState, useEffect } from 'preact/compat';
import { apiService } from '@/services/api';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { getPlanLimits } from '@/services/planLimits';
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
	const { user } = useAuth();
	const limits = getPlanLimits(user?.plan);
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
		if (!domainId) {
			return;
		}

		try {
			setIsLoading(true);
			setError(null);
			const response = await apiService.urls.getUrls(domainId);
			setUrls(response.urls);
			return response.urls as Url[];
		} catch (err: any) {
			setError(err.message || 'Failed to fetch URLs');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteUrlClick = async () => {
		if (!selectedWebsiteId) {
			return;
		}

		const confirmed = window.confirm('Are you sure you want to delete this URL?');
		if (!confirmed) {
			return;
		}

		try {
			await apiService.urls.deleteUrl(selectedWebsiteId);
			const newUrls = await fetchUrls();
			if (newUrls && newUrls.length > 0) {
				onWebsiteSelect(newUrls[0].id);
			}
		} catch (err: any) {
			setError(err.message || 'Failed to delete URL');
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
					<span className="url-count" aria-label={`URLs used ${urls.length} out of your plan limit ${limits.maxUrls}`}>
						{urls.length}/{limits.maxUrls} URLs
					</span>
					<Button title={`Add URL${user?.is_read_only ? ' (Disabled for demo user)' : ''}`} onClick={onAddUrl} disabled={!domainId || !!user?.is_read_only} className="add-url-button">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<span>Add URL</span>
					</Button>
					<Button className="delete-url-button" title={`Delete URL${user?.is_read_only ? ' (Disabled for demo user)' : ''}`} onClick={handleDeleteUrlClick} disabled={!domainId || !selectedWebsiteId || !!user?.is_read_only}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
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