import type { Locator } from '@vitest/browser/context'
import type { PixelmatchOptions } from 'pixelmatch'

/**
 * The project parameters for the snapshot.
 *
 * These parameters are set per project in the `.storybook/preview.ts` file.
 */
export interface VisOptions extends MatchImageSnapshotOptions, CustomizeSnapshotIdOptions {
	/**
	 * The snapshot folder relative to the root of the project.
	 *
	 * Default: `__vis__`
	 */
	snapshotRootDir?: string | undefined

	/**
	 * Customize the snapshot subpath.
	 *
	 * The snapshot subpath is used along with `snapshotRootDir` to determine the folder of the snapshots:
	 *
	 * - baseline: `<snapshotRootDir>/<platform>/<snapshotSubpath>/<snapshotId>.png`
	 * - result: `<snapshotRootDir>/__results__/<snapshotSubpath>/<snapshotId>.png`
	 * - diff: `<snapshotRootDir>/__diff_output__/<snapshotSubpath>/<snapshotId>.png`
	 *
	 * Typically, you place your test files either in a dedicated `tests` folder or in the `src` folder along with your source code.
	 * By default, the snapshot subpath is the test file path with that folder removed.
	 * This reduces the nesting of the snapshot folders.
	 *
	 * If you place your test files in multiple folders,
	 * such as in both `tests` and `src` folders,
	 * and they might have files with the same name,
	 * and create conflicting snapshots,
	 * you can set this to customize the snapshot subpath.
	 */
	customizeSnapshotSubpath?: (subPath: string) => string
	/**
	 * Timeout for taking the snapshot.
	 *
	 * Default: 30000 ms
	 */
	timeout?: number | undefined
}

export interface MatchImageSnapshotOptions {
	/**
	 * Custom options passed to 'pixelmatch'
	 */
	diffOptions?: PixelmatchOptions | undefined
	/**
	 * Failure threshold should measure in `pixel` or `percent`.
	 *
	 * Default is `pixel`.
	 */
	failureThresholdType?: 'pixel' | 'percent' | undefined
	/**
	 * Failure tolerance threshold.
	 *
	 * Default is `0`.
	 */
	failureThreshold?: number | undefined
	/**
	 * Timeout for taking the snapshot.
	 *
	 * Default: 30000
	 */
	timeout?: number | undefined
}

export interface CustomizeSnapshotIdOptions {
	/**
	 * Customize the snapshot id. This is used as the filename of the snapshot:
	 *
	 * `${snapshotId}.png`
	 *
	 * @param id The id of the snapshot.
	 * @param index The index of the snapshot.
	 */
	customizeSnapshotId?: (id: string, index: number) => string
}

export interface ImageSnapshotOptions extends CustomizeSnapshotIdOptions {
	element?: Element | Locator
	/**
	 * Timeout for taking the snapshot.
	 *
	 * Default: 30000
	 */
	timeout?: number | undefined
}

export type ImageSnapshot = {
	type: symbol
	snapshotFilename: string
	baselinePath: string
	resultPath: string
	diffPath: string
	base64: string
	image: ImageData
}
export type SnapshotInfo = {
	suiteId: string
	snapshotId: string
	baselineDir: string
	resultDir: string
	diffDir: string
	snapshotFilename: string
	baselinePath: string
	resultPath: string
	diffPath: string
}
