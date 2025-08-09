import { useState } from 'preact/hooks';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/Button';
import { Notification } from '@/components/Notifications/Notification';

export function SignUp() {
	const { register, error, clearError } = useAuth();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: ''
	});
	const [validationError, setValidationError] = useState('');

	const handleChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		setFormData(prev => ({
			...prev,
			[target.name]: target.value
		}));
		if (error) clearError();
		if (validationError) setValidationError('');
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			setValidationError('Passwords do not match');
			return;
		}

		try {
			await register({
				email: formData.email,
				password: formData.password
			});
		} catch (err) {
			// Error is handled by the context
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form-container">
			{(error || validationError) && (
				<Notification type="error" message={error || validationError} />
			)}

			<div className="form-group">
				<label htmlFor="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					required
					placeholder="Enter your email"
				/>
			</div>

			<div className="form-group">
				<label htmlFor="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					required
					placeholder="Enter your password"
					minLength={6}
				/>
			</div>

			<div className="form-group">
				<label htmlFor="confirmPassword">Confirm Password</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					value={formData.confirmPassword}
					onChange={handleChange}
					required
					placeholder="Confirm your password"
					minLength={6}
				/>
			</div>

			<Button type="submit" className="btn btn-primary mt-10">
				Sign Up
			</Button>
		</form>
	);
}

export default SignUp;