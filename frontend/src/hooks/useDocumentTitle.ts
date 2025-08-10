import { useEffect } from 'preact/compat'

/**
 * Sets document.title whenever the provided title changes
 */
export function useDocumentTitle(title: string): void {
	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.title = title
		}
	}, [title])
}
