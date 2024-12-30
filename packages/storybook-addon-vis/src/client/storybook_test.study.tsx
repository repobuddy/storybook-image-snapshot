import { composeStories } from '@storybook/react'
import { screen } from '@storybook/test'
import { page } from '@vitest/browser/context'
import { expect, test } from 'vitest'
import * as stories from './image_data.stories.js'

const { ConversionRoundtrip } = composeStories(stories)

test('using screen to access elements in story', async () => {
	await ConversionRoundtrip.run()
	const img = screen.getByTestId('img')
	expect(img).toBeInTheDocument()
})

test('using page to access elements in story', async () => {
	await ConversionRoundtrip.run()
	const img = page.getByTestId('img')
	expect(img.element()).toBeInTheDocument()
})
