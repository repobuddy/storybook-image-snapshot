import dedent from 'dedent'
import { mkdirp } from 'mkdirp'
import { resolve } from 'pathe'
import type { PixelmatchOptions } from 'pixelmatch'
import { PNG } from 'pngjs'
import type { BrowserCommand, BrowserCommandContext } from 'vitest/node'
import { isBase64String } from '../../shared/base64.ts'
import { getMaxSize } from '../../shared/get_max_size.ts'
import { isSameSize } from '../../shared/is_same_size.ts'
import type {
	ImageSnapshotCompareOptions,
	ImageSnapshotIdOptions,
	ImageSnapshotTimeoutOptions,
} from '../../shared/types.ts'
import { browserApi } from '../browser_provider/browser_api.ts'
import { compareImage } from '../compare_image.ts'
import { file } from '../file.ts'
import { visContext } from '../vis_context.ts'

export interface MatchImageSnapshotCommand {
	matchImageSnapshot: (
		taskId: string | undefined,
		subject: string,
		options?: MatchImageSnapshotOptions | undefined,
	) => Promise<void>
}

export interface MatchImageSnapshotOptions
	extends ImageSnapshotTimeoutOptions,
		ImageSnapshotIdOptions,
		ImageSnapshotCompareOptions {
	/**
	 * The snapshot file id calculated on the client side.
	 */
	snapshotFileId?: string | undefined
}

export const matchImageSnapshot: BrowserCommand<
	[taskId: string, subject: string, options?: MatchImageSnapshotOptions | undefined]
> = async (context, taskId, subject, options) => {
	if (!context.testPath) {
		throw new Error('Cannot match snapshot without testPath')
	}

	// vitest:browser passes in `null` when not defined
	if (!options) options = {}

	const info = visContext.getSnapshotInfo(context.testPath, taskId, options)
	const baselineBase64 = await file.tryReadFileBase64(info.baselinePath)
	if (!baselineBase64) {
		await takeSnapshot(context, subject, { dir: info.baselineDir, path: info.baselinePath }, options)
		return
	}

	const resultBase64 = await takeSnapshot(context, subject, { dir: info.resultDir, path: info.resultPath }, options)
	const baselineImage = PNG.sync.read(Buffer.from(baselineBase64, 'base64'))
	const resultImage = PNG.sync.read(Buffer.from(resultBase64, 'base64'))
	const [baselineAlignedImage, resultAlignedImage] = isSameSize(baselineImage, resultImage)
		? [baselineImage, resultImage]
		: alignImageSizes(baselineImage, resultImage)

	const { pass, diffAmount, diffImage } = compareImage(baselineAlignedImage, resultAlignedImage, options)
	if (pass) {
		if (sizeNotChanged(baselineImage, baselineAlignedImage)) {
			return
		}
		throw new Error(
			dedent`Snapshot \`${taskId}\` mismatched

				The image size changed form ${baselineImage.width}x${baselineImage.height} to ${resultImage.width}x${resultImage.height}

				Expected:   ${resolve(context.project.runner.root, info.baselinePath)}
				Actual:     ${resolve(context.project.runner.root, info.resultPath)}`,
		)
	}

	const diffBase64 = PNG.sync.write(diffImage).toString('base64')
	await writeSnapshot(diffBase64, { dir: info.diffDir, path: info.diffPath })

	throw new Error(
		dedent`Snapshot \`${taskId}\` mismatched

			${
				options?.failureThreshold
					? options?.failureThresholdType === 'percent'
						? `Expected image to match within ${options.failureThreshold}% but was differ by ${diffAmount}%.`
						: `Expected image to match within ${options.failureThreshold} pixels but was differ by ${diffAmount} pixels.`
					: `Expected image to match but was differ by ${options?.failureThresholdType === 'percent' ? `${diffAmount}%` : `${diffAmount} pixels`}.`
			}

			Expected:   ${resolve(context.project.runner.root, info.baselinePath)}
			Actual:     ${resolve(context.project.runner.root, info.resultPath)}
			Difference: ${resolve(context.project.runner.root, info.diffPath)}`,
	)
}

async function takeSnapshot(
	context: BrowserCommandContext,
	subject: string,
	info: { dir: string; path: string },
	options: ImageSnapshotTimeoutOptions | undefined,
) {
	if (isBase64String(subject)) {
		return writeSnapshot(subject, info)
	}

	await mkdirp(info.dir)
	const browser = browserApi(context)
	return browser.takeScreenshot(info.path, subject, {
		timeout: options?.timeout,
	})
}

async function writeSnapshot(subject: string, info: { dir: string; path: string }) {
	await mkdirp(info.dir)
	await file.writeFileBase64(info.path, subject)
	return subject
}

function alignImageSizes(baseline: PNG, result: PNG) {
	const size = getMaxSize(baseline, result)

	const baselineAligned = new PNG(size)
	const resultAligned = new PNG(size)

	baselineAligned.data.fill(0)
	resultAligned.data.fill(0)

	PNG.bitblt(baseline, baselineAligned, 0, 0, baseline.width, baseline.height)
	PNG.bitblt(result, resultAligned, 0, 0, result.width, result.height)

	return [baselineAligned, resultAligned] as const
}
function sizeNotChanged(baselineImage: PNG, baselineAlignedImage: PNG) {
	return baselineImage === baselineAlignedImage
}
