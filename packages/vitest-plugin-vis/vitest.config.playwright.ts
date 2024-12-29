import { vis } from 'vitest-plugin-vis/config'
import { defineProject } from 'vitest/config'

// https://vitejs.dev/config/
export default defineProject(() => {
	const browser = process.env.BROWSER ?? 'chromium'
	return {
		plugins: [vis()],
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
				api: 63316,
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
