import type { Preview } from '@storybook/react'
import { storybookPreviewVis } from '../src/index.ts'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
	initialGlobals: {
		background: { value: 'light' },
	},
	beforeEach: storybookPreviewVis.beforeEach,
}

export default preview
