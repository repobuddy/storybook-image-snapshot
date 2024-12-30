import { copyFile as copyFileFs } from 'node:fs/promises'
import { mkdirp } from 'mkdirp'
import { dirname, join } from 'pathe'
import type { BrowserCommand } from 'vitest/node'

export interface CopyFileCommand {
	copyFile(src: string, dest: string): Promise<void>
}

export const copyFile: BrowserCommand<[src: string, dest: string]> = async ({ testPath }, src, dest) => {
	if (!testPath) return

	const destPath = join(dirname(testPath), dest)
	const destDir = dirname(destPath)
	await mkdirp(destDir)
	return copyFileFs(join(dirname(testPath), src), destPath)
}
