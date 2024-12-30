import type { SnapshotMeta } from './snapshot_meta.ts'

/**
 * Determine should snapshot be taken.
 *
 * not story: false
 * no `snapshot` tag: false
 * disabled by `!snapshot` tag: false
 */
export function shouldTakeSnapshot(meta: SnapshotMeta | undefined) {
	return document.body.childElementCount > 0 && meta?.enable !== false
}
