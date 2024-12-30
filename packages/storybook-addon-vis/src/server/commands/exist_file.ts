import { stat } from 'node:fs/promises'
import { dirname, join } from 'pathe'
import type { BrowserCommand } from 'vitest/node'

export interface ExistFileCommand {
	existFile: (path: string) => Promise<boolean>
}

export const existFile: BrowserCommand<[path: string]> = async ({ testPath }, path) => {
	if (!testPath) return

	return stat(join(dirname(testPath), path))
		.then((s) => s.isFile())
		.catch(() => false)
}
