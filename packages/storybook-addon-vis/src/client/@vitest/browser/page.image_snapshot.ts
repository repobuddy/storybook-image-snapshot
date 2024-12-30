import type { BrowserPage } from '@vitest/browser/context'
import type { ImageSnapshot, ImageSnapshotOptions } from '../../../shared/types.ts'
import { toImageData } from '../../image_data.ts'
import { state } from '../../state.ts'
import { imageSnapshotSymbol } from './constants.ts'

export interface ImageSnapshotAction {
	imageSnapshot(this: BrowserPage, options?: ImageSnapshotOptions | undefined): Promise<ImageSnapshot>
}

export async function imageSnapshot(
	this: BrowserPage,
	options?: ImageSnapshotOptions | undefined,
): Promise<ImageSnapshot> {
	const { snapshotFilename, baselinePath, resultPath, diffPath } = state.getSnapshotFilePaths(options)
	// console.debug('taking snapshot', state.getName(), snapshotFilename)
	// `as any`: The prop `timeout` is not officially supported.
	// will be removed from server implementation.
	const screenshot = await this.screenshot({
		base64: true,
		path: resultPath,
		element: options?.element,
		timeout: state.getTimeout(options?.timeout),
	} as any)
	state.incrementSnapshotIndex()
	const image = await toImageData(screenshot.base64)

	return {
		type: imageSnapshotSymbol,
		snapshotFilename,
		baselinePath,
		resultPath,
		diffPath,
		base64: screenshot.base64,
		image,
	}
}
