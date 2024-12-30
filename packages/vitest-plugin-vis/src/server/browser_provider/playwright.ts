import type { BrowserCommandContext } from 'vitest/node'
import type { BrowserApi } from './types.ts'

export function playwright(context: BrowserCommandContext): BrowserApi {
	return {
		async takeScreenshot(filePath, selector, options) {
			// The `Locator` type from `vitest` has less props than the `Locator` in `playwright`
			const subject = context.iframe.locator(selector ?? 'body')
			const buffer = await subject.screenshot({
				timeout: options?.timeout ?? 1000,
				path: filePath,
			})
			return buffer.toString('base64')
		},
	}
}
