/**
 * Converts a local HH:MM time string to a UTC HH:MM string based on the browser timezone.
 */
export function localHHMMToUTC(localHHMM: string): string {
	const [hStr, mStr] = localHHMM.split(':');
	const now = new Date();
	const localDate = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		parseInt(hStr || '0', 10),
		parseInt(mStr || '0', 10),
		0,
		0
	);
	const utcHours = localDate.getUTCHours();
	const utcMinutes = localDate.getUTCMinutes();

	return `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`;
}

/**
 * Converts a UTC HH:MM time string to a local HH:MM string based on the browser timezone.
 */
export function utcHHMMToLocal(utcHHMM: string): string {
	const [hStr, mStr] = utcHHMM.split(':');
	const now = new Date();
	const utcDate = new Date(
		Date.UTC(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			parseInt(hStr || '0', 10),
			parseInt(mStr || '0', 10),
			0,
			0
		)
	);
	const localHours = utcDate.getHours();
	const localMinutes = utcDate.getMinutes();

	return `${localHours.toString().padStart(2, '0')}:${localMinutes.toString().padStart(2, '0')}`;
}


