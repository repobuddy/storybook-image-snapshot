import { expect, it } from 'vitest'
import { DIFF_DIR, RESULT_DIR } from '../shared/contants.ts'
import { createVisConfig } from '../vitest-setup.ts'
import { commands } from './@vitest/browser/context.ts'
import { state } from './state.ts'

it('can define the snapshot root folder relative to the root of the project', async () => {
	await createVisConfig({
		snapshotRootDir: '_sp_',
	}).beforeAll({ name: 'some.test.ts', file: { filepath: 'dummy/some.test.ts' } }),
		expect(state.getSnapshotFilePaths()).toMatchObject({
			baselinePath: `_sp_/${await commands.getSnapshotPlatform()}/some.test.ts/can-define-the-snapshot-root-folder-relative-to-the-root-of-the-project-1.png`,
			diffPath: `_sp_/${DIFF_DIR}/some.test.ts/can-define-the-snapshot-root-folder-relative-to-the-root-of-the-project-1.png`,
			resultPath: `_sp_/${RESULT_DIR}/some.test.ts/can-define-the-snapshot-root-folder-relative-to-the-root-of-the-project-1.png`,
		})
})

it('can define the timeout value for taking the snapshot', async () => {
	await createVisConfig({
		timeout: 30000,
	}).beforeAll({ name: 'some.test.ts', file: { filepath: 'dummy/some.test.ts' } })

	expect(state.getTimeout()).toEqual(30000)
})

it('can define default failureThreshold', async () => {
	await createVisConfig({
		failureThreshold: 50,
		failureThresholdType: 'percent',
	}).beforeAll({ name: 'some.test.ts', file: { filepath: 'dummy/some.test.ts' } })

	expect(state.mergeMatchImageSnapshotOptions()).toMatchObject({
		failureThreshold: 50,
		failureThresholdType: 'percent',
	})
})

it('can define default customizeSnapshotId', async () => {
	await createVisConfig({
		snapshotRootDir: '_sp_',
		customizeSnapshotId: (id) => id.slice(0, id.indexOf('-')),
	}).beforeAll({ name: 'some.test.ts', file: { filepath: 'dummy/some.test.ts' } })

	expect(state.getSnapshotFilePaths()).toMatchObject({
		baselinePath: `_sp_/${await commands.getSnapshotPlatform()}/some.test.ts/can.png`,
		diffPath: `_sp_/${DIFF_DIR}/some.test.ts/can.png`,
		resultPath: `_sp_/${RESULT_DIR}/some.test.ts/can.png`,
	})
})
