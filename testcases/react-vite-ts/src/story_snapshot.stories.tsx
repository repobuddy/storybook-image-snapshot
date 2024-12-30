import type { Meta, StoryObj } from '@storybook/react'
import { expect } from '@storybook/test'
import { page } from 'storybook-addon-vis'
import { Button } from './Button.js'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
	title: 'Example/Story Snapshot',
	component: Button,
	parameters: {
		layout: 'centered',
	},
} as Meta

export const Primary: StoryObj = {
	tags: ['snapshot'],
	args: {
		primary: true,
		label: 'Button',
	},
}

export const SkipSnapshot: StoryObj = {
	tags: ['!snapshot'],
	args: {
		label: 'Button2',
	},
	async play() {
		expect(await page.hasImageSnapshot()).toEqual(false)
	},
}
