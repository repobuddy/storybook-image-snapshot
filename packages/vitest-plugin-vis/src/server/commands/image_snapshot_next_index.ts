import type { BrowserCommand } from 'vitest/node'
import { visContext } from '../vis_context.ts'

export interface ImageSnapshotNextIndexCommand {
	/**
	 * Get the index of the snapshot image to be created.
	 */
	imageSnapshotNextIndex(taskId: string): Promise<number>
}

export const imageSnapshotNextIndex: BrowserCommand<[taskId: string]> = async (context, taskId) => {
	if (!context.testPath) {
		throw new Error('Cannot take snapshot without testPath')
	}

	return visContext.getTaskCount(context.testPath, taskId)
}
