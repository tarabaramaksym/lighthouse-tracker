import { useState } from 'preact/compat';
import { apiService } from '@/services/api';
import { FormContainer } from '@/components/FormContainer';
import './DomainForm.css';

interface DomainFormProps {
	onDomainCreated: () => void;
	onCancel: () => void;
}

export function DomainForm({ onDomainCreated, onCancel }: DomainFormProps) {
	const [url, setUrl] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		if (!url.trim()) {
			setError('URL is required');
			return;
		}

		let cleanUrl = url.trim();

		if (!cleanUrl.startsWith('https://')) {
			setError('Only HTTPS URLs are allowed');
			return;
		}

		cleanUrl = cleanUrl.replace(/^https?:\/\//, '');

		try {
			setIsSubmitting(true);
			setError(null);

			await apiService.domains.createDomain(cleanUrl);
			onDomainCreated();
		} catch (err: any) {
			setError(err.message || 'Failed to create domain');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		setUrl('');
		setError(null);
		onCancel();
	};

	return (
		<FormContainer>
			<div className="domain-form">
				<h3>Add New Domain</h3>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="domain-url">Domain URL</label>
						<input
							type="url"
							id="domain-url"
							value={url}
							onChange={(e) => setUrl((e.target as HTMLInputElement).value)}
							placeholder="https://example.com"
							disabled={isSubmitting}
							required
						/>
						<small style="color: var(--color-gray-3); font-size: 12px; margin-top: 4px; display: block;">
							Only HTTPS URLs are allowed
						</small>
					</div>

					{error && (
						<div className="error-message">
							{error}
						</div>
					)}

					<div className="form-actions">
						<button
							type="button"
							onClick={handleCancel}
							disabled={isSubmitting}
							className="btn btn-secondary"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="btn btn-primary"
						>
							{isSubmitting ? 'Creating...' : 'Create Domain'}
						</button>
					</div>
				</form>
			</div>
		</FormContainer>
	);
} 