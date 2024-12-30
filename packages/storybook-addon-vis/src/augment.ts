///  <reference types="@vitest/browser/context" />

import type { ImageSnapshotMatcher } from './client/expect.to_match_image_snapshot.ts'
import type { ImageSnapshotMatcher2 } from './client/to_match_image_snapshot/to_match_image_snapshot.ts'

declare global {
	namespace jest {
		// biome-ignore lint/correctness/noUnusedVariables: augmentation must have matching type params.
		interface Matchers<R, T> extends ImageSnapshotMatcher, ImageSnapshotMatcher2 {}
	}
}
