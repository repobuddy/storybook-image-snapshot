import { composeStories } from '@storybook/react'
import { page } from 'storybook-addon-vis'
import { expect, it, test } from 'vitest'
import * as rawStories from './story_snapshot.stories'

const stories = composeStories(rawStories)

it('take whole story snapshot', async () => {
	await stories.Primary.run()
	await expect(page.imageSnapshot()).toMatchImageSnapshot()
})
