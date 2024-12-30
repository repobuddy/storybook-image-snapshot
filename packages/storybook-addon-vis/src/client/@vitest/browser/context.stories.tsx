import type { Meta } from '@storybook/react'
import { expect } from '@storybook/test'
import { cdp, commands } from '../../../index.js'

export default {
	title: 'vitest/context',
	render: () => <>unit test</>,
} satisfies Meta

export const AccessCDP = {
	play() {
		expect(cdp()).toBeDefined()
	},
}

export const ThrowUnknownCommand = {
	play() {
		try {
			;(commands as any).blah
			throw new Error('should not reach')
		} catch (e: any) {
			expect(e.message).toEqual(`Command 'blah' not found`)
		}
	},
}
