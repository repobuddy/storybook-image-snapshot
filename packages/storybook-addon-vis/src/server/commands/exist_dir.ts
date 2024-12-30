import { stat } from 'node:fs/promises'
import { dirname, join } from 'pathe'
import type { BrowserCommand } from 'vitest/node'

export interface ExistDirCommand {
	existDir: (path: string) => Promise<boolean>
}

export const existDir: BrowserCommand<[path: string]> = async ({ testPath }, path) => {
	if (!testPath) return false
	return stat(join(dirname(testPath), path))
		.then((s) => s.isDirectory())
		.catch(() => false)
}
