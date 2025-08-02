import './Button.css';

interface ButtonProps {
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
	title?: string;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
}

export function Button({ children, className, title, onClick, disabled, type = 'button' }: ButtonProps) {
	return (
		<button
			className={`button ${className}`}
			onClick={onClick || undefined}
			title={title}
			disabled={disabled}
			type={type}
		>
			{children}
		</button>
	);
} 