import { resolve } from 'pathe'
import { stub } from 'type-plus'
import { expect, it } from 'vitest'
import type { BrowserCommandContext } from 'vitest/node'
import { matchImageSnapshot } from './match_image_snapshot.ts'

const stubContext = stub.build<BrowserCommandContext>({
	project: {
		config: {
			root: resolve(import.meta.dirname, '../..'),
		},
	},
	testPath: import.meta.filename,
})

it('throws error without testPath', async () => {
	await expect(() =>
		matchImageSnapshot(
			stubContext({
				testPath: '',
			}),
			'image name',
			'subject',
		),
	).rejects.toThrow('Cannot match snapshot without testPath')
})
