import { expect } from 'vitest'
import { type ImageSnapshotMatcher, toMatchImageSnapshot } from './to_match_image_snapshot.ts'

declare global {
	namespace jest {
		// biome-ignore lint/correctness/noUnusedVariables: augmentation must have matching type params.
		interface Matchers<R, T> extends ImageSnapshotMatcher {}
	}
}

expect.extend({ toMatchImageSnapshot })
