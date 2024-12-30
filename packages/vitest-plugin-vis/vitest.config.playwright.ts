import { defineProject } from 'vitest/config'
import { vis } from './src/config.ts'

// https://vitejs.dev/config/
export default defineProject(() => {
	const browser = process.env.BROWSER ?? 'chromium'
	return {
		plugins: [vis(/* disable presets */ {})],
		optimizeDeps: {
			include: ['react/jsx-dev-runtime'],
		},
		test: {
			name: 'vpv:pw',
			browser: {
				enabled: true,
				headless: true,
				name: browser,
				provider: 'playwright',
				// api: 63316,
				screenshotFailures: false,
				screenshotDirectory: `__screenshots__/playwright/${browser}`,
			},
			include: [
				'src/client/**/*.{spec,test,unit,accept,integrate,system,study,perf,stress}.{ts,tsx}',
				'src/shared/**/*.{spec,test,unit,accept,integrate,system,study,perf,stress}.{ts,tsx}',
			],
			setupFiles: ['vitest.setup.playwright.ts'],
			// enables globals only for testing global usage
			globals: true,
		},
	}
})
