import { useState } from 'preact/hooks';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/Button';
import { Notification } from '@/components/Notifications/Notification';

export function Login() {
	const { login, error, clearError } = useAuth();
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const handleChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		setFormData(prev => ({
			...prev,
			[target.name]: target.value
		}));
		if (error) clearError();
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();

		try {
			await login(formData);
		} catch (err) {
			// Error is handled by the context
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form-container">
			{error && <Notification type="error" message={error} />}

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
				/>
			</div>

			<Button type="submit" className="btn btn-primary mt-10">
				Login
			</Button>
		</form>
	);
}

export default Login;