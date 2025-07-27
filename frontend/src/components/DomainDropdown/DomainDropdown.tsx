import { useState, useEffect } from 'preact/compat';
import { apiService } from '@/services/api';
import './DomainDropdown.css';

interface Domain {
	id: number;
	url: string;
	status: 'active' | 'inactive';
	created_at: string;
	updated_at: string;
}

interface DomainDropdownProps {
	selectedDomainId: number | null;
	onDomainChange: (domainId: number) => void;
}

export function DomainDropdown({ selectedDomainId, onDomainChange }: DomainDropdownProps) {
	const [domains, setDomains] = useState<Domain[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchDomains();
	}, []);

	useEffect(() => {
		if (domains.length > 0 && !selectedDomainId) {
			onDomainChange(domains[0].id);
		}
	}, [domains, selectedDomainId, onDomainChange]);

	const fetchDomains = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await apiService.domains.getDomains();
			setDomains(response.domains);
		} catch (err: any) {
			setError(err.message || 'Failed to fetch domains');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelectChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		const domainId = parseInt(target.value);
		onDomainChange(domainId);
	};

	if (isLoading) {
		return (
			<div className="domain-dropdown">
				<select disabled>
					<option>Loading domains...</option>
				</select>
			</div>
		);
	}

	if (error) {
		return (
			<div className="domain-dropdown">
				<select disabled>
					<option>Error loading domains</option>
				</select>
			</div>
		);
	}

	if (domains.length === 0) {
		return (
			<div className="domain-dropdown">
				<select disabled>
					<option>No domains found</option>
				</select>
			</div>
		);
	}

	return (
		<div className="domain-dropdown">
			<select
				value={selectedDomainId || ''}
				onChange={handleSelectChange}
			>
				{domains.map(domain => (
					<option key={domain.id} value={domain.id}>
						{domain.url}
					</option>
				))}
			</select>
		</div>
	);
} 