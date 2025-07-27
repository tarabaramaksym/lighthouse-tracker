import './AddDomainButton.css';

interface AddDomainButtonProps {
	onClick: () => void;
}

export function AddDomainButton({ onClick }: AddDomainButtonProps) {
	return (
		<button
			className="add-domain-button"
			onClick={onClick}
			title="Add new domain"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</button>
	);
} 