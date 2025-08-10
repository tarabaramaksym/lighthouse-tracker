import { useState, useEffect } from 'preact/hooks';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import Login from '@/components/Login/Login';
import SignUp from '@/components/SignUp/SignUp';
import { Button } from '@/components/Button';
import { preloadAuthPageAssets } from '@/utils/globalPreloader';
import lighthouseGif from '@/assets/lighthouse.gif';

import './Auth.css';

export function Auth() {
	const [searchParams] = useSearchParams();
	const [isLogin, setIsLogin] = useState(true);
	const { login } = useAuth();

	const demoEmail = import.meta.env.DEMO_LOGIN;
	const demoPassword = import.meta.env.DEMO_PASSWORD;

	const handleDemoLogin = async () => {
		await login({ email: demoEmail, password: demoPassword });
	};

	useEffect(() => {
		preloadAuthPageAssets();

		const type = searchParams.get('type');
		if (type === 'signup') {
			setIsLogin(false);
		} else if (type === 'login') {
			setIsLogin(true);
		}
	}, [searchParams]);

	return (
		<div className="auth-container">
			<div className="auth-card">
				<div className="auth-header">
					<div className="auth-tabs">
						<Button
							className={`auth-tab ${isLogin ? 'active' : ''}`}
							onClick={() => setIsLogin(true)}
						>
							Login
						</Button>
						<Button
							className={`auth-tab ${!isLogin ? 'active' : ''}`}
							onClick={() => setIsLogin(false)}
						>
							Sign Up
						</Button>
					</div>
				</div>

				<div className="auth-content">
					{isLogin ? <Login /> : <SignUp />}
				</div>
			</div>
			<div className="lighthouse-gif">
				{demoEmail && demoPassword && <div className="demo-info">
					<p>Want to see the demo first?</p>
					<Button className="btn btn-secondary" onClick={handleDemoLogin} disabled={!demoEmail || !demoPassword}>
						Login Into Demo
					</Button>
				</div>}
				<img src={lighthouseGif} alt="Lighthouse GIF" />
			</div>
		</div>
	);
} 