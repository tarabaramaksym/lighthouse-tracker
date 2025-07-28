import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'preact/compat';
import { useSearchParams } from 'react-router-dom';
import { DomainDropdown } from '@/components/DomainDropdown';
import { AddDomainButton } from '@/components/AddDomainButton';
import { DomainForm } from '@/components/DomainForm';
import { UrlList } from '@/components/UrlList';
import { UrlForm } from '@/components/UrlForm';
import { PerformanceCalendar } from '@/components/PerformanceCalendar';
import { ScoresBreakdown } from '@/components/ScoresBreakdown';
import { ScoresChart, ChartControls } from '@/components/ScoresChart';
import { FormContainer } from '@/components/FormContainer';
import { useDataCache } from '@/hooks/useDataCache';
import { apiService } from '@/services/api';
import './Dashboard.css';

type FormState = 'none' | 'domain' | 'url';
type ViewState = 'main' | 'charts';

export function Dashboard() {
	const { user } = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
	const [selectedWebsiteId, setSelectedWebsiteId] = useState<number | null>(null);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [formState, setFormState] = useState<FormState>('none');
	const [viewState, setViewState] = useState<ViewState>('main');
	const [chartDateRange, setChartDateRange] = useState<'7d' | '14d' | '30d'>('7d');
	const [selectedChartMetrics, setSelectedChartMetrics] = useState<('performance' | 'accessibility' | 'best_practices' | 'seo' | 'pwa')[]>(['performance', 'accessibility', 'best_practices', 'seo', 'pwa']);
	const cache = useDataCache();
	const [dailyData, setDailyData] = useState<any>(null);
	const [isLoadingDaily, setIsLoadingDaily] = useState(false);
	const [dailyError, setDailyError] = useState<string | null>(null);
	const [calendarData, setCalendarData] = useState<any>(null);
	const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
	const [calendarError, setCalendarError] = useState<string | null>(null);

	const domainIdFromUrl = searchParams.get('domain');
	const websiteIdFromUrl = searchParams.get('website');
	const dateFromUrl = searchParams.get('date');

	useEffect(() => {
		if (domainIdFromUrl) {
			const domainId = parseInt(domainIdFromUrl);
			if (!isNaN(domainId)) {
				setSelectedDomainId(domainId);
			}
		}
		if (websiteIdFromUrl) {
			const websiteId = parseInt(websiteIdFromUrl);
			if (!isNaN(websiteId)) {
				setSelectedWebsiteId(websiteId);
			}
		} else {
			setSelectedWebsiteId(null);
		}
		if (dateFromUrl) {
			setSelectedDate(dateFromUrl);
		}
	}, [domainIdFromUrl, websiteIdFromUrl, dateFromUrl]);

	useEffect(() => {
		if (selectedDomainId && selectedWebsiteId && selectedDate) {
			fetchDailyData();
		} else {
			setDailyData(null);
		}
	}, [selectedDomainId, selectedWebsiteId, selectedDate, isMobile]);

	useEffect(() => {
		if (selectedDomainId && selectedWebsiteId) {
			fetchCalendarData();
		} else {
			setCalendarData(null);
		}
	}, [selectedDomainId, selectedWebsiteId, isMobile]);

	const fetchDailyData = async () => {
		if (!selectedDomainId || !selectedWebsiteId || !selectedDate) return;

		// Check cache first
		const cachedData = cache.get(selectedDomainId, selectedWebsiteId, selectedDate, isMobile);
		if (cachedData) {
			setDailyData(cachedData);
			return;
		}

		try {
			setIsLoadingDaily(true);
			setDailyError(null);
			const response = await apiService.issues.getDailyIssues(selectedDomainId, selectedWebsiteId, selectedDate, isMobile);
			setDailyData(response.data);

			// Cache the response
			cache.set(selectedDomainId, selectedWebsiteId, selectedDate, response.data, isMobile);
		} catch (err: any) {
			setDailyError(err.message || 'Failed to fetch daily data');
		} finally {
			setIsLoadingDaily(false);
		}
	};

	const fetchCalendarData = async () => {
		if (!selectedDomainId || !selectedWebsiteId) return;

		const currentDate = new Date();
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth() + 1;
		const cacheKey = `${selectedDomainId}-${selectedWebsiteId}-calendar-${year}-${month}-${isMobile}`;

		// Check cache first
		const cachedData = cache.get(selectedDomainId, selectedWebsiteId, cacheKey);
		if (cachedData) {
			setCalendarData(cachedData);
			return;
		}

		try {
			setIsLoadingCalendar(true);
			setCalendarError(null);
			const response = await apiService.issues.getCalendarData(selectedDomainId, selectedWebsiteId, year, month, isMobile);
			setCalendarData(response.data);

			// Cache the response
			cache.set(selectedDomainId, selectedWebsiteId, cacheKey, response.data);
		} catch (err: any) {
			setCalendarError(err.message || 'Failed to fetch calendar data');
		} finally {
			setIsLoadingCalendar(false);
		}
	};

	const handleDomainChange = (domainId: number) => {
		setSelectedDomainId(domainId);
		setSelectedWebsiteId(null);
		const today = new Date().toLocaleDateString('en-CA');
		setSelectedDate(today);
		const params: Record<string, string> = {
			domain: domainId.toString(),
			date: today
		};
		setSearchParams(params);
	};

	const handleDateSelect = (date: string) => {
		setSelectedDate(date);
		const params: Record<string, string> = {
			domain: selectedDomainId!.toString(),
			website: selectedWebsiteId!.toString()
		};
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

	const handleWebsiteSelect = (websiteId: number) => {
		setSelectedWebsiteId(websiteId);
		const params: Record<string, string> = {
			domain: selectedDomainId!.toString(),
			website: websiteId.toString()
		};
		if (selectedDate) {
			params.date = selectedDate;
		}
		setSearchParams(params);
	};

	const handleUrlCreated = () => {
		setFormState('none');
		window.location.reload();
	};

	const handleCancelUrlForm = () => {
		setFormState('none');
	};

	const handleChartDateRangeChange = (range: '7d' | '14d' | '30d') => {
		setChartDateRange(range);
	};

	const handleChartMetricToggle = (metric: 'performance' | 'accessibility' | 'best_practices' | 'seo' | 'pwa') => {
		setSelectedChartMetrics(prev => {
			if (prev.includes(metric)) {
				return prev.filter(m => m !== metric);
			} else {
				return [...prev, metric];
			}
		});
	};

	const handleViewChange = (view: ViewState) => {
		setViewState(view);
	};

	const handleMobileToggle = () => {
		setIsMobile(!isMobile);
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
							<UrlList
								key={selectedDomainId}
								domainId={selectedDomainId}
								selectedWebsiteId={selectedWebsiteId}
								onAddUrl={handleAddUrlClick}
								onWebsiteSelect={handleWebsiteSelect}
							/>
						</section>
						<section style="flex: 1">
							<div className="view-tabs">
								<div className="mobile-toggle">
									<button
										className={`view-tab ${viewState === 'main' ? 'active' : ''}`}
										onClick={() => handleViewChange('main')}
										aria-label="Main Dashboard View"
									>
										📊
									</button>
									<button
										className={`view-tab ${viewState === 'charts' ? 'active' : ''}`}
										onClick={() => handleViewChange('charts')}
										aria-label="Charts View"
									>
										📈
									</button>
								</div>
								<div className="mobile-toggle">
									<button
										className={`toggle-button ${!isMobile ? 'active' : ''}`}
										onClick={() => setIsMobile(false)}
										aria-label="Desktop View"
									>
										💻
									</button>
									<button
										className={`toggle-button ${isMobile ? 'active' : ''}`}
										onClick={() => setIsMobile(true)}
										aria-label="Mobile View"
									>
										📱
									</button>
								</div>
							</div>
							{viewState === 'main' ? (
								<>
									<section>
										{/* Calendar with performance scores*/}
										<div style="flex: 1; width: fit-content;">
											<PerformanceCalendar
												domainId={selectedDomainId}
												websiteId={selectedWebsiteId}
												selectedDate={selectedDate}
												onDateSelect={handleDateSelect}
												data={calendarData}
												isLoading={isLoadingCalendar}
												error={calendarError}
												isMobile={isMobile}
											/>
										</div>
									</section>
									<section>
										{/* Breakdown with current scores for selected date*/}
										<div style="margin-top: 24px;">
											<ScoresBreakdown
												domainId={selectedDomainId}
												websiteId={selectedWebsiteId}
												selectedDate={selectedDate}
												data={dailyData}
												isLoading={isLoadingDaily}
												error={dailyError}
												isMobile={isMobile}
											/>
										</div>
									</section>
								</>
							) : (
								<section>
									{/* Chart of the scores */}
									<div style="flex: 1; display: flex; flex-direction: column;">
										<ChartControls
											dateRange={chartDateRange}
											onDateRangeChange={handleChartDateRangeChange}
											selectedMetrics={selectedChartMetrics}
											onMetricToggle={handleChartMetricToggle}
										/>
										<ScoresChart
											domainId={selectedDomainId}
											websiteId={selectedWebsiteId}
											dateRange={chartDateRange}
											selectedMetrics={selectedChartMetrics}
											height={600}
											cache={cache}
											isMobile={isMobile}
										/>
									</div>
								</section>
							)}
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
					</section>
				</section>
				{/* Main content area */}
				{renderMainContent()}
			</main>
		</div >
	);
}

export default Dashboard; 