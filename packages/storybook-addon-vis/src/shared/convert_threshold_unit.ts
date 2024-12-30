export function convertThresholdUnit(
	{ failureThresholdType, width, height }: { failureThresholdType: 'pixel' | 'percent'; width: number; height: number },
	pixelDiff: number,
): number {
	switch (failureThresholdType) {
		case 'pixel':
			return pixelDiff
		case 'percent':
			return (pixelDiff / (width * height)) * 100
		default:
			throw new Error(`Invalid failureThresholdType: ${failureThresholdType}`)
	}
}
