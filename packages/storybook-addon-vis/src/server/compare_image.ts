import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { convertThresholdUnit } from '../shared/convert_threshold_unit.ts'
import type { MatchImageSnapshotOptions } from '../shared/types.ts'

export function compareImage(
	baselineImage: PNG,
	resultImage: PNG,
	{ failureThreshold = 0, failureThresholdType = 'pixel', diffOptions }: MatchImageSnapshotOptions = {},
) {
	const diffImage = new PNG({
		width: baselineImage.width,
		height: baselineImage.height,
	})

	const pixelDiff = pixelmatch(
		resultImage.data,
		baselineImage.data,
		diffImage.data,
		baselineImage.width,
		baselineImage.height,
		diffOptions,
	)
	const diffAmount = convertThresholdUnit(
		{ failureThresholdType, width: baselineImage.width, height: baselineImage.height },
		pixelDiff,
	)

	return {
		pass: diffAmount <= failureThreshold,
		diffAmount,
		diffImage,
	}
}
