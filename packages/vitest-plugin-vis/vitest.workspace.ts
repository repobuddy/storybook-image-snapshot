import ci from 'is-ci'
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace(
	[
		'vitest.config.playwright.ts',
		process.env.COVERAGE || (ci && process.platform === 'win32') ? '' : 'vitest.config.webdriverio.ts',
		'vitest.config.node.ts',
	].filter(Boolean),
)
