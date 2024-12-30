import { afterEach, expect, it } from 'vitest'
import { vis } from '../config.ts'
import { visContext } from '../server/vis_context.ts'

afterEach(() => visContext.__test__reset())

it('can be used with zero config', () => {
	expect(vis()).toBeDefined()
})

it('can customize snapshot root directory', () => {
	vis({ snapshotRootDir: 'custom' })
	expect(visContext.__test__getOptions()).toEqual({
		snapshotRootDir: 'custom',
	})
})

it('can customize snapshot subpath to keep base folder', () => {
	const customizeSnapshotSubpath = (subPath: string): string => subPath

	vis({ customizeSnapshotSubpath })

	expect(visContext.__test__getOptions()).toMatchObject({
		customizeSnapshotSubpath,
	})
})

it('can set default snapshot id', () => {
	const customizeSnapshotId = (id: string) => id

	vis({ customizeSnapshotId })

	expect(visContext.__test__getOptions()).toMatchObject({
		customizeSnapshotId,
	})
})

it('can set default snapshot timeout', () => {
	vis({ timeout: 1000 })
	expect(visContext.__test__getOptions()).toMatchObject({
		timeout: 1000,
	})
})

it('can set default failure threshold', () => {
	vis({ failureThreshold: 0.01 })
	expect(visContext.__test__getOptions()).toMatchObject({
		failureThreshold: 0.01,
	})
})

it('can set default failure threshold type to percent', () => {
	vis({ failureThresholdType: 'percent' })
	expect(visContext.__test__getOptions()).toMatchObject({
		failureThresholdType: 'percent',
	})
})

it('can set default diff options', () => {
	const diffOptions = { threshold: 0.1 }

	vis({ diffOptions })

	expect(visContext.__test__getOptions()).toMatchObject({
		diffOptions,
	})
})

it('default preset is auto', () => {
	const plugin = vis()
	expect(plugin.config()).toMatchObject({
		test: {
			setupFiles: ['vitest-plugin-vis/presets/auto'],
		},
	})
})

it('can set preset to manual', () => {
	const plugin = vis({ preset: 'manual' })
	expect(plugin.config()).toMatchObject({
		test: {
			setupFiles: ['vitest-plugin-vis/presets/manual'],
		},
	})
})

it('default to no preset when options is set', () => {
	const plugin = vis({})
	expect(plugin.config()).toMatchObject({
		test: {
			setupFiles: undefined,
		},
	})
})

it('can set preset to none', () => {
	const plugin = vis({ preset: 'none' })
	expect(plugin.config()).toMatchObject({
		test: {
			setupFiles: undefined,
		},
	})
})
