import { join, relative } from 'pathe'
import { getSnapshotSubpath } from '../shared/snapshot_path.ts'
import type { VisOptions } from '../shared/types.ts'
import type { VisState } from './types.ts'

export function getSuiteId(state: VisState, testPath: string, options: VisOptions) {
	return getSnapshotSubpath(relative(state.projectPath, testPath), options)
}

export function createSuite(state: VisState, testPath: string, options: VisOptions) {
	const suiteId = getSuiteId(state, testPath, options)
	return {
		suiteId,
		suite: {
			baselineDir: join(state.snapshotBaselineDir, suiteId),
			resultDir: join(state.snapshotResultDir, suiteId),
			diffDir: join(state.snapshotDiffDir, suiteId),
			tasks: {},
		},
	}
}
