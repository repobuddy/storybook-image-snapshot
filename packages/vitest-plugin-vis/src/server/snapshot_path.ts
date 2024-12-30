import type { VisOptions } from '../config/types.ts'
import { SNAPSHOT_ROOT_DIR } from '../shared/constants.ts'
import { trimCommonFolder } from '../shared/trim_common_folder.ts'

export function resolveSnapshotRootDir(options: VisOptions | undefined) {
	return options?.snapshotRootDir ?? SNAPSHOT_ROOT_DIR
}

export function getSnapshotSubpath(suiteName: string, options: VisOptions) {
	const customizeSnapshotSubpath = options.customizeSnapshotSubpath ?? trimCommonFolder
	return customizeSnapshotSubpath(suiteName)
}
