import type { PixelmatchOptions } from 'pixelmatch'

export interface ImageSnapshotTimeoutOptions {
	/**
	 * Timeout for taking the snapshot.
	 *
	 * Default: 30000 ms
	 */
	snapshotTimeout?: number | undefined
}

export interface ImageSnapshotIdOptions {
	/**
	 * Customize the snapshot id. This is used as the filename of the snapshot: `${snapshotId}.png`
	 *
	 * @param id The id of the snapshot.
	 * @param index The index of the snapshot.
	 */
	customizeSnapshotId?: (id: string, index: number) => string
}

export interface MatchImageSnapshotOptions extends ImageSnapshotTimeoutOptions, ImageSnapshotIdOptions {
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
	 * The snapshot file id calculated on the client side.
	 */
	snapshotFileId?: string | undefined
}
