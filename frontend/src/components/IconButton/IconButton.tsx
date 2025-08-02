import './IconButton.css';

interface IconButtonProps {
	onClick: () => void;
	children: React.ReactNode;
}

export function IconButton({ children, onClick }: IconButtonProps) {
	return (
		<button
			className="add-domain-button"
			onClick={onClick}
			title="Add new domain"
		>
			{children}
		</button>
	);
} 