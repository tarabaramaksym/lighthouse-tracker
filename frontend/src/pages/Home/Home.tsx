import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'preact/compat';
import dayPng from '@/assets/calendar_day.png';
import nightPng from '@/assets/calendar_night.png';
import clouds from '@/assets/clouds.png';
import day from '@/assets/day.png';
import evening from '@/assets/evening.png';
import night from '@/assets/night.png';
import { LighthouseEffect } from '@/components/LighthouseEffect';
import { Button } from '@/components/Button';
import { preloadHomePageAssets } from '@/utils/globalPreloader';
import './Home.css';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function Home() {
	const navigate = useNavigate();
	const [isYearly, setIsYearly] = useState(false);

	useDocumentTitle('Lighthouse Keeper – Track Lighthouse performance over time');

	useEffect(() => {
		preloadHomePageAssets();
	}, []);

	const handleSignIn = () => {
		navigate('/auth?type=login');
	};

	const handleSignUp = () => {
		navigate('/auth?type=signup');
	};

	const handlePricingSignUp = () => {
		navigate('/auth?type=signup');
	};

	return (
		<div className="home-container">
			<main className="home-main">
				<section className="hero-section">
					<div>
						<h2>Track Your Website Performance</h2>
						<p>
							Monitor your website's performance, accessibility, SEO, and best practices
							with automated Lighthouse audits. Get detailed insights and track improvements over time.
						</p>
						<div className="hero-actions">
							<Button onClick={handleSignUp} className="btn btn-primary">
								Get Started Free
							</Button>
							<Button onClick={handleSignIn} className="btn btn-secondary">
								Sign In
							</Button>
						</div>
					</div>
					<LighthouseEffect auto radius={100} borderRadius="16px" dayImageUrl={dayPng} nightImageUrl={nightPng} />
				</section>

				<section className="features-section">
					<img className="clouds" src={clouds} alt="Image of clouds"></img>
					<h3>Why Choose Lighthouse Keeper?</h3>
					<div className="features-grid">
						<div className="feature-card">
							<h4>Performance Monitoring</h4>
							<p>Track your website's loading speed and performance metrics over time.</p>
						</div>
						<div className="feature-card">
							<h4>SEO Optimization</h4>
							<p>Monitor and improve your search engine optimization scores.</p>
						</div>
						<div className="feature-card">
							<h4>Accessibility Testing</h4>
							<p>Ensure your website is accessible to all users.</p>
						</div>
						<div className="feature-card">
							<h4>Best Practices</h4>
							<p>Follow web development best practices and standards.</p>
						</div>
						<div className="feature-card">
							<h4>Alert System</h4>
							<p>Get notified about performance issues and regressions as they occur.</p>
						</div>
						<div className="feature-card">
							<h4>Development Tracking</h4>
							<p>Monitor development instances to catch issues before they reach production.</p>
						</div>
					</div>
				</section>

				<section className="pricing-section" style="display:none;">
					<h3>Choose Your Plan</h3>
					<div className="pricing-toggle">
						<span className={!isYearly ? 'active' : ''}>Monthly</span>
						<Button
							className={`toggle-button ${isYearly ? 'active' : ''}`}
							onClick={() => setIsYearly(!isYearly)}
						>
							<div className="toggle-slider"></div>
						</Button>
						<span className={isYearly ? 'active' : ''}>
							Yearly <span className="discount">Save 50%</span>
						</span>
					</div>
					<div className="pricing-grid">
						<div className="pricing-card" style={{ backgroundImage: `url(${night})` }}>
							<div className="pricing-header">
								<h4>Free</h4>
								<div className="price" style="opacity:0;">
									<span className="currency">$</span>
									<span className="amount">0</span>
									<span className="period">/month</span>
								</div>
								<div className="yearly-total" style="opacity: 0">$191.88 billed yearly</div>
							</div>
							<div className="pricing-features">
								<div className="feature">
									<span className="check">✓</span>
									<span>1 domain</span>
								</div>
								<div className="feature">
									<span className="check">✓</span>
									<span>5 URLs per domain</span>
								</div>
							</div>
							<Button onClick={handlePricingSignUp} className="btn btn-secondary">
								Get Started Free
							</Button>
						</div>

						<div className="pricing-card featured" style={{ backgroundImage: `url(${evening})` }}>
							<div className="pricing-header">
								<h4>Pro</h4>
								<div className="price">
									<span className="currency">$</span>
									<span className="amount">{isYearly ? '4.99' : '9.99'}</span>
									<span className="period">/month</span>
								</div>
								<div className="yearly-total" style={isYearly ? '' : 'opacity: 0'}>$59.88 billed yearly</div>
							</div>
							<div className="pricing-features">
								<div className="feature">
									<span className="check">✓</span>
									<span>5 domains</span>
								</div>
								<div className="feature">
									<span className="check">✓</span>
									<span>100 URLs per domain</span>
								</div>
							</div>
							<Button onClick={handlePricingSignUp} className="btn btn-primary">
								Start Pro Plan
							</Button>
						</div>

						<div className="pricing-card" style={{ backgroundImage: `url(${day})` }}>
							<div className="pricing-header">
								<h4>Pro+</h4>
								<div className="price">
									<span className="currency">$</span>
									<span className="amount">{isYearly ? '9.99' : '19.99'}</span>
									<span className="period">/month</span>
								</div>
								<div className="yearly-total" style={isYearly ? '' : 'opacity: 0'}>$119.88 billed yearly</div>
							</div>
							<div className="pricing-features">
								<div className="feature">
									<span className="check">✓</span>
									<span>1000 domains</span>
								</div>
								<div className="feature">
									<span className="check">✓</span>
									<span>10,000 URLs per domain</span>
								</div>
							</div>
							<Button onClick={handlePricingSignUp} className="btn btn-secondary">
								Start Pro+ Plan
							</Button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

export default Home; 