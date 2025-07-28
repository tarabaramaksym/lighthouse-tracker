import './Placeholder.css';

interface PlaceholderProps {
	desktopHeight?: string;
	desktopWidth?: string;
	mobileHeight?: string;
	mobileWidth?: string;
	className?: string;
	children?: React.ReactNode;
}

export function Placeholder({
	desktopHeight = 'auto',
	desktopWidth = 'auto',
	mobileHeight = 'auto',
	mobileWidth = 'auto',
	className = '',
	children
}: PlaceholderProps) {
	return (
		<div className={`placeholder ${className}`}>
			<div
				className="placeholder-content"
				style={{
					'--desktop-height': desktopHeight,
					'--desktop-width': desktopWidth,
					'--mobile-height': mobileHeight,
					'--mobile-width': mobileWidth
				} as React.CSSProperties}
			>
				{children || (
					<div className="placeholder-skeleton">
						<div className="skeleton-line"></div>
						<div className="skeleton-line"></div>
						<div className="skeleton-line"></div>
					</div>
				)}
			</div>
		</div>
	);
} 