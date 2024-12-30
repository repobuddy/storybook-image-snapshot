import type { BrowserPage } from '@vitest/browser/context'
import type { CustomizeSnapshotIdOptions } from '../../../shared/types.ts'
import { state } from '../../state.ts'
import { commands } from './context.ts'

export interface HasImageSnapshotAction {
	hasImageSnapshot(this: BrowserPage, options?: CustomizeSnapshotIdOptions | undefined): Promise<boolean>
}

/**
 * Check if the snapshot image exists.
 */
export async function hasImageSnapshot(this: BrowserPage, options?: CustomizeSnapshotIdOptions | undefined) {
	const { baselinePath } = state.getSnapshotFilePaths(options)
	return commands.existFile(baselinePath)
}
