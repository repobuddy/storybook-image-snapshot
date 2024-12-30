import ci from 'is-ci'
import { join } from 'pathe'
import { rimraf } from 'rimraf'
import type { BrowserCommandContext } from 'vitest/node'
import { DIFF_DIR, RESULT_DIR } from '../shared/contants.ts'
import { toSnapshotId } from '../shared/snapshot_id.ts'
import { resolveSnapshotRootDir } from '../shared/snapshot_path.ts'
import type { SnapshotInfo, VisOptions } from '../shared/types.ts'
import type { VisState } from './types.ts'
import { createSuite, getSuiteId } from './vis_context.logic.ts'

// export const visContext: VisContext = {}

// export type VisState = {
// 	snapshotRootDir?: string | undefined
// 	snapshotRootPath?: string | undefined
// 	timeout?: number | undefined
// 	projectPath: string
// 	testTimeout?: number | undefined
// 	hookTimeout?: number | undefined
// 	platform: string
// }

// export type VisContext = {
// 	options?: VisOptions
// 	state: VisState
// 	suite: Record<
// 		string,
// 		{
// 			baselineDir: string
// 			resultDir: string
// 			diffDir: string
// 			tasks: Record<string, { count: number }>
// 		}
// 	>
// }
type Suite = {
	project: {
		config: {
			root: string
			snapshotOptions: {
				updateSnapshot: 'all' | 'new' | 'none'
			}
			testTimeout: number
			hookTimeout: number
		}
	}
}

function createVisContext() {
	let visOptions: VisOptions
	let state: VisState
	let globalStateReady: Promise<void>

	async function setupGlobalSuite(suite: Suite) {
		const snapshotRootDir = resolveSnapshotRootDir(visOptions)
		const projectPath = suite.project.config.root
		const platform = getSnapshotPlatform()

		state = {
			projectPath,
			platform,
			testTimeout: suite.project.config.testTimeout,
			hookTimeout: suite.project.config.hookTimeout,
			snapshotRootDir,
			snapshotBaselineDir: join(snapshotRootDir, platform),
			snapshotResultDir: join(snapshotRootDir, RESULT_DIR),
			snapshotDiffDir: join(snapshotRootDir, DIFF_DIR),
			snapshotRootPath: join(projectPath, snapshotRootDir),
			suites: {},
		}
		await Promise.allSettled([rimraf.rimraf(join(state.snapshotDiffDir)), rimraf.rimraf(join(state.snapshotResultDir))])
	}

	return {
		setOptions(options: VisOptions) {
			visOptions = options
		},
		/** for testing only */
		getOptions() {
			return visOptions
		},
		getSnapshotInfo(context: BrowserCommandContext, name: string): SnapshotInfo {
			const suiteId = getSuiteId(state, context.testPath!, visOptions)
			const suite = state.suites[suiteId]
			const snapshotId = toSnapshotId(name)
			const task = (suite.tasks[snapshotId] = suite.tasks[snapshotId] ?? { count: 0 })
			const customizeSnapshotId = visOptions.customizeSnapshotId ?? ((id, index) => `${id}-${index}`)

			const snapshotFilename = `${customizeSnapshotId(snapshotId, ++task.count)}.png`
			const baselinePath = join(suite.baselineDir, snapshotFilename)
			const resultPath = join(suite.resultDir, snapshotFilename)
			const diffPath = join(suite.diffDir, snapshotFilename)

			return {
				suiteId,
				snapshotId,
				baselineDir: suite.baselineDir,
				resultDir: suite.resultDir,
				diffDir: suite.diffDir,
				snapshotFilename,
				baselinePath,
				resultPath,
				diffPath,
			}
		},
		/**
		 * Setup suite is called on each test file's beforeAll hook.
		 * Test files include vitest test files and storybook story files.
		 * It needs to make sure there is no race condition between the test files.
		 */
		async setupSuite(context: BrowserCommandContext) {
			if (!globalStateReady) {
				globalStateReady = setupGlobalSuite(context)
			}
			await globalStateReady

			const { suiteId, suite } = createSuite(state, context.testPath!, visOptions)
			state.suites[suiteId] = suite
			await Promise.allSettled([rimraf.rimraf(suite.diffDir), rimraf.rimraf(suite.resultDir)])
		},
	}
}

export const visContext = createVisContext()

function getSnapshotPlatform() {
	/* v8 ignore next */
	return ci ? process.platform : 'local'
}
