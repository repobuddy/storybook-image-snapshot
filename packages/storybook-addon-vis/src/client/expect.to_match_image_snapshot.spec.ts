import { composeStories } from '@storybook/react'
import { screen } from '@testing-library/react'
import { assertType } from 'type-plus'
import { expect, it, test } from 'vitest'
import { page } from './@vitest/browser/context.ts'
import { toSnapshotId } from './@vitest/browser/image_snapshot.logic.ts'
import * as ToMatchStories from './expect.to_match_image_snapshot.stories.tsx'
import * as ImageDataStories from './image_data.stories.tsx'

const { ConversionRoundtrip } = composeStories(ImageDataStories)
const { Success, Failed } = composeStories(ToMatchStories)

it('should reject if the subject is undefined', async () => {
	await expect(() => expect(undefined).toMatchImageSnapshot()).rejects.toThrowError(
		'`toMatchImageSnapshot()` expects the subject to be an element, locator, or result of `page.imageSnapshot()`, but got: `undefined`',
	)
})

it('should fail if the subject is not an element, locator, or result of page.imageSnapshot()', async () => {
	// TODO: this is not complete.
	// need to handle other cases first.
	try {
		await expect('something').toMatchImageSnapshot()
	} catch (e) {
		expect(e).toBeInstanceOf(Error)
		assertType.as<Error>(e)
		expect(e.message).toEqual(
			'`toMatchImageSnapshot()` expects the subject to be an element, locator, or result of `page.imageSnapshot()`, but got: `something`',
		)
	}
})

it('should fail when the subject is the result of page.screenshot()', async () => {
	await ConversionRoundtrip.run()
	try {
		await expect(page.screenshot({ base64: true })).toMatchImageSnapshot()
	} catch (e) {
		expect(e).toBeInstanceOf(Error)
		assertType.as<Error>(e)
		expect(e.message).toEqual(
			'`toMatchImageSnapshot()` expects the subject to be the result of `page.imageSnapshot()`, but seems like you are using `page.screenshot()`?',
		)
	}
})

it('should work with page.imageSnapshot()', async () => {
	await ConversionRoundtrip.run()
	await expect(page.imageSnapshot()).toMatchImageSnapshot()
})

it('can customize snapshot filename', async ({ task }) => {
	await ConversionRoundtrip.run()
	const result = await page.imageSnapshot({
		customizeSnapshotId(id, index) {
			return `${id}-custom-${index}`
		},
	})
	expect(result.snapshotFilename).toEqual(`${toSnapshotId(task.name)}-custom-1.png`)
})

// With recording the promise in the test object, we can't do negative test.
// The test will always fail as it is outside the loop
// it('should fail when the subject is a rejected promise', async () => {
// 	expect(expect(Promise.reject(new Error('error'))).toMatchImageSnapshot()).rejects.toThrowError('error')
// })

it('should fail with mismatch message', async ({ task }) => {
	if (await page.hasImageSnapshot({ customizeSnapshotId: (id) => id })) {
		await Failed.run()
		try {
			await expect(
				page.imageSnapshot({
					customizeSnapshotId: (id) => id,
				}),
			).toMatchImageSnapshot()
			// NOTE: test WILL reach there when updating snapshot as the assertion will succeed.
			// So right now we can't assert the negative part of this test.
			// We can improve this when the updateSnapshot option is easily available.
			// throw new Error('should not reach')
		} catch (e) {
			expect(e).toBeInstanceOf(Error)
			assertType.as<Error>(e)
			await expect(e.message).toMatch(`Snapshot \`${task.name}\` mismatched`)
		}
	} else {
		await Success.run()
		await expect(
			page.imageSnapshot({
				customizeSnapshotId: (id) => id,
			}),
		).toMatchImageSnapshot()
	}
})

test('use screen to get element', async () => {
	await Success.run()
	const subject = screen.getByRole('img')
	await expect(subject).toMatchImageSnapshot()
})
