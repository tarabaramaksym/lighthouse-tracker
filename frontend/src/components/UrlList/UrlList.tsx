import { useState, useEffect } from 'preact/compat';
import { apiService } from '@/services/api';
import { AddUrlButton } from '@/components/AddUrlButton';
import './UrlList.css';

interface Url {
	id: number;
	path: string;
	status: 'monitoring' | 'ignored';
	created_at: string;
	updated_at: string;
}

interface UrlListProps {
	domainId: number | null;
	onAddUrl: () => void;
}

export function UrlList({ domainId, onAddUrl }: UrlListProps) {
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
					<AddUrlButton onClick={onAddUrl} disabled={!domainId} />
				</div>
			</div>
			<div className="url-list-content">
				{urls.length === 0 ? (
					<div className="no-urls">
						No URLs found for this domain
					</div>
				) : (
					urls.map(url => (
						<div key={url.id} className="url-item">
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