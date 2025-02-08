import type { Preview } from '@storybook/react'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		docs: {
			codePanel: true,
		},
	},
	initialGlobals: {
		background: { value: 'light' },
	},
}

export default preview
