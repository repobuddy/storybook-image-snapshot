import { page } from '@vitest/browser/context'
import { type HasImageSnapshotAction, hasImageSnapshot } from './has_image_snapshot.ts'

declare module '@vitest/browser/context' {
	interface BrowserPage extends HasImageSnapshotAction {}
}

page.extend({ hasImageSnapshot })
