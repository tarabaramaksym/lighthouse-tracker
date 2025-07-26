import { useNavigate } from 'react-router-dom';
import '@/styles/common.css';
import './Home.css';

export function Home() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth?type=login');
  };

  const handleSignUp = () => {
    navigate('/auth?type=signup');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-nav">
          <h1 className="home-logo">Lighthouse Tracker</h1>
          <div className="home-actions">
            <button onClick={handleSignIn} className="btn btn-secondary">
              Sign In
            </button>
            <button onClick={handleSignUp} className="btn btn-primary">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <h2>Track Your Website Performance</h2>
          <p>
            Monitor your website's performance, accessibility, SEO, and best practices 
            with automated Lighthouse audits. Get detailed insights and track improvements over time.
          </p>
          <div className="hero-actions">
            <button onClick={handleSignUp} className="btn btn-primary">
              Get Started Free
            </button>
            <button onClick={handleSignIn} className="btn btn-secondary">
              Sign In
            </button>
          </div>
        </section>

        <section className="features-section">
          <h3>Why Choose Lighthouse Tracker?</h3>
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
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2024 Lighthouse Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home; 