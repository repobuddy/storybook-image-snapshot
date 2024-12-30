import type { StoryObj } from '@storybook/react'
import { expect } from '@storybook/test'
import { UNI_PNG_URL } from '../../testing/constants.ts'
import { page } from '../../vitest-setup.ts'

export default {
	title: 'toMatchImageSnapshot/tests',
	render: () => <div data-testid="subject">unit</div>,
}

export const FailWithDifferentImage: StoryObj = {
	loaders: [
		async () => {
			return { hasImageSnapshot: await page.hasImageSnapshot() }
		},
	],
	render(_, { loaded: { hasImageSnapshot } }) {
		return hasImageSnapshot ? (
			<img data-testid="subject" style={{ width: 128, height: 128 }} src={UNI_PNG_URL} />
		) : (
			<div data-testid="subject">unit</div>
		)
	},
	async play({ canvas, loaded: { hasImageSnapshot } }) {
		const subject = canvas.getByTestId('subject')
		if (!hasImageSnapshot) {
			await expect(subject).toMatchImageSnapshot2()
			return
		}

		await expect(subject)
			.toMatchImageSnapshot2()
			.then(
				() => {
					throw new Error('Should not reach')
				},
				(error) => {
					expect(error.message).toMatch(/Expected image to match but was differ by \d+ pixels./)
				},
			)
	},
}

export const FailWithDifferentSize: StoryObj = {
	loaders: [
		async () => {
			return {
				hasImageSnapshot: await page.hasImageSnapshot({
					customizeSnapshotId: (id) => id,
				}),
			}
		},
	],
	render(_, { loaded: { hasImageSnapshot } }) {
		const style = hasImageSnapshot ? { width: 128, height: 128 } : { width: 256, height: 256 }
		return <img data-testid="subject" style={style} src={UNI_PNG_URL} />
	},
	// async play({ canvas, loaded: { hasImageSnapshot } }) {
	// 	const subject = canvas.getByTestId('subject')
	// 	if (!hasImageSnapshot) {
	// 		await expect(subject).toMatchImageSnapshot2({
	// 			customizeSnapshotId: (id) => id,
	// 		})
	// 		return
	// 	}

	// 	await expect(subject)
	// 		.toMatchImageSnapshot2({
	// 			customizeSnapshotId: (id) => id,
	// 		})
	// 		.then(
	// 			() => {
	// 				throw new Error('Should not reach')
	// 			},
	// 			(error) => {
	// 				console.info(error.message)
	// 				expect(error.message).toMatch(/Expected image to match but was differ by \d+ pixels./)
	// 			},
	// 		)
	// },
}
