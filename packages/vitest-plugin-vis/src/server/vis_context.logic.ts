import ci from 'is-ci'
import { join, relative } from 'pathe'
import type { VisOptions } from '../config/types.ts'
import { DIFF_DIR, RESULT_DIR } from '../shared/constants.ts'
import { file } from './file.ts'
import { getSnapshotSubpath, resolveSnapshotRootDir } from './snapshot_path.ts'
import { ctx } from './vis_context.ctx.ts'
import type { VisState } from './vis_context.types.ts'

export type PartialBrowserCommandContext = {
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
	testPath: string | undefined
}

export function createVisContext() {
	let visOptions: VisOptions = {}
	let state: VisState
	let globalStateReady: Promise<VisState>

	const context = {
		setOptions(options: VisOptions = {}) {
			visOptions = options
		},
		__test__getOptions() {
			return visOptions
		},
		__test__reset() {
			visOptions = undefined as any
		},
		__test__getState() {
			return state
		},
		/**
		 * Setup suite is called on each test file's beforeAll hook.
		 * Test files include vitest test files and storybook story files.
		 * It needs to make sure there is no race condition between the test files.
		 */
		async setupSuite(context: PartialBrowserCommandContext) {
			if (!globalStateReady) {
				globalStateReady = setupState(context, visOptions)
				state = await globalStateReady
			} else {
				await globalStateReady
			}

			const { suiteId, suite } = createSuite(state, context.testPath!, visOptions)
			state.suites[suiteId] = suite
			await Promise.allSettled([ctx.rimraf(suite.diffDir), ctx.rimraf(suite.resultDir)])
		},
		getSnapshotInfo(testPath: string, name: string, options?: { snapshotFileId?: string | undefined }) {
			const info = context.getSuiteInfo(testPath, name)
			const snapshotFilename = context.getSnapshotFilename(info, options?.snapshotFileId)

			const { suiteId, baselineDir, resultDir, diffDir, task } = info

			task.count = task.count + 1
			const baselinePath = join(baselineDir, snapshotFilename)
			const resultPath = join(resultDir, snapshotFilename)
			const diffPath = join(diffDir, snapshotFilename)

			return {
				suiteId,
				snapshotFilename,
				baselinePath,
				resultPath,
				diffPath,
				snapshotTimeout: visOptions.timeout ?? (ci ? 30000 : 5000),
			}
		},
		getTaskCount(testPath: string, taskId: string) {
			return context.getSuiteInfo(testPath, taskId).task.count
		},
		hasImageSnapshot(testPath: string, taskId: string, snapshotFileId: string | undefined) {
			const info = context.getSuiteInfo(testPath, taskId)
			return file.existFile(join(info.baselineDir, context.getSnapshotFilename(info, snapshotFileId)))
		},
		getSnapshotFilename(info: { taskId: string; task: { count: number } }, snapshotFileId: string | undefined) {
			if (snapshotFileId) return `${snapshotFileId}.png`

			const customizeSnapshotId = visOptions.customizeSnapshotId ?? ((id, index) => `${id}-${index}`)
			return `${customizeSnapshotId(info.taskId, info.task.count)}.png`
		},
		getSuiteInfo(testPath: string, taskId: string) {
			const suiteId = getSuiteId(state, testPath, visOptions)
			const suite = state.suites[suiteId]!
			const task = (suite.tasks[taskId] = suite.tasks[taskId] ?? { count: 1 })
			return {
				suiteId,
				taskId,
				baselineDir: suite.baselineDir,
				resultDir: suite.resultDir,
				diffDir: suite.diffDir,
				task,
			}
		},
	}
	return context
}

async function setupState(suite: PartialBrowserCommandContext, visOptions: VisOptions) {
	const snapshotRootDir = resolveSnapshotRootDir(visOptions)
	const projectPath = suite.project.config.root
	const platform = ctx.getSnapshotPlatform()

	const state = {
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
	await Promise.allSettled([ctx.rimraf(join(state.snapshotDiffDir)), ctx.rimraf(join(state.snapshotResultDir))])
	return state
}

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
