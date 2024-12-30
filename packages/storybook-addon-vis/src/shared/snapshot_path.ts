import { trimCommonFolder } from 'vitest-plugin-vis'
import { SNAPSHOT_DIR } from './contants.ts'
import type { VisOptions } from './types.ts'

export function resolveSnapshotRootDir(options: VisOptions | undefined) {
	return options?.snapshotRootDir ?? SNAPSHOT_DIR
}

export function getSnapshotSubpath(suiteName: string, options: VisOptions) {
	const customizeSnapshotSubpath = options.customizeSnapshotSubpath ?? trimCommonFolder
	return customizeSnapshotSubpath(suiteName)
}
