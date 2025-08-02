import { useState } from 'preact/compat';
import { apiService } from '@/services/api';
import { FormContainer } from '@/components/FormContainer';
import { Button } from '@/components/Button';
import './DomainForm.css';

interface DomainFormProps {
	onDomainCreated: () => void;
	onCancel: () => void;
	mode?: 'create' | 'update';
	domain?: {
		id: number;
		url: string;
		lighthouse_schedule?: string;
	};
}

export function DomainForm({ onDomainCreated, onCancel, mode = 'create', domain }: DomainFormProps) {
	const [url, setUrl] = useState(domain?.url || '');
	const [lighthouseSchedule, setLighthouseSchedule] = useState(domain?.lighthouse_schedule || '12:00');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		if (!url.trim()) {
			setError('URL is required');
			return;
		}

		let cleanUrl = url.trim();

		cleanUrl = cleanUrl.replace(/^https?:\/\//, '');
		cleanUrl = cleanUrl.replace(/^www\./, '');

		if (!cleanUrl.includes('.') || cleanUrl.length < 3) {
			setError('Please enter a valid domain (e.g., example.com, x.com)');
			return;
		}

		try {
			setIsSubmitting(true);
			setError(null);

			if (mode === 'update' && domain) {
				await apiService.domains.updateDomain(domain.id, cleanUrl, lighthouseSchedule);
			} else {
				await apiService.domains.createDomain(cleanUrl, lighthouseSchedule);
			}
			onDomainCreated();
		} catch (err: any) {
			setError(err.message || `Failed to ${mode} domain`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		setUrl('');
		setLighthouseSchedule('12:00');
		setError(null);
		onCancel();
	};

	return (
		<FormContainer>
			<div className="domain-form">
				<h3>{mode === 'update' ? 'Update Domain' : 'Add New Domain'}</h3>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="domain-url">Domain URL</label>
						<input
							type="text"
							id="domain-url"
							value={url}
							onChange={(e) => setUrl((e.target as HTMLInputElement).value)}
							placeholder="example.com"
							disabled={isSubmitting}
							required
						/>
						<small style="color: var(--color-gray-3); font-size: 12px; margin-top: 4px; display: block;">
							Enter domain name (e.g., example.com, www.example.com)
						</small>
					</div>

					<div className="form-group">
						<label htmlFor="lighthouse-schedule">
							⚡ Lighthouse Schedule
						</label>
						<input
							type="time"
							id="lighthouse-schedule"
							value={lighthouseSchedule}
							onChange={(e) => setLighthouseSchedule((e.target as HTMLInputElement).value)}
							disabled={isSubmitting}
							step="900"
						/>
						<small style="color: var(--color-gray-3); font-size: 12px; margin-top: 4px; display: block;">
							Time when Lighthouse audits will run (15-minute intervals)
						</small>
					</div>

					{error && (
						<div className="error-message">
							{error}
						</div>
					)}

					<div className="form-actions">
						<Button
							type="button"
							onClick={handleCancel}
							disabled={isSubmitting}
							className="btn btn-secondary"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="btn btn-primary"
						>
							{isSubmitting ? (mode === 'update' ? 'Updating...' : 'Creating...') : (mode === 'update' ? 'Update Domain' : 'Create Domain')}
						</Button>
					</div>
				</form>
			</div>
		</FormContainer>
	);
} 