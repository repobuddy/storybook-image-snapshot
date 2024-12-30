import { composeStories } from '@storybook/react'
import { expect, it } from 'vitest'
import { commands, page } from './client/@vitest/browser/context.ts'
import * as ImageDataStories from './client/image_data.stories.ts'
import { DIFF_DIR, RESULT_DIR, SNAPSHOT_DIR } from './shared/contants.ts'

const { ConversionRoundtrip } = composeStories(ImageDataStories)

it('should delete the results and diffs folder when the during `beforeAll`', async () => {
	const snapshotPlatform = await commands.getSnapshotPlatform()
	await expect(commands.existDir(`${SNAPSHOT_DIR}/${snapshotPlatform}/${DIFF_DIR}`)).resolves.toBe(false)
	await expect(commands.existDir(`${SNAPSHOT_DIR}/${snapshotPlatform}/${RESULT_DIR}`)).resolves.toBe(false)
	await ConversionRoundtrip.run()
	await expect(page.imageSnapshot()).toMatchImageSnapshot()
})
