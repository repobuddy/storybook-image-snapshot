import type { SyncExpectationResult } from '@vitest/expect'

export const success: SyncExpectationResult = {
	pass: true,
	/* v8 ignore next */
	message: () => '',
}
