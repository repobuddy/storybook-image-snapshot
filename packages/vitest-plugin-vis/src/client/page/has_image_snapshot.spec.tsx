import { page } from '@vitest/browser/context'
import { afterEach, expect, it } from 'vitest'
import { ctx } from '../ctx.ts'

afterEach(() => ctx.__test__reset())

it('throws when not running in a test', () => {
	ctx.getCurrentTest = () => undefined as any
	expect(() => page.hasImageSnapshot()).toThrow('`hasImageSnapshot()` must be called in a test.')
})

it('throws an error when running in a concurrent test', () => {
	ctx.getCurrentTest = () => ({ concurrent: true }) as any
	expect(() => page.hasImageSnapshot()).toThrow(
		'`hasImageSnapshot()` cannot be called in a concurrent test because ' +
			"concurrent tests run at the same time in the same iframe and affect each other's environment. ",
	)
})

it('returns false when no snapshot exists', async () => {
	expect(
		await page.hasImageSnapshot({
			customizeSnapshotId: (id) => id,
		}),
	).toBe(false)
})

it('returns true when the snapshot exists', async () => {
	page.render(<div data-testid="subject">hello</div>)
	const subject = page.getByTestId('subject')
	await expect(subject).toMatchImageSnapshot({
		customizeSnapshotId: (id) => id,
	})
	expect(
		await page.hasImageSnapshot({
			customizeSnapshotId: (id) => id,
		}),
	).toBe(true)
})
