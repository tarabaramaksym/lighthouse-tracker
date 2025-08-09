import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'preact/compat';
import { useAuth } from '@/hooks/useAuth';

const Home = lazy(() => import('@/pages/Home').then(module => ({ default: module.Home })));
const Test = lazy(() => import('@/pages/Test').then(module => ({ default: module.Test })));
const Auth = lazy(() => import('@/pages/Auth').then(module => ({ default: module.Auth })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));

function PageLoader() {
	return (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100vh',
			fontSize: '18px',
			color: 'var(--color-gray-3)'
		}}>
			Loading...
		</div>
	);
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				fontSize: '18px',
				color: 'var(--color-gray-3)'
			}}>
				Loading...
			</div>
		);
	}

	return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				fontSize: '18px',
				color: 'var(--color-gray-3)'
			}}>
				Loading...
			</div>
		);
	}

	return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={
				<Suspense fallback={<PageLoader />}>
					<Home />
				</Suspense>
			} />
			<Route path="/test" element={
				<Suspense fallback={<PageLoader />}>
					<Test />
				</Suspense>
			} />
			<Route
				path="/auth"
				element={
					<PublicRoute>
						<Suspense fallback={<PageLoader />}>
							<Auth />
						</Suspense>
					</PublicRoute>
				}
			/>
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<Suspense fallback={<PageLoader />}>
							<Dashboard />
						</Suspense>
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
} 