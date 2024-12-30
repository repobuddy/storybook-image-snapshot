import { join } from 'node:path'
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin'
import react from '@vitejs/plugin-react'
import { storybookVis } from 'storybook-addon-vis/vitest-plugin'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), storybookTest({ configDir: join(import.meta.dirname, '.storybook') }), storybookVis()],
	test: {
		browser: {
			enabled: true,
			headless: true,
			name: 'chromium',
			provider: 'playwright',
		},
		include: [
			// But we are including them here to cover the scenario that
			// not all tests are stories.
			// Also, this is easier for the user to setup.
			'**/*.spec.ts?(x)',
			'**/*.stories.?(m)[jt]s?(x)',
		],
		setupFiles: ['./.storybook/vitest.setup.ts'],
	},
})
