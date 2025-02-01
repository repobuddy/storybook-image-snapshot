import dedent from 'dedent'
import { afterEach, beforeAll } from 'vitest'
import { toTaskId } from '../client.ts'
import { ctx } from '../client/ctx.ts'
import { shouldTakeSnapshot } from '../client/should_take_snapshot.ts'
import { getAutoSnapshotOptions } from '../client/snapshot_options.internal.js'
import type { SetupVisSuiteCommand } from '../server/commands/setup_vis_suite.ts'

export function createVis(commands: SetupVisSuiteCommand) {
	let subjectDataTestId: string | undefined
	/**
	 * Visual test configuration on the client side.
	 */
	const vis = {
		presets: {
			/**
			 * Enable manual visual testing.
			 */
			manual() {
				beforeAll(vis.beforeAll.setup)
			},
			/**
			 * Enable automatic visual testing.
			 *
			 * This will take a snapshot after each test.
			 */
			auto() {
				beforeAll(vis.beforeAll.setup)
				afterEach(vis.afterEach.matchImageSnapshot)
			},
			/**
			 * Enable automatic visual testing with multiple themes.
			 *
			 * This will take a snapshot after each test for each theme.
			 *
			 * @param themes A record of theme names and their setup functions.
			 *
			 * @example
			 * ```ts
			 * vis().presets.theme({
			 *  light() { document.body.classList.add('light') },
			 *  dark() { document.body.classList.add('dark') },
			 * })
			 * ```
			 */
			theme(themes: Record<string, () => void | Promise<void>>) {
				beforeAll(vis.beforeAll.setup)
				afterEach(vis.afterEach.matchPerTheme(themes))
			},
		},
		beforeAll: {
			async setup() {
				subjectDataTestId = (await commands.setupVisSuite()).subjectDataTestId
			},
		},
		afterEach: {
			async matchImageSnapshot() {
				const test = ctx.getCurrentTest()

				if ((test?.result?.errors?.length ?? 0) > 0) return

				const meta = getAutoSnapshotOptions(test)
				if (!shouldTakeSnapshot(meta)) return

				await test!.context.expect(getSubject(meta?.subjectDataTestId ?? subjectDataTestId)).toMatchImageSnapshot(meta)
			},
			matchPerTheme(themes: Record<string, () => Promise<void> | void>) {
				return async function matchImageSnapshot() {
					const test = ctx.getCurrentTest()
					if ((test?.result?.errors?.length ?? 0) > 0) return

					const meta = getAutoSnapshotOptions(test)
					if (!shouldTakeSnapshot(meta)) return
					const errors: any[] = []
					for (const themeId in themes) {
						try {
							await new Promise((a) => setTimeout(() => a(themes[themeId]!()), 10))
							await test!.context
								.expect(getSubject(meta?.subjectDataTestId ?? subjectDataTestId))
								.toMatchImageSnapshot({
									...meta,
									customizeSnapshotId: meta?.customizeSnapshotId
										? (id, index) => `${meta.customizeSnapshotId!(id, index)}-${themeId}`
										: (id) => `${id}-${themeId}`,
								})
						} catch (error) {
							errors.push([themeId, error])
						}
					}
					if (errors.length > 0) {
						if (errors.length === 1) throw errors[0][1]
						const taskId = toTaskId(test!)
						throw new AggregateError(
							errors,
							dedent`Snapshot \`${taskId}\` mismatched

						${errors
							.map(([themeId, error]) => {
								return `Theme \`${themeId}\` failed: ${error.message}`
							})
							.join('\n\n')}`,
						)
					}
				}
			},
		},
	}
	return vis
}

function getSubject(subjectDataTestId: string | undefined) {
	if (subjectDataTestId) {
		const subject = document.querySelector(`[data-testid="${subjectDataTestId}"]`)
		if (subject) return subject
	}

	return document.body
}
