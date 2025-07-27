import './Footer.css';

export function Footer() {
	return (
		<footer className="footer">
			<p>&copy; {new Date().getFullYear()} Lighthouse Keeper. All rights reserved.</p>
		</footer>
	);
}

export default Footer; 