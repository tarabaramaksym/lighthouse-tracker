import './AddUrlButton.css';

interface AddUrlButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

export function AddUrlButton({ onClick, disabled = false }: AddUrlButtonProps) {
	return (
		<button
			className="add-url-button"
			onClick={onClick}
			disabled={disabled}
			title="Add new URL"
		>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
			<span>Add URL</span>
		</button>
	);
} 