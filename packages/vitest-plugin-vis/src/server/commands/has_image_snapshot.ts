import type { BrowserCommand } from 'vitest/node'
import { visContext } from '../vis_context.ts'

export interface HasImageSnapshotCommand {
	hasImageSnapshot(taskId: string, snapshotId?: string | undefined): Promise<boolean>
}

export const hasImageSnapshot: BrowserCommand<[taskId: string, snapshotId?: string | undefined]> = async (
	context,
	taskId,
	snapshotId,
) => {
	if (!context.testPath) {
		throw new Error('Cannot take snapshot without testPath')
	}

	return visContext.hasImageSnapshot(context.testPath, taskId, snapshotId)
}
