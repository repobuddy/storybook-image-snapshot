import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { storybookVis } from './src/vitest-plugin.js'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), storybookTest(), storybookVis()],
	test: {
		name: 'vis',
		browser: {
			enabled: true,
			headless: true,
			name: 'chromium',
			provider: 'playwright',
		},
		globals: true,
		include: [
			// But we are including them here to cover the scenario that
			// not all tests are stories.
			// Also, this is easier for the user to setup.
			'**/*.spec.ts',
			'**/*.stories.?(m)[jt]s?(x)',
		],
		setupFiles: ['./.storybook/vitest.setup.ts'],
	},
})
