import type { AsyncExpectationResult } from '@vitest/expect'
import dedent from 'dedent'
import { resolve } from 'pathe'
import { getCurrentTest } from 'vitest/suite'
import { compareImage } from '../shared/compare_image.ts'
import { getMaxSize } from '../shared/get_max_size.ts'
import { createImageResizer } from '../shared/image_resizer.ts'
import { isSameSize } from '../shared/is_same_size.ts'
import type { MatchImageSnapshotOptions } from '../shared/types.ts'
import { imageSnapshotStubSymbol } from './@vitest/browser/constants.ts'
import { commands, page, server } from './@vitest/browser/context.ts'
import { assertImageSnapshot, isImageSnapshot } from './@vitest/browser/image_snapshot.logic.ts'
import { toDataURL, toImageData } from './image_data.ts'
import { imageSnapshot } from './image_snapshot.ts'
import { state } from './state.ts'
import { success } from './to_match_image_snapshot/expectation_result.ts'

export interface ImageSnapshotMatcher {
	toMatchImageSnapshot(options?: MatchImageSnapshotOptions): Promise<void>
}

export async function toMatchImageSnapshot(
	actual: any,
	options?: MatchImageSnapshotOptions | undefined,
): AsyncExpectationResult {
	if (actual instanceof Element) {
		await imageSnapshot({ element: actual })
		return success
	}
	const promise = toMatchImageSnapshotInternal(actual, options)
	const test = getCurrentTest()
	if (!test) return promise
	test.promises ??= []
	test.promises.push(promise)
	return promise
}

async function toMatchImageSnapshotInternal(
	actual: any,
	options?: MatchImageSnapshotOptions | undefined,
): AsyncExpectationResult {
	let subject = await actual
	if (subject?.type === imageSnapshotStubSymbol) {
		return success
	}
	if (!isImageSnapshot(subject)) {
		if (subject?.path && subject?.base64) {
			return {
				pass: false,
				actual: subject,
				message: () =>
					'`toMatchImageSnapshot()` expects the subject to be the result of `page.imageSnapshot()`, but seems like you are using `page.screenshot()`?',
			}
		}

		if (typeof subject !== 'object') {
			return {
				pass: false,
				actual: subject,
				message: () =>
					`\`toMatchImageSnapshot()\` expects the subject to be an element, locator, or result of \`page.imageSnapshot()\`, but got: \`${subject}\``,
			}
		}
		subject = await page.imageSnapshot({ element: subject })
	}

	assertImageSnapshot(subject)

	const baseline = await tryReadSnapshot(subject.baselinePath)
	if (!baseline) {
		await commands.copyFile(subject.resultPath, subject.baselinePath)
		return success
	}

	const originalImage = await toImageData(baseline)
	const [resultImage, baselineImage] = alignImagesToSameSize(subject.image, originalImage)

	const { pass, diffAmount, diffData } = compareImage(
		resultImage.width,
		resultImage.height,
		baselineImage.data,
		resultImage.data,
		state.mergeMatchImageSnapshotOptions(options),
	)

	if (!pass) {
		if (server.config.snapshotOptions.updateSnapshot === 'all') {
			await writeSnapshot(`${subject.baselinePath}`, resultImage)
			return success
		}
		const diffImage = new ImageData(diffData, resultImage.width, resultImage.height)
		await writeSnapshot(`${subject.diffPath}`, diffImage)
		return {
			pass: false,
			message: () =>
				dedent`Snapshot \`${state.getName()}\` mismatched

			${
				options?.failureThreshold
					? options?.failureThresholdType === 'percent'
						? `Expected image to match within ${options.failureThreshold}% but was differ by ${diffAmount}%.`
						: `Expected image to match within ${options.failureThreshold} pixels but was differ by ${diffAmount} pixels.`
					: `Expected image to match but was differ by ${options?.failureThresholdType === 'percent' ? `${diffAmount}%` : `${diffAmount} pixels`}.`
			}

			Expected:   '${resolve(state.getCurrentDir(), subject.baselinePath)}'
			Actual:     '${resolve(state.getCurrentDir(), subject.resultPath)}'
			Difference: '${resolve(state.getCurrentDir(), subject.diffPath)}'`,
		}
	}
	return success
}

function tryReadSnapshot(path: string): Promise<string | undefined> {
	return commands.readFile(path, { encoding: 'base64' }).catch(() => undefined)
}
async function writeSnapshot(path: string, image: ImageData) {
	const content = (await toDataURL(image)).split(',')[1]!
	return commands.writeFile(path, content, 'base64url')
}

function alignImagesToSameSize(image1: ImageData, image2: ImageData): [image1: ImageData, image2: ImageData] {
	if (isSameSize(image1, image2)) {
		return [image1, image2]
	}
	const size = getMaxSize(image1, image2)
	const resize = createImageResizer(size)
	return [resize(image1), resize(image2)]
}
