import { commands } from '@vitest/browser/context'
import type { AsyncExpectationResult } from '@vitest/expect'
import { isBase64String } from '../../shared/base64.ts'
import type {
	ImageSnapshotCompareOptions,
	ImageSnapshotIdOptions,
	ImageSnapshotTimeoutOptions,
} from '../../shared/types.ts'
import { ctx } from '../ctx.ts'
import { convertElementToCssSelector } from '../selector.ts'
import { toTaskId } from '../task_id.ts'
import { success } from './expectation_result.ts'

export interface ImageSnapshotMatcher {
	toMatchImageSnapshot(options?: ToMatchImageSnapshotOptions | undefined): Promise<void>
}

export interface ToMatchImageSnapshotOptions
	extends ImageSnapshotTimeoutOptions,
		ImageSnapshotIdOptions,
		ImageSnapshotCompareOptions {}

export function toMatchImageSnapshot(
	/**
	 * The element or locator to take the snapshot of,
	 * or the base64 value of the image to compare against.
	 */
	subject: any,
	options?: ToMatchImageSnapshotOptions | undefined,
): AsyncExpectationResult {
	const test = ctx.getCurrentTest()
	if (!test) {
		throw new Error('`toMatchImageSnapshot()` must be called in a test.')
	}

	if (test.concurrent) {
		throw new Error(
			'`toMatchImageSnapshot()` cannot be called in a concurrent test because ' +
				"concurrent tests run at the same time in the same iframe and affect each other's environment. ",
		)
	}

	const s = parseSubject(subject)
	if (!s) {
		throw new Error(
			`'toMatchImageSnapshot()' expects the subject to be an element, locator, or image encoded in base64 string, but got: ${subject}`,
		)
	}

	const taskId = toTaskId(test)
	return toMatchImageSnapshotAsync(taskId, s, options).then(() => success)
}

async function toMatchImageSnapshotAsync(taskId: string, subject: string, options?: ToMatchImageSnapshotOptions) {
	if (options?.customizeSnapshotId) {
		const index = await commands.imageSnapshotNextIndex(taskId)
		const { customizeSnapshotId, ...rest } = options
		const snapshotFileId = customizeSnapshotId(taskId, index)
		return commands.matchImageSnapshot(taskId, subject, { ...rest, snapshotFileId })
	}

	return commands.matchImageSnapshot(taskId, subject, options)
}

function parseSubject(subject: any) {
	if (subject instanceof Element) return convertElementToCssSelector(subject)
	if (subject?.['selector']) return subject['selector']
	if (isBase64String(subject)) return subject
	return undefined
}
