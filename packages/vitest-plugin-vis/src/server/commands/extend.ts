import { type HasImageSnapshotCommand, hasImageSnapshot } from './has_image_snapshot.ts'
import { type ImageSnapshotNextIndexCommand, imageSnapshotNextIndex } from './image_snapshot_next_index.ts'
import { type MatchImageSnapshotCommand, matchImageSnapshot } from './match_image_snapshot.ts'
import { type SetupVisSuiteCommand, setupVisSuite } from './setup_vis_suite.ts'

declare module '@vitest/browser/context' {
	interface BrowserCommands
		extends SetupVisSuiteCommand,
			ImageSnapshotNextIndexCommand,
			HasImageSnapshotCommand,
			MatchImageSnapshotCommand {}
}

export const commands = {
	setupVisSuite,
	imageSnapshotNextIndex,
	hasImageSnapshot,
	matchImageSnapshot,
}
