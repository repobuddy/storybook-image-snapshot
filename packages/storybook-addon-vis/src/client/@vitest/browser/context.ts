import {
	getByAltText,
	getByLabelText,
	getByPlaceholderText,
	getByRole,
	getByTestId,
	getByText,
	getByTitle,
} from '@storybook/test'
import type { BrowserCommands, BrowserPage, CDPSession, Platform } from '@vitest/browser/context'
import type { SerializedConfig } from 'vitest'
import type { CopyFileCommand } from '../../../server/commands/copy_file.ts'
import type { ExistDirCommand } from '../../../server/commands/exist_dir.ts'
import type { ExistFileCommand } from '../../../server/commands/exist_file.ts'
import type { GetSnapshotPlatformCommand } from '../../../server/commands/get_snapshot_platform.ts'
import type { ImageSnapshotCommand } from '../../../server/commands/image_snapshot.ts'
import type { IsCICommand } from '../../../server/commands/is_ci.ts'
import type { MatchImageSnapshotCommand } from '../../../server/commands/match_image_snapshot.ts'
import type { RmDirCommand } from '../../../server/commands/rm_dir.ts'
import type { SetupVisSuiteCommand } from '../../../server/commands/setup_vis_suite.ts'
import { imageSnapshotStubSymbol } from './constants.ts'
import { type HasImageSnapshotAction, hasImageSnapshot } from './page.has_image_snapshot.ts'
import { type ImageSnapshotAction, imageSnapshot } from './page.image_snapshot.ts'

declare module '@vitest/browser/context' {
	interface BrowserPage extends ImageSnapshotAction, HasImageSnapshotAction {}
	interface BrowserCommands
		extends CopyFileCommand,
			ExistDirCommand,
			GetSnapshotPlatformCommand,
			RmDirCommand,
			IsCICommand,
			MatchImageSnapshotCommand,
			ImageSnapshotCommand,
			SetupVisSuiteCommand,
			ExistFileCommand {}
}

let ctx: Awaited<typeof import('@vitest/browser/context')>

if ((globalThis as any).__vitest_browser__) {
	import('@vitest/browser/context').then((m) => {
		ctx = m
		page.extend({ imageSnapshot, hasImageSnapshot })
	})
}

// TODO: stub the functions within the `CDPSession`
// when we better understands the use cases
export function cdp(): CDPSession {
	return ctx?.cdp() ?? ({} as any)
}

export const commands = new Proxy<BrowserCommands>({} as any, {
	get(_target, prop) {
		return (
			(ctx?.commands as any)?.[prop] ??
			/* v8 ignore start : used in storybook, not in vitest */
			commandsStub[prop] ??
			(() => {
				throw new Error(`Command '${String(prop)}' not found`)
			})()
			/* v8 ignore end */
		)
	},
})

/* v8 ignore start : used in storybook, not in vitest */
const commandsStub = {
	matchImageSnapshot: async () => {},
	setupVisSuite: () => {},
} as any
/* v8 ignore end */

export const page = new Proxy<BrowserPage>(
	{
		getByAltText,
		getByRole,
		getByTestId,
		getByText,
		getByTitle,
		getByPlaceholder: getByPlaceholderText,
		getByLabelText,
	} as any,
	{
		get(target, prop) {
			return (
				(target as any)[prop] ??
				(ctx?.page as any)?.[prop] ??
				/* v8 ignore start : used in storybook, not in vitest */
				pageStub[prop] ??
				(() => {
					console.error(`\`page.${prop.toString()}\` does not exist when running in browser`)
				})
				/* v8 ignore end */
			)
		},
	},
)

/* v8 ignore start : used in storybook, not in vitest */
const pageStub = {
	imageSnapshot() {
		return { type: imageSnapshotStubSymbol }
	},
	hasImageSnapshot() {
		return false
	},
} as any
/* v8 ignore end */

export const server = new Proxy<{
	/**
	 * Platform the Vitest server is running on.
	 * The same as calling `process.platform` on the server.
	 */
	platform: Platform
	/**
	 * Runtime version of the Vitest server.
	 * The same as calling `process.version` on the server.
	 */
	version: string
	/**
	 * Name of the browser provider.
	 */
	provider: string
	/**
	 * Name of the current browser.
	 */
	browser: string
	/**
	 * Available commands for the browser.
	 * @see {@link https://vitest.dev/guide/browser/commands}
	 */
	commands: BrowserCommands
	/**
	 * Serialized test config.
	 */
	config: SerializedConfig
}>({} as any, {
	get(target, prop) {
		return (target as any)[prop] ?? (ctx?.server as any)[prop]
	},
})
