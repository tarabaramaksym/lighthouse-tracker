import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'preact/compat';
import { useSearchParams } from 'react-router-dom';
import { DomainDropdown } from '@/components/DomainDropdown';
import { Button } from '@/components/Button';
import { DomainForm } from '@/components/DomainForm';
import { UrlList } from '@/components/UrlList';
import { UrlForm } from '@/components/UrlForm';
import { PerformanceCalendar } from '@/components/PerformanceCalendar';
import { ScoresBreakdown } from '@/components/ScoresBreakdown';
import { ScoresChart, ChartControls } from '@/components/ScoresChart';
import { getPlanLimits } from '@/services/planLimits';
import { useDataCache } from '@/hooks/useDataCache';
import { apiService } from '@/services/api';
import './Dashboard.css';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

type FormState = 'none' | 'domain' | 'url';
type ViewState = 'main' | 'charts';

export function Dashboard() {
	useDocumentTitle('Lighthouse Keeper – Dashboard');
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
	const [editingDomain, setEditingDomain] = useState<any>(null);
	const [domains, setDomains] = useState<any[]>([]);
	const [domainReloadKey, setDomainReloadKey] = useState<number>(0);
	const [urlReloadKey, setUrlReloadKey] = useState<number>(0);
	const [currentCalendarMonth, setCurrentCalendarMonth] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });

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
			const shouldClearData = !calendarData ||
				calendarData.domain?.id !== selectedDomainId ||
				calendarData.website?.id !== selectedWebsiteId;

			if (shouldClearData) {
				setCalendarData(null);
			}
			fetchCalendarData();
		} else {
			setCalendarData(null);
		}
	}, [selectedDomainId, selectedWebsiteId, isMobile, currentCalendarMonth]);

	useEffect(() => {
		fetchDomains();
	}, []);

	const fetchDailyData = async () => {
		if (!selectedDomainId || !selectedWebsiteId || !selectedDate) return;

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

			cache.set(selectedDomainId, selectedWebsiteId, selectedDate, response.data, isMobile);
		} catch (err: any) {
			setDailyError(err.message || 'Failed to fetch daily data');
		} finally {
			setIsLoadingDaily(false);
		}
	};

	const fetchCalendarData = async () => {
		if (!selectedDomainId || !selectedWebsiteId) return;

		const { year, month } = currentCalendarMonth;

		const monthsToFetch = [
			{ year, month },
			{ year: month === 1 ? year - 1 : year, month: month === 1 ? 12 : month - 1 },
			{ year: month === 12 ? year + 1 : year, month: month === 12 ? 1 : month + 1 }
		];

		try {
			setIsLoadingCalendar(true);
			setCalendarError(null);

			const currentMonthData = monthsToFetch[0];
			const cacheKey = `${selectedDomainId}-${selectedWebsiteId}-calendar-${currentMonthData.year}-${currentMonthData.month}-${isMobile}`;

			const cachedData = cache.get(selectedDomainId, selectedWebsiteId, cacheKey);
			if (cachedData) {
				// Merge with any existing adjacent month data
				setCalendarData((prevData: any) => {
					if (!prevData) return cachedData;

					const allData: Record<string, any> = {};

					// Merge existing data
					if (prevData.daily_scores) {
						Object.assign(allData, prevData.daily_scores);
					}

					// Merge cached data
					if (cachedData.daily_scores) {
						Object.assign(allData, cachedData.daily_scores);
					}

					return {
						...cachedData,
						daily_scores: allData
					};
				});
			} else {
				const response = await apiService.issues.getCalendarData(selectedDomainId, selectedWebsiteId, currentMonthData.year, currentMonthData.month, isMobile);

				// Merge with any existing adjacent month data
				setCalendarData((prevData: any) => {
					const allData: Record<string, any> = {};

					// Merge existing data
					if (prevData && prevData.daily_scores) {
						Object.assign(allData, prevData.daily_scores);
					}

					// Merge new data
					if (response.data && response.data.daily_scores) {
						Object.assign(allData, response.data.daily_scores);
					}

					return {
						...response.data,
						daily_scores: allData
					};
				});

				cache.set(selectedDomainId, selectedWebsiteId, cacheKey, response.data);
			}

			const adjacentMonths = monthsToFetch.slice(1);

			for (const { year: fetchYear, month: fetchMonth } of adjacentMonths) {
				const cacheKey = `${selectedDomainId}-${selectedWebsiteId}-calendar-${fetchYear}-${fetchMonth}-${isMobile}`;

				const cachedData = cache.get(selectedDomainId, selectedWebsiteId, cacheKey);
				if (cachedData) continue;

				apiService.issues.getCalendarData(selectedDomainId, selectedWebsiteId, fetchYear, fetchMonth, isMobile)
					.then(response => {
						cache.set(selectedDomainId, selectedWebsiteId, cacheKey, response.data);

						setCalendarData((prevData: any) => {
							if (!prevData) return prevData;

							const allData: Record<string, any> = {};

							if (prevData.daily_scores) {
								Object.assign(allData, prevData.daily_scores);
							}

							if (response.data && response.data.daily_scores) {
								Object.assign(allData, response.data.daily_scores);
							}

							return {
								...prevData,
								daily_scores: allData
							};
						});
					})
					.catch(err => {
						console.error(`Failed to fetch data for ${fetchYear}-${fetchMonth}:`, err);
					});
			}
		} catch (err: any) {
			setCalendarError(err.message || 'Failed to fetch calendar data');
		} finally {
			setIsLoadingCalendar(false);
		}
	};

	const handleCalendarMonthChange = (year: number, month: number) => {
		setCurrentCalendarMonth({ year, month });
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

	const handleUpdateDomainClick = () => {
		if (selectedDomainId) {
			const selectedDomain = domains.find((d: any) => d.id === selectedDomainId);
			if (selectedDomain) {
				setEditingDomain(selectedDomain);
				setFormState('domain');
			}
		}
	};

	const handleDeleteDomainClick = async () => {
		if (!selectedDomainId) {
			return
		};

		const confirmed = window.confirm('Are you sure you want to delete this domain?');

		if (!confirmed) {
			return
		};

		try {
			await apiService.domains.deleteDomain(selectedDomainId);
			setSelectedDomainId(null);
			setSelectedWebsiteId(null);
			setSelectedDate(null);
			setSearchParams({});
			fetchDomains();
			setDomainReloadKey(prev => prev + 1);
		} catch (error: any) {
			alert(error.message || 'Failed to delete domain');
		}
	};

	const fetchDomains = async () => {
		try {
			const response = await apiService.domains.getDomains();
			setDomains(response.domains || []);
		} catch (error) {
			console.error('Failed to fetch domains:', error);
		}
	};

	const handleDomainCreated = () => {
		setFormState('none');
		setEditingDomain(null);
		fetchDomains();
		setDomainReloadKey(prev => prev + 1);
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

	const handleUrlCreated = (newWebsiteId: number) => {
		setFormState('none');
		setSelectedWebsiteId(newWebsiteId);
		const params: Record<string, string> = {
			domain: selectedDomainId!.toString(),
			website: newWebsiteId.toString()
		};
		if (selectedDate) {
			params.date = selectedDate;
		}
		setSearchParams(params);
		setUrlReloadKey(prev => prev + 1);
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

	const renderMainContent = () => {
		switch (formState) {
			case 'domain':
				return (
					<DomainForm
						onDomainCreated={handleDomainCreated}
						onCancel={handleCancelDomainForm}
						mode={editingDomain ? 'update' : 'create'}
						domain={editingDomain}
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
					<section className="dashboard-content-wrapper">
						<section style="margin-right: 24px; width: 300px;">
							<UrlList
								key={`${selectedDomainId}-${urlReloadKey}`}
								domainId={selectedDomainId}
								selectedWebsiteId={selectedWebsiteId}
								onAddUrl={handleAddUrlClick}
								onWebsiteSelect={handleWebsiteSelect}
							/>
						</section>
						<section style="flex: 1">
							<div className="view-tabs">
								<div className="mobile-toggle">
									<Button title="Main Dashboard View" onClick={() => handleViewChange('main')} className={`view-tab ${viewState === 'main' ? 'active' : ''}`}>
										📊
									</Button>
									<Button title="Charts View" onClick={() => handleViewChange('charts')} className={`view-tab ${viewState === 'charts' ? 'active' : ''}`}>
										📈
									</Button>
								</div>
								<div className="mobile-toggle">
									<Button title="Desktop View" onClick={() => setIsMobile(false)} className={`toggle-button ${!isMobile ? 'active' : ''}`}>
										💻
									</Button>
									<Button title="Mobile View" onClick={() => setIsMobile(true)} className={`toggle-button ${isMobile ? 'active' : ''}`}>
										📱
									</Button>
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
												onMonthChange={handleCalendarMonthChange}
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
				<p className="domains-limits url-count" aria-label={`Domains used ${domains.length} out of your plan limit ${getPlanLimits(user?.plan).maxDomains}`}>
					{domains.length}/{getPlanLimits(user?.plan).maxDomains} Domains
				</p>
				<section style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
					<section className="dashboard-domain-actions">
						<DomainDropdown
							selectedDomainId={selectedDomainId}
							onDomainChange={handleDomainChange}
							reloadKey={domainReloadKey}
						/>

						<div style="display: flex; gap: 12px;">
							<Button onClick={handleUpdateDomainClick} title={`Update domain${user?.is_read_only ? ' (Disabled for demo user)' : ''}`} disabled={!!user?.is_read_only}>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									<path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</Button>

							<Button onClick={handleAddDomainClick} title={`Add domain${user?.is_read_only ? ' (Disabled for demo user)' : ''}`} disabled={!!user?.is_read_only}>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</Button>

							<Button onClick={handleDeleteDomainClick} title={`Delete domain${user?.is_read_only ? ' (Disabled for demo user)' : ''}`} disabled={!selectedDomainId || !!user?.is_read_only}>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									<path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</Button>
						</div>
					</section>
				</section>
				{/* Main content area */}
				{renderMainContent()}
			</main>
		</div >
	);
}

export default Dashboard; 