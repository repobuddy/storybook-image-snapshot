import pixelmatch from 'pixelmatch'
import { convertThresholdUnit } from './convert_threshold_unit.ts'
import type { MatchImageSnapshotOptions } from './types.ts'

export function compareImage(
	width: number,
	height: number,
	baselineData: Uint8ClampedArray,
	resultData: Uint8ClampedArray,
	{ failureThreshold = 0, failureThresholdType = 'pixel', diffOptions }: MatchImageSnapshotOptions = {},
) {
	const diffData = new Uint8ClampedArray(width * height * 4)

	const pixelDiff = pixelmatch(resultData, baselineData, diffData, width, height, diffOptions)
	const diffAmount = convertThresholdUnit({ failureThresholdType, width, height }, pixelDiff)

	return {
		pass: diffAmount <= failureThreshold,
		diffAmount,
		diffData,
	}
}
