import { getCurrentTest } from 'vitest/suite'
import type { ImageSnapshot, ImageSnapshotOptions } from '../shared/types.ts'
import { commands } from './@vitest/browser/context.ts'

export function imageSnapshot(options?: ImageSnapshotOptions | undefined): Promise<ImageSnapshot> {
	const test = getCurrentTest()
	if (!test) {
		throw new Error('`imageSnapshot()` must be called during a test')
	}

	return commands.imageSnapshot(test.name, options)
}
