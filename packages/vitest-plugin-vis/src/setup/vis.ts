import { commands } from '@vitest/browser/context'
import { afterEach, beforeAll, expect } from 'vitest'
import { getCurrentTest } from 'vitest/suite'
import { shouldTakeSnapshot } from '../client/should_take_snapshot.ts'
import { getSnapshotMeta } from '../client/snapshot_meta.internal.ts'

/**
 * Visual test configuration on the client side.
 */
export const vis = {
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
			await commands.setupVisSuite()
		},
	},
	afterEach: {
		async matchImageSnapshot() {
			const meta = getSnapshotMeta(getCurrentTest())
			if (!shouldTakeSnapshot(meta)) return
			await expect(document.body).toMatchImageSnapshot(meta)
		},
		matchPerTheme(themes: Record<string, () => Promise<void> | void>) {
			return async function matchImageSnapshot() {
				const meta = getSnapshotMeta(getCurrentTest())
				if (!shouldTakeSnapshot(meta)) return
				for (const themeId in themes) {
					await themes[themeId]!()
					await expect(document.body).toMatchImageSnapshot({
						...meta,
						customizeSnapshotId: (id) => `${id}-${themeId}`,
					})
				}
			}
		},
	},
}
