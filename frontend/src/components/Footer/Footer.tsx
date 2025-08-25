import './Footer.css';

export function Footer() {
	return (
		<footer className="footer">
			<div className="footer-links">
				<span className="author-link">
					<span className="link-icon email-icon">📧</span>
					<span className="link-handle">tarabara.maksym@protonmail.com</span>
				</span>
				<a href="https://t.me/trbmaksym" className="author-link link-icon-wrapper" target="_blank" rel="noopener noreferrer">
					<img src="telegram.png" alt="Telegram" className="link-icon" />
				</a>
				<a href="https://github.com/tarabaramaksym" className="author-link link-icon-wrapper" target="_blank" rel="noopener noreferrer">
					<img src="github.svg" alt="GitHub" className="link-icon" />
				</a>
			</div>

			<p>&copy; {new Date().getFullYear()} Lighthouse Keeper. All rights reserved.</p>
		</footer>
	);
}

export default Footer; 