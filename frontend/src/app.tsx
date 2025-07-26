import { AuthProvider } from '@/contexts/AuthContext';
import { AppRouter } from '@/components/AppRouter';
import './app.css';
import '@/styles/common.css';
import '@/styles/colors.css';

export function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
