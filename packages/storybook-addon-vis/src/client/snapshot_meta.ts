import type { TaskMeta } from 'vitest'
import type { MatchImageSnapshotOptions } from '../shared/types.ts'
import { META_KEY } from './constants.ts'

export type SnapshotMeta = MatchImageSnapshotOptions & { enable?: boolean | undefined }

/**
 * Set the snapshot meta for the task (test).
 *
 * ```ts
 * beforeAll(suite => setSnapshotMeta(suite, ...))
 * beforeEach(({ task }) => setSnapshotMeta(task, ...))
 *
 * it('...', ({ task }) => {
 *   setSnapshotMeta(task, ...)
 * })
 * ```
 */
export function setSnapshotMeta(
	task:
		| {
				file: { meta: TaskMeta }
				meta: TaskMeta
		  }
		| undefined,
	meta: SnapshotMeta | boolean = true,
) {
	if (!task) return
	if (typeof meta === 'boolean') meta = { enable: meta }
	else {
		meta = {
			enable: true,
			...meta,
		}
	}
	;(task.meta as any)[META_KEY] = meta
}
