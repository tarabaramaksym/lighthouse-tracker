import { useState } from 'preact/hooks';
import { useAuth } from '@/hooks/useAuth';

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
			{error && <div className="error-message">{error}</div>}

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

			<button type="submit" className="btn btn-primary mt-10">
				Login
			</button>
		</form>
	);
}

export default Login;