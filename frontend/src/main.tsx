import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'
import { preloadHomePageAssets, preloadAuthPageAssets } from '@/utils/globalPreloader'

try {
	const path = window.location.pathname;
	if (path.startsWith('/auth')) {
		preloadAuthPageAssets();
	} else {
		preloadHomePageAssets();
	}
} catch (_) { }

render(<App />, document.getElementById('app')!)
