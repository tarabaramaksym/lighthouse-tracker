import { defineConfig, loadEnv } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')

	return {
		plugins: [preact()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
				'@/components': path.resolve(__dirname, './src/components'),
				'@/pages': path.resolve(__dirname, './src/pages'),
				'@/assets': path.resolve(__dirname, './src/assets'),
				'@/services': path.resolve(__dirname, './src/services'),
				'@/types': path.resolve(__dirname, './src/types'),
				'@/contexts': path.resolve(__dirname, './src/contexts'),
				'@/hooks': path.resolve(__dirname, './src/hooks'),
				'@/styles': path.resolve(__dirname, './src/styles')
			}
		},
		define: {
			'import.meta.env.DEMO_LOGIN': JSON.stringify(env.DEMO_LOGIN || ''),
			'import.meta.env.DEMO_PASSWORD': JSON.stringify(env.DEMO_PASSWORD || '')
		}
	}
})
