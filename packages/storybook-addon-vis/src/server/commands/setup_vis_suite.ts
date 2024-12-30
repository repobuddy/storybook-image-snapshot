import type { BrowserCommand } from 'vitest/node'
import { visContext } from '../vis_context.ts'

export interface SetupVisSuiteCommand {
	/**
	 * Setup the vis suite.
	 */
	setupVisSuite: () => Promise<void>
}

/**
 * Sets up the visual testing suite by cleaning up previous snapshot and diff output directories.
 *
 * @param context - The context of the browser command execution.
 * @param suite - An object containing the suite details.
 * @param suite.file.filepath - The file path of the suite.
 * @param suite.name - The name of the suite.
 *
 * @returns A promise that resolves when the setup is complete.
 */
export const setupVisSuite: BrowserCommand<[]> = async (context) => {
	await visContext.setupSuite(context)
}
