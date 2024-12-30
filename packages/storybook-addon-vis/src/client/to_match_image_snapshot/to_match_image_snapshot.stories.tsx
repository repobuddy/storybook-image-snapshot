import type { StoryObj } from '@storybook/react'
import { expect } from '@storybook/test'
import { UNI_PNG_BASE64 } from '../../testing/constants.ts'

export default {
	title: 'toMatchImageSnapshot',
	render: () => <div data-testid="subject">unit</div>,
}

export const MatchingCanvasElement: StoryObj = {
	async play({ canvasElement }) {
		await expect(canvasElement).toMatchImageSnapshot2()
	},
}

export const MatchingElement: StoryObj = {
	async play({ canvas }) {
		const element = canvas.getByTestId('subject')
		await expect(element).toMatchImageSnapshot2()
	},
}

export const MatchingBase64Image: StoryObj = {
	async play() {
		await expect(UNI_PNG_BASE64).toMatchImageSnapshot2()
	},
}
