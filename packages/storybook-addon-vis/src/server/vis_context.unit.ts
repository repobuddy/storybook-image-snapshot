import { describe, expect, it } from 'vitest'
import { DIFF_DIR, RESULT_DIR, SNAPSHOT_DIR } from '../shared/contants.ts'
import type { VisOptions } from '../shared/types.ts'
import type { VisState } from './types.ts'
import { createSuite, getSuiteId } from './vis_context.logic.ts'

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
				snapshotBaselineDir: `/root/project/${SNAPSHOT_DIR}/local`,
				snapshotResultDir: `/root/project/${SNAPSHOT_DIR}/${RESULT_DIR}`,
				snapshotDiffDir: `/root/project/${SNAPSHOT_DIR}/${DIFF_DIR}`,
			} as VisState,
			'/root/project/src/code.spec.ts',
			{},
		)
		expect(suite.baselineDir).toBe(`/root/project/${SNAPSHOT_DIR}/local/${suiteId}`)
		expect(suite.resultDir).toBe(`/root/project/${SNAPSHOT_DIR}/${RESULT_DIR}/${suiteId}`)
		expect(suite.diffDir).toBe(`/root/project/${SNAPSHOT_DIR}/${DIFF_DIR}/${suiteId}`)
	})
})
