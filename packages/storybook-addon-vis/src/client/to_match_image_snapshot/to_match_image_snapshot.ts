import type { AsyncExpectationResult } from '@vitest/expect'
import { getCurrentTest } from 'vitest/suite'
import { isBase64String } from '../../shared/base64.ts'
import type { MatchImageSnapshotOptions } from '../../shared/types.ts'
import { commands, page } from '../@vitest/browser/context.ts'
import { success } from './expectation_result.ts'

export interface ImageSnapshotMatcher2 {
	toMatchImageSnapshot2(options?: MatchImageSnapshotOptions | undefined): Promise<void>
}

export function toMatchImageSnapshot2(
	/**
	 * The element or locator to take the snapshot of,
	 * or the base64 value of the image to compare against.
	 */
	subject: any,
	options?: MatchImageSnapshotOptions | undefined,
): AsyncExpectationResult {
	const test = getCurrentTest()

	/* v8 ignore start: stub as success when not in a test (e.g. in a story) */
	if (!test) {
		return Promise.resolve(success)
	}
	/* v8 ignore end */

	const s = parseSubject(subject)
	if (!s) {
		throw new Error(
			`'toMatchImageSnapshot()' expects the subject to be an element, locator, or image encoded in base64 string, but got: ${subject}`,
		)
	}

	return commands.matchImageSnapshot(test.name, s, options).then(() => success)
}

function parseSubject(subject: any) {
	if (subject instanceof Element) {
		// the `Locater.selector` is not exposed in the type definition.
		return (page.elementLocator(subject) as any).selector
	}
	if (subject?.['selector']) return subject['selector']
	if (isBase64String(subject)) return subject
	return undefined
}
