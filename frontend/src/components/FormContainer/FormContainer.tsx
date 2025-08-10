import { type ReactNode } from 'preact/compat';
import './FormContainer.css';

interface FormContainerProps {
	children: ReactNode;
}

export function FormContainer({ children }: FormContainerProps) {
	return (
		<div className="form-container form">
			{children}
		</div>
	);
} 