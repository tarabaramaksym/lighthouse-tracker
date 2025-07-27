import { useState, useEffect } from 'preact/compat';
import { apiService } from '@/services/api';
import './PerformanceCalendar.css';

interface DailyScore {
	performance: number;
	accessibility: number;
	best_practices: number;
	seo: number;
	pwa: number;
	overall: number;
}

interface CalendarData {
	year: number;
	month: number;
	domain: {
		id: number;
		url: string;
	};
	daily_scores: Record<string, DailyScore>;
	total_days_with_data: number;
}

interface PerformanceCalendarProps {
	domainId: number | null;
	selectedDate: string | null;
	onDateSelect: (date: string) => void;
}

export function PerformanceCalendar({ domainId, selectedDate, onDateSelect }: PerformanceCalendarProps) {
	const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (domainId) {
			fetchCalendarData();
		}
	}, [domainId, currentMonth]);

	const fetchCalendarData = async () => {
		if (!domainId) return;

		try {
			setIsLoading(true);
			setError(null);

			const year = currentMonth.getFullYear();
			const month = currentMonth.getMonth() + 1;

			const response = await apiService.issues.getCalendarData(domainId, year, month);
			setCalendarData(response.data);
		} catch (err: any) {
			setError(err.message || 'Failed to fetch calendar data');
		} finally {
			setIsLoading(false);
		}
	};

	const getPerformanceColor = (score: number): string => {
		if (score >= 90) return 'green';
		if (score >= 50) return 'yellow';
		return 'red';
	};

	const getPerformanceText = (score: number): string => {
		if (score >= 90) return 'Good';
		if (score >= 50) return 'Needs Improvement';
		return 'Poor';
	};

	const renderCalendarHeader = () => {
		const monthNames = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];

		return (
			<div className="calendar-header">
				<button
					className="calendar-nav-btn"
					onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
				>
					←
				</button>
				<h3 className="calendar-title">
					{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
				</h3>
				<button
					className="calendar-nav-btn"
					onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
				>
					→
				</button>
			</div>
		);
	};

	const renderCalendarGrid = () => {
		if (!calendarData) return null;

		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - firstDay.getDay());

		const days = [];
		const currentDate = new Date(startDate);

		while (currentDate <= lastDay || currentDate.getDay() !== 0) {
			const dateKey = currentDate.toISOString().split('T')[0];
			const isCurrentMonth = currentDate.getMonth() === month;
			const dayScore = calendarData.daily_scores[dateKey];
			const isSelected = selectedDate === dateKey;

			days.push(
				<div
					key={dateKey}
					className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isSelected ? 'selected' : ''}`}
					onClick={() => {
						if (isCurrentMonth && dayScore) {
							onDateSelect(dateKey);
						}
					}}
				>
					<span className="day-number">{currentDate.getDate()}</span>
					{isCurrentMonth && dayScore && (
						<div className={`performance-indicator ${getPerformanceColor(dayScore.overall)}`}>
							<span className="score-text">{dayScore.overall}</span>
							<span className="performance-text">{getPerformanceText(dayScore.overall)}</span>
						</div>
					)}
				</div>
			);

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return (
			<div className="calendar-grid">
				<div className="calendar-weekdays">
					<div>Sun</div>
					<div>Mon</div>
					<div>Tue</div>
					<div>Wed</div>
					<div>Thu</div>
					<div>Fri</div>
					<div>Sat</div>
				</div>
				<div className="calendar-days">
					{days}
				</div>
			</div>
		);
	};

	if (!domainId) {
		return (
			<div className="performance-calendar">
				<div className="calendar-placeholder">
					Select a domain to view performance calendar
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="performance-calendar">
				<div className="calendar-placeholder">
					Loading calendar data...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="performance-calendar">
				<div className="calendar-placeholder error">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className="performance-calendar">
			{renderCalendarHeader()}
			{renderCalendarGrid()}
			<div className="calendar-legend">
				<div className="legend-item">
					<div className="legend-color green"></div>
					<span>Good (90+)</span>
				</div>
				<div className="legend-item">
					<div className="legend-color yellow"></div>
					<span>Needs Improvement (50-89)</span>
				</div>
				<div className="legend-item">
					<div className="legend-color red"></div>
					<span>Poor (0-49)</span>
				</div>
				<div className="legend-item">
					<div className="legend-color gray"></div>
					<span>No Data</span>
				</div>
			</div>
		</div>
	);
} 