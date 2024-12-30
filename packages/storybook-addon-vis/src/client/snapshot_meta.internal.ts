import { META_KEY } from './constants.ts'
import type { SnapshotMeta } from './snapshot_meta.ts'

type Suite = { meta: any; suite?: Suite | undefined }

export function getSnapshotMeta(
	task:
		| {
				file?: { meta: any } | undefined
				suite?: Suite | undefined
				meta: any
		  }
		| undefined,
): SnapshotMeta | undefined {
	if (!task) return

	const l: any[] = []
	let t = task
	while (t?.suite) {
		l.unshift(t.suite.meta)
		t = t.suite
	}
	l.unshift(task.file?.meta)
	l.push(task.meta)
	return l.reduce((acc, cur) => {
		if (cur?.[META_KEY]) {
			const { [META_KEY]: meta } = cur
			return Object.assign({}, acc, meta)
		}
		return acc
	}, {})
}
