import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo.png';
import './Header.css';

export function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout, isAuthenticated } = useAuth();

	const isHomePage = location.pathname === '/';
	const isAuthPage = location.pathname === '/auth';
	const isDashboardPage = location.pathname === '/dashboard';

	const handleSignIn = () => {
		navigate('/auth?type=login');
	};

	const handleSignUp = () => {
		navigate('/auth?type=signup');
	};

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const handleGoToDashboard = () => {
		navigate('/dashboard');
	};

	return (
		<header className="header">
			<div className="header-nav">
				<Link to="/" className="header-logo-link">
					<h1 className="header-logo">
						<img src={logo} alt="Lightkeeper websites logo" />
						Lighthouse Keeper
					</h1>
				</Link>
				<div className="header-actions">
					{isHomePage && !isAuthenticated && (
						<>
							<button onClick={handleSignIn} className="btn btn-secondary">
								Sign In
							</button>
							<button onClick={handleSignUp} className="btn btn-primary">
								Sign Up
							</button>
						</>
					)}
					{isHomePage && isAuthenticated && (
						<button onClick={handleGoToDashboard} className="btn btn-primary">
							Dashboard
						</button>
					)}
					{isDashboardPage && (
						<button onClick={handleLogout} className="btn btn-secondary">
							Logout
						</button>
					)}
				</div>
			</div>
		</header>
	);
} 