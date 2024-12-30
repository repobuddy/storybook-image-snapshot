import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { setSnapshotMeta } from '../vitest-setup.ts'
import { META_KEY } from './constants.ts'
import { getSnapshotMeta } from './snapshot_meta.internal.ts'

beforeAll((ctx) => {
	// this set the `file` meta
	setSnapshotMeta(ctx, { diffOptions: { threshold: 0.01 } })
})

beforeEach(({ task }) => {
	// this set the `task` meta
	setSnapshotMeta(task, { failureThreshold: 0.01 })
})

it('is noop when task is undefined', () => {
	setSnapshotMeta(undefined)
	getSnapshotMeta(undefined)
})

it('should merge meta from beforeAll and beforeEach', ({ task }) => {
	const meta = getSnapshotMeta(task)
	expect(meta).toEqual({ enable: true, diffOptions: { threshold: 0.01 }, failureThreshold: 0.01 })
})

describe('without beforeAll', () => {
	beforeAll((ctx) => {
		delete (ctx.file.meta as any)[META_KEY]
	})

	it('should merge meta from beforeEach', ({ task }) => {
		const meta = getSnapshotMeta(task)
		expect(meta).toEqual({ enable: true, failureThreshold: 0.01 })
	})

	it('should override existing meta with boolean', ({ task }) => {
		setSnapshotMeta(task, false)
		expect(getSnapshotMeta(task)).toEqual({ enable: false })
	})

	it('should override existing meta with enable: false', ({ task }) => {
		setSnapshotMeta(task, { enable: false })
		expect(getSnapshotMeta(task)).toEqual({ enable: false })
	})
})

describe('with no beforeAll and beforeEach', () => {
	beforeAll((ctx) => {
		delete (ctx.file.meta as any)[META_KEY]
	})

	beforeEach(({ task }) => {
		delete (task.meta as any)[META_KEY]
	})

	it('should enable snapshot by default', ({ task }) => {
		setSnapshotMeta(task)
		expect(getSnapshotMeta(task)).toEqual({ enable: true })
	})

	it('should set the provided meta', ({ task }) => {
		setSnapshotMeta(task, { failureThreshold: 0.01 })
		expect(getSnapshotMeta(task)).toEqual({ enable: true, failureThreshold: 0.01 })
	})

	it('should set enable to false when passing in false', ({ task }) => {
		setSnapshotMeta(task, false)
		expect(getSnapshotMeta(task)).toEqual({ enable: false })
	})
})

describe('disable snapshot during beforeAll', () => {
	beforeAll((ctx) => {
		delete (ctx.file.meta as any)[META_KEY]
		// this set the `suite` meta
		setSnapshotMeta(ctx, false)
	})

	beforeEach(({ task }) => {
		delete (task.meta as any)[META_KEY]
	})

	it('should disable snapshot', ({ task }) => {
		expect(getSnapshotMeta(task)).toEqual({ enable: false })
	})

	it('can override the disable snapshot', ({ task }) => {
		setSnapshotMeta(task, { enable: true })
		expect(getSnapshotMeta(task)).toEqual({ enable: true })
	})
})
