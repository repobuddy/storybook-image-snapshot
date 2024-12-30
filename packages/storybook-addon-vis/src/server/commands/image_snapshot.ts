import type { BrowserCommand } from 'vitest/node'
import type { ImageSnapshot, ImageSnapshotOptions } from '../../shared/types.ts'
import { visContext } from '../vis_context.ts'

export interface ImageSnapshotCommand {
	/**
	 * Take a snapshot of the current image.
	 *
	 * @param options - The options for the image snapshot.
	 */
	imageSnapshot: (name: string, options?: ImageSnapshotOptions) => Promise<ImageSnapshot>
}

export const imageSnapshot: BrowserCommand<[name: string, options?: ImageSnapshotOptions | undefined]> = async (
	context,
	name,
	_options,
) => {
	const state = visContext.getSnapshotInfo(context, name)
	console.info('taking snapshot', state)
}
