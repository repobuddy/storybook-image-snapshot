import { resolve } from 'pathe'
import { stub } from 'type-plus'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { vis } from '../config.ts'
import type { VisOptions } from '../config/types.ts'
import { DIFF_DIR, RESULT_DIR, SNAPSHOT_ROOT_DIR } from '../shared/constants.ts'
import { ctx } from './vis_context.ctx.ts'
import { type PartialBrowserCommandContext, createSuite, createVisContext, getSuiteId } from './vis_context.logic.ts'
import type { VisState } from './vis_context.types.ts'
describe(`${getSuiteId.name}()`, () => {
	const mockState = {
		projectPath: '/root/project',
	} as VisState

	it('returns `testPath` as the suite id for a file in the project root', () => {
		const testPath = '/root/project/test.ts'
		const options: VisOptions = {}
		expect(getSuiteId(mockState, testPath, options)).toBe('test.ts')
	})

	it('trims well known test folder form suite id', () => {
		const options: VisOptions = {}
		const testPaths = [
			'/root/project/tests/code.spec.ts',
			'/root/project/test/code.spec.ts',
			'/root/project/src/code.spec.ts',
			'/root/project/source/code.spec.ts',
			'/root/project/js/code.spec.ts',
			'/root/project/ts/code.spec.ts',
			'/root/project/lib/code.spec.ts',
		]
		testPaths.forEach((testPath) => {
			const result = getSuiteId(mockState, testPath, options)
			expect(result).toBe('code.spec.ts')
		})
	})
})

describe(`${createSuite.name}()`, () => {
	it('creates suiteId', () => {
		const r = createSuite(
			{
				projectPath: '/root/project',
			} as VisState,
			'/root/project/src/code.spec.ts',
			{},
		)
		expect(r.suiteId).toBe('code.spec.ts')
	})

	it('create suite directories based on directory in state and suite id', () => {
		const { suiteId, suite } = createSuite(
			{
				projectPath: '/root/project',
				snapshotBaselineDir: `/root/project/${SNAPSHOT_ROOT_DIR}/local`,
				snapshotResultDir: `/root/project/${SNAPSHOT_ROOT_DIR}/${RESULT_DIR}`,
				snapshotDiffDir: `/root/project/${SNAPSHOT_ROOT_DIR}/${DIFF_DIR}`,
			} as VisState,
			'/root/project/src/code.spec.ts',
			{},
		)
		expect(suite.baselineDir).toBe(`/root/project/${SNAPSHOT_ROOT_DIR}/local/${suiteId}`)
		expect(suite.resultDir).toBe(`/root/project/${SNAPSHOT_ROOT_DIR}/${RESULT_DIR}/${suiteId}`)
		expect(suite.diffDir).toBe(`/root/project/${SNAPSHOT_ROOT_DIR}/${DIFF_DIR}/${suiteId}`)
	})
})

describe(`${createVisContext.name}()`, () => {
	const stubSuite = stub.build<PartialBrowserCommandContext>({
		project: {
			config: {
				root: resolve(import.meta.dirname, '../..'),
			},
		},
		testPath: import.meta.filename,
	})

	beforeEach(() => {
		ctx.rimraf = vi.fn() as any
		ctx.getSnapshotPlatform = vi.fn(() => 'local' as any)
	})
	describe('set up state', () => {
		it('set projectPath to suite.project.config.root', async () => {
			const visContext = createVisContext()
			await visContext.setupSuite(stubSuite())
			const state = visContext.__test__getState()

			expect(state.projectPath).toEqual(stubSuite().project.config.root)
			expect(state.projectPath).toMatch(/vitest-plugin-vis$/)
		})

		it('default snapshotRootDir to SNAPSHOT_ROOT_DIR', async () => {
			const visContext = createVisContext()
			await visContext.setupSuite(stubSuite())
			const state = visContext.__test__getState()

			expect(state.snapshotRootDir).toEqual(SNAPSHOT_ROOT_DIR)
		})
		it('skip setup state if already set up', async () => {
			const visContext = createVisContext()
			await visContext.setupSuite(stubSuite())
			await visContext.setupSuite(stubSuite({ project: { config: { root: 'another' } } }))
			expect(visContext.__test__getState().projectPath).toMatch(/vitest-plugin-vis$/)
		})
	})
})
