import type { BrowserCommand } from 'vitest/node'
import { visContext } from '../vis_context.ts'

export interface SetupVisSuiteCommand {
	/**
	 * Sets up the visual testing suite by cleaning up previous snapshot and diff output directories.
	 * When this command is run for the first time,
	 * it will remove the results and diffs directory of all suites.
	 *
	 * In subsequent runs, it will only remove the results and diffs directory of the current suite.
	 */
	setupVisSuite: () => Promise<void>
}

export const setupVisSuite: BrowserCommand<[]> = async (context) => {
	await visContext.setupSuite(context)
}
