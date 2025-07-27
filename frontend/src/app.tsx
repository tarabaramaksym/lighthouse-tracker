import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppRouter } from '@/components/AppRouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './app.css';
import '@/styles/common.css';
import '@/styles/colors.css';

export function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Header />
				<AppRouter />
				<Footer />
			</AuthProvider>
		</BrowserRouter>
	);
}
