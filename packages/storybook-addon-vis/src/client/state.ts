import { dirname, join, relative } from 'pathe'
import type { StoryContext } from 'storybook/internal/types'
import { omit, required } from 'type-plus'
import { getCurrentTest } from 'vitest/suite'
import { DIFF_DIR, RESULT_DIR } from '../shared/contants.ts'
import { getSnapshotSubpath, resolveSnapshotRootDir } from '../shared/snapshot_path.ts'
import type { ImageSnapshotOptions, MatchImageSnapshotOptions, VisOptions } from '../shared/types.ts'
import { commands } from './@vitest/browser/context.ts'
import { toSnapshotId } from './@vitest/browser/image_snapshot.logic.ts'
import { getSnapshotMeta } from './snapshot_meta.internal.ts'
import { setSnapshotMeta } from './snapshot_meta.ts'

function createStore() {
	// test suite (runner.beforeAll) states
	let testFilepath: string
	let currentDir: string
	let baselineDir = ''
	let resultDir = ''
	let diffDir = ''
	let snapshot: Record<string, Record<string, { index: number }>>
	let suiteOptions: VisOptions = Object.create(null)

	// story states (story.beforeEach)
	let taskName: string
	let id: string

	const state = {
		baselineDir,
		resultDir,
		diffDir,
		snapshot: {},
		async setupSuite(suite: { file: { filepath: string }; name: string }, options: VisOptions = {}) {
			testFilepath = suite.file.filepath
			const projectDir = testFilepath.slice(0, -suite.name.length)

			const snapshotFullPath = join(projectDir, resolveSnapshotRootDir(options))
			currentDir = dirname(testFilepath)
			const suiteDir = getSnapshotSubpath(suite.name, options)
			baselineDir = relative(currentDir, join(snapshotFullPath, await getPlatform(), suiteDir))
			resultDir = relative(currentDir, join(snapshotFullPath, RESULT_DIR, suiteDir))
			diffDir = relative(currentDir, join(snapshotFullPath, DIFF_DIR, suiteDir))

			suiteOptions = options
			snapshot = snapshot ?? {}
			if (!snapshot[testFilepath]) {
				snapshot[testFilepath] = Object.create(null)
				await commands.rmDir(resultDir)
				await commands.rmDir(diffDir)
			}
		},
		setupStory(ctx: StoryContext) {
			const tags = ctx.tags
			const enable = !tags ? false : tags.lastIndexOf('!snapshot') < tags.lastIndexOf('snapshot')
			setSnapshotMeta(getCurrentTest(), { enable, ...ctx.parameters?.snapshot })
		},
		shouldTakeSnapshot() {
			return !!getSnapshotMeta(getCurrentTest())?.enable
		},
		getName() {
			return taskName
		},
		getCurrentDir() {
			return currentDir
		},
		getTimeout(timeout?: number | undefined) {
			return timeout ?? suiteOptions.timeout ?? 30000
		},
		mergeMatchImageSnapshotOptions(options?: MatchImageSnapshotOptions) {
			return required(
				omit(suiteOptions, 'snapshotRootDir', 'customizeSnapshotSubpath'),
				getSnapshotMeta(getCurrentTest()),
				options,
			)
		},
		getSnapshotFilePaths(options?: ImageSnapshotOptions | undefined) {
			const test = getCurrentTest()!
			taskName = test.name
			id = toSnapshotId(taskName)
			snapshot[testFilepath][id] = snapshot[testFilepath][id] ?? { index: 1 }

			const index = snapshot[testFilepath][id]!.index
			const customizeSnapshotId =
				suiteOptions.customizeSnapshotId ?? options?.customizeSnapshotId ?? ((id, index) => `${id}-${index}`)
			const snapshotFilename = `${customizeSnapshotId(id, index)}.png`
			const baselinePath = join(baselineDir, snapshotFilename)
			const resultPath = join(resultDir, snapshotFilename)
			const diffPath = join(diffDir, snapshotFilename)
			return { snapshotFilename, baselinePath, resultPath, diffPath }
		},
		incrementSnapshotIndex() {
			snapshot[testFilepath][id]!.index++
		},
	}
	return state
}

export const state = createStore()

let platformP: Promise<string>
function getPlatform() {
	if (platformP) return platformP

	return (platformP = commands.getSnapshotPlatform())
}
