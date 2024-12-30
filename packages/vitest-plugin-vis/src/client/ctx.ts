import { getCurrentTest } from 'vitest/suite'

export const ctx = {
	getCurrentTest,
	__test__reset() {
		ctx.getCurrentTest = getCurrentTest
	},
}
