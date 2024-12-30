import { dirname, join } from 'pathe'
import { rimraf } from 'rimraf'
import type { BrowserCommand } from 'vitest/node'

export interface RmDirCommand {
	rmDir: (path: string) => Promise<void>
}

export const rmDir: BrowserCommand<[path: string]> = async ({ testPath }, path) => {
	if (!testPath) return

	return rimraf(join(dirname(testPath), path))
}
