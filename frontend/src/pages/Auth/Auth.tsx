import { useState, useEffect } from 'preact/hooks';
import { useSearchParams } from 'react-router-dom';
import Login from '@/components/Login/Login';
import SignUp from '@/components/SignUp/SignUp';
import { LighthouseEffect } from '@/components/LighthouseEffect';
import dayPng from '@/assets/day.png';
import nightPng from '@/assets/night.png';

import './Auth.css';

export function Auth() {
	const [searchParams] = useSearchParams();
	const [isLogin, setIsLogin] = useState(true);

	useEffect(() => {
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
						<button
							className={`auth-tab ${isLogin ? 'active' : ''}`}
							onClick={() => setIsLogin(true)}
						>
							Login
						</button>
						<button
							className={`auth-tab ${!isLogin ? 'active' : ''}`}
							onClick={() => setIsLogin(false)}
						>
							Sign Up
						</button>
					</div>
				</div>

				<div className="auth-content">
					{isLogin ? <Login /> : <SignUp />}
				</div>
			</div>
			<div className="lighthouse-gif">
				<LighthouseEffect dayImageUrl={dayPng} nightImageUrl={nightPng} />
			</div>
		</div>
	);
} 