import type { BrowserCommandContext } from 'vitest/node'
import { playwright } from './playwright.ts'
import { webdriverio } from './webdriverio.ts'

export function browserApi(context: BrowserCommandContext) {
	if (context.provider.name === 'playwright') {
		return playwright(context)
	}
	if (context.provider.name === 'webdriverio') {
		return webdriverio(context)
	}
	throw new Error(`Unsupported provider: ${context.provider.name}`)
}
