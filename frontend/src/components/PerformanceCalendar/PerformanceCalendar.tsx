import { useState, useEffect } from 'preact/compat';
import { Placeholder } from '@/components/Placeholder';
import { Button } from '@/components/Button';
import './PerformanceCalendar.css';

interface DailyScore {
	performance: number;
	accessibility: number;
	best_practices: number;
	seo: number;
	pwa: number | null;
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
	websiteId: number | null;
	selectedDate: string | null;
	onDateSelect: (date: string) => void;
	data: any;
	isLoading: boolean;
	error: string | null;
	isMobile: boolean;
}

export function PerformanceCalendar({ domainId, websiteId, selectedDate, onDateSelect, data, isLoading, error }: PerformanceCalendarProps) {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const calendarData = data;



	const getPerformanceColor = (score: number): string => {
		if (score >= 90) return 'green';
		if (score >= 50) return 'yellow';
		return 'red';
	};

	const renderCalendarHeader = () => {
		const monthNames = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];

		return (
			<div className="calendar-header">
				<Button
					className="calendar-nav-btn"
					onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
				>
					←
				</Button>
				<h3 className="calendar-title">
					{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
				</h3>
				<Button
					className="calendar-nav-btn"
					onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
				>
					→
				</Button>
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
			const dateKey = currentDate.toLocaleDateString('en-CA');
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

	if (!domainId || !websiteId) {
		return (
			<div className="performance-calendar">
				<Placeholder
					desktopHeight="480px"
					desktopWidth="478px"
					mobileHeight="480px"
					mobileWidth="478px"
				>
					<div className="selection-message">
						Select a domain and website to view performance calendar
					</div>
				</Placeholder>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="performance-calendar">
				<Placeholder
					desktopHeight="480px"
					desktopWidth="478px"
					mobileHeight="480px"
					mobileWidth="478px"
				/>
			</div>
		);
	}

	if (error) {
		return (
			<div className="performance-calendar">
				<Placeholder
					desktopHeight="480px"
					desktopWidth="478px"
					mobileHeight="480px"
					mobileWidth="478px"
				>
					<div className="error-message">
						{error}
					</div>
				</Placeholder>
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

export default PerformanceCalendar; 