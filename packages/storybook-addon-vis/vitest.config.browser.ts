import storybookTest from '@storybook/experimental-addon-test/vitest-plugin'
import react from '@vitejs/plugin-react'
import { join } from 'node:path'
import { defineConfig } from 'vitest/config'
import { storybookVis, trimCommonFolder } from './src/vitest-plugin.ts'

// https://vitejs.dev/config/
export default defineConfig(() => {
	const browser = process.env.BROWSER ?? 'chromium'
	const browserProvider = process.env.BROWSERPROVIDER ?? 'playwright'
	const options =
		browserProvider === 'webdriverio'
			? {
					customizeSnapshotSubpath(subPath) {
						return `wb/${trimCommonFolder(subPath)}`
					},
					subjectDataTestId: 'subject',
				}
			: {
					subjectDataTestId: 'subject',
				}
	return {
		plugins: [react(), storybookTest({ configDir: join(import.meta.dirname, '.storybook') }), storybookVis(options)],
		test: {
			name: browserProvider === 'playwright' ? 'sav' : 'sav:wb',
			browser: {
				enabled: true,
				headless: true,
				provider: browserProvider,
				instances: [{ browser }],
			},
			include: [
				'src/client/**/*.{spec,test,unit,accept,integrate,system,study,perf,stress}.{ts,tsx}',
				'src/shared/**/*.{spec,test,unit,accept,integrate,system,study,perf,stress}.{ts,tsx}',
				'src/**/*.stories.tsx',
			],
			setupFiles: [
				browserProvider === 'playwright' ? './.storybook/vitest.setup.ts' : './.storybook/vitest.setup.webdriverio.ts',
			],
			// enables globals only for testing global usage
			globals: true,
		},
	}
})
