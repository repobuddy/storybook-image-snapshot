import type { TaskMeta } from 'vitest'
import { NAME } from '../shared/constants.ts'
import type { ToMatchImageSnapshotOptions } from './expect/to_match_image_snapshot.ts'

export type SnapshotMeta = ToMatchImageSnapshotOptions & { enable?: boolean | undefined }

/**
 * Set the snapshot options for auto snapshot.
 *
 * ```ts
 * beforeEach(({ task }) => setAutoSnapshotOptions(task, ...))
 *
 * it('...', ({ task }) => {
 *   setAutoSnapshotOptions(task, ...)
 * })
 * ```
 */
export function setAutoSnapshotOptions(
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
	;(task.meta as any)[NAME] = meta
}
