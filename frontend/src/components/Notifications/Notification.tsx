import './Notification.css';

type NotificationType = 'error' | 'success' | 'alert';

interface NotificationProps {
	type: NotificationType;
	message: string;
	ariaLabel?: string;
}

export function Notification({ type, message, ariaLabel }: NotificationProps) {
	const className = `notification notification-${type}`;
	const icon = type === 'error' ? '❗' : type === 'success' ? '✅' : '⚠️';

	return (
		<div className={className} role={type === 'error' ? 'alert' : 'status'} aria-label={ariaLabel || message}>
			<span className="icon" aria-hidden="true">{icon}</span>
			<span>{message}</span>
		</div>
	);
}

export default Notification;


