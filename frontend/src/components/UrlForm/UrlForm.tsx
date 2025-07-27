import { useState } from 'preact/compat';
import { apiService } from '@/services/api';
import { FormContainer } from '@/components/FormContainer';
import './UrlForm.css';

interface UrlFormProps {
	domainId: number;
	onUrlCreated: () => void;
	onCancel: () => void;
}

export function UrlForm({ domainId, onUrlCreated, onCancel }: UrlFormProps) {
	const [path, setPath] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		if (!path.trim()) {
			setError('Path is required');
			return;
		}

		try {
			setIsSubmitting(true);
			setError(null);

			await apiService.urls.createUrl(domainId, path.trim());
			onUrlCreated();
		} catch (err: any) {
			setError(err.message || 'Failed to create URL');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		setPath('');
		setError(null);
		onCancel();
	};

	return (
		<FormContainer>
			<div className="url-form">
				<h3>Add New URL</h3>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="url-path">URL Path</label>
						<input
							type="text"
							id="url-path"
							value={path}
							onChange={(e) => setPath((e.target as HTMLInputElement).value)}
							placeholder="/dashboard"
							disabled={isSubmitting}
							required
						/>
						<small style="color: var(--color-gray-3); font-size: 12px; margin-top: 4px; display: block;">
							Enter the path (e.g., /dashboard, /about)
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
							{isSubmitting ? 'Creating...' : 'Create URL'}
						</button>
					</div>
				</form>
			</div>
		</FormContainer>
	);
} 