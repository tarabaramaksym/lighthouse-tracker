import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'preact/compat';
import { useSearchParams } from 'react-router-dom';
import { DomainDropdown } from '@/components/DomainDropdown';
import { AddDomainButton } from '@/components/AddDomainButton';
import { DomainForm } from '@/components/DomainForm';
import { UrlList } from '@/components/UrlList';
import { UrlForm } from '@/components/UrlForm';
import { PerformanceCalendar } from '@/components/PerformanceCalendar';
import { FormContainer } from '@/components/FormContainer';
import './Dashboard.css';

type FormState = 'none' | 'domain' | 'url';

export function Dashboard() {
	const { user } = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [formState, setFormState] = useState<FormState>('none');

	const domainIdFromUrl = searchParams.get('domain');
	const dateFromUrl = searchParams.get('date');

	useEffect(() => {
		if (domainIdFromUrl) {
			const domainId = parseInt(domainIdFromUrl);
			if (!isNaN(domainId)) {
				setSelectedDomainId(domainId);
			}
		}
		if (dateFromUrl) {
			setSelectedDate(dateFromUrl);
		}
	}, [domainIdFromUrl, dateFromUrl]);

	const handleDomainChange = (domainId: number) => {
		setSelectedDomainId(domainId);
		setSearchParams({ domain: domainId.toString() });
	};

	const handleDateSelect = (date: string) => {
		setSelectedDate(date);
		const params: Record<string, string> = { domain: selectedDomainId!.toString() };
		if (date) {
			params.date = date;
		}
		setSearchParams(params);
	};

	const handleAddDomainClick = () => {
		setFormState('domain');
	};

	const handleDomainCreated = () => {
		setFormState('none');
		window.location.reload();
	};

	const handleCancelDomainForm = () => {
		setFormState('none');
	};

	const handleAddUrlClick = () => {
		setFormState('url');
	};

	const handleUrlCreated = () => {
		setFormState('none');
		window.location.reload();
	};

	const handleCancelUrlForm = () => {
		setFormState('none');
	};

	const renderMainContent = () => {
		switch (formState) {
			case 'domain':
				return (
					<DomainForm
						onDomainCreated={handleDomainCreated}
						onCancel={handleCancelDomainForm}
					/>
				);
			case 'url':
				return (
					<UrlForm
						domainId={selectedDomainId!}
						onUrlCreated={handleUrlCreated}
						onCancel={handleCancelUrlForm}
					/>
				);
			default:
				return (
					<section style="display: flex;">
						<section style="margin-right: 24px; width: 300px;">
							<UrlList domainId={selectedDomainId} onAddUrl={handleAddUrlClick} />
						</section>
						<section style="flex: 1">
							<section style="display: flex; gap: 12px;">
								{/* Calendar with performance scores*/}
								<div style="flex: 1;">
									<PerformanceCalendar
										domainId={selectedDomainId}
										selectedDate={selectedDate}
										onDateSelect={handleDateSelect}
									/>
								</div>
								{/* Chart of the scores */}
								<div style="flex: 1"></div>
							</section>
							<section>
								{/* Breakdown with current scores for selected date*/}
								<div style="margin-top: 24px; height: 284px;"></div>
							</section>
							<section>
								{/* All issues for selected date */}
								<div style="margin-top: 24px; height: 484px;"></div>
							</section>
						</section>
					</section>
				);
		}
	};

	return (
		<div className="dashboard-container">
			<main className="dashboard-content">
				{/* Dashbaard top settings area */}
				<section style="display: flex; justify-content: space-between; margin-bottom: 24px">
					<section style="display: flex;">
						<DomainDropdown
							selectedDomainId={selectedDomainId}
							onDomainChange={handleDomainChange}
						/>
						<AddDomainButton onClick={handleAddDomainClick} />
					</section>
					<section style="display: flex;">
						{/* Settings & Alerts buttons*/}
						<div style="margin-right: 12px; width: 44px; height: 44px;"></div>
						<div style="width: 44px; height: 44px;"></div>
					</section>
				</section>
				{/* Main content area */}
				{renderMainContent()}
			</main>
		</div >
	);
}

export default Dashboard; 