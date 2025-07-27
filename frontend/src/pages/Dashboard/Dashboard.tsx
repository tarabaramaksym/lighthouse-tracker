import { useAuth } from '@/hooks/useAuth';
import './Dashboard.css';

export function Dashboard() {
	const { user, logout } = useAuth();

	return (
		<div className="dashboard-container">
			<header className="dashboard-header">
				<div className="dashboard-title">
					<h1>Lighthouse Keeper Dashboard</h1>
					<p>Welcome back, {user?.email}!</p>
				</div>
				<button onClick={logout} className="btn btn-secondary">
					Logout
				</button>
			</header>

			<main className="dashboard-content">
				<div className="dashboard-card">
					<h2>Getting Started</h2>
					<p>
						Welcome to Lighthouse Keeper! This is your main dashboard where you'll be able to:
					</p>
					<ul>
						<li>Add and manage your websites</li>
						<li>Run Lighthouse audits</li>
						<li>View performance reports</li>
						<li>Track improvements over time</li>
						<li>Analyze SEO and accessibility scores</li>
					</ul>
					<p>
						The dashboard is currently under development. More features will be available soon!
					</p>
				</div>

				<div className="dashboard-card">
					<h2>Quick Stats</h2>
					<p>Your website monitoring statistics will appear here.</p>
				</div>
			</main>
		</div>
	);
}

export default Dashboard; 